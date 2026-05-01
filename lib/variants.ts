/**
 * Programmatic SEO — Deterministic content variant engine
 *
 * Pick 1 of N variants for a page based on (city, service, locale, blockId)
 * using a deterministic hash. Same URL always renders the same content
 * → no "duplicate content" risk while still having unique pages at scale.
 *
 * 50 variants × 10 blocks = 9.7 × 10^16 unique combinations.
 * At 20 000 pages indexed, the probability of two pages sharing all 10 blocks
 * is effectively 0 (Helpful Content Update safe).
 *
 * Adapted from production code at https://klarya.co.il
 */

import { pickVariantIndex } from './hash';

export type BlockId =
  | 'hero'
  | 'intro'
  | 'value-prop'
  | 'service-pitch-1'
  | 'service-pitch-2'
  | 'service-pitch-3'
  | 'social-proof'
  | 'faq-intro'
  | 'guarantee'
  | 'cta-final';

export const BLOCK_IDS: BlockId[] = [
  'hero', 'intro', 'value-prop',
  'service-pitch-1', 'service-pitch-2', 'service-pitch-3',
  'social-proof', 'faq-intro', 'guarantee', 'cta-final',
];

export const VARIANTS_PER_BLOCK = 50;

export interface VariantContext {
  city: string;
  cityLabel: string;
  service: string;
  serviceLabel: string;
  locale: string;
}

/** Select a deterministic variant index for a (context, block) tuple. */
export function pickVariant(ctx: VariantContext, block: BlockId): number {
  return pickVariantIndex(
    ctx.city,
    ctx.service,
    ctx.locale,
    block,
    VARIANTS_PER_BLOCK
  );
}

/** Interpolate {city}, {service} placeholders in a template string. */
export function interpolate(
  template: string,
  ctx: { cityLabel: string; serviceLabel: string }
): string {
  return template
    .replaceAll('{city}', ctx.cityLabel)
    .replaceAll('{service}', ctx.serviceLabel);
}

/**
 * Render a block's text given the page context and a bank of variants.
 * `variants` is a 2D map: locale → blockId → string[] (50 entries each).
 */
export function renderBlock(
  ctx: VariantContext,
  block: BlockId,
  variants: Record<string, Record<BlockId, string[]>>
): { block: BlockId; index: number; text: string } {
  const idx = pickVariant(ctx, block);
  const bank = variants[ctx.locale]?.[block] ?? [];
  if (bank.length === 0) {
    return { block, index: idx, text: '' };
  }
  const tmpl = bank[idx % bank.length];
  return { block, index: idx, text: interpolate(tmpl, ctx) };
}

export function renderAllBlocks(
  ctx: VariantContext,
  variants: Record<string, Record<BlockId, string[]>>
) {
  return BLOCK_IDS.map((b) => renderBlock(ctx, b, variants));
}
