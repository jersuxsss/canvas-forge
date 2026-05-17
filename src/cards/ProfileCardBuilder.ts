/**
 * Profile Card Builder for canvas-forge.
 * Creates detailed user profile cards for Discord.
 * @module cards/ProfileCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { ProfileCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, StatusType, ThemeMode, TextAlign } from '../types/common';
import { DefaultDimensions, StatusColors } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, formatNumber, formatRank, truncateText, wrapText } from '../utils/text';
import { drawProgressBar, drawStatusIndicator, drawRoundedRect } from '../utils/shapes';
import type { BadgeData } from '../types/cards';
import { loadImage } from '../core/ImageLoader';

const DEFAULT_CONFIG: ProfileCardConfig = {
  width: DefaultDimensions.PROFILE.width,
  height: DefaultDimensions.PROFILE.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  avatar: null,
  avatarSize: 120,
  avatarBorderColor: '#e94560',
  avatarBorderWidth: 4,
  username: 'User',
  discriminator: '',
  displayName: '',
  bio: '',
  badges: [],
  level: 1,
  currentXP: 0,
  requiredXP: 100,
  rank: 1,
  reputation: 0,
  joinedAt: null,
  status: 'online',
  progressBarColor: '#e94560',
  progressBarTrackColor: '#2a2a3e',
  accentColor: '#e94560',
  usernameColor: '#ffffff',
  bioColor: '#a0a0b0',
  bioAlign: 'left',
  theme: 'dark',
};

/**
 * Builder for creating Discord user profile cards.
 *
 * @example
 * ```typescript
 * const card = await new ProfileCardBuilder()
 *   .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
 *   .setUsername(user.username)
 *   .setDisplayName(member.nickname ?? user.globalName ?? user.username)
 *   .setBio('Hello! I love coding bots.')
 *   .setLevel(25)
 *   .setCurrentXP(7500)
 *   .setRequiredXP(10000)
 *   .setRank(5)
 *   .setReputation(420)
 *   .setStatus('online')
 *   .build();
 * ```
 */
