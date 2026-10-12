import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {readFileSync} from 'node:fs';

// Canonicals deliberately keep the established domain even on the Pages preview.
const site = 'https://klavierlernen-berlin.de';
const base = process.env.BASE_PATH || '/';
const legacyPages=JSON.parse(readFileSync(new URL('./src/data/legacy-pages.json',import.meta.url),'utf8'));
const nonCanonicalPages=new Set(legacyPages.filter(page=>page.path!==page.canonical).map(page=>page.path));
// The user approved deleting these empty WordPress pages on 2026-10-12.
// Keep them excluded in case a future archive import recreates a route.
const legacyPlaceholders=new Set(['/hallo-welt/','/category/allgemein/','/author/jacfab/']);
const withoutBase=(pathname)=>base!=='/'&&pathname.startsWith(base)?'/'+pathname.slice(base.length).replace(/^\//,''):pathname;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({
    filter: (page) => {
      const pathname=withoutBase(new URL(page).pathname);
      return pathname!=='/404/'&&!pathname.endsWith('/404.html')&&pathname!=='/ko/'&&!pathname.startsWith('/vergleich/')&&!nonCanonicalPages.has(pathname)&&!legacyPlaceholders.has(pathname);
    },
    serialize(item) {
      const pathname = new URL(item.url).pathname;
      const cleanPath = withoutBase(pathname);
      item.url = new URL(cleanPath, site).href;
      return item;
    }
  })]
});
