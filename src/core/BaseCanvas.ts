/**
 * Abstract base class for all card builders in canvas-forge.
 * Provides shared canvas management, background rendering, avatar drawing, and output.
 * @module core/BaseCanvas
 */

import {
  createCanvas,
  type Canvas,
  type SKRSContext2D,
  GlobalFonts,
} from '@napi-rs/canvas';
import type {
  ColorResolvable,
  GradientData,
  ImageResolvable,
  OutputFormat,
} from '../types/common';
import type { BaseCardConfig } from '../types/cards';
import { resolveColor, createGradientStops, getGradientCoords } from '../utils/colors';
import { clipCircle, drawAvatarBorder } from '../utils/shapes';
import { loadImage } from './ImageLoader';
import { validateDimensions, validateRange } from '../utils/validators';

/**
 * Abstract base class that all card builders extend.
 *
 * Handles internal canvas creation, background rendering, overlay application,
 * avatar drawing (with circular clipping and borders), and output encoding.
 *
 * Subclasses must implement the `_render()` method to draw their specific content.
 *
 * @typeParam TConfig - The specific card configuration type.
 */
export abstract class BaseCanvas<TConfig extends BaseCardConfig> {
  /** The internal card configuration. Subclasses access this to read settings. */
  protected config: TConfig;

  /** The underlying @napi-rs/canvas Canvas instance. */
  protected canvas!: Canvas;

  /** The 2D rendering context. */
  protected ctx!: SKRSContext2D;

  /**
   * Creates a new BaseCanvas instance with the given default configuration.
   * @param defaultConfig - The default configuration for this card type.
   */
  constructor(defaultConfig: TConfig) {
    this.config = { ...defaultConfig };
  }

  /**
   * Sets the canvas dimensions.
   * @param width - Width in pixels.
   * @param height - Height in pixels.
   * @returns This builder instance for chaining.
   */
  public setSize(width: number, height: number): this {
    validateDimensions(width, height);
    this.config.width = width;
    this.config.height = height;
    return this;
  }

  /**
   * Sets the background to a solid color.
   * @param color - The background color.
   * @returns This builder instance for chaining.
   */
  public setBackground(color: ColorResolvable): this {
    this.config.background = color;
    this.config.backgroundIsImage = false;
    return this;
  }

  /**
   * Sets the background to a gradient.
   * @param gradient - Gradient configuration with colors and direction.
   * @returns This builder instance for chaining.
   */
  public setBackgroundGradient(gradient: GradientData): this {
    this.config.background = gradient;
    this.config.backgroundIsImage = false;
    return this;
  }

  /**
   * Sets the background to an image.
   * @param image - Image URL, path, or Buffer.
   * @returns This builder instance for chaining.
   */
  public setBackgroundImage(image: ImageResolvable): this {
    this.config.background = image;
    this.config.backgroundIsImage = true;
    return this;
  }

  /**
   * Sets the overlay color and opacity (applied on top of background).
   * Useful for darkening/lightening background images.
   * @param color - Overlay color.
   * @param opacity - Overlay opacity (0.0 to 1.0). Defaults to 0.5.
   * @returns This builder instance for chaining.
   */
  public setOverlay(color: ColorResolvable, opacity: number = 0.5): this {
    validateRange(opacity, 0, 1, 'overlay opacity');
    this.config.overlayColor = color;
    this.config.overlayOpacity = opacity;
    return this;
  }

  /**
   * Sets the output image format.
   * @param format - Output format ('png', 'jpeg', or 'webp').
   * @returns This builder instance for chaining.
   */
  public setOutputFormat(format: OutputFormat): this {
    this.config.outputFormat = format;
    return this;
  }

  /**
   * Sets the output quality (for JPEG and WebP formats).
   * @param quality - Quality value (1-100).
   * @returns This builder instance for chaining.
   */
  public setQuality(quality: number): this {
    validateRange(quality, 1, 100, 'quality');
    this.config.quality = quality;
    return this;
  }

