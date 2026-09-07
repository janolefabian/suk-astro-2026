import type {APIRoute} from 'astro';
import {isIndexable,site} from '../lib/site';
export const GET:APIRoute=()=>new Response(`User-agent: *\nDisallow:\n\n${isIndexable?`Sitemap: ${site.origin}/sitemap_index.xml\n`:''}`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
