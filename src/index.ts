/**
 * canvas-forge — A high-performance, Discord-focused canvas library.
 *
 * Built on @napi-rs/canvas (Skia engine) for maximum speed with zero
 * system dependencies. Provides ready-to-use card builders for common
 * Discord bot needs (welcome, leave, rank, level-up, profile) plus a
 * freeform CanvasBuilder for completely custom designs.
 *
 * @packageDocumentation
 * @module canvas-forge
 *
 * @example
 * ```typescript
 * import { WelcomeCardBuilder, RankCardBuilder, CanvasBuilder } from 'canvas-forge';
 *
 * // Create a welcome card
 * const welcomeCard = await new WelcomeCardBuilder()
 *   .setAvatar('https://cdn.discordapp.com/avatars/...')
 *   .setUsername('Jersuxs')
 *   .setMemberCount(1500)
 *   .build();
 *
 * // Create a rank card
 * const rankCard = await new RankCardBuilder()
 *   .setAvatar('https://cdn.discordapp.com/avatars/...')
 *   .setUsername('Jersuxs')
 *   .setLevel(15)
 *   .setCurrentXP(2500)
 *   .setRequiredXP(5000)
 *   .setRank(3)
 *   .build();
 *
 * // Create a custom canvas
 * const custom = new CanvasBuilder(800, 400)
 *   .setBackground('#1a1a2e')
 *   .setFont(32, 'sans-serif', 'bold')
 *   .drawText('Hello World!', 400, 200, '#e94560', 'center')
 *   .toBuffer();
 * ```
 */

// ── Card Builders ──────────────────────────────────────────────────────────
export { WelcomeCardBuilder } from './cards/WelcomeCardBuilder';
export { LeaveCardBuilder } from './cards/LeaveCardBuilder';
export { RankCardBuilder } from './cards/RankCardBuilder';
export { LevelUpCardBuilder } from './cards/LevelUpCardBuilder';
export { ProfileCardBuilder } from './cards/ProfileCardBuilder';

// ── Core ───────────────────────────────────────────────────────────────────
export { CanvasBuilder } from './core/CanvasBuilder';
export { BaseCanvas } from './core/BaseCanvas';
export { loadImage, tryLoadImage } from './core/ImageLoader';

// ── Utilities ──────────────────────────────────────────────────────────────
export {
  resolveColor,
  hexToRgba,
  rgbaToHex,
  darken,
  lighten,
  withOpacity,
  isHexColor,
  createGradientStops,
  getGradientCoords,
} from './utils/colors';

export {
  wrapText,
  truncateText,
  measureText,
  formatNumber,
  formatRank,
  buildFontString,
  centerTextVertically,
} from './utils/text';

export {
  drawRoundedRect,
  drawCircle,
  clipCircle,
  drawProgressBar,
  drawCircularProgress,
  drawAvatarBorder,
  drawStatusIndicator,
} from './utils/shapes';

export {
  validatePositiveInteger,
  validateNonNegative,
  validateRange,
  validateNonEmptyString,
  validateColor,
  validateImage,
  validateTheme,
  validateStatus,
  validateOutputFormat,
  validateDimensions,
} from './utils/validators';

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  ColorResolvable,
  ImageResolvable,
  ThemeMode,
  StatusType,
  OutputFormat,
  FontWeight,
  TextAlign,
  GradientDirection,
  GradientData,
  TextOptions,
  ImageOptions,
} from './types/common';

export { DiscordColors, StatusColors, DefaultDimensions } from './types/common';

export type {
  BaseCardConfig,
  WelcomeCardConfig,
  LeaveCardConfig,
  RankCardConfig,
  LevelUpCardConfig,
  BadgeData,
  ProfileCardConfig,
} from './types/cards';

// ── Re-export color types from utils ───────────────────────────────────────
export type { RGBAColor } from './utils/colors';
export type { TextMeasurement } from './utils/text';
