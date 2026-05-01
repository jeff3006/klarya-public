# Open-source TypeScript modules for multilingual programmatic SEO

> Standalone, zero-dependency TypeScript modules for building large-scale multilingual websites with proper SEO and AEO support.

MIT licensed. Drop-in to any Next.js / Node.js project.

---

## Modules

| File | What it does |
|---|---|
| [`lib/hash.ts`](./lib/hash.ts) | FNV-1a 32-bit deterministic hash (zero deps, edge-safe) |
| [`lib/variants.ts`](./lib/variants.ts) | Programmatic content variant engine — pick 1 of N with deterministic hash |
| [`lib/seo/sitemap-urls.ts`](./lib/seo/sitemap-urls.ts) | Sitemap split helper for sites with > 5 000 pages |
| [`lib/seo/schema-org.ts`](./lib/seo/schema-org.ts) | JSON-LD generator (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList) |
| [`lib/chat/signals.ts`](./lib/chat/signals.ts) | Multilingual lead signal detection (HE/EN/FR/AR/RU/ES/IT/DE) |

---

## Why these patterns

### Programmatic SEO without "duplicate content" penalty

Combining `lib/hash.ts` + `lib/variants.ts` lets you generate large-scale unique pages where every page has a deterministic but non-duplicate content fingerprint.

```ts
import { pickVariantIndex } from './lib/hash';
const idx = pickVariantIndex('city-slug', 'service-slug', 'fr', 'hero', 50);
// Always returns the same index for this exact tuple → SEO-safe + reproducible
```

### Sitemap that scales

Google's sitemap limit is 50 000 URLs per file. `lib/seo/sitemap-urls.ts` handles automatic chunking with a sitemap-index, and auto-detects your domain from the request host.

### AEO-ready Schema.org

The types in `lib/seo/schema-org.ts` are commonly cited by AI search engines when answering local-business queries.

### Multilingual lead detection

`lib/chat/signals.ts` extracts phone, email, and intent signals from chat messages across 8 languages.

---

## Install

```bash
# Copy the files you need into your project
cp lib/hash.ts your-project/lib/
cp lib/variants.ts your-project/lib/
```

No `npm install` needed — these modules use only TypeScript built-ins.

---

## License

MIT — see [LICENSE](./LICENSE).

---

Maintained by **[Klarya](https://klarya.co.il)** · Made in Netanya, Israel 🇮🇱

## Topics

`nextjs` `programmatic-seo` `aeo` `multilingual` `i18n` `typescript` `seo` `schema-org` `sitemap`
