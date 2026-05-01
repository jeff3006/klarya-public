# Example: Sitemap split for large sites

When you have > 5 000 URLs, Google needs a sitemap-index pointing to chunks.

## Pattern
```
/sitemap.xml         → sitemap-index
/sitemap/0.xml       → first 5000 URLs
/sitemap/1.xml       → next 5000 URLs
/sitemap/2.xml       → ...
```

## Steps
1. Copy `lib/seo/sitemap-urls.ts`
2. Create `app/sitemap.xml/route.ts` returning `indexToXml()`
3. Create `app/sitemap/[id].xml/route.ts` returning the chunk via `urlsToXml()`

Done — Google will crawl all chunks automatically.
