/**
 * Sitemap split helper for Next.js 15+
 *
 * Google sitemaps are limited to 50 000 URLs each.
 * For sites with >5 000 pages, split into chunks and serve a sitemap-index.
 *
 * Adapted from production code at https://klarya.co.il
 */

export const URLS_PER_SITEMAP = 5000;

export interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

export function chunkCount(total: number): number {
  return Math.ceil(total / URLS_PER_SITEMAP);
}

export function urlsToXml(urls: UrlEntry[]): string {
  const items = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export function indexToXml(baseUrl: string, count: number): string {
  const now = new Date().toISOString();
  const items = Array.from({ length: count }, (_, i) => `  <sitemap>
    <loc>${baseUrl}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Auto-detect base URL from request host (works in Vercel, Cloudflare, local).
 * Falls back to NEXT_PUBLIC_SITE_URL env var if set.
 */
export function getBaseUrl(host?: string | null): string {
  const env = (process.env.NEXT_PUBLIC_SITE_URL ?? '')
    .replace(/[\r\n\t]/g, '')
    .trim()
    .replace(/\/$/, '');
  if (env && env.startsWith('http')) return env;
  if (host) {
    const cleanHost = host.replace(/[\r\n\t]/g, '').trim();
    const proto = cleanHost.includes('localhost') ? 'http' : 'https';
    return `${proto}://${cleanHost}`;
  }
  return 'https://example.com';
}
