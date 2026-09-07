import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {load} from 'cheerio';
import path from 'node:path';
const root=new URL('../',import.meta.url).pathname;
const origin='https://klavierlernen-berlin.de';
const inventory=JSON.parse(await readFile(path.join(root,'.audit/inventory.json'),'utf8'));
const alreadyBuilt=new Set(['/','/ko/','/ko','/ko/home/','/audio/','/ko/audio/','/bio/','/impressum/','/datenschutz/']);
const urls=[...new Set(Object.values(inventory.sitemaps).flatMap(xml=>[...String(xml).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])))].filter(url=>url.startsWith(origin)&&!url.endsWith('.xml')&&!alreadyBuilt.has(new URL(url).pathname));
const assets=new Set();
const assetsOnly=process.argv.includes('--assets-only');
const results=assetsOnly?JSON.parse(await readFile(path.join(root,'src/data/legacy-pages.json'),'utf8')):[];
for(let i=0;!assetsOnly&&i<urls.length;i+=4){
  results.push(...await Promise.all(urls.slice(i,i+4).map(async url=>{
    const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw new Error(`${response.status} ${url}`);
    const html=await response.text();
    const $=load(html);
    const content=$('main .entry-content').first();
    content.find('script,style,iframe,form,object,embed,input,button,link,meta').remove();
    content.find('*').each((_,element)=>{
      for(const name of Object.keys(element.attribs||{})){
        if(/^on/i.test(name)||['style','class','id','itemscope','itemtype','itemprop','srcset','sizes'].includes(name))$(element).removeAttr(name);
      }
    });
    content.find('[src]').each((_,element)=>{
      const src=$(element).attr('src');
      if(src?.startsWith(origin+'/wp-content/uploads/'))assets.add(new URL(src).pathname);
    });
    content.find('a').each((_,element)=>{const href=$(element).attr('href')||'';if(/^(javascript|data):/i.test(href))$(element).removeAttr('href');});
    const page={path:new URL(url).pathname,title:$('title').text(),description:$('meta[name=description]').attr('content')||'',canonical:new URL($('link[rel=canonical]').attr('href')||url).pathname,heading:$('main h1').first().text()||$('main .entry-title').first().text()||$('title').text().split(' - ')[0],html:content.html()||'<p>Klavierunterricht mit Jongsuk Kim in Berlin Prenzlauer Berg.</p>'};
    return page;
  })));
}
for(const page of results){
  const $=load(page.html);
  if(page.canonical.startsWith('/wp-content/uploads/'))assets.add(page.canonical);
  $('[src],a[href]').each((_,element)=>{
    const value=$(element).attr('src')||$(element).attr('href');
    if(value?.startsWith(origin+'/wp-content/uploads/'))assets.add(new URL(value).pathname);
  });
}
for(const asset of assets){
  const target=path.join(root,'public',asset);
  try{await access(target);continue;}catch{}
  const response=await fetch(origin+asset,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`${response.status} ${asset}`);
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,Buffer.from(await response.arrayBuffer()));
}
await mkdir(path.join(root,'src/data'),{recursive:true});
await writeFile(path.join(root,'src/data/legacy-pages.json'),JSON.stringify(results,null,2));
const originalRoutes=[...new Set(['/',...Object.values(inventory.sitemaps).flatMap(xml=>[...String(xml).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])).filter(url=>url.startsWith(origin)&&!url.endsWith('.xml')).map(url=>new URL(url).pathname)])];
await mkdir(path.join(root,'docs'),{recursive:true});
await writeFile(path.join(root,'docs/seo-baseline.json'),JSON.stringify({capturedAt:inventory.date,domain:origin,pages:inventory.pages,routes:originalRoutes,assets:[...new Set([...inventory.assets.filter(a=>!a.error).map(a=>a.path),...assets])]},null,2));
console.log(JSON.stringify({legacyPages:results.map(({path,title,canonical})=>({path,title,canonical})),additionalImages:[...assets],originalRoutes},null,2));
