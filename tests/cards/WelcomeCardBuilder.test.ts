/**
 * Tests for the WelcomeCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { WelcomeCardBuilder } from '../../src/cards/WelcomeCardBuilder';

/** Creates a test PNG buffer to use as an avatar. */
function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e94560';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('WelcomeCardBuilder', () => {
  it('should build a card with default settings', async () => {
    const buffer = await new WelcomeCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    // PNG magic bytes
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
  });

  it('should build a card with avatar', async () => {
    const avatar = createTestAvatar();
    const buffer = await new WelcomeCardBuilder()
      .setAvatar(avatar)
      .setUsername('TestUser')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support all setter methods with chaining', () => {
    const avatar = createTestAvatar();
    const builder = new WelcomeCardBuilder()
      .setAvatar(avatar)
      .setAvatarSize(200)
      .setAvatarBorder('#ff0000')
      .setAvatarBorderWidth(6)
      .setUsername('TestUser')
      .setDiscriminator('0001')
      .setGuildName('Test Server')
      .setMemberCount(1500)
      .setTitleText('Welcome!')
      .setSubtitleText('You are member #{memberCount}')
      .setTitleColor('#e94560')
      .setSubtitleColor('#a0a0b0')
      .setUsernameColor('#ffffff')
      .setTheme('dark')
      .setSize(1024, 450)
      .setBackground('#1a1a2e')
      .setOverlay('#000000', 0.3)
      .setOutputFormat('png')
      .setQuality(90);
    expect(builder).toBeInstanceOf(WelcomeCardBuilder);
  });

  it('should build with dark theme', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setTheme('dark')
      .setUsername('DarkUser')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with light theme', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setTheme('light')
      .setUsername('LightUser')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with custom theme', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setTheme('custom')
      .setBackground('#ff00ff')
      .setTitleColor('#00ff00')
      .setUsernameColor('#0000ff')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should replace {memberCount} in subtitle', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setSubtitleText('Member #{memberCount}')
      .setMemberCount(42)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support discriminator display', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setUsername('User')
      .setDiscriminator('1234')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with background gradient', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setBackgroundGradient({ colors: ['#e94560', '#0f3460'], direction: 'horizontal' })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build as JPEG', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setOutputFormat('jpeg')
      .build();
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
  });

  it('should build with custom size', async () => {
    const buffer = await new WelcomeCardBuilder()
      .setSize(500, 300)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
