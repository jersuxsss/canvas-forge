/**
 * Rank Card Builder for canvas-forge.
 * Creates XP/rank cards with progress bars for Discord.
 * @module cards/RankCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { RankCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, StatusType, ThemeMode } from '../types/common';
import { DefaultDimensions, StatusColors } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, formatNumber, formatRank, truncateText } from '../utils/text';
import { drawProgressBar, drawStatusIndicator } from '../utils/shapes';

const DEFAULT_CONFIG: RankCardConfig = {
  width: DefaultDimensions.RANK.width,
  height: DefaultDimensions.RANK.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 140,
  avatarBorderColor: '#e94560',
  avatarBorderWidth: 4,
  username: 'User',
  discriminator: '',
  level: 1,
  currentXP: 0,
  requiredXP: 100,
  rank: 1,
  progressBarColor: '#e94560',
  progressBarTrackColor: '#2a2a3e',
  progressBarHeight: 30,
  progressBarRadius: 15,
  status: 'online',
  statusColor: null,
  usernameColor: '#ffffff',
  levelColor: '#e94560',
  xpColor: '#a0a0b0',
  rankColor: '#ffffff',
  theme: 'dark',
};

/**
 * Builder for creating Discord rank/XP cards with progress bars.
 *
 * @example
 * ```typescript
 * const card = await new RankCardBuilder()
 *   .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
 *   .setUsername(user.username)
 *   .setLevel(15)
 *   .setCurrentXP(2500)
 *   .setRequiredXP(5000)
 *   .setRank(3)
 *   .setStatus('online')
 *   .build();
 * ```
 */
export class RankCardBuilder extends BaseCanvas<RankCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  public setAvatarSize(size: number): this { this.config.avatarSize = size; return this; }
  public setAvatarBorder(color: ColorResolvable): this { this.config.avatarBorderColor = color; return this; }
  public setAvatarBorderWidth(width: number): this { this.config.avatarBorderWidth = width; return this; }
  public setUsername(username: string): this { this.config.username = username; return this; }
  public setDiscriminator(discriminator: string): this { this.config.discriminator = discriminator; return this; }
  public setLevel(level: number): this { this.config.level = level; return this; }
  public setCurrentXP(xp: number): this { this.config.currentXP = xp; return this; }
  public setRequiredXP(xp: number): this { this.config.requiredXP = xp; return this; }
  public setRank(rank: number): this { this.config.rank = rank; return this; }
  public setProgressBarColor(color: ColorResolvable): this { this.config.progressBarColor = color; return this; }
  public setProgressBarTrackColor(color: ColorResolvable): this { this.config.progressBarTrackColor = color; return this; }
  public setProgressBarHeight(height: number): this { this.config.progressBarHeight = height; return this; }
  public setStatus(status: StatusType): this { this.config.status = status; return this; }
  public setStatusColor(color: ColorResolvable): this { this.config.statusColor = color; return this; }
  public setUsernameColor(color: ColorResolvable): this { this.config.usernameColor = color; return this; }
  public setLevelColor(color: ColorResolvable): this { this.config.levelColor = color; return this; }
  public setXPColor(color: ColorResolvable): this { this.config.xpColor = color; return this; }
  public setRankColor(color: ColorResolvable): this { this.config.rankColor = color; return this; }

  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.usernameColor = '#ffffff';
      this.config.progressBarTrackColor = '#2a2a3e';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.usernameColor = '#1a1a2e';
      this.config.progressBarTrackColor = '#dcdcdc';
    }
    return this;
  }

  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 30;
    const avatarX = padding + this.config.avatarSize / 2 + 10;
    const avatarY = height / 2;

    // Draw card inner panel
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    const r = 20;
    this.ctx.moveTo(padding + r, padding);
    this.ctx.lineTo(width - padding - r, padding);
    this.ctx.quadraticCurveTo(width - padding, padding, width - padding, padding + r);
    this.ctx.lineTo(width - padding, height - padding - r);
    this.ctx.quadraticCurveTo(width - padding, height - padding, width - padding - r, height - padding);
    this.ctx.lineTo(padding + r, height - padding);
    this.ctx.quadraticCurveTo(padding, height - padding, padding, height - padding - r);
    this.ctx.lineTo(padding, padding + r);
    this.ctx.quadraticCurveTo(padding, padding, padding + r, padding);
    this.ctx.closePath();
    this.ctx.fill();

    // Draw avatar
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, avatarX, avatarY,
        this.config.avatarSize, this.config.avatarBorderColor, this.config.avatarBorderWidth,
      );

      // Status indicator
      const statusColor = this.config.statusColor
        ? resolveColor(this.config.statusColor)
        : StatusColors[this.config.status];
      drawStatusIndicator(
        this.ctx,
        avatarX + this.config.avatarSize / 2 - 15,
        avatarY + this.config.avatarSize / 2 - 15,
        12, statusColor, this.config.background as string,
      );
    }

    // Text area starts after avatar
    const textX = avatarX + this.config.avatarSize / 2 + 30;
    const textAreaWidth = width - textX - padding - 10;

    // Rank and Level at the top
    this.ctx.textAlign = 'right';
    const topTextY = padding + 50;

    // Rank
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.rankColor);
    this.ctx.fillText(formatRank(this.config.rank), width - padding - 20, topTextY);

    // Level
    const rankWidth = this.ctx.measureText(formatRank(this.config.rank)).width;
    this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.xpColor);
    this.ctx.fillText('RANK', width - padding - 20 - rankWidth - 10, topTextY);

    // Level number
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.levelColor);
    const levelText = this.config.level.toString();
    const rankLabelWidth = this.ctx.measureText('RANK').width;
    this.ctx.fillText(
      levelText,
      width - padding - 20 - rankWidth - 10 - rankLabelWidth - 20,
      topTextY,
    );

    this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.xpColor);
    const levelNumWidth = this.ctx.measureText(levelText).width;
    this.ctx.fillText(
      'LEVEL',
      width - padding - 20 - rankWidth - 10 - rankLabelWidth - 20 - levelNumWidth - 10,
      topTextY,
    );

    // Username
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    const displayName = this.config.discriminator
      ? `${this.config.username}#${this.config.discriminator}`
      : this.config.username;
    const truncated = truncateText(this.ctx, displayName, textAreaWidth);
    this.ctx.fillText(truncated, textX, topTextY);

    // XP text
    const progress = this.config.requiredXP > 0
      ? this.config.currentXP / this.config.requiredXP
      : 0;
    const xpText = `${formatNumber(this.config.currentXP)} / ${formatNumber(this.config.requiredXP)} XP`;
    this.ctx.textAlign = 'right';
    this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.xpColor);
    const barY = height - padding - 50;
    this.ctx.fillText(xpText, width - padding - 20, barY - 10);

    // Progress bar
    const barX = textX;
    const barWidth = width - textX - padding - 20;
    drawProgressBar(
      this.ctx, barX, barY, barWidth, this.config.progressBarHeight,
      progress, this.config.progressBarColor, this.config.progressBarTrackColor,
      this.config.progressBarRadius,
    );
  }
}
