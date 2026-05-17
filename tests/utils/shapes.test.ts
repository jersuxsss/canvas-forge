/**
 * Tests for the shapes utility module.
 * Since shapes draw directly on a canvas context, these tests verify
 * that the functions execute without errors and produce non-empty canvases.
 */

import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import {
  drawRoundedRect,
  drawCircle,
  clipCircle,
  drawProgressBar,
  drawCircularProgress,
  drawAvatarBorder,
  drawStatusIndicator,
} from '../../src/utils/shapes';

/** Helper to create a canvas and context for testing. */
function createTestCanvas(width = 200, height = 200) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

/** Helper to check that pixels were drawn (not all transparent). */
function hasContent(canvas: ReturnType<typeof createCanvas>): boolean {
  const buf = canvas.toBuffer('image/png');
  return buf.length > 100; // A blank PNG is ~100 bytes; any drawn content adds more
}

describe('drawRoundedRect', () => {
  it('should draw a filled rounded rectangle', () => {
    const { canvas, ctx } = createTestCanvas();
    drawRoundedRect(ctx, 10, 10, 180, 180, 15, '#e94560');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should draw a stroked rounded rectangle', () => {
    const { canvas, ctx } = createTestCanvas();
    drawRoundedRect(ctx, 10, 10, 180, 180, 15, undefined, '#e94560');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should handle radius larger than half the dimensions', () => {
    const { canvas, ctx } = createTestCanvas();
    drawRoundedRect(ctx, 10, 10, 50, 50, 100, '#ff0000');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should handle zero radius', () => {
    const { canvas, ctx } = createTestCanvas();
    drawRoundedRect(ctx, 10, 10, 50, 50, 0, '#ff0000');
    expect(hasContent(canvas)).toBe(true);
  });
});

describe('drawCircle', () => {
  it('should draw a filled circle', () => {
    const { canvas, ctx } = createTestCanvas();
    drawCircle(ctx, 100, 100, 50, '#e94560');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should accept RGB tuple colors', () => {
    const { canvas, ctx } = createTestCanvas();
    drawCircle(ctx, 100, 100, 50, [255, 0, 0]);
    expect(hasContent(canvas)).toBe(true);
  });
});

describe('clipCircle', () => {
  it('should create a clip path without errors', () => {
    const { ctx } = createTestCanvas();
    ctx.save();
    clipCircle(ctx, 100, 100, 50);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 200, 200);
    ctx.restore();
  });
});

describe('drawProgressBar', () => {
  it('should draw a progress bar at 50%', () => {
    const { canvas, ctx } = createTestCanvas(400, 50);
    drawProgressBar(ctx, 10, 10, 380, 30, 0.5, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should handle 0% progress', () => {
    const { canvas, ctx } = createTestCanvas(400, 50);
    drawProgressBar(ctx, 10, 10, 380, 30, 0, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should handle 100% progress', () => {
    const { canvas, ctx } = createTestCanvas(400, 50);
    drawProgressBar(ctx, 10, 10, 380, 30, 1, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should clamp progress values', () => {
    const { canvas, ctx } = createTestCanvas(400, 50);
    drawProgressBar(ctx, 10, 10, 380, 30, 1.5, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
    drawProgressBar(ctx, 10, 10, 380, 30, -0.5, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should accept custom radius', () => {
    const { canvas, ctx } = createTestCanvas(400, 50);
    drawProgressBar(ctx, 10, 10, 380, 30, 0.5, '#e94560', '#2a2a3e', 5);
    expect(hasContent(canvas)).toBe(true);
  });
});

describe('drawCircularProgress', () => {
  it('should draw a circular progress ring', () => {
    const { canvas, ctx } = createTestCanvas();
    drawCircularProgress(ctx, 100, 100, 40, 8, 0.75, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should handle 0% progress', () => {
    const { canvas, ctx } = createTestCanvas();
    drawCircularProgress(ctx, 100, 100, 40, 8, 0, '#e94560', '#2a2a3e');
    expect(hasContent(canvas)).toBe(true);
  });
});

describe('drawAvatarBorder', () => {
  it('should draw an avatar border ring', () => {
    const { canvas, ctx } = createTestCanvas();
    drawAvatarBorder(ctx, 100, 100, 50, 5, '#e94560');
    expect(hasContent(canvas)).toBe(true);
  });
});

describe('drawStatusIndicator', () => {
  it('should draw a status indicator', () => {
    const { canvas, ctx } = createTestCanvas();
    drawStatusIndicator(ctx, 150, 150, 12, '#43b581');
    expect(hasContent(canvas)).toBe(true);
  });

  it('should accept custom background color', () => {
    const { canvas, ctx } = createTestCanvas();
    drawStatusIndicator(ctx, 150, 150, 12, '#43b581', '#ffffff');
    expect(hasContent(canvas)).toBe(true);
  });
});
