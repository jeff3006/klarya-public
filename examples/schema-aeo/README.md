# Example: Schema.org for AI search (AEO)

ChatGPT, Claude, Perplexity, and Gemini cite local-business sites that have proper JSON-LD.

## Minimum schema for AEO

The 7 types in `lib/seo/schema-org.ts`:
- Organization
- LocalBusiness
- Service
- FAQPage (most important — direct citation source)
- HowTo
- BreadcrumbList
- AggregateRating

## Steps
1. Copy `lib/seo/schema-org.ts`
2. Call `generateSchemaNodes()` in your page component
3. Render each node as `<script type="application/ld+json">{JSON.stringify(node)}</script>` in the `<head>`

Verify with [Google Rich Results Test](https://search.google.com/test/rich-results).
