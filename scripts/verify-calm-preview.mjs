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
function verifyApprovedLesson($, lang) {
  assert.equal($('#unterricht.lesson-focus').length, 1);
  assert.equal($('#unterricht img').length, 1);
  assert.ok($('#unterricht img').attr('src').endsWith('/kind1.jpg'));
  assert.equal($('#lesson-title').text(), lang === 'de' ? 'So lernen wir zusammen.' : '함께 배워가는 시간.');
  assert.equal($('.calm-advanced').closest('details').length, 0);
  assert.equal($('#fragen').prop('tagName'), 'SECTION');
  assert.equal($('#fragen').attr('aria-labelledby'), 'questions-title');
  assert.equal($('#questions-title').text(), lang === 'de' ? 'Gut zu wissen' : '레슨 안내');
  assert.equal($('.calm-advanced + section#fragen').length, 1, 'General lesson information must be a sibling, not a part of advanced lessons');
}
for (const variant of variants) {
  const original = await page(variant.original);
  const lessonDraftFile = `vergleich/unterricht/${variant.lang === 'ko' ? 'ko/' : ''}index.html`;
  const lessonCurrentFile = `vergleich/unterricht/bisher/${variant.lang === 'ko' ? 'ko/' : ''}index.html`;
  if (indexable) {
    assert.equal(await exists(variant.calm), false, 'Do not publish experiments on the final production site');
    for (const file of [lessonDraftFile, lessonCurrentFile]) assert.equal(await exists(file), false, 'Comparison URLs must remain preview-only');
    verifyApprovedLesson(original, variant.lang);
    assert.equal(original('[data-layout-path]').length, 0);
  } else {
    assert.equal(original('html').attr('data-layout'), undefined, 'Retain the original homepage for preview comparison');
    assert.equal(original('.audience').length, 3);
    assert.equal(original('#request-form').length, 1);
    assert.equal(original('.faq-list details').length, variant.lang === 'de' ? 7 : 5);
  }
  const calm = indexable ? original : await page(variant.calm);
  assert.equal(calm('html').attr('lang'), variant.lang);
  assert.equal(calm('html').attr('data-layout'), 'calm');
  assert.match(calm('meta[name=robots]').attr('content'), indexable ? /^index, follow/ : /noindex/);
  assert.equal(calm('link[rel=canonical]').attr('href'), 'https://klavierlernen-berlin.de' + variant.originalPath);
  assert.equal(calm('.calm-home').length, 1);
  assert.equal(calm('.audience, .intro-strip, #request-form, .faq-section').length, 0);
  assert.equal(calm('.calm-questions details').length, 2);
  assert.equal(calm('#unterricht .calm-advanced').length, 1, 'Keep advanced lessons and study preparation visible in the teaching section');
  assert.equal(calm('.calm-advanced h3').text(), variant.lang === 'de' ? 'Fortgeschrittene & Studium' : '중급·고급 & 음대 입시');
  assert.equal(calm('.calm-advanced details').length, 0, 'Do not hide this teaching focus in an accordion');
  assert.match(calm('.calm-advanced').text(), variant.lang === 'de' ? /Bachelor- oder Masterstudium/ : /학사·석사/);
  if (variant.lang === 'de') assert.doesNotMatch(calm('#unterricht').text(), /Für angehende Musikstudierende biete ich außerdem/);
  assert.equal(calm('.calm-specialist strong').length, 2, 'Preserve the services highlighted at Kim’s request');
  assert.deepEqual(calm('.calm-price-table td').toArray().map(el => calm(el).text().trim()), ['30 €', '45 €', '50 €', '60 €']);
  assert.equal(calm('.music-section audio').length, 3);
  assert.equal(calm('.calm-recordings audio').length, 3, 'Group the recordings independently from the album');
  assert.equal(calm('.calm-recordings .recording h4').length, 3, 'Recording titles belong under the recordings heading');
  assert.equal(calm('.calm-recordings + .album-release').length, 1, 'The independent album block must follow all recordings');
  assert.equal(calm('.calm-recordings .album-cover').length, 0, 'Do not visually attribute these recordings to Lost Beauty');
  assert.match(calm('.calm-recordings-title').text(), variant.lang === 'de' ? /Hörproben.*Solo & Kammermusik/ : /연주 감상.*독주 & 실내악/);
  assert.deepEqual(calm('.music-section audio source').toArray().map(el => calm(el).attr('src')), original('.music-section audio source').toArray().map(el => original(el).attr('src')));
  for (const selector of ['.hero-portrait img', '.contact-portrait', '.music-story img', '.album-cover']) {
    assert.equal(calm(selector).attr('src'), original(selector).attr('src'), `Keep the original photograph: ${selector}`);
  }
  assert.equal(calm('.album-release a').attr('href'), original('.album-release a').attr('href'));
  assert.equal(calm('.album-description').length, 0);
  assert.equal(calm('a[href*="Vita-2019.pdf"]').length, 0);
  assert.doesNotMatch(calm('.calm-home').text(), /jazz|재즈/i);
  for (const id of ['unterricht', 'aboutme', 'preise', 'pianistin', 'fragen', 'kontakt']) assert.equal(calm(`#${id}`).length, 1);
  if (indexable) {
    assert.equal(calm('.languages a[lang=de]').attr('href'), base + '/');
    assert.equal(calm('.languages a[lang=ko]').attr('href'), base + '/ko/home/');
    assert.ok(calm('.desktop-nav a').toArray().every(el => calm(el).attr('href').startsWith(base + variant.originalPath + '#')));
    assert.equal(calm('#design-preview').length, 0);
    assert.ok(calm('#kontakt a[href^="mailto:jongsuk.kim83@gmail.com"]').length > 0);
    continue;
  }
  for (const $ of [original, calm]) {
    assert.deepEqual($('[data-design-choice]').toArray().map(el => $(el).attr('data-design-choice')), ['salon', 'studio', 'edition', 'lesart']);
    assert.deepEqual($('[data-layout-path]').toArray().map(el => $(el).attr('data-layout-path')), [base + variant.originalPath, base + variant.calmPath]);
    assert.equal($('.layout-choices [aria-current=page]').length, 1);
  }
  assert.equal(calm('.languages a[lang=de]').attr('href'), base + '/vergleich/');
  assert.equal(calm('.languages a[lang=ko]').attr('href'), base + '/vergleich/ko/');
  assert.ok(calm('.desktop-nav a').toArray().every(el => calm(el).attr('href').startsWith(base + variant.calmPath + '#')));
  const draft = await page(lessonDraftFile);
  const current = await page(lessonCurrentFile);
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  for (const $ of [draft, current]) {
    assert.match($('meta[name=robots]').attr('content'), /noindex/);
    assert.equal($('link[rel=canonical]').attr('href'), calm('link[rel=canonical]').attr('href'));
    assert.equal(normalize($('.hero').html()), normalize(calm('.hero').html()), 'Never change the hero for the teaching proposal');
    for (const id of ['aboutme', 'preise', 'pianistin', 'kontakt']) assert.equal($(`#${id}`).html(), calm(`#${id}`).html(), `Unrelated section changed: ${id}`);
    assert.equal($('.calm-copy p').text(), calm('.calm-copy p').text(), 'Preserve all teaching copy, advanced lessons and FAQs');
    assert.equal($('.calm-questions details').length, 2);
    assert.equal($('.calm-advanced').html(), calm('.calm-advanced').html());
    assert.deepEqual($('[data-layout-path]').toArray().map(el => $(el).text()), ['Bisher', 'Entwurf']);
    assert.equal($('.layout-choices [aria-current=page]').length, 1);
    assert.ok($('.desktop-nav a').toArray().every(el => $(el).attr('href').includes('/vergleich/unterricht/')));
  }
  assert.equal(current('#unterricht').html(), calm('#unterricht').html(), 'The comparison must show the unchanged current teaching section');
  verifyApprovedLesson(draft, variant.lang);
  assert.equal(current('#fragen h3').text(), variant.lang === 'de' ? 'Gut zu wissen' : '레슨 안내');
  const words = $ => $('main').text().trim().split(/\s+/).length;
  assert.ok(words(calm) < words(original) * .8, 'The alternative should be materially shorter');
}
assert.doesNotMatch(await readFile(new URL('sitemap-0.xml', dist), 'utf8'), /\/vergleich\//);
if (indexable) verifyApprovedLesson(await page('ko/index.html'), 'ko');
console.log(`Verified ${indexable ? 'approved calmer homepages, indexable and canonical, no review routes' : 'isolated calmer comparison, both languages and four styles'}, advanced lessons, prices/photos/audio and sitemap.`);
