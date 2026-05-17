/**
 * Level Up Card Builder for canvas-forge.
 * Creates level-up notification cards for Discord.
 * @module cards/LevelUpCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { LevelUpCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';

const DEFAULT_CONFIG: LevelUpCardConfig = {
  width: DefaultDimensions.LEVEL_UP.width,
  height: DefaultDimensions.LEVEL_UP.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 100,
  avatarBorderColor: '#e94560',
  avatarBorderWidth: 4,
  username: 'User',
  level: 1,
  titleText: 'Level Up!',
  titleColor: '#e94560',
  usernameColor: '#ffffff',
  levelColor: '#e94560',
  theme: 'dark',
};

/**
 * Builder for creating Discord level-up notification cards.
 *
 * @example
 * ```typescript
 * const card = await new LevelUpCardBuilder()
 *   .setAvatar(user.displayAvatarURL({ extension: 'png', size: 256 }))
 *   .setUsername(user.username)
 *   .setLevel(10)
 *   .build();
 * ```
 */
export class LevelUpCardBuilder extends BaseCanvas<LevelUpCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  public setAvatarSize(size: number): this { this.config.avatarSize = size; return this; }
  public setAvatarBorder(color: ColorResolvable): this { this.config.avatarBorderColor = color; return this; }
  public setAvatarBorderWidth(width: number): this { this.config.avatarBorderWidth = width; return this; }
  public setUsername(username: string): this { this.config.username = username; return this; }
  public setLevel(level: number): this { this.config.level = level; return this; }
  public setTitleText(text: string): this { this.config.titleText = text; return this; }
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  public setUsernameColor(color: ColorResolvable): this { this.config.usernameColor = color; return this; }
  public setLevelColor(color: ColorResolvable): this { this.config.levelColor = color; return this; }

  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.usernameColor = '#ffffff';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.usernameColor = '#1a1a2e';
    }
    return this;
  }

  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const avatarX = 30 + this.config.avatarSize / 2 + 10;
    const avatarY = height / 2;

    // Avatar
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, avatarX, avatarY,
        this.config.avatarSize, this.config.avatarBorderColor, this.config.avatarBorderWidth,
      );
    }

    // Text area
    const textX = avatarX + this.config.avatarSize / 2 + 25;

    // Title
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(28, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.fillText(this.config.titleText, textX, height / 2 - 20);

    // Username
    this.ctx.font = buildFontString(20, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    const maxTextWidth = width - textX - 30;
    const truncated = truncateText(this.ctx, this.config.username, maxTextWidth);
    this.ctx.fillText(truncated, textX, height / 2 + 10);

    // Level
    this.ctx.font = buildFontString(22, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.levelColor);
    this.ctx.fillText(`Level ${this.config.level}`, textX, height / 2 + 45);
  }
}
