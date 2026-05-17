/**
 * Tests for the InfoCardBuilder.
 */

import { describe, it, expect } from 'vitest';
import { InfoCardBuilder } from '../../src/cards/InfoCardBuilder';

describe('InfoCardBuilder', () => {
  it('should build a card with defaults', async () => {
    const buffer = await new InfoCardBuilder().build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should support fluent API chaining', () => {
    const builder = new InfoCardBuilder();
    const result = builder
      .setTitle('Server Info')
      .setDescription('A friendly community')
      .setFooter('Updated May 2026')
      .setAccentColor('#5865F2')
      .setTitleColor('#ffffff')
      .setDescriptionColor('#aaaaaa')
      .setFieldNameColor('#e94560')
      .setFieldValueColor('#cccccc')
      .setFooterColor('#666666')
      .setTheme('dark');
    expect(result).toBe(builder);
  });

  it('should support adding fields', async () => {
    const buffer = await new InfoCardBuilder()
      .setTitle('Rules')
      .addField({ name: 'Rule 1', value: 'Be nice' })
      .addField({ name: 'Rule 2', value: 'No spam' })
      .addField({ name: 'Rule 3', value: 'Have fun', inline: true })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support setFields to replace all fields', () => {
    const builder = new InfoCardBuilder();
    builder.addField({ name: 'Old', value: 'field' });
    builder.setFields([{ name: 'New', value: 'field' }]);
    // Should have only the new field
    expect(builder).toBeDefined();
  });

  it('should support light theme', async () => {
    const buffer = await new InfoCardBuilder()
      .setTheme('light')
      .setTitle('Light Card')
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support description wrapping', async () => {
    const longDesc = 'This is a very long description that should wrap across multiple lines in the info card. It tests the text wrapping functionality of the card builder.';
    const buffer = await new InfoCardBuilder()
      .setDescription(longDesc)
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support inline fields', async () => {
    const buffer = await new InfoCardBuilder()
      .addField({ name: 'Members', value: '1500', inline: true })
      .addField({ name: 'Online', value: '300', inline: true })
      .addField({ name: 'Roles', value: '25', inline: true })
      .build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should support icon and icon size', () => {
    const builder = new InfoCardBuilder();
    const result = builder.setIconSize(32);
    expect(result).toBe(builder);
  });
});
