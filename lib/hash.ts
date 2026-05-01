/**
 * Klarya — Hash déterministe pour variantes 50/bloc.
 * Implémentation xxhash32-like FNV-1a 32 bits (zero deps, build-time safe, edge-safe).
 *
 * Garantit que (ville, métier, locale, blockIndex) → toujours la même variante.
 * 50^10 = 9.7 × 10^16 combinaisons → 0% duplicate Google.
 */

const FNV_OFFSET_32 = 0x811c9dc5;
const FNV_PRIME_32 = 0x01000193;

/** FNV-1a 32-bit hash (deterministic, fast, no Node crypto needed). */
export function hash32(input: string): number {
  let hash = FNV_OFFSET_32;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // Multiplication 32-bit unsigned
    hash = Math.imul(hash, FNV_PRIME_32) >>> 0;
  }
  return hash >>> 0;
}

/** Returns an integer in [0, max). Deterministic from input. */
export function hashIndex(input: string, max: number): number {
  if (max <= 0) return 0;
  return hash32(input) % max;
}

/**
 * Composite key for variant selection.
 * Pattern : "ville|metier|locale|blockId"
 */
export function variantKey(
  ville: string,
  metier: string,
  locale: string,
  blockId: string | number
): string {
  return `${ville}|${metier}|${locale}|${blockId}`;
}

/**
 * Pick a deterministic variant index for a content block.
 * Always returns the same index for the same (ville, metier, locale, blockId).
 */
export function pickVariantIndex(
  ville: string,
  metier: string,
  locale: string,
  blockId: string | number,
  variantCount: number
): number {
  return hashIndex(variantKey(ville, metier, locale, blockId), variantCount);
}
