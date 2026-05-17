/**
 * Spotify / Now Playing Card Builder for canvas-forge.
 * Creates music "Now Playing" cards with album art and progress bar.
 * @module cards/SpotifyCardBuilder
 */

import { BaseCanvas } from '../core/BaseCanvas';
import type { SpotifyCardConfig } from '../types/cards';
import type { ColorResolvable, ImageResolvable, ThemeMode } from '../types/common';
import { DefaultDimensions } from '../types/common';
import { resolveColor } from '../utils/colors';
import { buildFontString, truncateText } from '../utils/text';
import { drawRoundedRect, drawProgressBar } from '../utils/shapes';
import { loadImage } from '../core/ImageLoader';

/**
 * Formats milliseconds into a mm:ss string.
 * @param ms - Duration in milliseconds.
 * @returns Formatted time string.
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const DEFAULT_CONFIG: SpotifyCardConfig = {
  width: DefaultDimensions.SPOTIFY.width,
  height: DefaultDimensions.SPOTIFY.height,
  background: '#191414',
  backgroundIsImage: false,
  overlayColor: '#000000',
  overlayOpacity: 0,
  outputFormat: 'png',
  quality: 90,
  songTitle: 'Unknown Track',
  artist: 'Unknown Artist',
  album: '',
  albumArt: null,
  albumArtSize: 160,
  elapsed: 0,
  duration: 200000,
  isPlaying: true,
  titleColor: '#ffffff',
  artistColor: '#b3b3b3',
  albumColor: '#808080',
  progressBarColor: '#1DB954',
  progressBarTrackColor: '#404040',
  timestampColor: '#b3b3b3',
  accentColor: '#1DB954',
  theme: 'dark',
};

/**
 * Builder for creating Spotify-style "Now Playing" cards.
 *
 * Displays album art, song title, artist, album name, and a playback
 * progress bar with timestamps.
 *
 * @example
 * ```typescript
 * import { SpotifyCardBuilder } from 'canvas-forge';
 *
 * const card = await new SpotifyCardBuilder()
 *   .setSongTitle('Blinding Lights')
 *   .setArtist('The Weeknd')
 *   .setAlbum('After Hours')
 *   .setAlbumArt('https://example.com/cover.jpg')
 *   .setElapsed(90000)
 *   .setDuration(200000)
 *   .build();
 * ```
 */
export class SpotifyCardBuilder extends BaseCanvas<SpotifyCardConfig> {
  constructor() {
    super({ ...DEFAULT_CONFIG });
  }

  /** Sets the song title. */
  public setSongTitle(title: string): this { this.config.songTitle = title; return this; }
  /** Sets the artist name. */
  public setArtist(artist: string): this { this.config.artist = artist; return this; }
  /** Sets the album name. */
  public setAlbum(album: string): this { this.config.album = album; return this; }
  /** Sets the album art image. */
  public setAlbumArt(source: ImageResolvable): this { this.config.albumArt = source; return this; }
  /** Sets the album art size in pixels. */
  public setAlbumArtSize(size: number): this { this.config.albumArtSize = size; return this; }
  /** Sets elapsed time in milliseconds. */
  public setElapsed(ms: number): this { this.config.elapsed = ms; return this; }
  /** Sets total duration in milliseconds. */
  public setDuration(ms: number): this { this.config.duration = ms; return this; }
  /** Sets whether the track is currently playing. */
  public setIsPlaying(playing: boolean): this { this.config.isPlaying = playing; return this; }
  /** Sets the song title color. */
  public setTitleColor(color: ColorResolvable): this { this.config.titleColor = color; return this; }
  /** Sets the artist text color. */
  public setArtistColor(color: ColorResolvable): this { this.config.artistColor = color; return this; }
  /** Sets the album text color. */
  public setAlbumColor(color: ColorResolvable): this { this.config.albumColor = color; return this; }
  /** Sets the progress bar fill color. */
  public setProgressBarColor(color: ColorResolvable): this { this.config.progressBarColor = color; return this; }
  /** Sets the progress bar track color. */
  public setProgressBarTrackColor(color: ColorResolvable): this { this.config.progressBarTrackColor = color; return this; }
  /** Sets the timestamp text color. */
  public setTimestampColor(color: ColorResolvable): this { this.config.timestampColor = color; return this; }
  /** Sets the accent color. */
  public setAccentColor(color: ColorResolvable): this { this.config.accentColor = color; return this; }

