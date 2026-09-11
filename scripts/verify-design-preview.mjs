import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {load} from 'cheerio';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const page = load(await readFile(path.join(dist, 'index.html'), 'utf8'));
const scripts = page('script:not([src])').toArray().map(element => page(element).text());
const init = scripts.find(script => script.includes('designIds'));
const indexable = process.env.PUBLIC_INDEXABLE === 'true';

if (indexable) {
  assert.equal(page('#design-preview').length, 0, 'Comparison controls leaked into production');
  assert.equal(page('html').attr('data-design'), undefined, 'Experimental theme leaked into production');
  assert.equal(init, undefined, 'Preview preference script leaked into production');
  console.log('Verified production has no design comparison controls or experimental theme.');
} else {
  const ids = ['salon', 'studio', 'edition', 'lesart'];
  assert.deepEqual(page('[data-design-choice]').toArray().map(element => page(element).attr('data-design-choice')), ids);
  assert.equal(page('#design-preview').length, 1);
  assert.ok(init, 'Early theme initialization missing');
  const storedKey = 'suk-design-comparison-v1';
  const initialize = (query, stored, blocked = false) => {
    const storage = new Map(stored ? [[storedKey, stored]] : []);
    const document = {documentElement: {dataset: {}}};
    vm.runInNewContext(init, {
      URL, document,
      window: {location: {href: `https://example.test/suk-astro-2026/${query}`}},
      localStorage: {
        getItem: key => {if (blocked) throw Error('Storage disabled'); return storage.get(key);},
        setItem: (key, value) => {if (blocked) throw Error('Storage disabled'); storage.set(key, value);},
      },
    });
    return {design: document.documentElement.dataset.design, saved: storage.get(storedKey)};
  };
  assert.equal(initialize('', null).design, 'salon');
  for (const id of ids) {
    assert.equal(initialize(`?stil=${id}#kontakt`, 'studio').design, id);
    assert.equal(initialize(`?stil=${id}`, null).saved, id, 'Direct style links must survive page navigation');
    assert.equal(initialize('', id).design, id);
    assert.equal(initialize(`?stil=${id}`, null, true).design, id, 'Disabled storage must not break switching');
  }
  assert.equal(initialize('?stil=unknown', 'lesart').design, 'lesart');
  assert.equal(initialize('?stil=unknown', 'unknown').design, 'salon');
  assert.equal(initialize('', null, true).design, 'salon');

  const cssHref = page('link[rel=stylesheet]').attr('href');
  assert.ok(cssHref, 'Stylesheet missing');
  const css = await readFile(path.join(dist, '_astro', path.basename(cssHref)), 'utf8');
  for (const font of ['Newsreader Variable', 'DM Sans Variable', 'Cormorant Garamond Variable', 'Lora Variable', 'Manrope Variable']) {
    assert.ok(css.includes(font), `Missing font ${font}`);
  }
  for (const id of ids) assert.ok(css.includes(`data-design=${id}`) || css.includes(`data-design="${id}"`) || css.includes(`data-design='${id}'`), `Missing theme ${id}`);
  const fontUrls = [...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map(match => match[1].replace(/["']/g, ''));
  assert.ok(fontUrls.length >= 5, 'Bundled web fonts missing');
  for (const url of fontUrls) {
    const asset = path.join(dist, '_astro', path.basename(url));
    assert.ok((await stat(asset)).isFile(), `Missing local font ${url}`);
  }
  assert.ok(page('.hero-portrait img').attr('src').endsWith('/header1-1.jpg'), 'Original hero must stay');
  assert.ok(page('.contact-portrait').attr('src').endsWith('/jongsuk_kim6994-2-3.jpg'), 'Contact portrait must stay');
  console.log('Verified all four styles, direct links, saved preferences, blocked storage, bundled fonts and unchanged photographs.');
}
