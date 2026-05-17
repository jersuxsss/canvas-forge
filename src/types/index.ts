/**
 * Central type export hub for canvas-forge.
 * All public types are re-exported from here for convenient access.
 *
 * @module types
 */

// Common types and constants
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
} from './common';

export { DiscordColors, StatusColors, DefaultDimensions } from './common';

// Card configuration types
export type {
  BaseCardConfig,
  WelcomeCardConfig,
  LeaveCardConfig,
  RankCardConfig,
  LevelUpCardConfig,
  BadgeData,
  ProfileCardConfig,
} from './cards';