  /** Sets the color theme ('dark', 'light', or 'custom'). */
  public setTheme(theme: ThemeMode): this {
    this.config.theme = theme;
    if (theme === 'dark') {
      this.config.background = '#191414';
      this.config.titleColor = '#ffffff';
      this.config.artistColor = '#b3b3b3';
      this.config.albumColor = '#808080';
      this.config.progressBarTrackColor = '#404040';
    } else if (theme === 'light') {
      this.config.background = '#f5f5f5';
      this.config.titleColor = '#191414';
      this.config.artistColor = '#555555';
      this.config.albumColor = '#888888';
      this.config.progressBarTrackColor = '#dcdcdc';
    }
    return this;
  }

  /** Renders the Spotify card content. */
  protected async _render(): Promise<void> {
    const { width, height } = this.config;
    const padding = 25;

    // Inner card panel
    drawRoundedRect(
      this.ctx, padding, padding, width - padding * 2, height - padding * 2,
      16, 'rgba(0, 0, 0, 0.25)',
    );

    // Album art
    const artSize = this.config.albumArtSize;
    const artX = padding + 25;
    const artY = (height - artSize) / 2;
    if (this.config.albumArt) {
      try {
        const img = await loadImage(this.config.albumArt);
        // Draw with rounded corners
        this.ctx.save();
        const artRadius = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(artX + artRadius, artY);
        this.ctx.lineTo(artX + artSize - artRadius, artY);
        this.ctx.quadraticCurveTo(artX + artSize, artY, artX + artSize, artY + artRadius);
        this.ctx.lineTo(artX + artSize, artY + artSize - artRadius);
        this.ctx.quadraticCurveTo(artX + artSize, artY + artSize, artX + artSize - artRadius, artY + artSize);
        this.ctx.lineTo(artX + artRadius, artY + artSize);
        this.ctx.quadraticCurveTo(artX, artY + artSize, artX, artY + artSize - artRadius);
        this.ctx.lineTo(artX, artY + artRadius);
        this.ctx.quadraticCurveTo(artX, artY, artX + artRadius, artY);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(img, artX, artY, artSize, artSize);
        this.ctx.restore();
      } catch {
        // Draw placeholder
        drawRoundedRect(this.ctx, artX, artY, artSize, artSize, 8, '#282828');
      }
    } else {
      drawRoundedRect(this.ctx, artX, artY, artSize, artSize, 8, '#282828');
    }

    // Text area
    const textX = artX + artSize + 25;
    const maxTextWidth = width - textX - padding - 20;

    // Song title
    this.ctx.textAlign = 'left';
    this.ctx.font = buildFontString(22, 'sans-serif', 'bold');
    this.ctx.fillStyle = resolveColor(this.config.titleColor);
    this.ctx.fillText(truncateText(this.ctx, this.config.songTitle, maxTextWidth), textX, artY + 30);

    // Artist
    this.ctx.font = buildFontString(16, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.artistColor);
    this.ctx.fillText(truncateText(this.ctx, this.config.artist, maxTextWidth), textX, artY + 55);

    // Album
    if (this.config.album) {
      this.ctx.font = buildFontString(13, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.albumColor);
      this.ctx.fillText(truncateText(this.ctx, this.config.album, maxTextWidth), textX, artY + 78);
    }

    // Progress bar
    const barY = artY + artSize - 30;
    const barWidth = maxTextWidth;
    const progress = this.config.duration > 0
      ? Math.min(1, this.config.elapsed / this.config.duration) : 0;

    drawProgressBar(
      this.ctx, textX, barY, barWidth, 6,
      progress, this.config.progressBarColor, this.config.progressBarTrackColor, 3,
    );

    // Timestamps
    this.ctx.font = buildFontString(11, 'sans-serif', 'normal');
    this.ctx.fillStyle = resolveColor(this.config.timestampColor);
    this.ctx.textAlign = 'left';
    this.ctx.fillText(formatTime(this.config.elapsed), textX, barY + 18);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(formatTime(this.config.duration), textX + barWidth, barY + 18);

    // Playing indicator
    if (this.config.isPlaying) {
      const indicatorX = textX + barWidth / 2;
      const indicatorY = barY + 17;
      this.ctx.textAlign = 'center';
      this.ctx.font = buildFontString(10, 'sans-serif', 'normal');
      this.ctx.fillStyle = resolveColor(this.config.accentColor);
      this.ctx.fillText('▶ PLAYING', indicatorX, indicatorY);
    }
  }
}
