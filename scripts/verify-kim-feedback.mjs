import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';

const dist = new URL('../dist/', import.meta.url);
const page = async path => load(await readFile(new URL(path, dist), 'utf8'));
const de = await page('index.html');
const ko = await page('ko/home/index.html');
const bio = await page('bio/index.html');

for (const $ of [de, ko]) {
  assert.doesNotMatch($('.lesson-intro, .faq-list').text(), /jazz|재즈/i);
  assert.equal($('.price-extra strong').length, 2, 'Both specialist services need visible emphasis');
  assert.equal($('a[href*="Vita-2019.pdf"]').length, 0);
  assert.equal($('.hero-portrait img[src$="header1-1.jpg"]').length, 1);
  assert.equal($('.music-story img[src$="pianistin_foto.jpg"]').length, 1);
  assert.equal($('.music-section audio').length, 3, 'Existing recordings must stay');
  assert.equal($('.about-copy a[href$="/bio/"]').length, 1, 'Keep the biography accessible');
  assert.equal($('.music-section .album-release').length, 1, 'One compact album block inside the existing music section');
  assert.equal($('.album-release #album-title').text(), 'Lost Beauty');
  const cover = $('.album-release img');
  assert.ok(cover.attr('src').endsWith('/images/lost-beauty-cover.jpg'), 'Cover must be hosted locally');
  assert.equal(cover.attr('width'), '768');
  assert.equal(cover.attr('height'), '768');
  assert.equal(cover.attr('loading'), 'lazy');
  assert.ok(cover.attr('alt').length > 10, 'Album cover needs descriptive alternative text');
  assert.equal($('.album-release a').attr('href'), 'https://szymonmarciniak.bandcamp.com/album/lost-beauty-audiophile-edition');
  assert.equal($('.album-release iframe, .album-release script, .album-release audio').length, 0, 'No external player should load before a click');
}
assert.equal(de('.album-release a').text().trim(), 'Album auf Bandcamp anhören');
assert.equal(ko('.album-release a').text().trim(), 'Bandcamp에서 앨범 듣기');
assert.equal(bio('a[href*="Vita-2019.pdf"]').length, 0);
assert.match(bio('.prose').text(), /Lost Beauty/);
assert.match(bio('.prose').text(), /Szymon Marciniak/);
assert.match(bio('.prose').text(), /Anatol Ugorski/);
const years = bio('.prose li strong').toArray().map(el => Number(bio(el).text().match(/\d{4}/)[0]));
assert.deepEqual(years, [2026, 2025, 2024, 2023, 2015, 2015, 2014]);
assert.ok((await stat(new URL('wp-content/uploads/2019/02/Vita-2019.pdf', dist))).isFile(), 'Do not delete the legacy file');
assert.ok((await stat(new URL('downloads/preise-klavierschule.pdf', dist))).isFile());
assert.ok((await stat(new URL('images/lost-beauty-cover.jpg', dist))).isFile());
console.log('Verified Kim feedback: no jazz, specialist services, current biography, chronology, bilingual album block, local cover, Bandcamp link, original photos/audio and retained PDF URLs.');
