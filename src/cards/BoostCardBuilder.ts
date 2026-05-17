/**
 * Boost Card Builder for canvas-forge.
 * Creates server boost notification cards for Discord.
 * @module cards/BoostCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { BoostCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';
import { drawRoundedRect } from '../utils/shapes';

const DEFAULT_CONFIG: BoostCardConfig = {
  width: DefaultDimensions.BOOST.width,
  height: DefaultDimensions.BOOST.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 120,
  avatarBorderColor: '#f47fff',
  avatarBorderWidth: 4,
  username: 'User',
  guildName: 'Server',
  boostCount: 1,
  titleText: 'Server Boosted!',
  subtitleText: 'This server now has {boostCount} boosts!',
  titleColor: '#f47fff',
  subtitleColor: '#a0a0b0',
  usernameColor: '#ffffff',
  accentColor: '#f47fff',
  theme: 'dark',
};

/**
 * Builder for creating Discord server boost notification cards.
 *
 * Features a Nitro-themed gradient accent and boost glow effect.
 *
 * @example
 * ```typescript
 * import { BoostCardBuilder } from 'canvas-forge';
 *
 * const card = await new BoostCardBuilder()
 *   .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
 *   .setUsername(member.user.username)
 *   .setGuildName(member.guild.name)
 *   .setBoostCount(15)
 *   .build();
 * ```
 */
export class BoostCardBuilder extends BaseCanvas<BoostCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the user's avatar image. */
  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  /** Sets the avatar display size (diameter in pixels). */
  public setAvatarSize(size: number): this { this.config.avatarSize = size; return this; }
  /** Sets the avatar border color. */
  public setAvatarBorder(color: ColorResolvable): this { this.config.avatarBorderColor = color; return this; }
  /** Sets the avatar border width in pixels. */
  public setAvatarBorderWidth(width: number): this { this.config.avatarBorderWidth = width; return this; }
  /** Sets the username text. */
  public setUsername(username: string): this { this.config.username = username; return this; }
  /** Sets the guild (server) name. */
  public setGuildName(name: string): this { this.config.guildName = name; return this; }
  /** Sets the current boost count. */
  public setBoostCount(count: number): this { this.config.boostCount = count; return this; }
  /** Sets the title text. */
  public setTitleText(text: string): this { this.config.titleText = text; return this; }
  /** Sets the subtitle text. Use {boostCount} as a placeholder. */
  public setSubtitleText(text: string): this { this.config.subtitleText = text; return this; }
  /** Sets the title text color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the subtitle text color. */
  public setSubtitleColor(color: ColorResolvable): this { this.config.subtitleColor = color; return this; }
  /** Sets the username text color. */
  public setUsernameColor(color: ColorResolvable): this { this.config.usernameColor = color; return this; }
  /** Sets the accent/highlight color. */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.usernameColor = '#ffffff';
      this.config.subtitleColor = '#a0a0b0';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.usernameColor = '#1a1a2e';
      this.config.subtitleColor = '#555555';
    }
    return this;
  }

  /** Renders the boost card content. */
  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 30;

    // Top gradient accent bar (Nitro-like)
    const gradientBar = this.ctx.createLinearGradient(0, 0, width, 0);
    gradientBar.addColorStop(0, '#f47fff');
    gradientBar.addColorStop(0.5, '#7289da');
    gradientBar.addColorStop(1, '#f47fff');
    this.ctx.fillStyle = gradientBar;
    this.ctx.fillRect(0, 0, width, 6);

    // Inner card panel
    drawRoundedRect(
      this.ctx, padding, padding + 6, width - padding * 2, height - padding * 2 - 6,
      15, 'rgba(0, 0, 0, 0.25)',
    );

    // Avatar
    const avatarX = padding + 40 + this.config.avatarSize / 2;
    const avatarY = height / 2;
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, avatarX, avatarY,
        this.config.avatarSize, this.config.avatarBorderColor, this.config.avatarBorderWidth,
      );
    }

    // Text area
    const textX = avatarX + this.config.avatarSize / 2 + 30;
    const maxTextWidth = width - textX - padding - 20;

    // Title
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(28, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.fillText(this.config.titleText, textX, height / 2 - 30);

    // Username
    this.ctx.font = buildFontString(22, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    const truncated = truncateText(this.ctx, this.config.username, maxTextWidth);
    this.ctx.fillText(truncated, textX, height / 2 + 5);

    // Subtitle
    const subtitle = this.config.subtitleText.replace(
      '{boostCount}',
      this.config.boostCount.toString(),
    );
    this.ctx.font = buildFontString(16, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.subtitleColor);
    this.ctx.fillText(subtitle, textX, height / 2 + 35);

    // Boost icon (decorative diamond)
    const iconX = width - padding - 60;
    const iconY = height / 2;
    this.ctx.fillStyle = resolveColor(this.config.accentColor);
    this.ctx.globalAlpha = 0.15;
    this.ctx.beginPath();
    this.ctx.moveTo(iconX, iconY - 40);
    this.ctx.lineTo(iconX + 30, iconY);
    this.ctx.lineTo(iconX, iconY + 40);
    this.ctx.lineTo(iconX - 30, iconY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}
