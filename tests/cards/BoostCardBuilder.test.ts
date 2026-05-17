/**
 * Tests for the BoostCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { BoostCardBuilder } from '../../src/cards/BoostCardBuilder';

/** Generate a minimal test avatar buffer. */
function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('BoostCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new BoostCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new BoostCardBuilder();
    const result = builder
      .setUsername('Jersuxs')
      .setGuildName('My Server')
      .setBoostCount(15)
      .setTitleText('Boosted!')
      .setSubtitleText('{boostCount} boosts now')
      .setTitleColor('#f47fff')
      .setSubtitleColor('#aaaaaa')
      .setUsernameColor('#ffffff')
      .setAccentColor('#f47fff')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should build with an avatar', async () => {
    const avatar = createTestAvatar();
    const buffer = await new BoostCardBuilder()
      .setAvatar(avatar)
      .setUsername('Booster')
      .setBoostCount(5)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support light theme', async () => {
    const buffer = await new BoostCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support avatar customization', () => {
    const builder = new BoostCardBuilder();
    const result = builder
      .setAvatarSize(100)
      .setAvatarBorder('#ff00ff')
      .setAvatarBorderWidth(6);
    expect(result).toBe(builder);
  });

  it('should replace {boostCount} in subtitle', async () => {
    const buffer = await new BoostCardBuilder()
      .setBoostCount(42)
      .setSubtitleText('Server has {boostCount} boosts!')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
