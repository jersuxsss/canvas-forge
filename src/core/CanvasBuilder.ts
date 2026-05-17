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
} from '@napi-rs/canvas';
import type { ColorResolvable, GradientData, ImageResolvable, OutputFormat } from '../types/common';
import { resolveColor, createGradientStops, getGradientCoords } from '../utils/colors';
import { drawRoundedRect, drawCircle, drawProgressBar, clipCircle } from '../utils/shapes';
import { wrapText, buildFontString } from '../utils/text';
import { loadImage } from './ImageLoader';
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
    const coords = getGradientCoords(this.width, this.height, gradient.direction);
    const grad = this.ctx.createLinearGradient(coords.x0, coords.y0, coords.x1, coords.y1);
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
