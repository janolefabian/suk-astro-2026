import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';

const dist = new URL('../dist/', import.meta.url);
const page = async path => load(await readFile(new URL(path, dist), 'utf8'));
const exists = async path => {try {return (await stat(new URL(path, dist))).isFile();} catch {return false;}};
const indexable = process.env.PUBLIC_INDEXABLE === 'true';
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const variants = [
  {lang: 'de', original: 'index.html', calm: 'vergleich/index.html', originalPath: '/', calmPath: '/vergleich/'},
  {lang: 'ko', original: 'ko/home/index.html', calm: 'vergleich/ko/index.html', originalPath: '/ko/home/', calmPath: '/vergleich/ko/'},
];
for (const variant of variants) {
  const original = await page(variant.original);
  assert.equal(original('html').attr('data-layout'), undefined, 'Never replace the original homepage');
  assert.equal(original('.audience').length, 3, 'Original audience blocks must stay');
  assert.equal(original('#request-form').length, 1, 'Original contact form must stay');
  assert.equal(original('.faq-list details').length, variant.lang === 'de' ? 7 : 5);
  if (indexable) {
    assert.equal(await exists(variant.calm), false, 'Do not publish experiments on the final production site');
    assert.equal(original('[data-layout-path]').length, 0);
    continue;
  }
  const calm = await page(variant.calm);
  assert.equal(calm('html').attr('lang'), variant.lang);
  assert.equal(calm('html').attr('data-layout'), 'calm');
  assert.match(calm('meta[name=robots]').attr('content'), /noindex/);
  assert.equal(calm('link[rel=canonical]').attr('href'), 'https://klavierlernen-berlin.de' + variant.originalPath);
  assert.equal(calm('.calm-home').length, 1);
  assert.equal(calm('.audience, .intro-strip, #request-form, .faq-section').length, 0);
  assert.equal(calm('.calm-questions details').length, 2);
  assert.equal(calm('.calm-specialist strong').length, 2, 'Preserve the services highlighted at Kim’s request');
  assert.deepEqual(calm('.calm-price-table td').toArray().map(el => calm(el).text().trim()), ['30 €', '45 €', '50 €', '60 €']);
  assert.equal(calm('.music-section audio').length, 3);
  assert.deepEqual(calm('.music-section audio source').toArray().map(el => calm(el).attr('src')), original('.music-section audio source').toArray().map(el => original(el).attr('src')));
  for (const selector of ['.hero-portrait img', '.contact-portrait', '.music-story img', '.album-cover']) {
    assert.equal(calm(selector).attr('src'), original(selector).attr('src'), `Keep the original photograph: ${selector}`);
  }
  assert.equal(calm('.album-release a').attr('href'), original('.album-release a').attr('href'));
  assert.equal(calm('.album-description').length, 0);
  assert.equal(calm('a[href*="Vita-2019.pdf"]').length, 0);
  assert.doesNotMatch(calm('.calm-home').text(), /jazz|재즈/i);
  for (const id of ['unterricht', 'aboutme', 'preise', 'pianistin', 'fragen', 'kontakt']) assert.equal(calm(`#${id}`).length, 1);
  for (const $ of [original, calm]) {
    assert.deepEqual($('[data-design-choice]').toArray().map(el => $(el).attr('data-design-choice')), ['salon', 'studio', 'edition', 'lesart']);
    assert.deepEqual($('[data-layout-path]').toArray().map(el => $(el).attr('data-layout-path')), [base + variant.originalPath, base + variant.calmPath]);
    assert.equal($('.layout-choices [aria-current=page]').length, 1);
  }
  assert.equal(calm('.languages a[lang=de]').attr('href'), base + '/vergleich/');
  assert.equal(calm('.languages a[lang=ko]').attr('href'), base + '/vergleich/ko/');
  assert.ok(calm('.desktop-nav a').toArray().every(el => calm(el).attr('href').startsWith(base + variant.calmPath + '#')));
  const words = $ => $('main').text().trim().split(/\s+/).length;
  assert.ok(words(calm) < words(original) * .8, 'The alternative should be materially shorter');
}
assert.doesNotMatch(await readFile(new URL('sitemap-0.xml', dist), 'utf8'), /\/vergleich\//);
console.log(`Verified calmer comparison: ${indexable ? 'excluded from production' : 'both languages, both versions, four styles, unchanged prices/photos/audio and noindex'}, excluded from sitemap, original content retained.`);
