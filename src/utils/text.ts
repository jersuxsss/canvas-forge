/**
 * Text manipulation and rendering utilities for canvas-forge.
 * @module utils/text
 */

import type { SKRSContext2D } from '@napi-rs/canvas';

/** Result of a text measurement operation. */
export interface TextMeasurement {
  width: number;
  height: number;
}

/**
 * Wraps text into multiple lines based on a maximum width.
 * @param ctx - The canvas 2D rendering context.
 * @param text - The text to wrap.
 * @param maxWidth - Maximum width in pixels for each line.
 * @returns Array of text lines.
 */
export function wrapText(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  if (!text || maxWidth <= 0) { return []; }
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) { lines.push(currentLine); }
  return lines;
}

/**
 * Truncates text to fit within a maximum width, adding an ellipsis if needed.
 * @param ctx - The canvas 2D rendering context.
 * @param text - The text to truncate.
 * @param maxWidth - Maximum width in pixels.
 * @param suffix - The suffix to append when truncating. Defaults to '...'.
 * @returns The truncated text.
 */
export function truncateText(
  ctx: SKRSContext2D, text: string, maxWidth: number, suffix: string = '...',
): string {
  if (!text) { return ''; }
  const metrics = ctx.measureText(text);
  if (metrics.width <= maxWidth) { return text; }
  let truncated = text;
  while (truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    const testMetrics = ctx.measureText(truncated + suffix);
    if (testMetrics.width <= maxWidth) { return truncated + suffix; }
  }
  return suffix;
}

/**
 * Measures text dimensions using the canvas context's current font.
 * @param ctx - The canvas 2D rendering context.
 * @param text - The text to measure.
 * @returns Object with width and height.
 */
export function measureText(ctx: SKRSContext2D, text: string): TextMeasurement {
  const metrics = ctx.measureText(text);
  const height = (metrics.actualBoundingBoxAscent ?? 0) + (metrics.actualBoundingBoxDescent ?? 0);
  return { width: metrics.width, height: height || parseInt(ctx.font, 10) || 16 };
}

/**
 * Formats a number into an abbreviated string (e.g., 1500 → '1.5K').
 * @param num - The number to format.
 * @returns Abbreviated string.
 */
export function formatNumber(num: number): string {
  if (num < 1000) { return num.toString(); }
  if (num < 1_000_000) {
    const f = (num / 1000).toFixed(1);
    return f.endsWith('.0') ? f.slice(0, -2) + 'K' : f + 'K';
  }
  if (num < 1_000_000_000) {
    const f = (num / 1_000_000).toFixed(1);
    return f.endsWith('.0') ? f.slice(0, -2) + 'M' : f + 'M';
  }
  const f = (num / 1_000_000_000).toFixed(1);
  return f.endsWith('.0') ? f.slice(0, -2) + 'B' : f + 'B';
}

/**
 * Formats a rank number with a prefix (e.g., '#3').
 * @param num - The rank number.
 * @param prefix - Prefix string. Defaults to '#'.
 */
export function formatRank(num: number, prefix: string = '#'): string {
  return `${prefix}${num}`;
}

/**
 * Builds a CSS font string for the Canvas API.
 * @param size - Font size in pixels.
 * @param family - Font family. Defaults to 'sans-serif'.
 * @param weight - Font weight. Defaults to 'normal'.
 */
export function buildFontString(
  size: number, family: string = 'sans-serif', weight: string = 'normal',
): string {
  return `${weight} ${size}px ${family}`;
}

/**
 * Calculates the y-coordinate for vertically centered text.
 * @param containerHeight - Container height in pixels.
 * @param fontSize - Font size in pixels.
 */
export function centerTextVertically(containerHeight: number, fontSize: number): number {
  return (containerHeight + fontSize) / 2;
}

/**
 * A tokenized segment of text or a Discord custom emoji.
 */
export interface TextToken {
  type: 'text' | 'emoji';
  content: string;
}

/**
 * Tokenizes text containing Discord custom emojis into segments.
 * @param text - The text to tokenize.
 */
export function tokenizeEmojiText(text: string): TextToken[] {
  const tokens: TextToken[] = [];
  const regex = /<a?:[a-zA-Z0-9_~]+:([0-9]+)>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (match && match[1]) {
      const emojiId = match[1];

      if (matchIndex > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, matchIndex),
        });
      }

      tokens.push({
        type: 'emoji',
        content: emojiId,
      });

      lastIndex = regex.lastIndex;
    }
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return tokens;
}

