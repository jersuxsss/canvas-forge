/**
 * Leave Card Builder for canvas-forge.
 * Creates goodbye/leave cards for Discord servers.
 * @module cards/LeaveCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { LeaveCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';

const DEFAULT_CONFIG: LeaveCardConfig = {
  width: DefaultDimensions.LEAVE.width,
  height: DefaultDimensions.LEAVE.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 150,
  avatarBorderColor: '#747f8d',
  avatarBorderWidth: 5,
  username: 'User',
  discriminator: '',
  guildName: 'Server',
  titleText: 'Goodbye!',
  subtitleText: 'We will miss you...',
  titleColor: '#747f8d',
  subtitleColor: '#a0a0b0',
  usernameColor: '#ffffff',
  theme: 'dark',
};

/**
 * Builder for creating Discord leave/goodbye cards.
 *
 * @example
 * ```typescript
 * const card = await new LeaveCardBuilder()
 *   .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
 *   .setUsername(member.user.username)
 *   .setGuildName(member.guild.name)
 *   .build();
 * ```
 */
export class LeaveCardBuilder extends BaseCanvas<LeaveCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  public setAvatarSize(size: number): this { this.config.avatarSize = size; return this; }
  public setAvatarBorder(color: ColorResolvable): this { this.config.avatarBorderColor = color; return this; }
  public setAvatarBorderWidth(width: number): this { this.config.avatarBorderWidth = width; return this; }
  public setUsername(username: string): this { this.config.username = username; return this; }
  public setDiscriminator(discriminator: string): this { this.config.discriminator = discriminator; return this; }
  public setGuildName(name: string): this { this.config.guildName = name; return this; }
  public setTitleText(text: string): this { this.config.titleText = text; return this; }
  public setSubtitleText(text: string): this { this.config.subtitleText = text; return this; }
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  public setSubtitleColor(color: ColorResolvable): this { this.config.subtitleColor = color; return this; }
  public setUsernameColor(color: ColorResolvable): this { this.config.usernameColor = color; return this; }

  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#747f8d';
      this.config.subtitleColor = '#a0a0b0';
      this.config.usernameColor = '#ffffff';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#747f8d';
      this.config.subtitleColor = '#555555';
      this.config.usernameColor = '#1a1a2e';
    }
    return this;
  }

  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const centerX = width / 2;

    // Decorative border
    this.ctx.strokeStyle = resolveColor(this.config.avatarBorderColor);
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeRect(20, 20, width - 40, height - 40);
    this.ctx.globalAlpha = 1;

    // Avatar
    const avatarY = height * 0.35;
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, centerX, avatarY,
        this.config.avatarSize, this.config.avatarBorderColor, this.config.avatarBorderWidth,
      );
    }

    // Title
    this.ctx.font = buildFontString(36, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.config.titleText, centerX, avatarY + this.config.avatarSize / 2 + 50);

    // Username
    this.ctx.font = buildFontString(28, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    const displayName = this.config.discriminator
      ? `${this.config.username}#${this.config.discriminator}`
      : this.config.username;
    const truncated = truncateText(this.ctx, displayName, width * 0.8);
    this.ctx.fillText(truncated, centerX, avatarY + this.config.avatarSize / 2 + 90);

    // Subtitle
    this.ctx.font = buildFontString(20, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.subtitleColor);
    this.ctx.fillText(this.config.subtitleText, centerX, avatarY + this.config.avatarSize / 2 + 120);
  }
}
