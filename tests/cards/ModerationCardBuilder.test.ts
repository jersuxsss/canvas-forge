/**
 * Tests for the ModerationCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { ModerationCardBuilder } from '../../src/cards/ModerationCardBuilder';

/** Generate a minimal test avatar buffer. */
function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('ModerationCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new ModerationCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new ModerationCardBuilder();
    const result = builder
      .setAction('ban')
      .setUsername('Jersuxs')
      .setModerator('ModX')
      .setReason('Trolling')
      .setCaseNumber('#104')
      .setAccentColor('#ff0000')
      .setTitleColor('#ffffff')
      .setContentColor('#cccccc')
      .setLabelColor('#ff0000')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should build with avatar and custom action', async () => {
    const avatar = createTestAvatar();
    const buffer = await new ModerationCardBuilder()
      .setAction('mute')
      .setAvatar(avatar)
      .setUsername('Spammer')
      .setModerator('ModBot')
      .setReason('Spamming caps')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support light theme', async () => {
    const buffer = await new ModerationCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
