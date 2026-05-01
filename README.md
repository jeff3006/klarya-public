# Multilingual Programmatic SEO Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

> **Production-ready TypeScript modules for building large-scale multilingual SEO websites.**
> Generate 10 000+ unique pages with deterministic content variants, sitemap auto-split, AEO-ready Schema.org, and lead detection in 8 languages — zero dependencies.

---

## ⭐ Why this toolkit

Building **programmatic SEO at scale** (10k+ pages) hits 4 problems most devs solve badly:

1. **Duplicate content penalty** (Helpful Content Update) — pages that look the same get deindexed.
2. **Sitemap > 50 000 URLs** — Google rejects the file, your pages stop being crawled.
3. **AI search invisibility** — without proper Schema.org, ChatGPT/Claude/Perplexity won't cite you.
4. **Multilingual support broken** — RTL, hreflang, locale-aware regex are subtle.

This toolkit solves each with **standalone, zero-dependency TypeScript modules** you copy-paste into your Next.js or Node project.

---

## 📦 Modules

| Module | Purpose | Key feature |
|---|---|---|
| [`lib/hash.ts`](./lib/hash.ts) | Deterministic content variant selection | FNV-1a 32-bit, edge-runtime safe |
| [`lib/variants.ts`](./lib/variants.ts) | Pick 1 of N variants per (city × service × locale × block) | 50 × 10 = 9.7 × 10^16 unique combos |
| [`lib/seo/sitemap-urls.ts`](./lib/seo/sitemap-urls.ts) | Sitemap split + auto host detect | Compliant with Google 50k limit |
| [`lib/seo/schema-org.ts`](./lib/seo/schema-org.ts) | JSON-LD generator (7 types) | Organization, LocalBusiness, Service, FAQPage, HowTo, BreadcrumbList, AggregateRating |
| [`lib/chat/signals.ts`](./lib/chat/signals.ts) | Multilingual lead signal detection | 8 languages: HE, EN, FR, AR, RU, ES, IT, DE |

---

## 🚀 Quick start

### 1. Programmatic content with no duplicate penalty

```ts
import { pickVariantIndex } from './lib/hash';
import { renderBlock } from './lib/variants';

const ctx = {
  city: 'tel-aviv', cityLabel: 'Tel Aviv',
  service: 'plumber', serviceLabel: 'Plumbers',
  locale: 'fr',
};

const heroVariants = {
  fr: {
    hero: [
      'Find the best {service} in {city}',
      '{service} in {city} — your trusted partner',
      'Looking for {service}? {city} has the answer',
      // ... 47 more
    ],
  },
};

const idx = pickVariantIndex(ctx.city, ctx.service, ctx.locale, 'hero', 50);
// idx is deterministic — same URL always gets same content (SEO-safe)
```

### 2. Auto-split sitemap > 5 000 URLs

```ts
// app/sitemap.xml/route.ts
import { buildAllUrls, indexToXml, getBaseUrl } from '@/lib/seo/sitemap-urls';

export async function GET(req: Request) {
  const baseUrl = getBaseUrl(req.headers.get('host'));
  const urls = buildAllUrls(baseUrl); // your URL list
  const count = Math.ceil(urls.length / 5000);
  return new Response(indexToXml(baseUrl, count), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### 3. AEO-ready Schema.org JSON-LD

```ts
import { generateSchemaNodes } from './lib/seo/schema-org';

const nodes = generateSchemaNodes({
  baseUrl: 'https://example.com',
  brandName: 'YourBrand',
  city: 'Tel Aviv',
  serviceLabel: 'Plumbing',
  servicePlural: 'Plumbers',
  pageUrl: 'https://example.com/fr/plumber/tel-aviv',
  pageTitle: 'Plumbers in Tel Aviv',
  pageDescription: '...',
  faqs: [{ question: 'How much?', answer: '...' }],
  countryCode: 'IL',
});

