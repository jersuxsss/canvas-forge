/**
 * Color manipulation and conversion utilities for canvas-forge.
 *
 * Provides functions to convert between color formats, manipulate colors,
 * and access Discord brand color constants.
 *
 * @module utils/colors
 */

import type { ColorResolvable, GradientData, GradientDirection } from '../types/common';

/**
 * Parsed RGBA color components.
 */
export interface RGBAColor {
  /** Red channel (0-255). */
  r: number;
  /** Green channel (0-255). */
  g: number;
  /** Blue channel (0-255). */
  b: number;
  /** Alpha channel (0.0-1.0). */
  a: number;
}

/**
 * Resolves a `ColorResolvable` into a CSS-compatible color string.
 *
 * @param color - The color to resolve (hex string, RGB/RGBA tuple, or CSS color name).
 * @returns A CSS-compatible color string (e.g., '#ff0000' or 'rgba(255,0,0,0.5)').
 * @throws Error if the color format is invalid.
 *
 * @example
 * ```typescript
 * resolveColor('#e94560');        // '#e94560'
 * resolveColor([233, 69, 96]);    // 'rgb(233, 69, 96)'
 * resolveColor([233, 69, 96, 0.5]); // 'rgba(233, 69, 96, 0.5)'
 * resolveColor('red');            // 'red'
 * ```
 */
export function resolveColor(color: ColorResolvable): string {
  if (typeof color === 'string') {
    return color;
  }

  if (Array.isArray(color)) {
    if (color.length === 3) {
      const [r, g, b] = color;
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (color.length === 4) {
      const [r, g, b, a] = color;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  }

  throw new Error(`[canvas-forge] Invalid color format: ${String(color)}`);
}

/**
 * Parses a hex color string into RGBA components.
 *
 * Supports 3-char (#RGB), 4-char (#RGBA), 6-char (#RRGGBB), and 8-char (#RRGGBBAA) hex strings.
 *
 * @param hex - The hex color string to parse.
 * @returns Parsed RGBA color object.
 * @throws Error if the hex string is invalid.
 *
 * @example
 * ```typescript
 * hexToRgba('#e94560');    // { r: 233, g: 69, b: 96, a: 1 }
 * hexToRgba('#e9456080');  // { r: 233, g: 69, b: 96, a: 0.502 }
 * hexToRgba('#f00');       // { r: 255, g: 0, b: 0, a: 1 }
 * ```
 */
export function hexToRgba(hex: string): RGBAColor {
  // Remove the leading '#' if present
  let cleaned = hex.replace(/^#/, '');

  // Expand shorthand (3/4 char) to full form
  if (cleaned.length === 3 || cleaned.length === 4) {
    cleaned = cleaned
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (cleaned.length !== 6 && cleaned.length !== 8) {
    throw new Error(`[canvas-forge] Invalid hex color: "${hex}"`);
  }

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const a = cleaned.length === 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;

  if ([r, g, b].some((v) => isNaN(v))) {
    throw new Error(`[canvas-forge] Invalid hex color: "${hex}"`);
  }

  return { r, g, b, a: Math.round(a * 1000) / 1000 };
}

/**
 * Converts RGBA components to a hex color string.
 *
 * @param r - Red channel (0-255).
 * @param g - Green channel (0-255).
 * @param b - Blue channel (0-255).
 * @param a - Alpha channel (0.0-1.0). Defaults to 1.
 * @returns Hex color string (e.g., '#e94560' or '#e9456080').
 *
 * @example
 * ```typescript
 * rgbaToHex(233, 69, 96);       // '#e94560'
 * rgbaToHex(233, 69, 96, 0.5);  // '#e9456080'
 * ```
 */
export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (a < 1) {
    return hex + toHex(Math.round(a * 255));
  }

  return hex;
}

/**
 * Darkens a hex color by a given percentage.
 *
 * @param hex - The hex color to darken.
 * @param amount - Percentage to darken (0-100). Defaults to 20.
 * @returns The darkened hex color string.
 *
 * @example
 * ```typescript
 * darken('#e94560', 30); // A darker shade of the input color
 * ```
 */
export function darken(hex: string, amount: number = 20): string {
  const { r, g, b, a } = hexToRgba(hex);
  const factor = 1 - amount / 100;

  return rgbaToHex(
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor),
    a,
  );
}

/**
 * Lightens a hex color by a given percentage.
 *
 * @param hex - The hex color to lighten.
 * @param amount - Percentage to lighten (0-100). Defaults to 20.
 * @returns The lightened hex color string.
 *
 * @example
 * ```typescript
 * lighten('#e94560', 30); // A lighter shade of the input color
 * ```
 */
export function lighten(hex: string, amount: number = 20): string {
  const { r, g, b, a } = hexToRgba(hex);
  const factor = amount / 100;

  return rgbaToHex(
    Math.round(r + (255 - r) * factor),
    Math.round(g + (255 - g) * factor),
    Math.round(b + (255 - b) * factor),
    a,
  );
}

/**
 * Adjusts the opacity of a hex color.
 *
 * @param hex - The hex color to adjust.
 * @param opacity - New opacity value (0.0-1.0).
 * @returns The color with adjusted opacity as an rgba string.
 *
 * @example
 * ```typescript
 * withOpacity('#e94560', 0.5); // 'rgba(233, 69, 96, 0.5)'
 * ```
 */
export function withOpacity(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgba(hex);
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
}

/**
 * Checks if a string is a valid hex color.
 *
 * @param value - The string to check.
 * @returns True if the value is a valid hex color.
 *
 * @example
 * ```typescript
 * isHexColor('#e94560');   // true
 * isHexColor('#f00');      // true
 * isHexColor('e94560');    // false (missing #)
 * isHexColor('#xyz');      // false
 * ```
 */
export function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

/**
 * Creates gradient color stops data for use with the canvas API.
 * Returns an array of `[offset, color]` pairs evenly distributed.
 *
 * @param gradient - The gradient data with colors and optional direction.
 * @returns Array of `[offset, colorString]` tuples.
 *
 * @example
 * ```typescript
 * const stops = createGradientStops({
 *   colors: ['#e94560', '#0f3460'],
 *   direction: 'horizontal',
 * });
 * // [[0, '#e94560'], [1, '#0f3460']]
 * ```
 */
export function createGradientStops(
  gradient: GradientData,
): Array<[number, string]> {
  const { colors } = gradient;

  if (colors.length < 2) {
    throw new Error('[canvas-forge] Gradient requires at least 2 colors.');
  }

  return colors.map((color, index) => {
    const offset = index / (colors.length - 1);
    return [offset, resolveColor(color)];
  });
}

/**
 * Computes the gradient start and end coordinates for a given canvas size and direction.
 *
 * @param width - Canvas width in pixels.
 * @param height - Canvas height in pixels.
 * @param direction - The gradient direction.
 * @returns An object with `x0, y0, x1, y1` coordinates for a linear gradient.
 */
export function getGradientCoords(
  width: number,
  height: number,
  direction: GradientDirection = 'horizontal',
): { x0: number; y0: number; x1: number; y1: number } {
  switch (direction) {
    case 'horizontal':
      return { x0: 0, y0: 0, x1: width, y1: 0 };
    case 'vertical':
      return { x0: 0, y0: 0, x1: 0, y1: height };
    case 'diagonal':
      return { x0: 0, y0: 0, x1: width, y1: height };
    case 'radial':
      // For radial gradients, these coords represent the center
      return { x0: width / 2, y0: height / 2, x1: width / 2, y1: height / 2 };
    default:
      return { x0: 0, y0: 0, x1: width, y1: 0 };
  }
}
