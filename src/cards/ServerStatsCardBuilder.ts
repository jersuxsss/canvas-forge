/**
 * Server Stats Card Builder for canvas-forge.
 * Creates visually striking server statistics cards for Discord.
 * @module cards/ServerStatsCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { ServerStatsCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText, formatNumber } from '../utils/text';
import { drawRoundedRect } from '../utils/shapes';

const DEFAULT_CONFIG: ServerStatsCardConfig = {
  width: DefaultDimensions.SERVER_STATS.width,
  height: DefaultDimensions.SERVER_STATS.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  guildName: 'Discord Server',
  guildIcon: null,
  totalMembers: 1000,
  onlineMembers: 250,
  boosts: 15,
  boostLevel: 2,
  accentColor: '#5865F2', // Discord Blurple
  titleColor: '#ffffff',
  valueColor: '#ffffff',
  labelColor: '#a0a0b0',
  theme: 'dark',
};

/**
 * Builder for creating Discord server statistics cards.
 *
 * Shows total members, online members, server boost level, and boost count.
 *
 * @example
 * ```typescript
 * import { ServerStatsCardBuilder } from 'canvas-forge';
 *
 * const card = await new ServerStatsCardBuilder()
 *   .setGuildName('Gamer Zone')
 *   .setGuildIcon(guild.iconURL())
 *   .setTotalMembers(guild.memberCount)
 *   .setOnlineMembers(onlineCount)
 *   .setBoosts(guild.premiumSubscriptionCount)
 *   .setBoostLevel(guild.premiumTier)
 *   .build();
 * ```
 */
export class ServerStatsCardBuilder extends BaseCanvas<ServerStatsCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the server/guild name. */
  public setGuildName(name: string): this { this.config.guildName = name; return this; }
  /** Sets the server/guild icon image. */
  public setGuildIcon(source: ImageResolvable): this { this.config.guildIcon = source; return this; }
  /** Sets the total member count. */
  public setTotalMembers(count: number): this { this.config.totalMembers = count; return this; }
  /** Sets the online member count. */
  public setOnlineMembers(count: number): this { this.config.onlineMembers = count; return this; }
  /** Sets the boost count. */
  public setBoosts(boosts: number): this { this.config.boosts = boosts; return this; }
  /** Sets the boost level (tier). */
  public setBoostLevel(level: number): this { this.config.boostLevel = level; return this; }
  /** Sets the accent highlight color. */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }
  /** Sets the title text color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the value text color. */
  public setValueColor(color: ColorResolvable): this { this.config.valueColor = color; return this; }
  /** Sets the label text color. */
  public setLabelColor(color: ColorResolvable): this { this.config.labelColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#ffffff';
      this.config.valueColor = '#ffffff';
      this.config.labelColor = '#a0a0b0';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#1a1a2e';
      this.config.valueColor = '#222233';
      this.config.labelColor = '#666677';
    }
    return this;
  }

  /** Renders the server stats card content. */
  protected async _render(): Promise<void> {
    const { width, height, guildName, totalMembers, onlineMembers, boosts, boostLevel, accentColor, titleColor, valueColor, labelColor } = this.config;
    const padding = 30;

    // Header container with background
    drawRoundedRect(
      this.ctx, padding, padding, width - padding * 2, 100,
      12, 'rgba(0, 0, 0, 0.2)',
    );

    // Guild Icon
    const iconSize = 70;
    const iconX = padding + 20 + iconSize / 2;
    const iconY = padding + 50;

    if (this.config.guildIcon) {
      await this._drawAvatar(
        this.config.guildIcon, iconX, iconY,
        iconSize, accentColor, 3,
      );
    } else {
      // Draw a default text-based guild icon placeholder
      this.ctx.save();
      this.ctx.fillStyle = resolveColor(accentColor);
      this.ctx.beginPath();
      this.ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.textAlign = 'center';
      this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
      this.ctx.fillStyle = '#ffffff';
      const initials = guildName.split(' ').map(w => w[0]).slice(0, 3).join('').toUpperCase();
      this.ctx.fillText(initials || 'G', iconX, iconY + 8);
      this.ctx.restore();
    }

    // Guild Name & Stats Label
    const textX = iconX + iconSize / 2 + 20;
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(26, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(titleColor);
    this.ctx.fillText(truncateText(this.ctx, guildName, width - textX - padding - 20), textX, padding + 48);

    this.ctx.font = buildFontString(14, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(labelColor);
    this.ctx.fillText('SERVER STATISTICS', textX, padding + 73);

    // Grid panels configuration (3 columns for members, online, and boosts)
    const cardY = padding + 120;
    const cardHeight = height - cardY - padding;
    const colWidth = (width - padding * 2 - 40) / 3;
    const colSpacing = 20;

    const panelsData = [
      {
        title: 'TOTAL MEMBERS',
        value: formatNumber(totalMembers),
        subtitle: `${totalMembers.toLocaleString()} users`,
        progress: 1.0,
        progressColor: accentColor,
      },
      {
        title: 'ONLINE MEMBERS',
        value: formatNumber(onlineMembers),
        subtitle: `${((onlineMembers / (totalMembers || 1)) * 100).toFixed(1)}% online`,
        progress: totalMembers ? onlineMembers / totalMembers : 0,
        progressColor: '#57F287', // Discord Green
      },
      {
        title: 'SERVER BOOSTS',
        value: `TIER ${boostLevel}`,
        subtitle: `${boosts} boosts total`,
        progress: boostLevel / 3, // Tier 3 is max
        progressColor: '#f47fff', // Nitro Pink
      },
    ];

    for (let i = 0; i < panelsData.length; i++) {
      const panel = panelsData[i];
      if (!panel) {
        continue;
      }
      const colX = padding + i * (colWidth + colSpacing);

      // Draw glassmorphic panel
      drawRoundedRect(
        this.ctx, colX, cardY, colWidth, cardHeight,
        15, 'rgba(0, 0, 0, 0.25)',
      );

      // Panel Header Label
      this.ctx.textAlign = 'center';
      this.ctx.font = buildFontString(13, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(labelColor);
      this.ctx.fillText(panel.title, colX + colWidth / 2, cardY + 40);

      // Main big value
      this.ctx.font = buildFontString(38, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(valueColor);
      this.ctx.fillText(panel.value, colX + colWidth / 2, cardY + 95);

      // Small subtitle
      this.ctx.font = buildFontString(13, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(labelColor);
      this.ctx.fillText(panel.subtitle, colX + colWidth / 2, cardY + 130);

      // Progress bar at the bottom
      const pbX = colX + 25;
      const pbY = cardY + cardHeight - 50;
      const pbW = colWidth - 50;
      const pbH = 8;

      // Track
      drawRoundedRect(this.ctx, pbX, pbY, pbW, pbH, pbH / 2, 'rgba(255, 255, 255, 0.08)');

      // Fill
      if (panel.progress > 0) {
        const fillW = Math.max(pbH, pbW * Math.min(1, panel.progress));
        drawRoundedRect(this.ctx, pbX, pbY, fillW, pbH, pbH / 2, panel.progressColor);
      }
    }
  }
}
