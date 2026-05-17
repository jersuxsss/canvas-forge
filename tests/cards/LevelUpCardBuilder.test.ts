/**
 * Tests for the LevelUpCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { LevelUpCardBuilder } from '../../src/cards/LevelUpCardBuilder';

function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e94560';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('LevelUpCardBuilder', () => {
  it('should build with default settings', async () => {
    const buffer = await new LevelUpCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should build with full config', async () => {
    const buffer = await new LevelUpCardBuilder()
      .setAvatar(createTestAvatar())
      .setUsername('TestUser')
      .setLevel(10)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support chaining', () => {
    const builder = new LevelUpCardBuilder()
      .setAvatar(createTestAvatar())
      .setAvatarSize(120)
      .setAvatarBorder('#e94560')
      .setAvatarBorderWidth(4)
      .setUsername('User')
      .setLevel(42)
      .setTitleText('Level Up!')
      .setTitleColor('#e94560')
      .setUsernameColor('#ffffff')
      .setLevelColor('#e94560')
      .setTheme('dark');
    expect(builder).toBeInstanceOf(LevelUpCardBuilder);
  });

  it('should build with light theme', async () => {
    const buffer = await new LevelUpCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle level 1', async () => {
    const buffer = await new LevelUpCardBuilder()
      .setLevel(1)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle high levels', async () => {
    const buffer = await new LevelUpCardBuilder()
      .setLevel(999)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
