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

// ---------------------------------------------------------------------------
// Boost Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Boost Card builder.
 */
export interface BoostCardConfig extends BaseCardConfig {
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
  /** The guild/server name. */
  guildName: string;
  /** How many boosts the server now has. */
  boostCount: number;
  /** Title text (e.g., 'Server Boosted!'). */
  titleText: string;
  /** Subtitle text template. Use {boostCount} as a placeholder. */
  subtitleText: string;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the subtitle text. */
  subtitleColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Accent / highlight color (boost glow). */
  accentColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Info Card
// ---------------------------------------------------------------------------

/**
 * A field displayed on the info card (similar to Discord embed fields).
 */
export interface InfoFieldData {
  /** Field name/title. */
  name: string;
  /** Field value/content. */
  value: string;
  /** Whether this field is inline (side-by-side with other fields). */
  inline?: boolean;
}

/**
 * Configuration for the Info Card builder.
 */
export interface InfoCardConfig extends BaseCardConfig {
  /** Title text of the info card. */
  title: string;
  /** Description / body text. */
  description: string;
  /** Structured fields displayed in a grid. */
  fields: InfoFieldData[];
  /** Footer text (e.g., timestamp, credits). */
  footer: string;
  /** Optional icon image (top-left). */
  icon: ImageResolvable | null;
  /** Size of the icon in pixels. */
  iconSize: number;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the description text. */
  descriptionColor: ColorResolvable;
  /** Color of the field names/labels. */
  fieldNameColor: ColorResolvable;
  /** Color of the field values. */
  fieldValueColor: ColorResolvable;
  /** Color of the footer text. */
  footerColor: ColorResolvable;
  /** Left accent stripe color. */
  accentColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Leaderboard Card
// ---------------------------------------------------------------------------

/**
 * A single entry on the leaderboard.
 */
export interface LeaderboardEntry {
  /** Rank position (1, 2, 3, …). */
  rank: number;
  /** The username to display. */
  username: string;
  /** The user's score or value (XP, coins, etc.). */
  score: number;
  /** Optional avatar image. */
  avatar?: ImageResolvable;
}

/**
 * Configuration for the Leaderboard Card builder.
 */
export interface LeaderboardCardConfig extends BaseCardConfig {
  /** Title text (e.g., 'XP Leaderboard'). */
  title: string;
  /** Array of leaderboard entries (users). */
  entries: LeaderboardEntry[];
  /** Maximum entries to display. Defaults to 10. */
  maxEntries: number;
  /** Label for the score column (e.g., 'XP', 'Coins'). */
  scoreLabel: string;
  /** Color of the title text. */
  titleColor: ColorResolvable;
  /** Color of the username text. */
  usernameColor: ColorResolvable;
  /** Color of the score text. */
  scoreColor: ColorResolvable;
  /** Accent color for top-3 highlights. */
  accentColor: ColorResolvable;
  /** Color of divider lines. */
  dividerColor: ColorResolvable;
  /** Color of the rank number. */
  rankColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}

// ---------------------------------------------------------------------------
// Spotify / Now Playing Card
// ---------------------------------------------------------------------------

/**
 * Configuration for the Spotify / Now Playing card builder.
 */
export interface SpotifyCardConfig extends BaseCardConfig {
  /** Song / track title. */
  songTitle: string;
  /** Artist name(s). */
  artist: string;
  /** Album name. */
  album: string;
  /** Album art / cover image. */
  albumArt: ImageResolvable | null;
  /** Size of the album art in pixels. */
  albumArtSize: number;
  /** Elapsed time in milliseconds. */
  elapsed: number;
  /** Total duration in milliseconds. */
  duration: number;
  /** Whether the track is currently playing. */
  isPlaying: boolean;
  /** Color of the song title text. */
  titleColor: ColorResolvable;
  /** Color of the artist text. */
  artistColor: ColorResolvable;
  /** Color of the album text. */
  albumColor: ColorResolvable;
  /** Color of the progress bar fill. */
  progressBarColor: ColorResolvable;
  /** Color of the progress bar track. */
  progressBarTrackColor: ColorResolvable;
  /** Color of the timestamps. */
  timestampColor: ColorResolvable;
  /** Accent color. */
  accentColor: ColorResolvable;
  /** Color theme. */
  theme: ThemeMode;
}
