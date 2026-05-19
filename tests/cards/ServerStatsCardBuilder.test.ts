/**
 * Tests for the ServerStatsCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { ServerStatsCardBuilder } from '../../src/cards/ServerStatsCardBuilder';

/** Generate a minimal test avatar buffer. */
function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ffff';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('ServerStatsCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new ServerStatsCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new ServerStatsCardBuilder();
    const result = builder
      .setGuildName('Gamer Club')
      .setTotalMembers(1500)
      .setOnlineMembers(500)
      .setBoosts(32)
      .setBoostLevel(3)
      .setAccentColor('#5865f2')
      .setTitleColor('#ffffff')
      .setValueColor('#ffffff')
      .setLabelColor('#888888')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should build with guild icon and details', async () => {
    const icon = createTestAvatar();
    const buffer = await new ServerStatsCardBuilder()
      .setGuildIcon(icon)
      .setGuildName('Design Land')
      .setTotalMembers(5000)
      .setOnlineMembers(1200)
      .setBoosts(14)
      .setBoostLevel(2)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support light theme', async () => {
    const buffer = await new ServerStatsCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
