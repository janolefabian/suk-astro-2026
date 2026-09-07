import type {APIRoute} from 'astro';
import {site} from '../lib/site';
// Keep the old WordPress sitemap URL for Search Console and inbound references.
export const GET:APIRoute=()=>new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site.origin}/sitemap-0.xml</loc></sitemap></sitemapindex>`,{headers:{'Content-Type':'application/xml'}});
