/**
 * Tests for the SpotifyCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { SpotifyCardBuilder } from '../../src/cards/SpotifyCardBuilder';

/** Generate a minimal test album art buffer. */
function createTestAlbumArt(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1DB954';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('SpotifyCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new SpotifyCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new SpotifyCardBuilder();
    const result = builder
      .setSongTitle('Blinding Lights')
      .setArtist('The Weeknd')
      .setAlbum('After Hours')
      .setElapsed(90000)
      .setDuration(200000)
      .setIsPlaying(true)
      .setTitleColor('#ffffff')
      .setArtistColor('#b3b3b3')
      .setAlbumColor('#808080')
      .setProgressBarColor('#1DB954')
      .setProgressBarTrackColor('#404040')
      .setTimestampColor('#b3b3b3')
      .setAccentColor('#1DB954')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should build with album art', async () => {
    const art = createTestAlbumArt();
    const buffer = await new SpotifyCardBuilder()
      .setSongTitle('Test Song')
      .setArtist('Test Artist')
      .setAlbumArt(art)
      .setElapsed(60000)
      .setDuration(180000)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support album art size customization', () => {
    const builder = new SpotifyCardBuilder();
    const result = builder.setAlbumArtSize(200);
    expect(result).toBe(builder);
  });

  it('should support light theme', async () => {
    const buffer = await new SpotifyCardBuilder()
      .setTheme('light')
      .setSongTitle('Light Mode Song')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle zero duration', async () => {
    const buffer = await new SpotifyCardBuilder()
      .setDuration(0)
      .setElapsed(0)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle paused state', async () => {
    const buffer = await new SpotifyCardBuilder()
      .setIsPlaying(false)
      .setSongTitle('Paused Song')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle no album name', async () => {
    const buffer = await new SpotifyCardBuilder()
      .setSongTitle('Single')
      .setArtist('Artist')
      .setAlbum('')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