  /**
   * Registers a custom font for use in the card.
   * @param path - Absolute file path to the font file (.ttf, .otf, etc.).
   * @param nameAlias - A name alias to reference the font in font strings.
   * @returns This builder instance for chaining.
   *
   * @example
   * ```typescript
   * builder.registerFont('./fonts/Montserrat-Bold.ttf', 'Montserrat');
   * ```
   */
  public registerFont(path: string, nameAlias: string): this {
    GlobalFonts.registerFromPath(path, nameAlias);
    return this;
  }

  /**
   * Builds the card and returns the image as a Buffer.
   * This is the main method that triggers rendering.
   * @returns A Promise resolving to a Buffer containing the encoded image.
   */
  public async build(): Promise<Buffer> {
    // Initialize canvas
    this.canvas = createCanvas(this.config.width, this.config.height);
    this.ctx = this.canvas.getContext('2d');

    // Render background
    await this._renderBackground();

    // Render overlay
    this._renderOverlay();

    // Delegate to subclass for specific content rendering
    await this._render();

    // Encode and return
    return this._encode();
  }

  /**
   * Abstract method that subclasses must implement to draw their content.
   * Called after background and overlay are rendered.
   */
  protected abstract _render(): Promise<void>;

  /**
   * Renders the background (color, gradient, or image).
   */
  protected async _renderBackground(): Promise<void> {
    const { width, height, background, backgroundIsImage } = this.config;

    if (backgroundIsImage) {
      // Background is an image
      const img = await loadImage(background as ImageResolvable);
      this.ctx.drawImage(img, 0, 0, width, height);
    } else if (typeof background === 'object' && !Array.isArray(background) && 'colors' in (background as object)) {
      // Background is a gradient
      const gradientData = background as GradientData;
      const coords = getGradientCoords(width, height, gradientData.direction);
      const gradient = this.ctx.createLinearGradient(coords.x0, coords.y0, coords.x1, coords.y1);
      const stops = createGradientStops(gradientData);
      for (const [offset, color] of stops) {
        gradient.addColorStop(offset, color);
      }
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
    } else {
      // Background is a solid color
      this.ctx.fillStyle = resolveColor(background as ColorResolvable);
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  /**
   * Renders the overlay on top of the background.
   */
  protected _renderOverlay(): void {
    if (this.config.overlayOpacity > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = this.config.overlayOpacity;
      this.ctx.fillStyle = resolveColor(this.config.overlayColor);
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);
      this.ctx.restore();
    }
  }

  /**
   * Draws a circular avatar with optional border.
   * @param avatarSource - Image source for the avatar.
   * @param x - Center X position.
   * @param y - Center Y position.
   * @param size - Diameter of the avatar in pixels.
   * @param borderColor - Border color.
   * @param borderWidth - Border width in pixels.
   */
  protected async _drawAvatar(
    avatarSource: ImageResolvable,
    x: number, y: number, size: number,
    borderColor?: ColorResolvable, borderWidth: number = 4,
  ): Promise<void> {
    const radius = size / 2;
    const img = await loadImage(avatarSource);

    // Draw border if specified
    if (borderColor && borderWidth > 0) {
      drawAvatarBorder(this.ctx, x, y, radius, borderWidth, borderColor);
    }

    // Clip to circle and draw avatar
    this.ctx.save();
    clipCircle(this.ctx, x, y, radius);
    this.ctx.drawImage(img, x - radius, y - radius, size, size);
    this.ctx.restore();
  }

  /**
   * Encodes the canvas to a Buffer in the configured format.
   */
  protected _encode(): Buffer {
    const { outputFormat, quality } = this.config;

    switch (outputFormat) {
      case 'jpeg':
        return this.canvas.toBuffer('image/jpeg', quality);
      case 'webp':
        return this.canvas.toBuffer('image/webp', quality);
      case 'png':
      default:
        return this.canvas.toBuffer('image/png');
    }
  }
}