// Insert in <head>: <script type="application/ld+json">{JSON.stringify(node)}</script>
```

### 4. Multilingual lead detection

```ts
import { extractLeadInfo, detectSignals } from './lib/chat/signals';

const userText = "Hi! My name is Sarah, my email is sarah@example.com. How much for a website?";
const lead = extractLeadInfo(userText);
// { firstName: 'Sarah', email: 'sarah@example.com' }

const signals = detectSignals(userText);
// [{ type: 'buying_intent', score: 0.7, trigger: 'How much' }]
```

---

## 📚 Examples

See the [`examples/`](./examples/) folder for complete working examples:

- [`examples/nextjs-prog-seo/`](./examples/nextjs-prog-seo/) — Next.js 15 app with 10 000 programmatic pages
- [`examples/sitemap-split/`](./examples/sitemap-split/) — Sitemap split for large sites
- [`examples/schema-aeo/`](./examples/schema-aeo/) — Schema.org for AI search citation

---

## 🌍 Supported Languages

The signal detection module ships with patterns for:

🇮🇱 Hebrew · 🇬🇧 English · 🇫🇷 French · 🇸🇦 Arabic · 🇷🇺 Russian · 🇪🇸 Spanish · 🇮🇹 Italian · 🇩🇪 German

Easy to extend — see [`lib/chat/signals.ts`](./lib/chat/signals.ts) for the pattern format.

---

## 🤔 FAQ

### Why FNV-1a hash and not MD5/SHA-1?
FNV-1a is fast (single-pass, no allocations), zero dependencies, and works in Vercel Edge Runtime / Cloudflare Workers without polyfills. MD5/SHA-1 are overkill for variant selection.

### Why 50 variants per block?
50 × 10 blocks = 9.7 × 10^16 unique combinations. At 100 000 pages, the probability of collision is mathematically zero. Google's Helpful Content Update can't penalize you for "duplicate content" if every page is mathematically unique.

### How do I add a 9th language?
Open `lib/chat/signals.ts` and add patterns to the `PATTERNS` array. Each pattern is a regex + signal type + score. Pull requests welcome.

### Does this work with Cloudflare Workers / Deno / Bun?
Yes. The modules use only TypeScript built-ins and standard `URL`, `Map`, regex APIs. No Node-specific code.

### Can I use this for SaaS launch pages?
Absolutely — that's the primary use case. See [`examples/nextjs-prog-seo`](./examples/nextjs-prog-seo) for the SaaS variant.

---

## 🎯 What works well with this toolkit

- **Local SEO at scale**: city × service × locale matrix (e.g. 200 cities × 10 services × 8 languages = 16 000 pages)
- **Multilingual SaaS landing pages**: variant content per locale + Schema.org per region
- **Marketplace SEO**: deterministic content variants for listing pages
- **B2B service directories**: AEO-optimized Schema.org for AI search citation

## ❌ What this toolkit isn't

- Not a full SEO framework — it's 5 focused modules. Compose with your own.
- Not an AI content generator — variants are author-written templates with placeholders.
- Not a CMS — bring your own data layer (Prisma, Supabase, JSON files, whatever).

---

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

Quick guidelines:
- TypeScript strict mode
- Zero runtime dependencies
- Edge-runtime compatible
- Tests for any new pattern
- Multilingual: think 8 languages from day 1

---

## 📄 License

MIT — see [LICENSE](./LICENSE). Use it freely in commercial projects.

---

## 🇮🇱 Maintained by

This toolkit is open-sourced and maintained by the team at **[Klarya](https://klarya.co.il)** — based in Netanya, Israel.

If you're an Israeli SMB looking to grow online, check us out: [klarya.co.il](https://klarya.co.il).

---

## ⭐ Star this repo

If this toolkit saves you time, a star helps others find it. Thanks!

## 🏷 Topics

`programmatic-seo` `nextjs` `typescript` `i18n` `multilingual` `schema-org` `aeo` `seo-tools` `sitemap` `lead-detection` `vercel` `edge-runtime` `israel-tech` `open-source`
