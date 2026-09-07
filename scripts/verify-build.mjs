import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const root=new URL('../',import.meta.url).pathname;
const dist=path.join(root,'dist');
const baseline=JSON.parse(await readFile(path.join(root,'docs/seo-baseline.json'),'utf8'));
const base=(process.env.BASE_PATH||'/').replace(/\/$/,'');
const indexable=process.env.PUBLIC_INDEXABLE==='true';
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
async function exists(file){try{return(await stat(file)).isFile();}catch{return false;}}
async function walk(dir){const files=await readdir(dir,{withFileTypes:true});return(await Promise.all(files.map(file=>file.isDirectory()?walk(path.join(dir,file.name)):path.join(dir,file.name)))).flat();}
const htmlFiles=(await walk(dist)).filter(file=>file.endsWith('.html'));
const cache=new Map();
for(const file of htmlFiles)cache.set(file,load(await readFile(file,'utf8')));
for(const route of baseline.routes){const file=path.join(dist,route,'index.html');check(await exists(file),`Missing original route: ${route}`);}
for(const asset of baseline.assets)check(await exists(path.join(dist,asset)),`Missing original asset: ${asset}`);
for(const [file,$] of cache){
  const relative=path.relative(dist,file);
  check($('title').length===1&&$('title').text().length>5,`${relative}: missing title`);
  check($('meta[name=description]').attr('content')?.length>15,`${relative}: missing description`);
  check($('h1').length===1,`${relative}: expected one H1, got ${$('h1').length}`);
  check($('link[rel=canonical]').length===1,`${relative}: expected one canonical`);
  const canonical=$('link[rel=canonical]').attr('href')||'';
  check(canonical.startsWith(baseline.domain+'/'),`${relative}: canonical lost original domain`);
  check(!canonical.includes('/suk-astro-2026/'),`${relative}: preview base in canonical`);
  const robots=$('meta[name=robots]').attr('content')||'';
  check((indexable&&relative!=='404.html')?!robots.includes('noindex'):robots.includes('noindex'),`${relative}: unexpected indexing directive ${robots}`);
  for(const element of $('script[type="application/ld+json"]').toArray()){try{JSON.parse($(element).text());}catch{errors.push(`${relative}: invalid JSON-LD`);}}
  check(!$('script[src]').toArray().some(el=>/^https?:/.test($(el).attr('src')||'')),`${relative}: remote script dependency`);
  for(const image of $('img').toArray())check($(image).attr('alt')!==undefined,`${relative}: image without alt`);
  const documentPath='/'+relative.replace(/index\.html$/,'');
  for(const element of $('[href],[src]').toArray()){
    const attribute=$(element).attr('href')!==undefined?'href':'src';
    const value=$(element).attr(attribute);
    if(!value||/^(mailto:|tel:|data:|https?:|javascript:|\/\/)/.test(value))continue;
    const url=new URL(value,`https://local.test${base}${documentPath}`);
    if(base&&value.startsWith('/'))check(url.pathname===base||url.pathname.startsWith(base+'/'),`${relative}: missing base in ${value}`);
    let pathname=decodeURIComponent(url.pathname);
    if(base&&pathname.startsWith(base))pathname=pathname.slice(base.length)||'/';
    let target=path.join(dist,pathname);
    if(pathname.endsWith('/'))target=path.join(target,'index.html');
    else if(!path.extname(pathname)&&await exists(path.join(target,'index.html')))target=path.join(target,'index.html');
    check(await exists(target),`${relative}: broken local ${attribute} ${value}`);
    if(url.hash&&cache.has(target)){
      const id=decodeURIComponent(url.hash.slice(1));
      check(cache.get(target)(`[id="${id.replaceAll('"','\\"')}"]`).length>0,`${relative}: broken anchor ${value}`);
    }
  }
}
const home=cache.get(path.join(dist,'index.html'));
assert(home,'Homepage output missing');
check(home('title').text()===baseline.pages.find(page=>page.route==='/').title,'Original German homepage title changed');
check(home('h1').text().replace(/\s+/g,' ').includes('Klavierunterricht in Berlin Prenzlauer Berg'),'Main search phrase missing from H1');
for(const id of ['0','aboutme','unterricht','pianistin','kontakt'])check(home(`[id="${id}"]`).length===1,`Original anchor missing: ${id}`);
for(const [lang,url] of [['de-DE',baseline.domain+'/'],['ko-KR',baseline.domain+'/ko/home/']]){
  for(const route of ['index.html','ko/index.html','ko/home/index.html'])check(cache.get(path.join(dist,route))?.(`link[hreflang="${lang}"]`).attr('href')===url,`${route}: reciprocal hreflang missing for ${lang}`);
}
const sitemap=await readFile(path.join(dist,'sitemap-0.xml'),'utf8');
check(!sitemap.includes('/suk-astro-2026/'),'Preview base leaked into sitemap');
for(const route of ['/','/ko/home/','/audio/','/ko/audio/','/bio/'])check(sitemap.includes(`<loc>${baseline.domain}${route}</loc>`),`Sitemap missing ${route}`);
check(!sitemap.includes('/404'),'404 in sitemap');
check(await exists(path.join(dist,'sitemap_index.xml')),'Legacy sitemap URL missing');
for(const name of ['page','post','attachment','category','author'])check(await exists(path.join(dist,`${name}-sitemap.xml`)),`Legacy ${name} sitemap URL missing`);
const robots=await readFile(path.join(dist,'robots.txt'),'utf8');
check(!robots.includes('Disallow: /'),'Robots blocks crawling; noindex must be readable on previews');
if(errors.length){console.error(errors.join('\n'));throw new Error(`${errors.length} SEO/link checks failed`);}
console.log(`Verified ${htmlFiles.length} HTML pages, ${baseline.routes.length} existing routes, ${baseline.assets.length} original assets, internal links, anchors, canonical URLs, language links and sitemap. Mode: ${indexable?'production (indexable)':'preview (noindex)'}.`);
