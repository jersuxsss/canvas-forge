/**
 * Tests for the ProfileCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { ProfileCardBuilder } from '../../src/cards/ProfileCardBuilder';

function createTestAvatar(): Buffer {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e94560';
  ctx.fillRect(0, 0, 64, 64);
  return canvas.toBuffer('image/png');
}

describe('ProfileCardBuilder', () => {
  it('should build with default settings', async () => {
    const buffer = await new ProfileCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should build with full config', async () => {
    const buffer = await new ProfileCardBuilder()
      .setAvatar(createTestAvatar())
      .setUsername('TestUser')
      .setDisplayName('Test User')
      .setBio('Hello! I love coding bots.')
      .setLevel(25)
      .setCurrentXP(7500)
      .setRequiredXP(10000)
      .setRank(5)
      .setReputation(420)
      .setStatus('online')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support all setter chaining', () => {
    const builder = new ProfileCardBuilder()
      .setAvatar(createTestAvatar())
      .setAvatarSize(150)
      .setAvatarBorder('#e94560')
      .setAvatarBorderWidth(5)
      .setUsername('User')
      .setDiscriminator('0001')
      .setDisplayName('Cool User')
      .setBio('Some bio text')
      .setBadges([])
      .setLevel(10)
      .setCurrentXP(500)
      .setRequiredXP(1000)
      .setRank(1)
      .setReputation(100)
      .setJoinedAt(new Date())
      .setStatus('idle')
      .setProgressBarColor('#e94560')
      .setProgressBarTrackColor('#2a2a3e')
      .setAccentColor('#e94560')
      .setUsernameColor('#fff')
      .setBioColor('#aaa')
      .setBioAlign('center')
      .setTheme('dark');
    expect(builder).toBeInstanceOf(ProfileCardBuilder);
  });

  it('should build with bio text', async () => {
    const buffer = await new ProfileCardBuilder()
      .setBio('This is a longer bio that should wrap across multiple lines for testing.')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with center-aligned bio', async () => {
    const buffer = await new ProfileCardBuilder()
      .setBio('Centered bio')
      .setBioAlign('center')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with right-aligned bio', async () => {
    const buffer = await new ProfileCardBuilder()
      .setBio('Right bio')
      .setBioAlign('right')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with light theme', async () => {
    const buffer = await new ProfileCardBuilder()
      .setTheme('light')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should build with string joinedAt', async () => {
    const buffer = await new ProfileCardBuilder()
      .setJoinedAt('2024-01-01')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle empty badges array', async () => {
    const buffer = await new ProfileCardBuilder()
      .setBadges([])
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should handle zero reputation', async () => {
    const buffer = await new ProfileCardBuilder()
      .setReputation(0)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