export class ProfileCardBuilder extends BaseCanvas<ProfileCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  public setAvatarSize(size: number): this { this.config.avatarSize = size; return this; }
  public setAvatarBorder(color: ColorResolvable): this { this.config.avatarBorderColor = color; return this; }
  public setAvatarBorderWidth(width: number): this { this.config.avatarBorderWidth = width; return this; }
  public setUsername(username: string): this { this.config.username = username; return this; }
  public setDiscriminator(d: string): this { this.config.discriminator = d; return this; }
  public setDisplayName(name: string): this { this.config.displayName = name; return this; }
  public setBio(bio: string): this { this.config.bio = bio; return this; }
  public setBadges(badges: BadgeData[]): this { this.config.badges = badges; return this; }
  public setLevel(level: number): this { this.config.level = level; return this; }
  public setCurrentXP(xp: number): this { this.config.currentXP = xp; return this; }
  public setRequiredXP(xp: number): this { this.config.requiredXP = xp; return this; }
  public setRank(rank: number): this { this.config.rank = rank; return this; }
  public setReputation(rep: number): this { this.config.reputation = rep; return this; }
  public setJoinedAt(date: Date | string): this { this.config.joinedAt = date; return this; }
  public setStatus(status: StatusType): this { this.config.status = status; return this; }
  public setProgressBarColor(c: ColorResolvable): this { this.config.progressBarColor = c; return this; }
  public setProgressBarTrackColor(c: ColorResolvable): this { this.config.progressBarTrackColor = c; return this; }
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }
  public setUsernameColor(c: ColorResolvable): this { this.config.usernameColor = c; return this; }
  public setBioColor(c: ColorResolvable): this { this.config.bioColor = c; return this; }
  public setBioAlign(align: TextAlign): this { this.config.bioAlign = align; return this; }

  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.usernameColor = '#ffffff';
      this.config.bioColor = '#a0a0b0';
      this.config.progressBarTrackColor = '#2a2a3e';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.usernameColor = '#1a1a2e';
      this.config.bioColor = '#555555';
      this.config.progressBarTrackColor = '#dcdcdc';
    }
    return this;
  }

  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 30;

    // Top accent banner
    const bannerHeight = 180;
    this.ctx.fillStyle = resolveColor(this.config.accentColor);
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillRect(0, 0, width, bannerHeight);
    this.ctx.globalAlpha = 1;

    // Inner card panel
    drawRoundedRect(
      this.ctx, padding, bannerHeight - 30, width - padding * 2, height - bannerHeight,
      15, 'rgba(0, 0, 0, 0.3)',
    );

    // Avatar
    const avatarX = padding + 40 + this.config.avatarSize / 2;
    const avatarY = bannerHeight - 10;
    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, avatarX, avatarY,
        this.config.avatarSize, this.config.avatarBorderColor, this.config.avatarBorderWidth,
      );
      // Status
      const sc = StatusColors[this.config.status];
      drawStatusIndicator(
        this.ctx,
        avatarX + this.config.avatarSize / 2 - 12,
        avatarY + this.config.avatarSize / 2 - 12,
        10, sc, '#1a1a2e',
      );
    }

    // Display name / username
    const nameX = avatarX + this.config.avatarSize / 2 + 20;
    const nameY = bannerHeight + 20;
    this.ctx.textAlign = 'left';

    const displayName = this.config.displayName || this.config.username;
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.usernameColor);
    this.ctx.fillText(truncateText(this.ctx, displayName, width - nameX - padding), nameX, nameY);

    // @username
    this.ctx.font = buildFontString(16, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.bioColor);
    const handle = this.config.discriminator
      ? `@${this.config.username}#${this.config.discriminator}`
      : `@${this.config.username}`;
    this.ctx.fillText(handle, nameX, nameY + 25);

    // Badges
    if (this.config.badges.length > 0) {
      let badgeX = nameX;
      const badgeY = nameY + 40;
      const badgeSize = 28;
      for (const badge of this.config.badges) {
        try {
          const img = await loadImage(badge.icon);
          this.ctx.drawImage(img, badgeX, badgeY, badgeSize, badgeSize);
          badgeX += badgeSize + 6;
        } catch {
          // Skip broken badge icons
        }
      }
    }

    // Bio
    if (this.config.bio) {
      const bioY = bannerHeight + 100;
      const bioMaxWidth = width - padding * 2 - 40;
      this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.bioColor);
      this.ctx.textAlign = this.config.bioAlign;
      const bioX = this.config.bioAlign === 'center' ? width / 2
        : this.config.bioAlign === 'right' ? width - padding - 20
        : padding + 20;
      const lines = wrapText(this.ctx, this.config.bio, bioMaxWidth);
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        const line = lines[i];
        if (line) { this.ctx.fillText(line, bioX, bioY + i * 20); }
      }
    }

    // Stats section
    const statsY = height - 130;
    const statBoxWidth = (width - padding * 2 - 60) / 4;
    const stats = [
      { label: 'LEVEL', value: this.config.level.toString() },
      { label: 'RANK', value: formatRank(this.config.rank) },
      { label: 'XP', value: formatNumber(this.config.currentXP) },
      { label: 'REP', value: formatNumber(this.config.reputation) },
    ];

    this.ctx.textAlign = 'center';
    stats.forEach((stat, i) => {
      const sx = padding + 30 + statBoxWidth * i + statBoxWidth / 2;

      // Stat value
      this.ctx.font = buildFontString(22, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(this.config.accentColor);
      this.ctx.fillText(stat.value, sx, statsY);

      // Stat label
      this.ctx.font = buildFontString(11, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.bioColor);
      this.ctx.fillText(stat.label, sx, statsY + 20);
    });

    // XP progress bar
    const barY = height - padding - 35;
    const barX = padding + 20;
    const barWidth = width - padding * 2 - 40;
    const progress = this.config.requiredXP > 0
      ? this.config.currentXP / this.config.requiredXP : 0;

    // XP label
    this.ctx.textAlign = 'right';
    this.ctx.font = buildFontString(12, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.bioColor);
    this.ctx.fillText(
      `${formatNumber(this.config.currentXP)} / ${formatNumber(this.config.requiredXP)} XP`,
      barX + barWidth, barY - 8,
    );

    drawProgressBar(
      this.ctx, barX, barY, barWidth, 20,
      progress, this.config.progressBarColor, this.config.progressBarTrackColor, 10,
    );
  }
}
