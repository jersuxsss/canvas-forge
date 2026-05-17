/**
 * Welcome Card Builder for canvas-forge.
 * Creates beautiful welcome cards for Discord servers.
 * @module cards/WelcomeCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { WelcomeCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';

/** Default configuration for the Welcome Card. */
const DEFAULT_CONFIG: WelcomeCardConfig = {
  width: DefaultDimensions.WELCOME.width,
  height: DefaultDimensions.WELCOME.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 150,
  avatarBorderColor: '#e94560',
  avatarBorderWidth: 5,
  username: 'User',
  discriminator: '',
  guildName: 'Server',
  memberCount: 0,
  titleText: 'Welcome!',
  subtitleText: 'You are member #{memberCount}',
  titleColor: '#e94560',
  subtitleColor: '#a0a0b0',
  usernameColor: '#ffffff',
  theme: 'dark',
};

/**
 * Builder for creating Discord welcome cards.
 *
 * Uses a fluent (chainable) API to configure every aspect of the card.
 *
 * @example
 * ```typescript
 * import { WelcomeCardBuilder } from 'canvas-forge';
 *
 * const card = await new WelcomeCardBuilder()
 *   .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
 *   .setUsername(member.user.username)
 *   .setGuildName(member.guild.name)
 *   .setMemberCount(member.guild.memberCount)
 *   .setBackground('#1a1a2e')
 *   .build();
 *
 * // Send in Discord.js
 * channel.send({ files: [{ attachment: card, name: 'welcome.png' }] });
 * ```
 */
export class WelcomeCardBuilder extends BaseCanvas<WelcomeCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the user's avatar image. */
  public setAvatar(source: ImageResolvable): this {
    this.config.avatar = source;
    return this;
  }

  /** Sets the avatar display size (diameter in pixels). */
  public setAvatarSize(size: number): this {
    this.config.avatarSize = size;
    return this;
  }

  /** Sets the avatar border color. */
  public setAvatarBorder(color: ColorResolvable): this {
    this.config.avatarBorderColor = color;
    return this;
  }

  /** Sets the avatar border width in pixels. */
  public setAvatarBorderWidth(width: number): this {
    this.config.avatarBorderWidth = width;
    return this;
  }

  /** Sets the username text. */
  public setUsername(username: string): this {
    this.config.username = username;
    return this;
  }

  /** Sets the discriminator (e.g., '0001'). */
  public setDiscriminator(discriminator: string): this {
    this.config.discriminator = discriminator;
    return this;
  }

  /** Sets the guild (server) name. */
  public setGuildName(name: string): this {
    this.config.guildName = name;
    return this;
  }

  /** Sets the member count number. */
  public setMemberCount(count: number): this {
    this.config.memberCount = count;
    return this;
  }

  /** Sets the title text (e.g., 'Welcome!'). */
  public setTitleText(text: string): this {
    this.config.titleText = text;
    return this;
  }

  /** Sets the subtitle text. Use {memberCount} as a placeholder. */
  public setSubtitleText(text: string): this {
    this.config.subtitleText = text;
    return this;
  }

  /** Sets the title text color. */
  public setTitleColor(color: ColorResolvable): this {
    this.config.titleColor = color;
    return this;
  }

  /** Sets the subtitle text color. */
  public setSubtitleColor(color: ColorResolvable): this {
    this.config.subtitleColor = color;
    return this;
  }

  /** Sets the username text color. */
  public setUsernameColor(color: ColorResolvable): this {
    this.config.usernameColor = color;
    return this;
  }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#e94560';
      this.config.subtitleColor = '#a0a0b0';
      this.config.usernameColor = '#ffffff';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#e94560';
      this.config.subtitleColor = '#555555';
      this.config.usernameColor = '#1a1a2e';
    }
    return this;
  }

  /** Renders the welcome card content. */
  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const centerX = width / 2;

    // Draw decorative border/frame
    this.ctx.strokeStyle = resolveColor(this.config.avatarBorderColor);
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeRect(20, 20, width - 40, height - 40);
    this.ctx.globalAlpha = 1;

    // Draw avatar
    const avatarY = height * 0.35;
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar,
        centerX, avatarY,
        this.config.avatarSize,
        this.config.avatarBorderColor,
        this.config.avatarBorderWidth,
      );
    }

    // Draw title text
    this.ctx.font = buildFontString(36, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.config.titleText, centerX, avatarY + this.config.avatarSize / 2 + 50);

    // Draw username
    this.ctx.font = buildFontString(28, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    const displayName = this.config.discriminator
      ? `${this.config.username}#${this.config.discriminator}`
      : this.config.username;
    const truncatedName = truncateText(this.ctx, displayName, width * 0.8);
    this.ctx.fillText(truncatedName, centerX, avatarY + this.config.avatarSize / 2 + 90);

    // Draw subtitle
    const subtitle = this.config.subtitleText.replace(
      '{memberCount}',
      this.config.memberCount.toString(),
    );
    this.ctx.font = buildFontString(20, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.subtitleColor);
    this.ctx.fillText(subtitle, centerX, avatarY + this.config.avatarSize / 2 + 120);
  }
}
