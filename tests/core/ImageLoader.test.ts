/**
 * Tests for the ImageLoader module.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { loadImage, tryLoadImage } from '../../src/core/ImageLoader';

// Generate a minimal valid 1x1 PNG buffer for testing
function createTestPngBuffer(): Buffer {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 1, 1);
  return canvas.toBuffer('image/png');
}

describe('loadImage', () => {
  it('should load an image from a Buffer', async () => {
    const buffer = createTestPngBuffer();
    const img = await loadImage(buffer);
    expect(img).toBeDefined();
    expect(img.width).toBe(1);
    expect(img.height).toBe(1);
  });

  it('should throw for an empty string', async () => {
    await expect(loadImage('')).rejects.toThrow('[canvas-forge]');
  });

  it('should throw for an empty buffer', async () => {
    await expect(loadImage(Buffer.alloc(0))).rejects.toThrow('[canvas-forge]');
  });

  it('should throw for an invalid URL', async () => {
    await expect(loadImage('https://invalid.nonexistent.domain/image.png')).rejects.toThrow();
  });
});

describe('tryLoadImage', () => {
  it('should return an image from a valid Buffer', async () => {
    const buffer = createTestPngBuffer();
    const img = await tryLoadImage(buffer);
    expect(img).not.toBeNull();
    expect(img!.width).toBe(1);
  });

  it('should return null for invalid sources', async () => {
    const img = await tryLoadImage('https://invalid.nonexistent.domain/image.png');
    expect(img).toBeNull();
  });
});
