/**
 * Tests for the RankCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { RankCardBuilder } from '../../src/cards/RankCardBuilder';

function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e94560';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('RankCardBuilder', () => {
  it('should build with default settings', async () => {
    const buffer = await new RankCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should build with full config', async () => {
    const buffer = await new RankCardBuilder()
      .setAvatar(createTestAvatar())
      .setUsername('TestUser')
      .setLevel(15)
      .setCurrentXP(2500)
      .setRequiredXP(5000)
      .setRank(3)
      .setStatus('online')
      .setProgressBarColor('#e94560')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support all setter chaining', () => {
    const builder = new RankCardBuilder()
      .setAvatar(createTestAvatar())
      .setAvatarSize(150)
      .setAvatarBorder('#e94560')
      .setAvatarBorderWidth(4)
      .setUsername('User')
      .setDiscriminator('0001')
      .setLevel(10)
      .setCurrentXP(500)
      .setRequiredXP(1000)
      .setRank(1)
      .setProgressBarColor('#e94560')
      .setProgressBarTrackColor('#2a2a3e')
      .setProgressBarHeight(25)
      .setStatus('dnd')
      .setStatusColor('#ff0000')
      .setUsernameColor('#fff')
      .setLevelColor('#e94560')
      .setXPColor('#aaa')
      .setRankColor('#fff')
      .setTheme('dark');
    expect(builder).toBeInstanceOf(RankCardBuilder);
  });

  it('should handle various status types', async () => {
    for (const status of ['online', 'idle', 'dnd', 'offline', 'streaming'] as const) {
      const buffer = await new RankCardBuilder()
        .setAvatar(createTestAvatar())
        .setStatus(status)
        .build();
      expect(buffer).toBeInstanceOf(Buffer);
    }
  });

  it('should handle zero XP', async () => {
    const buffer = await new RankCardBuilder()
      .setCurrentXP(0)
      .setRequiredXP(100)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle maxed XP', async () => {
    const buffer = await new RankCardBuilder()
      .setCurrentXP(5000)
      .setRequiredXP(5000)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with light theme', async () => {
    const buffer = await new RankCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
