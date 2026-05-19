/**
 * Freeform canvas builder for custom designs.
 * Wraps @napi-rs/canvas with a friendlier, chainable API.
 * @module core/CanvasBuilder
 */

import {
  createCanvas,
  type Canvas,
  type SKRSContext2D,
  GlobalFonts,
  type Image,
} from '@napi-rs/canvas';
import type { ColorResolvable, GradientData, ImageResolvable, OutputFormat } from '../types/common';
import { resolveColor, createGradientStops, getGradientCoords } from '../utils/colors';
import { drawRoundedRect, drawCircle, drawProgressBar, clipCircle } from '../utils/shapes';
import { wrapText, buildFontString, tokenizeEmojiText } from '../utils/text';
import { loadImage, tryLoadImage } from './ImageLoader';
import { validateDimensions } from '../utils/validators';

/**
 * A freeform canvas builder for creating completely custom designs.
 *
 * Unlike the specific card builders (Welcome, Rank, etc.), CanvasBuilder
 * gives you full control over what is drawn and where. It wraps the
 * @napi-rs/canvas API with friendlier method chaining.
 *
 * @example
 * ```typescript
 * const buffer = await new CanvasBuilder(800, 400)
 *   .setBackground('#1a1a2e')
 *   .drawRect(20, 20, 760, 360, '#16213e', 15)
 *   .setFont(32, 'sans-serif', 'bold')
 *   .drawText('Custom Card', 400, 60, '#e94560', 'center')
 *   .drawCircleShape(400, 200, 50, '#0f3460')
 *   .toBuffer();
 * ```
 */
export class CanvasBuilder {
  private readonly canvas: Canvas;
  private readonly ctx: SKRSContext2D;
  private outputFormat: OutputFormat = 'png';
  private quality: number = 90;

