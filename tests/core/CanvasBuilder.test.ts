/**
 * Tests for the CanvasBuilder module.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { CanvasBuilder } from '../../src/core/CanvasBuilder';

function createTestPngBuffer(): Buffer {
  const canvas = createCanvas(10, 10);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 10, 10);
  return canvas.toBuffer('image/png');
}

describe('CanvasBuilder', () => {
  it('should create a canvas with specified dimensions', () => {
    const builder = new CanvasBuilder(800, 400);
    expect(builder.width).toBe(800);
    expect(builder.height).toBe(400);
  });

  it('should throw for invalid dimensions', () => {
    expect(() => new CanvasBuilder(0, 400)).toThrow('[canvas-forge]');
    expect(() => new CanvasBuilder(800, -1)).toThrow('[canvas-forge]');
    expect(() => new CanvasBuilder(9000, 100)).toThrow('[canvas-forge]');
  });

  it('should set a solid background', () => {
    const builder = new CanvasBuilder(100, 100);
    const result = builder.setBackground('#1a1a2e');
    expect(result).toBe(builder); // Check chaining
  });

  it('should set a gradient background', () => {
    const builder = new CanvasBuilder(100, 100);
    const result = builder.setBackgroundGradient({
      colors: ['#e94560', '#0f3460'],
      direction: 'horizontal',
    });
    expect(result).toBe(builder);
  });

  it('should draw rectangles', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawRect(10, 10, 180, 180, '#ff0000');
    expect(result).toBe(builder);
  });

  it('should draw rounded rectangles', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawRect(10, 10, 180, 180, '#ff0000', 15);
    expect(result).toBe(builder);
  });

  it('should draw circles', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawCircleShape(100, 100, 50, '#e94560');
    expect(result).toBe(builder);
  });

  it('should set font', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.setFont(24, 'Arial', 'bold');
    expect(result).toBe(builder);
  });

  it('should draw text', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder
      .setFont(16)
      .drawText('Hello', 10, 30, '#ffffff');
    expect(result).toBe(builder);
  });

  it('should draw wrapped text', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder
      .setFont(16)
      .drawWrappedText('Hello world this is a long text', 10, 30, '#ffffff', 100);
    expect(result).toBe(builder);
  });

  it('should draw progress bars', () => {
    const builder = new CanvasBuilder(400, 50);
    const result = builder.drawProgressBar(10, 10, 380, 30, 0.5, '#e94560', '#2a2a3e');
    expect(result).toBe(builder);
  });

  it('should output a PNG buffer by default', () => {
    const buffer = new CanvasBuilder(100, 100)
      .setBackground('#1a1a2e')
      .toBuffer();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    // PNG magic bytes
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50); // 'P'
    expect(buffer[2]).toBe(0x4e); // 'N'
    expect(buffer[3]).toBe(0x47); // 'G'
  });

  it('should output a JPEG buffer', () => {
    const buffer = new CanvasBuilder(100, 100)
      .setBackground('#1a1a2e')
      .setOutputFormat('jpeg')
      .toBuffer();
    expect(buffer).toBeInstanceOf(Buffer);
    // JPEG magic bytes
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
  });

  it('should output a WebP buffer', () => {
    const buffer = new CanvasBuilder(100, 100)
      .setBackground('#1a1a2e')
      .setOutputFormat('webp')
      .toBuffer();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should draw images from buffer', async () => {
    const imgBuffer = createTestPngBuffer();
    const builder = new CanvasBuilder(100, 100);
    const result = await builder.drawImage(imgBuffer, 0, 0, 50, 50);
    expect(result).toBe(builder);
  });

  it('should draw circular images from buffer', async () => {
    const imgBuffer = createTestPngBuffer();
    const builder = new CanvasBuilder(100, 100);
    const result = await builder.drawCircularImage(imgBuffer, 50, 50, 40);
    expect(result).toBe(builder);
  });

  it('should expose the raw context', () => {
    const builder = new CanvasBuilder(100, 100);
    const ctx = builder.getContext();
    expect(ctx).toBeDefined();
    expect(typeof ctx.fillRect).toBe('function');
  });

  it('should support method chaining throughout', () => {
    const buffer = new CanvasBuilder(200, 200)
      .setBackground('#1a1a2e')
      .drawRect(10, 10, 50, 50, '#ff0000')
      .drawRect(60, 10, 50, 50, '#00ff00', 10)
      .drawCircleShape(100, 100, 30, '#0000ff')
      .setFont(16, 'sans-serif', 'bold')
      .drawText('Test', 10, 180, '#ffffff')
      .drawProgressBar(10, 150, 180, 10, 0.7, '#e94560', '#333')
      .setOutputFormat('png')
      .setOutputQuality(90)
      .toBuffer();

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  // ── New methods (v1.1.0) ──

  it('should draw lines', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawLine(0, 0, 200, 200, '#ff0000', 3);
    expect(result).toBe(builder);
  });

  it('should draw polygons', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawPolygon(
      [[100, 10], [190, 190], [10, 190]],
      '#ff0000',
    );
    expect(result).toBe(builder);
  });

  it('should draw polygons with stroke', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawPolygon(
      [[100, 10], [190, 190], [10, 190]],
      '#ff0000', '#ffffff', 2,
    );
    expect(result).toBe(builder);
  });

  it('should skip polygons with fewer than 3 points', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawPolygon([[0, 0], [1, 1]], '#ff0000');
    expect(result).toBe(builder);
  });

  it('should draw gradient rectangles', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawGradientRect(10, 10, 180, 180, {
      colors: ['#e94560', '#0f3460'],
      direction: 'horizontal',
    });
    expect(result).toBe(builder);
  });

  it('should draw gradient rectangles with radius', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawGradientRect(10, 10, 180, 180, {
      colors: ['#e94560', '#0f3460'],
    }, 15);
    expect(result).toBe(builder);
  });

  it('should draw bordered rectangles', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawBorderedRect(10, 10, 180, 180, '#e94560', 3);
    expect(result).toBe(builder);
  });

  it('should draw bordered rectangles with radius', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawBorderedRect(10, 10, 180, 180, '#e94560', 3, 10);
    expect(result).toBe(builder);
  });

  it('should draw arcs', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder.drawArc(100, 100, 50, 0, Math.PI, '#e94560', 3);
    expect(result).toBe(builder);
  });

  it('should manage shadows', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder
      .drawShadow('rgba(0,0,0,0.5)', 10, 4, 4)
      .drawRect(50, 50, 100, 100, '#ff0000')
      .clearShadow();
    expect(result).toBe(builder);
  });

  it('should manage global alpha', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder
      .setGlobalAlpha(0.5)
      .drawRect(0, 0, 200, 200, '#ff0000')
      .resetGlobalAlpha();
    expect(result).toBe(builder);
  });

  it('should clamp global alpha to 0-1', () => {
    const builder = new CanvasBuilder(200, 200);
    builder.setGlobalAlpha(2.0); // Should clamp to 1
    builder.setGlobalAlpha(-1.0); // Should clamp to 0
    expect(builder).toBeDefined();
  });

  it('should support save and restore', () => {
    const builder = new CanvasBuilder(200, 200);
    const result = builder
      .save()
      .setGlobalAlpha(0.5)
      .drawRect(0, 0, 100, 100, '#ff0000')
      .restore();
    expect(result).toBe(builder);
  });

  it('should chain all new methods together', () => {
    const buffer = new CanvasBuilder(400, 400)
      .setBackground('#1a1a2e')
      .drawShadow()
      .drawGradientRect(20, 20, 360, 360, { colors: ['#e94560', '#0f3460'] }, 15)
      .clearShadow()
      .drawLine(30, 200, 370, 200, '#ffffff', 1)
      .setGlobalAlpha(0.7)
      .drawPolygon([[200, 50], [350, 150], [200, 250], [50, 150]], '#5865F2')
      .resetGlobalAlpha()
      .drawBorderedRect(50, 300, 300, 50, '#e94560', 2, 8)
      .drawArc(200, 200, 80, 0, Math.PI * 1.5, '#f47fff', 4)
      .toBuffer();

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});

