/**
 * Type definitions for all card builder configurations.
 *
 * @module types/cards
 */

import type {
  ColorResolvable,
  GradientData,
  ImageResolvable,
  OutputFormat,
  StatusType,
  TextAlign,
  ThemeMode,
} from './common';

// ---------------------------------------------------------------------------
// Base Card Configuration
// ---------------------------------------------------------------------------

/**
 * Base configuration shared by all card builders.
 */
export interface BaseCardConfig {
  /** Canvas width in pixels. */
  width: number;
  /** Canvas height in pixels. */
  height: number;
  /** Background color, gradient, or image. */
  background: ColorResolvable | GradientData | ImageResolvable;
  /** Whether the background is an image. */
  backgroundIsImage: boolean;
  /** Overlay color applied on top of the background (useful for darkening background images). */
  overlayColor: ColorResolvable;
  /** Overlay opacity (0.0 to 1.0). */
  overlayOpacity: number;
  /** Output format for the rendered card. */
  outputFormat: OutputFormat;
  /** JPEG/WebP quality (1-100). Only used when outputFormat is 'jpeg' or 'webp'. */
  quality: number;
}

// ---------------------------------------------------------------------------
// Welcome Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Welcome Card builder.
 */
export interface WelcomeCardConfig extends BaseCardConfig {
  /** URL, path, or Buffer of the user's avatar image. */
  avatar: ImageResolvable | null;
  /** Size of the avatar in pixels. */
  avatarSize: number;
  /** Border color around the avatar. */
  avatarBorderColor: ColorResolvable;
  /** Border width around the avatar in pixels. */
  avatarBorderWidth: number;
  /** The username to display. */
  username: string;
  /** The user's discriminator (e.g., '0001'). */
  discriminator: string;
  /** The guild/server name. */
  guildName: string;
  /** Total member count to display. */
  memberCount: number;
  /** Title text (e.g., 'Welcome!'). */
  titleText: string;
  /** Subtitle text template. Use {memberCount} as a placeholder. */
  subtitleText: string;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the subtitle text. */
  subtitleColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Leave Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Leave Card builder.
 */
export interface LeaveCardConfig extends BaseCardConfig {
  /** URL, path, or Buffer of the user's avatar image. */
  avatar: ImageResolvable | null;
  /** Size of the avatar in pixels. */
  avatarSize: number;
  /** Border color around the avatar. */
  avatarBorderColor: ColorResolvable;
  /** Border width around the avatar in pixels. */
  avatarBorderWidth: number;
  /** The username to display. */
  username: string;
  /** The user's discriminator. */
  discriminator: string;
  /** The guild/server name. */
  guildName: string;
  /** Title text (e.g., 'Goodbye!'). */
  titleText: string;
  /** Subtitle text template. */
  subtitleText: string;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the subtitle text. */
  subtitleColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Rank Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Rank Card builder.
 */
export interface RankCardConfig extends BaseCardConfig {
  /** URL, path, or Buffer of the user's avatar image. */
  avatar: ImageResolvable | null;
  /** Size of the avatar in pixels. */
  avatarSize: number;
  /** Border color around the avatar. */
  avatarBorderColor: ColorResolvable;
  /** Border width around the avatar in pixels. */
  avatarBorderWidth: number;
  /** The username to display. */
  username: string;
  /** The user's discriminator. */
  discriminator: string;
  /** Current level number. */
  level: number;
  /** Current XP amount. */
  currentXP: number;
  /** XP required to reach the next level. */
  requiredXP: number;
  /** User's rank/position on the leaderboard. */
  rank: number;
  /** Color of the progress bar fill. */
  progressBarColor: ColorResolvable;
  /** Color of the progress bar track (unfilled portion). */
  progressBarTrackColor: ColorResolvable;
  /** Height of the progress bar in pixels. */
  progressBarHeight: number;
  /** Border radius of the progress bar in pixels. */
  progressBarRadius: number;
  /** Discord status indicator. */
  status: StatusType;
  /** Color of the status indicator. If null, uses default status colors. */
  statusColor: ColorResolvable | null;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color of the level label. */
  levelColor: ColorResolvable;
  /** Color of the XP text. */
  xpColor: ColorResolvable;
  /** Color of the rank text. */
  rankColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Level Up Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Level Up Card builder.
 */
export interface LevelUpCardConfig extends BaseCardConfig {
  /** URL, path, or Buffer of the user's avatar image. */
  avatar: ImageResolvable | null;
  /** Size of the avatar in pixels. */
  avatarSize: number;
  /** Border color around the avatar. */
  avatarBorderColor: ColorResolvable;
  /** Border width around the avatar in pixels. */
  avatarBorderWidth: number;
  /** The username to display. */
  username: string;
  /** The new level that was reached. */
  level: number;
  /** Title text (e.g., 'Level Up!'). */
  titleText: string;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color of the level text. */
  levelColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Profile Card
// ---------------------------------------------------------------------------

/**
 * A badge displayed on the profile card.
 */
export interface BadgeData {
  /** URL, path, or Buffer of the badge icon. */
  icon: ImageResolvable;
  /** Badge label/name (shown on hover or as alt text). */
  label: string;
}

/**
 * Configuration for the Profile Card builder.
 */
export interface ProfileCardConfig extends BaseCardConfig {
  /** URL, path, or Buffer of the user's avatar image. */
  avatar: ImageResolvable | null;
  /** Size of the avatar in pixels. */
  avatarSize: number;
  /** Border color around the avatar. */
  avatarBorderColor: ColorResolvable;
  /** Border width around the avatar in pixels. */
  avatarBorderWidth: number;
  /** The username to display. */
  username: string;
  /** The user's discriminator. */
  discriminator: string;
  /** User's display name or nickname. */
  displayName: string;
  /** User's bio/description text. */
  bio: string;
  /** User badges to display. */
  badges: BadgeData[];
  /** Current level number. */
  level: number;
  /** Current XP amount. */
  currentXP: number;
  /** XP required to reach the next level. */
  requiredXP: number;
  /** User's rank/position on the leaderboard. */
  rank: number;
  /** Total reputation/points. */
  reputation: number;
  /** Date when the user joined. */
  joinedAt: Date | string | null;
  /** Discord status indicator. */
  status: StatusType;
  /** Color of the progress bar fill. */
  progressBarColor: ColorResolvable;
  /** Color of the progress bar track. */
  progressBarTrackColor: ColorResolvable;
  /** Accent color used throughout the card. */
  accentColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color of the bio text. */
  bioColor: ColorResolvable;
  /** Text alignment for the bio. */
  bioAlign: TextAlign;
  /** Color theme. */
  theme: ThemeMode;
}
