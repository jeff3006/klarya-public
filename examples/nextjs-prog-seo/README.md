# Example: Next.js 15 Programmatic SEO

Generate 10 000+ unique programmatic pages with `pickVariantIndex` deterministic hash.

## Pattern
```
app/[locale]/[service]/[city]/page.tsx
```

## Steps
1. Install Next.js 15+ (`npx create-next-app@latest`)
2. Copy `lib/hash.ts` and `lib/variants.ts` from this repo
3. Build a `getStaticParams()` that returns your locale × service × city matrix
4. In the page, call `renderBlock(ctx, 'hero', variants)` to render unique content per route

See [klarya.co.il](https://klarya.co.il) for a production example.
