/**
 * Image loading utility for canvas-forge.
 * Loads images from URLs, file paths, or Buffers with error handling.
 * @module core/ImageLoader
 */

import { loadImage as napiLoadImage, type Image } from '@napi-rs/canvas';
import type { ImageResolvable } from '../types/common';
import { validateImage } from '../utils/validators';

/**
 * Loads an image from various sources (URL, file path, or Buffer).
 *
 * This function wraps `@napi-rs/canvas`'s `loadImage` with better error
 * handling and support for multiple input formats.
 *
 * @param source - The image source: URL string, file path, Buffer, or URL object.
 * @returns A Promise resolving to the loaded Image.
 * @throws Error if the image cannot be loaded.
 *
 * @example
 * ```typescript
 * // Load from URL
 * const avatar = await loadImage('https://cdn.discordapp.com/avatars/...');
 *
 * // Load from file path
 * const bg = await loadImage('./backgrounds/default.png');
 *
 * // Load from Buffer
 * const img = await loadImage(someBuffer);
 * ```
 */
export async function loadImage(source: ImageResolvable): Promise<Image> {
  validateImage(source, 'source');

  try {
    if (source instanceof URL) {
      return await napiLoadImage(source.toString());
    }
    return await napiLoadImage(source);
  } catch (error) {
    const sourceDesc =
      typeof source === 'string'
        ? source.length > 100
          ? source.slice(0, 100) + '...'
          : source
        : source instanceof Buffer
          ? `Buffer(${source.length} bytes)`
          : String(source);

    throw new Error(
      `[canvas-forge] Failed to load image from "${sourceDesc}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Attempts to load an image, returning null if it fails instead of throwing.
 *
 * @param source - The image source.
 * @returns The loaded Image, or null if loading failed.
 *
 * @example
 * ```typescript
 * const img = await tryLoadImage(userAvatar);
 * if (!img) {
 *   // Use a fallback avatar
 * }
 * ```
 */
export async function tryLoadImage(source: ImageResolvable): Promise<Image | null> {
  try {
    return await loadImage(source);
  } catch {
    return null;
  }
}
