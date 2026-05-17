/**
 * Common type definitions shared across all canvas-forge modules.
 *
 * @module types/common
 */

/**
 * A color that can be resolved into a valid canvas color.
 * Supports hex strings, RGB tuples, RGBA tuples, and named CSS colors.
 *
 * @example
 * ```typescript
 * const hex: ColorResolvable = '#e94560';
 * const rgb: ColorResolvable = [233, 69, 96];
 * const rgba: ColorResolvable = [233, 69, 96, 0.8];
 * const named: ColorResolvable = 'red';
 * ```
 */
export type ColorResolvable =
  | string
  | [red: number, green: number, blue: number]
  | [red: number, green: number, blue: number, alpha: number];

/**
 * An image source that can be resolved into canvas image data.
 * Supports URL strings, file paths, Buffer objects, and URL instances.
 *
 * @example
 * ```typescript
 * const url: ImageResolvable = 'https://example.com/avatar.png';
 * const path: ImageResolvable = './images/background.png';
 * const buffer: ImageResolvable = fs.readFileSync('./avatar.png');
 * ```
 */
export type ImageResolvable = string | Buffer | URL;

/**
 * Visual theme mode for card rendering.
 * - `dark` — Dark background with light text (default)
 * - `light` — Light background with dark text
 * - `custom` — Fully custom colors (you control everything)
 */
export type ThemeMode = 'dark' | 'light' | 'custom';

/**
 * Discord user status types for visual indicators.
 */
export type StatusType = 'online' | 'idle' | 'dnd' | 'offline' | 'streaming';

/**
 * Output image format for the rendered card.
 */
export type OutputFormat = 'png' | 'jpeg' | 'webp';

/**
 * Font weight options for text rendering.
 */
export type FontWeight = 'normal' | 'bold' | 'light' | 'extra-bold';

/**
 * Text alignment options.
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Gradient direction for background or element fills.
 */
export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

/**
 * Defines a gradient with colors and optional direction.
 *
 * @example
 * ```typescript
 * const gradient: GradientData = {
 *   colors: ['#e94560', '#0f3460'],
 *   direction: 'horizontal',
 * };
 * ```
 */
export interface GradientData {
  /** Array of color stops. Minimum 2 colors required. */
  colors: ColorResolvable[];
  /** Direction of the gradient. Defaults to 'horizontal'. */
  direction?: GradientDirection;
}

/**
 * Configuration for rendering text on the canvas.
 */
export interface TextOptions {
  /** The text content to render. */
  content: string;
  /** X position of the text. */
  x: number;
  /** Y position of the text. */
  y: number;
  /** Font size in pixels. */
  fontSize?: number;
  /** Font family name. */
  fontFamily?: string;
  /** Font weight. */
  fontWeight?: FontWeight;
  /** Text color. */
  color?: ColorResolvable;
  /** Text alignment. */
  align?: TextAlign;
  /** Maximum width for text wrapping (in pixels). */
  maxWidth?: number;
  /** Line height multiplier. Defaults to 1.2. */
  lineHeight?: number;
}

/**
 * Configuration for rendering an image on the canvas.
 */
export interface ImageOptions {
  /** The image source to render. */
  source: ImageResolvable;
  /** X position of the image. */
  x: number;
  /** Y position of the image. */
  y: number;
  /** Width of the image. If omitted, uses the original width. */
  width?: number;
  /** Height of the image. If omitted, uses the original height. */
  height?: number;
  /** Whether to render the image as a circle (clips to circular shape). */
  circular?: boolean;
  /** Border radius for rounded corners (ignored if circular is true). */
  borderRadius?: number;
}

/**
 * Discord brand color constants.
 */
export const DiscordColors = {
  /** Discord Blurple (#5865F2) */
  BLURPLE: '#5865F2',
  /** Discord Green (#57F287) */
  GREEN: '#57F287',
  /** Discord Yellow (#FEE75C) */
  YELLOW: '#FEE75C',
  /** Discord Fuchsia (#EB459E) */
  FUCHSIA: '#EB459E',
  /** Discord Red (#ED4245) */
  RED: '#ED4245',
  /** Discord White (#FFFFFF) */
  WHITE: '#FFFFFF',
  /** Discord Black (#23272A) */
  BLACK: '#23272A',
  /** Discord Dark But Not Black (#2C2F33) */
  DARK_BUT_NOT_BLACK: '#2C2F33',
  /** Discord Not Quite Black (#23272A) */
  NOT_QUITE_BLACK: '#23272A',
  /** Discord Greyple (#99AAB5) */
  GREYPLE: '#99AAB5',
  /** Discord Background Dark (#1a1a2e) */
  BACKGROUND_DARK: '#1a1a2e',
  /** Discord Background Light (#f5f5f5) */
  BACKGROUND_LIGHT: '#f5f5f5',
} as const;

/**
 * Discord status color mapping.
 */
export const StatusColors: Record<StatusType, string> = {
  online: '#43b581',
  idle: '#faa61a',
  dnd: '#f04747',
  offline: '#747f8d',
  streaming: '#593695',
} as const;

/**
 * Default dimensions for various card types.
 */
export const DefaultDimensions = {
  WELCOME: { width: 1024, height: 450 },
  LEAVE: { width: 1024, height: 450 },
  RANK: { width: 934, height: 282 },
  LEVEL_UP: { width: 600, height: 200 },
  PROFILE: { width: 800, height: 600 },
} as const;
