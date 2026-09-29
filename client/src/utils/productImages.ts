/**
 * NEXORO Canonical Product Image Mapping & Category-Safe Fallback System
 * 
 * Rules:
 * 1. Strict category compliance:
 *    - HEADPHONES must only display over-ear headphone imagery.
 *    - WIRELESS EARBUDS must only display true wireless earbuds / charging case imagery.
 * 2. Stable identifier mapping: Products are matched via SKU/ID, never array index.
 * 3. Fallbacks: If an image fails to load, fallback strictly matches product category.
 * 4. Development-time validation: Verifies category/asset set alignment in DEV mode.
 */

import { Product } from '../types';

export const SKU_IMAGE_MAP: Record<string, string> = {
  // --- HEADPHONES ---
  'NXR-APX-01': '/images/products/apex-x.jpg',
  'NXR-VST-02': '/images/products/vector-studio.jpg',
  'NXR-HX1-03': '/images/products/halo-x1.jpg',
  'NXR-FRG-04': '/images/products/forge.jpg',
  'NXR-ZNT-05': '/images/products/zenith.jpg',
  'NXR-FLX-06': '/images/products/flux.jpg',

  // --- WIRELESS EARBUDS ---
  'NXR-ARC-01': '/images/products/arc-tws.jpg',
  'NXR-PLS-02': '/images/products/pulse-buds.jpg',
  'NXR-HLB-03': '/images/products/halo-buds.jpg',
  'NXR-COR-04': '/images/products/core-tws.jpg',
  'NXR-FXB-05': '/images/products/flux-buds.jpg',
  'NXR-ZTB-06': '/images/products/zenith-tws.jpg',
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  HEADPHONES: '/images/products/fallback-headphones.jpg',
  EARBUDS: '/images/products/fallback-earbuds.jpg',
  WIRELESS_EARBUDS: '/images/products/fallback-earbuds.jpg',
  'WIRELESS EARBUDS': '/images/products/fallback-earbuds.jpg',
  DEFAULT: '/images/products/fallback-headphones.jpg',
};

/**
 * Returns the category-safe fallback image URL.
 */
export function getCategoryFallback(category?: string): string {
  if (!category) return CATEGORY_FALLBACK_IMAGES.DEFAULT;
  const upper = category.toUpperCase().trim();
  if (upper === 'EARBUDS' || upper === 'WIRELESS EARBUDS' || upper === 'WIRELESS_EARBUDS' || upper === 'TWS') {
    return CATEGORY_FALLBACK_IMAGES.EARBUDS;
  }
  return CATEGORY_FALLBACK_IMAGES.HEADPHONES;
}

/**
 * Resolves the canonical, verified image URL for any product or product-like object.
 */
export function getProductImageUrl(
  product?: Partial<Product> | { sku?: string; category?: string; imageUrl?: string; name?: string } | null
): string {
  if (!product) return CATEGORY_FALLBACK_IMAGES.DEFAULT;

  // 1. Check stable SKU mapping first
  if (product.sku && SKU_IMAGE_MAP[product.sku]) {
    const canonical = SKU_IMAGE_MAP[product.sku];
    validateDevAsset(product.sku, product.category, canonical);
    return canonical;
  }

  // 2. If product has an explicitly set imageUrl that is valid
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return product.imageUrl;
  }

  // 3. Fallback strictly based on category
  return getCategoryFallback(product.category);
}

/**
 * Development-time validation to catch mismatched categories and image assets.
 */
function validateDevAsset(sku: string, category?: string, resolvedUrl?: string) {
  if (!(import.meta as any)?.env?.DEV) return;
  if (!category || !resolvedUrl) return;

  const upperCat = category.toUpperCase().trim();
  const isEarbudCategory = upperCat === 'EARBUDS' || upperCat === 'WIRELESS EARBUDS' || upperCat === 'WIRELESS_EARBUDS' || upperCat === 'TWS';
  const isHeadphoneCategory = upperCat === 'HEADPHONES';

  // Prohibited patterns in earbud category
  const headphoneSignals = ['headphone', 'apex', 'vector', 'forge', 'halo-x1', 'guitar'];
  // Prohibited patterns in headphone category
  const earbudSignals = ['earbud', 'buds', 'tws', 'airpods'];

  const lowerUrl = resolvedUrl.toLowerCase();

  if (isEarbudCategory) {
    for (const signal of headphoneSignals) {
      if (lowerUrl.includes(signal)) {
        console.warn(
          `[NEXORO Image Audit Warning] Earbud SKU "${sku}" is using suspected headphone asset: ${resolvedUrl}`
        );
        break;
      }
    }
  } else if (isHeadphoneCategory) {
    for (const signal of earbudSignals) {
      if (lowerUrl.includes(signal)) {
        console.warn(
          `[NEXORO Image Audit Warning] Headphone SKU "${sku}" is using suspected earbud asset: ${resolvedUrl}`
        );
        break;
      }
    }
  }
}
