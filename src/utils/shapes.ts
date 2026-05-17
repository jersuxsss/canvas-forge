/**
 * Shape drawing utilities for canvas-forge.
 * Provides helpers for rounded rectangles, circles, progress bars, and clipping.
 * @module utils/shapes
 */

import type { SKRSContext2D } from '@napi-rs/canvas';
import type { ColorResolvable } from '../types/common';
import { resolveColor } from './colors';

/**
 * Draws a rounded rectangle on the canvas context.
 * @param ctx - The canvas 2D rendering context.
 * @param x - X position.
 * @param y - Y position.
 * @param width - Width in pixels.
 * @param height - Height in pixels.
 * @param radius - Corner radius in pixels.
 * @param fill - Fill color. If provided, the rectangle is filled.
 * @param stroke - Stroke color. If provided, the rectangle is stroked.
 */
export function drawRoundedRect(
  ctx: SKRSContext2D,
  x: number, y: number, width: number, height: number,
  radius: number, fill?: ColorResolvable, stroke?: ColorResolvable,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = resolveColor(fill);
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = resolveColor(stroke);
    ctx.stroke();
  }
}

/**
 * Draws a filled circle on the canvas context.
 * @param ctx - The canvas 2D rendering context.
 * @param x - Center X position.
 * @param y - Center Y position.
 * @param radius - Circle radius in pixels.
 * @param color - Fill color.
 */
export function drawCircle(
  ctx: SKRSContext2D,
  x: number, y: number, radius: number, color: ColorResolvable,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = resolveColor(color);
  ctx.fill();
}

/**
 * Creates a circular clipping path. Use before drawing an image to clip it to a circle.
 * Remember to call ctx.save() before and ctx.restore() after.
 * @param ctx - The canvas 2D rendering context.
 * @param x - Center X position.
 * @param y - Center Y position.
 * @param radius - Circle radius in pixels.
 */
export function clipCircle(
  ctx: SKRSContext2D, x: number, y: number, radius: number,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
}

/**
 * Draws a horizontal progress bar with customizable colors and radius.
 * @param ctx - The canvas 2D rendering context.
 * @param x - X position of the progress bar.
 * @param y - Y position of the progress bar.
 * @param width - Total width in pixels.
 * @param height - Height in pixels.
 * @param progress - Progress value (0.0 to 1.0).
 * @param fillColor - Color of the filled portion.
 * @param trackColor - Color of the track (unfilled portion).
 * @param radius - Corner radius in pixels. Defaults to half the height.
 */
export function drawProgressBar(
  ctx: SKRSContext2D,
  x: number, y: number, width: number, height: number,
  progress: number, fillColor: ColorResolvable, trackColor: ColorResolvable,
  radius?: number,
): void {
  const r = radius ?? height / 2;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Draw track
  drawRoundedRect(ctx, x, y, width, height, r, trackColor);

  // Draw fill
  const fillWidth = Math.max(height, width * clampedProgress);
  if (clampedProgress > 0) {
    drawRoundedRect(ctx, x, y, fillWidth, height, r, fillColor);
  }
}

/**
 * Draws a circular progress ring.
 * @param ctx - The canvas 2D rendering context.
 * @param x - Center X position.
 * @param y - Center Y position.
 * @param radius - Outer radius in pixels.
 * @param lineWidth - Thickness of the ring in pixels.
 * @param progress - Progress value (0.0 to 1.0).
 * @param fillColor - Color of the filled portion.
 * @param trackColor - Color of the track.
 */
export function drawCircularProgress(
  ctx: SKRSContext2D,
  x: number, y: number, radius: number, lineWidth: number,
  progress: number, fillColor: ColorResolvable, trackColor: ColorResolvable,
): void {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + 2 * Math.PI * clampedProgress;

  // Draw track
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = resolveColor(trackColor);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Draw progress
  if (clampedProgress > 0) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.strokeStyle = resolveColor(fillColor);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

/**
 * Draws an avatar border ring (a colored circle behind an avatar).
 * @param ctx - The canvas 2D rendering context.
 * @param x - Center X position.
 * @param y - Center Y position.
 * @param radius - Avatar radius in pixels.
 * @param borderWidth - Border width in pixels.
 * @param borderColor - Border color.
 */
export function drawAvatarBorder(
  ctx: SKRSContext2D,
  x: number, y: number, radius: number,
  borderWidth: number, borderColor: ColorResolvable,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = resolveColor(borderColor);
  ctx.fill();
}

/**
 * Draws a status indicator dot (used for online/idle/dnd/offline status).
 * @param ctx - The canvas 2D rendering context.
 * @param x - Center X position.
 * @param y - Center Y position.
 * @param radius - Status indicator radius in pixels.
 * @param statusColor - Color of the status dot.
 * @param bgColor - Background color for the cutout ring. Defaults to dark.
 */
export function drawStatusIndicator(
  ctx: SKRSContext2D,
  x: number, y: number, radius: number,
  statusColor: ColorResolvable, bgColor: ColorResolvable = '#1a1a2e',
): void {
  // Background ring (creates a cutout effect)
  drawCircle(ctx, x, y, radius + 3, bgColor);
  // Status dot
  drawCircle(ctx, x, y, radius, statusColor);
}