  /**
   * Creates a new CanvasBuilder with the specified dimensions.
   * @param width - Canvas width in pixels.
   * @param height - Canvas height in pixels.
   */
  constructor(width: number, height: number) {
    validateDimensions(width, height);
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  /** Returns the canvas width. */
  public get width(): number { return this.canvas.width; }

  /** Returns the canvas height. */
  public get height(): number { return this.canvas.height; }

  /**
   * Returns the raw 2D context for advanced operations.
   * Use this when you need direct access to the canvas API.
   */
  public getContext(): SKRSContext2D { return this.ctx; }

  /**
   * Registers a custom font file.
   * @param path - Path to the font file.
   * @param nameAlias - Name to reference the font.
   */
  public registerFont(path: string, nameAlias: string): this {
    GlobalFonts.registerFromPath(path, nameAlias);
    return this;
  }

  // ---- Background methods ----

  /**
   * Fills the entire canvas with a solid color.
   * @param color - The fill color.
   */
  public setBackground(color: ColorResolvable): this {
    this.ctx.fillStyle = resolveColor(color);
    this.ctx.fillRect(0, 0, this.width, this.height);
    return this;
  }

  /**
   * Fills the canvas with a gradient.
   * @param gradient - Gradient data with colors and direction.
   */
  public setBackgroundGradient(gradient: GradientData): this {
    let grad;
    if (gradient.direction === 'radial') {
      const cx = this.width / 2;
      const cy = this.height / 2;
      const r = Math.max(this.width, this.height) / 2;
      grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    } else {
      const coords = getGradientCoords(this.width, this.height, gradient.direction);
      grad = this.ctx.createLinearGradient(coords.x0, coords.y0, coords.x1, coords.y1);
    }
    const stops = createGradientStops(gradient);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    return this;
  }

  /**
   * Draws a background image, scaled to cover the entire canvas.
   * @param source - Image source (URL, path, or Buffer).
   */
  public async setBackgroundImage(source: ImageResolvable): Promise<this> {
    const img = await loadImage(source);
    this.ctx.drawImage(img, 0, 0, this.width, this.height);
    return this;
  }

  // ---- Drawing methods ----

  /**
   * Draws a filled rectangle (optionally rounded).
   * @param x - X position.
   * @param y - Y position.
   * @param width - Width in pixels.
   * @param height - Height in pixels.
   * @param color - Fill color.
   * @param radius - Corner radius. Defaults to 0 (sharp corners).
   */
  public drawRect(
    x: number, y: number, width: number, height: number,
    color: ColorResolvable, radius: number = 0,
  ): this {
    if (radius > 0) {
      drawRoundedRect(this.ctx, x, y, width, height, radius, color);
    } else {
      this.ctx.fillStyle = resolveColor(color);
      this.ctx.fillRect(x, y, width, height);
    }
    return this;
  }

  /**
   * Draws a filled circle.
   * @param x - Center X position.
   * @param y - Center Y position.
   * @param radius - Circle radius.
   * @param color - Fill color.
   */
  public drawCircleShape(x: number, y: number, radius: number, color: ColorResolvable): this {
    drawCircle(this.ctx, x, y, radius, color);
    return this;
  }

  /**
   * Draws an image on the canvas.
   * @param source - Image source (URL, path, or Buffer).
   * @param x - X position.
   * @param y - Y position.
   * @param width - Width. If omitted, uses the image's natural width.
   * @param height - Height. If omitted, uses the image's natural height.
   */
  public async drawImage(
    source: ImageResolvable, x: number, y: number,
    width?: number, height?: number,
  ): Promise<this> {
    const img = await loadImage(source);
    const w = width ?? img.width;
    const h = height ?? img.height;
    this.ctx.drawImage(img, x, y, w, h);
    return this;
  }

  /**
   * Draws a circular (clipped) image — perfect for avatars.
   * @param source - Image source.
   * @param x - Center X position.
   * @param y - Center Y position.
   * @param size - Diameter in pixels.
   */
  public async drawCircularImage(
    source: ImageResolvable, x: number, y: number, size: number,
  ): Promise<this> {
    const radius = size / 2;
    const img = await loadImage(source);
    this.ctx.save();
    clipCircle(this.ctx, x, y, radius);
    this.ctx.drawImage(img, x - radius, y - radius, size, size);
    this.ctx.restore();
    return this;
  }

  // ---- Text methods ----

  /**
   * Sets the current font for subsequent text operations.
   * @param size - Font size in pixels.
   * @param family - Font family. Defaults to 'sans-serif'.
   * @param weight - Font weight. Defaults to 'normal'.
   */
  public setFont(size: number, family: string = 'sans-serif', weight: string = 'normal'): this {
    this.ctx.font = buildFontString(size, family, weight);
    return this;
  }

  /**
   * Draws text on the canvas.
   * @param text - The text to draw.
   * @param x - X position.
   * @param y - Y position.
   * @param color - Text color.
   * @param align - Text alignment. Defaults to 'left'.
   */
  public drawText(
    text: string, x: number, y: number,
    color: ColorResolvable, align: 'left' | 'center' | 'right' | 'start' | 'end' = 'left',
  ): this {
    this.ctx.fillStyle = resolveColor(color);
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
    return this;
  }

  /**
   * Draws wrapped text that automatically breaks at the specified width.
   * @param text - The text to draw.
   * @param x - X position.
   * @param y - Y position of the first line.
   * @param color - Text color.
   * @param maxWidth - Maximum width per line in pixels.
   * @param lineHeight - Line height in pixels. Defaults to font size * 1.2.
   */
  public drawWrappedText(
    text: string, x: number, y: number,
    color: ColorResolvable, maxWidth: number, lineHeight?: number,
  ): this {
    const lines = wrapText(this.ctx, text, maxWidth);
    const lh = lineHeight ?? parseInt(this.ctx.font, 10) * 1.2;
    this.ctx.fillStyle = resolveColor(color);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line) {
        this.ctx.fillText(line, x, y + i * lh);
      }
    }
    return this;
  }

  // ---- Progress bar ----

  /**
   * Draws a progress bar.
   * @param x - X position.
   * @param y - Y position.
   * @param width - Total width.
   * @param height - Height.
   * @param progress - Progress value (0.0 to 1.0).
   * @param fillColor - Fill color.
   * @param trackColor - Track color.
   * @param radius - Corner radius.
   */
  public drawProgressBar(
    x: number, y: number, width: number, height: number,
    progress: number, fillColor: ColorResolvable, trackColor: ColorResolvable,
    radius?: number,
  ): this {
    drawProgressBar(this.ctx, x, y, width, height, progress, fillColor, trackColor, radius);
    return this;
  }

  // ---- Line & shape methods ----

  /**
   * Draws a straight line between two points.
   * @param x1 - Start X position.
   * @param y1 - Start Y position.
   * @param x2 - End X position.
   * @param y2 - End Y position.
   * @param color - Line color.
   * @param lineWidth - Line width in pixels. Defaults to 2.
   */
  public drawLine(
    x1: number, y1: number, x2: number, y2: number,
    color: ColorResolvable, lineWidth: number = 2,
  ): this {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = resolveColor(color);
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    return this;
  }

  /**
   * Draws a filled polygon from an array of [x, y] points.
   * @param points - Array of [x, y] coordinate pairs.
   * @param color - Fill color.
   * @param strokeColor - Optional stroke color.
   * @param strokeWidth - Stroke width. Defaults to 0 (no stroke).
   */
  public drawPolygon(
    points: [number, number][],
    color: ColorResolvable,
    strokeColor?: ColorResolvable,
    strokeWidth: number = 0,
  ): this {
    if (points.length < 3) { return this; }
    this.ctx.beginPath();
    const first = points[0];
    if (first) { this.ctx.moveTo(first[0], first[1]); }
    for (let i = 1; i < points.length; i++) {
      const pt = points[i];
      if (pt) { this.ctx.lineTo(pt[0], pt[1]); }
    }
    this.ctx.closePath();
    this.ctx.fillStyle = resolveColor(color);
    this.ctx.fill();
    if (strokeColor && strokeWidth > 0) {
      this.ctx.strokeStyle = resolveColor(strokeColor);
      this.ctx.lineWidth = strokeWidth;
      this.ctx.stroke();
    }
    return this;
  }

  /**
   * Draws a rectangle filled with a gradient.
   * @param x - X position.
   * @param y - Y position.
   * @param width - Width in pixels.
   * @param height - Height in pixels.
   * @param gradient - Gradient data with colors and direction.
   * @param radius - Corner radius. Defaults to 0.
   */
  public drawGradientRect(
    x: number, y: number, width: number, height: number,
    gradient: GradientData, radius: number = 0,
  ): this {
    let grad;
    if (gradient.direction === 'radial') {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const r = Math.max(width, height) / 2;
      grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    } else {
      const coords = getGradientCoords(width, height, gradient.direction);
      grad = this.ctx.createLinearGradient(
        x + coords.x0, y + coords.y0,
        x + coords.x1, y + coords.y1,
      );
    }
    const stops = createGradientStops(gradient);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    if (radius > 0) {
      this.ctx.save();
      const r = Math.min(radius, width / 2, height / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(x + r, y);
      this.ctx.lineTo(x + width - r, y);
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      this.ctx.lineTo(x + width, y + height - r);
      this.ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      this.ctx.lineTo(x + r, y + height);
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      this.ctx.lineTo(x, y + r);
      this.ctx.quadraticCurveTo(x, y, x + r, y);
      this.ctx.closePath();
      this.ctx.fillStyle = grad;
      this.ctx.fill();
      this.ctx.restore();
    } else {
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x, y, width, height);
    }
    return this;
  }

  /**
   * Draws a rectangle with a colored border (stroke only, no fill).
   * @param x - X position.
   * @param y - Y position.
   * @param width - Width in pixels.
   * @param height - Height in pixels.
   * @param color - Border color.
   * @param lineWidth - Border width in pixels. Defaults to 2.
   * @param radius - Corner radius. Defaults to 0.
   */
  public drawBorderedRect(
    x: number, y: number, width: number, height: number,
    color: ColorResolvable, lineWidth: number = 2, radius: number = 0,
  ): this {
    if (radius > 0) {
      drawRoundedRect(this.ctx, x, y, width, height, radius, undefined, color);
      this.ctx.lineWidth = lineWidth;
    } else {
      this.ctx.strokeStyle = resolveColor(color);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeRect(x, y, width, height);
    }
    return this;
  }

  /**
   * Draws an arc (partial circle / curve).
   * @param x - Center X position.
   * @param y - Center Y position.
   * @param radius - Arc radius.
   * @param startAngle - Start angle in radians.
   * @param endAngle - End angle in radians.
   * @param color - Stroke color.
   * @param lineWidth - Line width. Defaults to 2.
   */
  public drawArc(
    x: number, y: number, radius: number,
    startAngle: number, endAngle: number,
    color: ColorResolvable, lineWidth: number = 2,
  ): this {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle, endAngle);
    this.ctx.strokeStyle = resolveColor(color);
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    return this;
  }

  // ---- State management methods ----

  /**
   * Enables shadow for all subsequent drawing operations.
   * @param color - Shadow color. Defaults to 'rgba(0,0,0,0.5)'.
   * @param blur - Shadow blur radius. Defaults to 10.
   * @param offsetX - Horizontal shadow offset. Defaults to 4.
   * @param offsetY - Vertical shadow offset. Defaults to 4.
   */
  public drawShadow(
    color: ColorResolvable = 'rgba(0,0,0,0.5)',
    blur: number = 10, offsetX: number = 4, offsetY: number = 4,
  ): this {
    this.ctx.shadowColor = resolveColor(color);
    this.ctx.shadowBlur = blur;
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
    return this;
  }

  /** Clears shadow from subsequent drawing operations. */
  public clearShadow(): this {
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    return this;
  }

  /**
   * Sets global transparency for all subsequent drawing operations.
   * @param alpha - Opacity value (0.0 fully transparent to 1.0 fully opaque).
   */
  public setGlobalAlpha(alpha: number): this {
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    return this;
  }

  /** Resets global transparency back to fully opaque (1.0). */
  public resetGlobalAlpha(): this {
    this.ctx.globalAlpha = 1;
    return this;
  }

  /** Saves the current canvas state (transforms, styles, clip regions). */
  public save(): this {
    this.ctx.save();
    return this;
  }

  /** Restores the most recently saved canvas state. */
  public restore(): this {
    this.ctx.restore();
    return this;
  }

  // ---- Filter and Manipulation methods ----

  /**
   * Sets a native canvas filter string (e.g. "blur(5px) grayscale(100%)").
   * @param filterString - The CSS filter string.
   */
  public setFilter(filterString: string): this {
    this.ctx.filter = filterString;
    return this;
  }

  /** Clears any active canvas filters. */
  public clearFilter(): this {
    this.ctx.filter = 'none';
    return this;
  }

  /** Applies a quick blur filter. */
  public applyBlur(pixels: number = 5): this {
    return this.setFilter(`blur(${pixels}px)`);
  }

  /** Applies a quick grayscale filter. */
  public applyGrayscale(percent: number = 100): this {
    return this.setFilter(`grayscale(${percent}%)`);
  }

  /** Applies a quick sepia filter. */
  public applySepia(percent: number = 100): this {
    return this.setFilter(`sepia(${percent}%)`);
  }

  /** Applies a quick invert filter. */
  public applyInvert(percent: number = 100): this {
    return this.setFilter(`invert(${percent}%)`);
  }

  /**
   * Applies a pixelation effect to a rectangular region.
   * @param x - X position of the region.
   * @param y - Y position of the region.
   * @param width - Width of the region.
   * @param height - Height of the region.
   * @param pixelSize - Size of each pixel block. Defaults to 8.
   */
  public pixelate(x: number, y: number, width: number, height: number, pixelSize: number = 8): this {
    if (pixelSize <= 1) {
      return this;
    }
    const imgData = this.ctx.getImageData(x, y, width, height);
    const data = imgData.data;
    const w = imgData.width;
    const h = imgData.height;

    for (let r = 0; r < h; r += pixelSize) {
      for (let c = 0; c < w; c += pixelSize) {
        const pixelIdx = (r * w + c) * 4;
        const red = data[pixelIdx] ?? 0;
        const green = data[pixelIdx + 1] ?? 0;
        const blue = data[pixelIdx + 2] ?? 0;
        const alpha = data[pixelIdx + 3] ?? 255;

        for (let dy = 0; dy < pixelSize && r + dy < h; dy++) {
          for (let dx = 0; dx < pixelSize && c + dx < w; dx++) {
            const idx = ((r + dy) * w + (c + dx)) * 4;
            data[idx] = red;
            data[idx + 1] = green;
            data[idx + 2] = blue;
            data[idx + 3] = alpha;
          }
        }
      }
    }
    this.ctx.putImageData(imgData, x, y);
    return this;
  }

  // ---- Advanced Text methods ----

  /**
   * Draws text inline with Discord custom emojis (<:name:id> / <a:name:id>).
   * Automatically fetches custom emojis and aligns them with the text.
   * @param text - The text string containing custom emojis.
   * @param x - Horizontal position.
   * @param y - Vertical position (baseline).
   * @param color - Text color.
   * @param align - Text alignment ('left', 'center', 'right'). Defaults to 'left'.
   * @param emojiSize - Dimension size of the emojis. Defaults to font size.
   */
  public async drawTextWithEmojis(
    text: string, x: number, y: number,
    color: ColorResolvable, align: 'left' | 'center' | 'right' = 'left',
    emojiSize?: number
  ): Promise<this> {
    const tokens = tokenizeEmojiText(text);
    const fontSize = parseInt(this.ctx.font, 10) || 16;
    const eSize = emojiSize ?? fontSize;
    const spacing = 4;

    const segments: Array<{
       type: 'text' | 'emoji';
       content: string;
       width: number;
       image?: Image;
     }> = [];

    let totalWidth = 0;

    for (const token of tokens) {
      if (token.type === 'text') {
        const w = this.ctx.measureText(token.content).width;
        segments.push({ type: 'text', content: token.content, width: w });
        totalWidth += w;
      } else {
        const emojiUrl = `https://cdn.discordapp.com/emojis/${token.content}.png`;
        const img = await tryLoadImage(emojiUrl);
        if (img) {
          segments.push({ type: 'emoji', content: token.content, width: eSize, image: img });
          totalWidth += eSize + spacing;
        } else {
          const fallback = '';
          const w = this.ctx.measureText(fallback).width;
          segments.push({ type: 'text', content: fallback, width: w });
          totalWidth += w;
        }
      }
    }

    let currentX = x;
    if (align === 'center') {
      currentX = x - totalWidth / 2;
    } else if (align === 'right') {
      currentX = x - totalWidth;
    }

    this.ctx.save();
    this.ctx.fillStyle = resolveColor(color);
    this.ctx.textAlign = 'left';

    for (const segment of segments) {
      if (segment.type === 'text') {
        this.ctx.fillText(segment.content, currentX, y);
        currentX += segment.width;
      } else if (segment.type === 'emoji' && segment.image) {
        const emojiY = y - 0.85 * fontSize + (fontSize - eSize) / 2;
        this.ctx.drawImage(segment.image, currentX, emojiY, eSize, eSize);
        currentX += segment.width;
      }
    }

    this.ctx.restore();
    return this;
  }

  // ---- Output methods ----

  /** Sets the output format. */
  public setOutputFormat(format: OutputFormat): this {
    this.outputFormat = format;
    return this;
  }

  /** Sets the output quality (for JPEG/WebP). */
  public setOutputQuality(quality: number): this {
    this.quality = quality;
    return this;
  }

  /**
   * Encodes the canvas and returns a Buffer.
   * @returns Buffer containing the encoded image.
   */
  public toBuffer(): Buffer {
    switch (this.outputFormat) {
      case 'jpeg':
        return this.canvas.toBuffer('image/jpeg', this.quality);
      case 'webp':
        return this.canvas.toBuffer('image/webp', this.quality);
      case 'png':
      default:
        return this.canvas.toBuffer('image/png');
    }
  }
}
