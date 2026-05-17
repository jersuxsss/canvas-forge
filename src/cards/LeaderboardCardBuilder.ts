/**
 * Leaderboard Card Builder for canvas-forge.
 * Creates ranked leaderboard cards for Discord servers.
 * @module cards/LeaderboardCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { LeaderboardCardConfig, LeaderboardEntry } from '../types/cards';
import type { ColorResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText, formatNumber, formatRank } from '../utils/text';
import { drawRoundedRect, clipCircle } from '../utils/shapes';
import { loadImage } from '../core/ImageLoader';

const DEFAULT_CONFIG: LeaderboardCardConfig = {
  width: DefaultDimensions.LEADERBOARD.width,
  height: DefaultDimensions.LEADERBOARD.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  title: 'Leaderboard',
  entries: [],
  maxEntries: 10,
  scoreLabel: 'XP',
  titleColor: '#ffffff',
  usernameColor: '#d0d0e0',
  scoreColor: '#a0a0b0',
  accentColor: '#e94560',
  dividerColor: 'rgba(255, 255, 255, 0.06)',
  rankColor: '#e94560',
  theme: 'dark',
};

/** Medal colors for top-3 positions. */
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'] as const;

/**
 * Builder for creating Discord leaderboard cards.
 *
 * Displays a ranked list of users with optional avatars, scores, and medals.
 *
 * @example
 * ```typescript
 * import { LeaderboardCardBuilder } from 'canvas-forge';
 *
 * const card = await new LeaderboardCardBuilder()
 *   .setTitle('XP Leaderboard')
 *   .addEntry({ rank: 1, username: 'Jersuxs', score: 15000 })
 *   .addEntry({ rank: 2, username: 'Alice', score: 12000 })
 *   .addEntry({ rank: 3, username: 'Bob', score: 9500 })
 *   .setScoreLabel('XP')
 *   .build();
 * ```
 */
export class LeaderboardCardBuilder extends BaseCanvas<LeaderboardCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the title text. */
  public setTitle(title: string): this { this.config.title = title; return this; }
  /** Sets the entries (replaces existing). */
  public setEntries(entries: LeaderboardEntry[]): this { this.config.entries = entries; return this; }
  /** Adds a single entry. */
  public addEntry(entry: LeaderboardEntry): this { this.config.entries.push(entry); return this; }
  /** Sets the max number of entries to display. */
  public setMaxEntries(max: number): this { this.config.maxEntries = max; return this; }
  /** Sets the score column label (e.g., 'XP', 'Coins'). */
  public setScoreLabel(label: string): this { this.config.scoreLabel = label; return this; }
  /** Sets the title color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the username color. */
  public setUsernameColor(color: ColorResolvable): this { this.config.usernameColor = color; return this; }
  /** Sets the score color. */
  public setScoreColor(color: ColorResolvable): this { this.config.scoreColor = color; return this; }
  /** Sets the accent color (medals, highlights). */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }
  /** Sets the divider line color. */
  public setDividerColor(color: ColorResolvable): this { this.config.dividerColor = color; return this; }
  /** Sets the rank number color. */
  public setRankColor(color: ColorResolvable): this { this.config.rankColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#ffffff';
      this.config.usernameColor = '#d0d0e0';
      this.config.scoreColor = '#a0a0b0';
      this.config.dividerColor = 'rgba(255, 255, 255, 0.06)';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#1a1a2e';
      this.config.usernameColor = '#333333';
      this.config.scoreColor = '#555555';
      this.config.dividerColor = 'rgba(0, 0, 0, 0.08)';
    }
    return this;
  }

  /** Renders the leaderboard card content. */
  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 30;

    // Inner card panel
    drawRoundedRect(
      this.ctx, padding, padding, width - padding * 2, height - padding * 2,
      15, 'rgba(0, 0, 0, 0.2)',
    );

    // Title
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(24, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.fillText(this.config.title, padding + 20, padding + 40);

    // Score label header
    this.ctx.textAlign = 'right';
    this.ctx.font = buildFontString(13, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.scoreColor);
    this.ctx.fillText(this.config.scoreLabel.toUpperCase(), width - padding - 25, padding + 40);

    // Entries
    const startY = padding + 65;
    const displayEntries = this.config.entries.slice(0, this.config.maxEntries);
    const availableHeight = height - padding * 2 - 75;
    const rowHeight = Math.min(48, availableHeight / Math.max(displayEntries.length, 1));

    for (let i = 0; i < displayEntries.length; i++) {
      const entry = displayEntries[i];
      if (!entry) { continue; }
      const rowY = startY + i * rowHeight;

      // Divider line
      if (i > 0) {
        this.ctx.fillStyle = resolveColor(this.config.dividerColor);
        this.ctx.fillRect(padding + 20, rowY - 2, width - padding * 2 - 40, 1);
      }

      // Highlight top-3 with subtle background
      if (entry.rank <= 3) {
        const medalColor = MEDAL_COLORS[entry.rank - 1] ?? MEDAL_COLORS[2];
        this.ctx.globalAlpha = 0.06;
        drawRoundedRect(
          this.ctx, padding + 15, rowY - 2, width - padding * 2 - 30, rowHeight - 4,
          8, medalColor,
        );
        this.ctx.globalAlpha = 1;
      }

      // Rank number
      const rankX = padding + 35;
      this.ctx.textAlign = 'center';
      if (entry.rank <= 3) {
        const medalColor = MEDAL_COLORS[entry.rank - 1] ?? MEDAL_COLORS[2];
        this.ctx.font = buildFontString(16, 'sans-serif', 'bold');
        this.ctx.fillStyle = medalColor ?? resolveColor(this.config.rankColor);
      } else {
        this.ctx.font = buildFontString(14, 'sans-serif', 'normal');
        this.ctx.fillStyle = resolveColor(this.config.rankColor);
      }
      this.ctx.fillText(formatRank(entry.rank), rankX, rowY + rowHeight / 2 + 5);

      // Avatar (if provided)
      let nameX = padding + 65;
      if (entry.avatar) {
        const avatarSize = Math.min(32, rowHeight - 8);
        const avatarCenterX = nameX + avatarSize / 2;
        const avatarCenterY = rowY + rowHeight / 2;
        try {
          const img = await loadImage(entry.avatar);
          this.ctx.save();
          clipCircle(this.ctx, avatarCenterX, avatarCenterY, avatarSize / 2);
          this.ctx.drawImage(img, avatarCenterX - avatarSize / 2, avatarCenterY - avatarSize / 2, avatarSize, avatarSize);
          this.ctx.restore();
        } catch {
          // Skip broken avatar
        }
        nameX += avatarSize + 10;
      }

      // Username
      this.ctx.textAlign = 'left';
      this.ctx.font = buildFontString(15, 'sans-serif', entry.rank <= 3 ? 'bold' : 'normal');
      this.ctx.fillStyle = resolveColor(this.config.usernameColor);
      const maxNameWidth = width - nameX - padding - 120;
      this.ctx.fillText(
        truncateText(this.ctx, entry.username, maxNameWidth),
        nameX, rowY + rowHeight / 2 + 5,
      );

      // Score
      this.ctx.textAlign = 'right';
      this.ctx.font = buildFontString(14, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(this.config.scoreColor);
      this.ctx.fillText(formatNumber(entry.score), width - padding - 25, rowY + rowHeight / 2 + 5);
    }
  }
}
