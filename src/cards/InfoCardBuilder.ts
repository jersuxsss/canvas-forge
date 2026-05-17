/**
 * Info Card Builder for canvas-forge.
 * Creates general-purpose information cards (like Discord embeds).
 * @module cards/InfoCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { InfoCardConfig, InfoFieldData } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText, wrapText } from '../utils/text';
import { drawRoundedRect } from '../utils/shapes';
import { loadImage } from '../core/ImageLoader';

const DEFAULT_CONFIG: InfoCardConfig = {
  width: DefaultDimensions.INFO.width,
  height: DefaultDimensions.INFO.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  title: 'Information',
  description: '',
  fields: [],
  footer: '',
  icon: null,
  iconSize: 48,
  titleColor: '#ffffff',
  descriptionColor: '#a0a0b0',
  fieldNameColor: '#e94560',
  fieldValueColor: '#d0d0e0',
  footerColor: '#666680',
  accentColor: '#e94560',
  theme: 'dark',
};

/**
 * Builder for creating general-purpose information cards.
 *
 * Similar to Discord embeds, supports title, description, structured fields,
 * footer, icon, and a left accent stripe.
 *
 * @example
 * ```typescript
 * import { InfoCardBuilder } from 'canvas-forge';
 *
 * const card = await new InfoCardBuilder()
 *   .setTitle('Server Rules')
 *   .setDescription('Please follow these rules to keep the server friendly.')
 *   .addField({ name: 'Rule 1', value: 'Be respectful' })
 *   .addField({ name: 'Rule 2', value: 'No spam' })
 *   .setFooter('Last updated: May 2026')
 *   .setAccentColor('#5865F2')
 *   .build();
 * ```
 */
export class InfoCardBuilder extends BaseCanvas<InfoCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the title text. */
  public setTitle(title: string): this { this.config.title = title; return this; }
  /** Sets the description/body text. */
  public setDescription(description: string): this { this.config.description = description; return this; }
  /** Sets the fields array (replaces existing fields). */
  public setFields(fields: InfoFieldData[]): this { this.config.fields = fields; return this; }
  /** Adds a single field. */
  public addField(field: InfoFieldData): this { this.config.fields.push(field); return this; }
  /** Sets the footer text. */
  public setFooter(footer: string): this { this.config.footer = footer; return this; }
  /** Sets the icon image. */
  public setIcon(source: ImageResolvable): this { this.config.icon = source; return this; }
  /** Sets the icon size in pixels. */
  public setIconSize(size: number): this { this.config.iconSize = size; return this; }
  /** Sets the title text color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the description text color. */
  public setDescriptionColor(color: ColorResolvable): this { this.config.descriptionColor = color; return this; }
  /** Sets the field name color. */
  public setFieldNameColor(color: ColorResolvable): this { this.config.fieldNameColor = color; return this; }
  /** Sets the field value color. */
  public setFieldValueColor(color: ColorResolvable): this { this.config.fieldValueColor = color; return this; }
  /** Sets the footer text color. */
  public setFooterColor(color: ColorResolvable): this { this.config.footerColor = color; return this; }
  /** Sets the left accent stripe color. */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#ffffff';
      this.config.descriptionColor = '#a0a0b0';
      this.config.fieldValueColor = '#d0d0e0';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#1a1a2e';
      this.config.descriptionColor = '#555555';
      this.config.fieldValueColor = '#333333';
    }
    return this;
  }

  /** Renders the info card content. */
  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 30;

    // Inner card panel
    drawRoundedRect(
      this.ctx, padding, padding, width - padding * 2, height - padding * 2,
      12, 'rgba(0, 0, 0, 0.2)',
    );

    // Left accent stripe
    drawRoundedRect(
      this.ctx, padding, padding, 5, height - padding * 2,
      2, this.config.accentColor,
    );

    const contentX = padding + 25;
    let currentY = padding + 30;

    // Icon + Title row
    if (this.config.icon) {
      try {
        const iconImg = await loadImage(this.config.icon);
        this.ctx.drawImage(iconImg, contentX, currentY - 5, this.config.iconSize, this.config.iconSize);
      } catch {
        // Skip broken icon
      }
    }
    const titleX = this.config.icon ? contentX + this.config.iconSize + 12 : contentX;
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    const maxTitleWidth = width - titleX - padding - 20;
    this.ctx.fillText(truncateText(this.ctx, this.config.title, maxTitleWidth), titleX, currentY + 20);
    currentY += this.config.icon ? Math.max(this.config.iconSize, 35) + 15 : 40;

    // Description
    if (this.config.description) {
      this.ctx.font = buildFontString(15, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.descriptionColor);
      const descMaxWidth = width - contentX - padding - 20;
      const lines = wrapText(this.ctx, this.config.description, descMaxWidth);
      for (let i = 0; i < Math.min(lines.length, 4); i++) {
        const line = lines[i];
        if (line) {
          this.ctx.fillText(line, contentX, currentY);
          currentY += 20;
        }
      }
      currentY += 10;
    }

    // Fields
    if (this.config.fields.length > 0) {
      const fieldMaxWidth = width - contentX - padding - 20;
      const inlineWidth = (fieldMaxWidth - 20) / 3;
      let inlineX = contentX;
      let rowStartY = currentY;

      for (const field of this.config.fields) {
        const isInline = field.inline ?? false;

        if (!isInline) {
          // Full-width field
          if (inlineX !== contentX) {
            // Reset to next line after inline fields
            currentY = rowStartY + 50;
            inlineX = contentX;
          }
          this.ctx.font = buildFontString(13, 'sans-serif', 'bold');
          this.ctx.fillStyle = resolveColor(this.config.fieldNameColor);
          this.ctx.fillText(truncateText(this.ctx, field.name, fieldMaxWidth), contentX, currentY);
          this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
          this.ctx.fillStyle = resolveColor(this.config.fieldValueColor);
          this.ctx.fillText(truncateText(this.ctx, field.value, fieldMaxWidth), contentX, currentY + 18);
          currentY += 45;
        } else {
          // Inline field
          if (inlineX === contentX) { rowStartY = currentY; }
          this.ctx.font = buildFontString(13, 'sans-serif', 'bold');
          this.ctx.fillStyle = resolveColor(this.config.fieldNameColor);
          this.ctx.fillText(truncateText(this.ctx, field.name, inlineWidth), inlineX, currentY);
          this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
          this.ctx.fillStyle = resolveColor(this.config.fieldValueColor);
          this.ctx.fillText(truncateText(this.ctx, field.value, inlineWidth), inlineX, currentY + 18);
          inlineX += inlineWidth + 10;
          if (inlineX > contentX + fieldMaxWidth - inlineWidth) {
            currentY += 50;
            inlineX = contentX;
          }
        }
      }
    }

    // Footer
    if (this.config.footer) {
      this.ctx.font = buildFontString(12, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.footerColor);
      this.ctx.fillText(
        truncateText(this.ctx, this.config.footer, width - contentX - padding - 20),
        contentX, height - padding - 15,
      );
    }
  }
}
