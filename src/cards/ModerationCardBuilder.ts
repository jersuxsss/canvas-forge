/**
 * Moderation Card Builder for canvas-forge.
 * Creates moderation announcement cards for Discord logs or alerts.
 * @module cards/ModerationCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { ModerationCardConfig, ModerationAction } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';
import { drawRoundedRect } from '../utils/shapes';

const DEFAULT_CONFIG: ModerationCardConfig = {
  width: DefaultDimensions.MODERATION.width,
  height: DefaultDimensions.MODERATION.height,
  background: '#1a1a2e',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  action: 'ban',
  username: 'User',
  avatar: null,
  moderator: 'Moderator',
  reason: 'No reason provided',
  caseNumber: undefined,
  accentColor: '#ED4245',
  titleColor: '#ffffff',
  contentColor: '#d0d0e0',
  labelColor: '#e94560',
  theme: 'dark',
};

/**
 * Helper to get default accent color for a moderation action.
 */
function getActionColor(action: ModerationAction): string {
  switch (action) {
    case 'ban':
      return '#ED4245'; // Discord Red
    case 'kick':
      return '#faa61a'; // Discord Mute/Kick Orange
    case 'mute':
      return '#faa61a'; // Discord Mute/Kick Orange
    case 'warn':
      return '#FEE75C'; // Discord Yellow
    case 'unban':
    case 'unmute':
      return '#57F287'; // Discord Green
    default:
      return '#ED4245';
  }
}

/**
 * Helper to get user-friendly action title.
 */
function getActionTitle(action: ModerationAction): string {
  switch (action) {
    case 'ban':
      return 'User Banned';
    case 'kick':
      return 'User Kicked';
    case 'mute':
      return 'User Muted';
    case 'warn':
      return 'User Warned';
    case 'unban':
      return 'User Unbanned';
    case 'unmute':
      return 'User Unmuted';
    default:
      return 'Moderation Action';
  }
}

/**
 * Builder for creating Discord moderation log/announcement cards.
 *
 * Supports various action types (Ban, Kick, Mute, Warn, etc.) with matching accent colors.
 *
 * @example
 * ```typescript
 * import { ModerationCardBuilder } from 'canvas-forge';
 *
 * const card = await new ModerationCardBuilder()
 *   .setAction('ban')
 *   .setAvatar(user.displayAvatarURL())
 *   .setUsername(user.username)
 *   .setModerator(interaction.user.username)
 *   .setReason('Spamming in announcements channel')
 *   .setCaseNumber('#4321')
 *   .build();
 * ```
 */
export class ModerationCardBuilder extends BaseCanvas<ModerationCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the moderation action type. Automatically updates default accent color. */
  public setAction(action: ModerationAction): this {
    this.config.action = action;
    this.config.accentColor = getActionColor(action);
    this.config.labelColor = getActionColor(action);
    return this;
  }

  /** Sets the target user's username. */
  public setUsername(username: string): this { this.config.username = username; return this; }
  /** Sets the target user's avatar. */
  public setAvatar(source: ImageResolvable): this { this.config.avatar = source; return this; }
  /** Sets the moderator's username. */
  public setModerator(moderator: string): this { this.config.moderator = moderator; return this; }
  /** Sets the reason for the moderation action. */
  public setReason(reason: string): this { this.config.reason = reason; return this; }
  /** Sets the case number/ID. */
  public setCaseNumber(caseNumber: string): this { this.config.caseNumber = caseNumber; return this; }
  /** Sets the card accent/theme highlight color. */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }
  /** Sets the card title text color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the content text color. */
  public setContentColor(color: ColorResolvable): this { this.config.contentColor = color; return this; }
  /** Sets the label text color. */
  public setLabelColor(color: ColorResolvable): this { this.config.labelColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#1a1a2e';
      this.config.titleColor = '#ffffff';
      this.config.contentColor = '#d0d0e0';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#1a1a2e';
      this.config.contentColor = '#333344';
    }
    return this;
  }

  /** Renders the moderation card content. */
  protected async _render(): Promise<void> {
    const { width, height, action, accentColor, titleColor, contentColor, labelColor, caseNumber } = this.config;
    const padding = 25;

    // Outer border with accent color
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = resolveColor(accentColor);
    this.ctx.strokeRect(2, 2, width - 4, height - 4);

    // Inner card panel background
    drawRoundedRect(
      this.ctx, padding, padding, width - padding * 2, height - padding * 2,
      12, 'rgba(0, 0, 0, 0.15)',
    );

    // Left accent bar
    this.ctx.fillStyle = resolveColor(accentColor);
    this.ctx.fillRect(padding, padding, 6, height - padding * 2);

    // Render avatar on the right or inline
    const avatarSize = 100;
    const avatarX = width - padding - 80;
    const avatarY = height / 2;

    if (this.config.avatar) {
      await this._drawAvatar(
        this.config.avatar, avatarX, avatarY,
        avatarSize, accentColor, 4,
      );
    }

    // Text details on the left
    const startX = padding + 25;
    const maxTextWidth = this.config.avatar
      ? width - startX - padding * 2 - avatarSize - 40
      : width - startX - padding * 2;

    // 1. Title / Header
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(26, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(titleColor);
    const titleText = getActionTitle(action).toUpperCase();
    this.ctx.fillText(titleText, startX, padding + 40);

    // Case Number (top-right of the left section)
    if (caseNumber) {
      this.ctx.font = buildFontString(16, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(accentColor);
      this.ctx.fillText(caseNumber, startX + this.ctx.measureText(titleText).width + 15, padding + 38);
    }

    // Horizontal divider
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.fillRect(startX, padding + 55, maxTextWidth, 1);

    // 2. Info Fields
    const fieldYStart = padding + 85;
    const lineSpacing = 35;

    const fields = [
      { label: 'Target User', value: this.config.username },
      { label: 'Moderator', value: this.config.moderator },
      { label: 'Reason', value: this.config.reason },
    ];

    fields.forEach((field, index) => {
      const yPos = fieldYStart + index * lineSpacing;

      // Label (e.g. "Target User:")
      this.ctx.font = buildFontString(14, 'sans-serif', 'bold');
      this.ctx.fillStyle = resolveColor(labelColor);
      const labelText = `${field.label}: `;
      this.ctx.fillText(labelText, startX, yPos);

      const labelWidth = this.ctx.measureText(labelText).width;

      // Value
      this.ctx.font = buildFontString(15, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(contentColor);
      const valText = truncateText(this.ctx, field.value, maxTextWidth - labelWidth);
      this.ctx.fillText(valText, startX + labelWidth, yPos);
    });
  }
}
