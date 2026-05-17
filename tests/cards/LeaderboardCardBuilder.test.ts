/**
 * Tests for the LeaderboardCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { LeaderboardCardBuilder } from '../../src/cards/LeaderboardCardBuilder';

/** Generate a minimal test avatar buffer. */
function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('LeaderboardCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new LeaderboardCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new LeaderboardCardBuilder();
    const result = builder
      .setTitle('XP Leaderboard')
      .setScoreLabel('XP')
      .setMaxEntries(5)
      .setTitleColor('#ffffff')
      .setUsernameColor('#cccccc')
      .setScoreColor('#aaaaaa')
      .setAccentColor('#e94560')
      .setDividerColor('#333333')
      .setRankColor('#e94560')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should render entries', async () => {
    const buffer = await new LeaderboardCardBuilder()
      .setTitle('Top Users')
      .addEntry({ rank: 1, username: 'Alice', score: 15000 })
      .addEntry({ rank: 2, username: 'Bob', score: 12000 })
      .addEntry({ rank: 3, username: 'Charlie', score: 9500 })
      .addEntry({ rank: 4, username: 'Dave', score: 7000 })
      .addEntry({ rank: 5, username: 'Eve', score: 5500 })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should render entries with avatars', async () => {
    const avatar = createTestAvatar();
    const buffer = await new LeaderboardCardBuilder()
      .addEntry({ rank: 1, username: 'Alice', score: 15000, avatar })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support setEntries to replace all entries', () => {
    const builder = new LeaderboardCardBuilder();
    builder.addEntry({ rank: 1, username: 'Old', score: 100 });
    builder.setEntries([{ rank: 1, username: 'New', score: 200 }]);
    expect(builder).toBeDefined();
  });

  it('should support light theme', async () => {
    const buffer = await new LeaderboardCardBuilder()
      .setTheme('light')
      .addEntry({ rank: 1, username: 'User', score: 1000 })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should limit entries to maxEntries', async () => {
    const builder = new LeaderboardCardBuilder().setMaxEntries(2);
    for (let i = 1; i <= 5; i++) {
      builder.addEntry({ rank: i, username: `User${i}`, score: 1000 * (6 - i) });
    }
    const buffer = await builder.build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
