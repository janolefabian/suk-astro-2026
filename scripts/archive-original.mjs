import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://klavierlernen-berlin.de';
const root = new URL('../', import.meta.url).pathname;
const routes = ['/', '/ko/', '/bio/', '/impressum/', '/datenschutz/'];
const files = new Set([
  '/downloads/preise-klavierschule.pdf', '/downloads/jongsukkim_repertoire.pdf',
  '/downloads/jongsukkim_biografie.pdf', '/wp-content/uploads/2019/02/Vita-2019.pdf',
  '/downloads/schumann.mp3', '/downloads/schubert.mp3', '/downloads/beethoven.mp3'
]);
const fetchFile = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
};
await mkdir(path.join(root, '.audit'), { recursive: true });
const pages = await Promise.all(routes.map(async route => {
  const html = await (await fetchFile(origin + route)).text();
  const name = route === '/' ? 'home' : route.replaceAll('/', '');
  await writeFile(path.join(root, '.audit', name + '.html'), html);
  for (const match of html.matchAll(/https:\/\/klavierlernen-berlin\.de([^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|pdf|mp3))/g)) {
    if (match[1].startsWith('/wp-content/uploads/') || match[1].startsWith('/downloads/')) files.add(match[1]);
  }
  return { route, title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1], canonical:html.match(/rel="canonical" href="([^"]+)"/)?.[1] };
}));
const sitemaps = {};
for (const route of ['/robots.txt', '/sitemap_index.xml']) {
  try { sitemaps[route] = await (await fetchFile(origin+route)).text(); } catch(e) { sitemaps[route] = String(e); }
}
for (const match of (sitemaps['/sitemap_index.xml'] || '').matchAll(/<loc>(.*?)<\/loc>/g)) {
  if (match[1].startsWith(origin)) {
    try { sitemaps[match[1]] = await (await fetchFile(match[1])).text(); } catch(e) { sitemaps[match[1]] = String(e); }
  }
}
const assets = [];
for (const file of files) {
  try {
    const body = Buffer.from(await (await fetchFile(origin+file)).arrayBuffer());
    const target = path.join(root, 'public', file);
    await mkdir(path.dirname(target), { recursive:true });
    await writeFile(target, body);
    assets.push({ path:file, bytes:body.length });
  } catch(e) { assets.push({ path:file, error:String(e) }); }
}
await writeFile(path.join(root,'.audit','inventory.json'), JSON.stringify({date:new Date().toISOString(),pages,sitemaps,assets},null,2));
console.log(JSON.stringify({pages,sitemaps,assets},null,2));
