/**
 * Tests for BaseCanvas (tested through a concrete subclass).
 */

import { describe, it, expect } from 'vitest';
import { BaseCanvas } from '../../src/core/BaseCanvas';
import type { BaseCardConfig } from '../../src/types/cards';

/** Minimal concrete implementation of BaseCanvas for testing. */
class TestCanvas extends BaseCanvas<BaseCardConfig> {
  public renderCalled = false;

  constructor() {
    super({
      width: 200,
      height: 200,
      background: '#1a1a2e',
      backgroundIsImage: false,
      overlayColor: '#000000',
      overlayOpacity: 0,
      outputFormat: 'png',
      quality: 90,
    });
  }

  protected _render(): Promise<void> {
    this.renderCalled = true;
    // Draw something simple
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(10, 10, 50, 50);
    return Promise.resolve();
  }
}

describe('BaseCanvas', () => {
  it('should build a card with default settings', async () => {
    const canvas = new TestCanvas();
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should call _render during build', async () => {
    const canvas = new TestCanvas();
    await canvas.build();
    expect(canvas.renderCalled).toBe(true);
  });

  it('should set size via chaining', async () => {
    const canvas = new TestCanvas();
    const result = canvas.setSize(400, 300);
    expect(result).toBe(canvas);
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should throw for invalid dimensions', () => {
    const canvas = new TestCanvas();
    expect(() => canvas.setSize(0, 100)).toThrow('[canvas-forge]');
  });

  it('should set background color', async () => {
    const canvas = new TestCanvas();
    canvas.setBackground('#ff0000');
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should set gradient background', async () => {
    const canvas = new TestCanvas();
    canvas.setBackgroundGradient({ colors: ['#e94560', '#0f3460'], direction: 'horizontal' });
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should set overlay', async () => {
    const canvas = new TestCanvas();
    canvas.setOverlay('#000000', 0.5);
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should throw for invalid overlay opacity', () => {
    const canvas = new TestCanvas();
    expect(() => canvas.setOverlay('#000000', 1.5)).toThrow('[canvas-forge]');
    expect(() => canvas.setOverlay('#000000', -0.1)).toThrow('[canvas-forge]');
  });

  it('should set output format', async () => {
    const canvas = new TestCanvas();
    canvas.setOutputFormat('jpeg');
    const buffer = await canvas.build();
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
  });

  it('should set quality', () => {
    const canvas = new TestCanvas();
    const result = canvas.setQuality(50);
    expect(result).toBe(canvas);
  });

  it('should throw for invalid quality', () => {
    const canvas = new TestCanvas();
    expect(() => canvas.setQuality(0)).toThrow('[canvas-forge]');
    expect(() => canvas.setQuality(101)).toThrow('[canvas-forge]');
  });

  it('should support method chaining', () => {
    const canvas = new TestCanvas();
    const result = canvas
      .setSize(400, 300)
      .setBackground('#1a1a2e')
      .setOverlay('#000000', 0.3)
      .setOutputFormat('png')
      .setQuality(80);
    expect(result).toBe(canvas);
  });

  it('should produce a PNG by default', async () => {
    const canvas = new TestCanvas();
    const buffer = await canvas.build();
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
  });

  it('should produce WebP when configured', async () => {
    const canvas = new TestCanvas();
    canvas.setOutputFormat('webp');
    const buffer = await canvas.build();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
