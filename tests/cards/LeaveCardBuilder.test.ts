/**
 * Tests for the LeaveCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { LeaveCardBuilder } from '../../src/cards/LeaveCardBuilder';

function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#747f8d';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('LeaveCardBuilder', () => {
  it('should build a card with default settings', async () => {
    const buffer = await new LeaveCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should build with avatar', async () => {
    const avatar = createTestAvatar();
    const buffer = await new LeaveCardBuilder()
      .setAvatar(avatar)
      .setUsername('LeavingUser')
      .setGuildName('Test Server')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support chaining all methods', () => {
    const builder = new LeaveCardBuilder()
      .setAvatar(createTestAvatar())
      .setAvatarSize(200)
      .setAvatarBorder('#747f8d')
      .setAvatarBorderWidth(5)
      .setUsername('User')
      .setDiscriminator('0001')
      .setGuildName('Server')
      .setTitleText('Goodbye!')
      .setSubtitleText('We will miss you...')
      .setTitleColor('#747f8d')
      .setSubtitleColor('#a0a0b0')
      .setUsernameColor('#ffffff')
      .setTheme('dark');
    expect(builder).toBeInstanceOf(LeaveCardBuilder);
  });

  it('should build with light theme', async () => {
    const buffer = await new LeaveCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build as JPEG', async () => {
    const buffer = await new LeaveCardBuilder()
      .setOutputFormat('jpeg')
      .build();
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
  });
});
