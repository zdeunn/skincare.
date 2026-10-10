import { describe, expect, it } from 'vitest';
import { product } from '@/lib/product';

describe('product config', () => {
  it('has at least one image, and the main image is the first one', () => {
    expect(product.images.length).toBeGreaterThan(0);
    expect(product.image).toBe(product.images[0]);
    for (const img of product.images) {
      expect(img.src).toMatch(/^\//);
      expect(img.alt.length).toBeGreaterThan(0);
    }
  });

  it('bundle items have positive integer quantities and unique names', () => {
    for (const item of product.bundleItems) {
      expect(Number.isInteger(item.quantity) && item.quantity > 0).toBe(true);
    }
    const names = product.bundleItems.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
