/**
 * Input validation utilities for canvas-forge.
 * Provides type guards and validators for all builder inputs.
 * @module utils/validators
 */

import type { ColorResolvable, ImageResolvable, OutputFormat, StatusType, ThemeMode } from '../types/common';
import { isHexColor } from './colors';

/**
 * Validates that a value is a positive integer.
 * @param value - The value to check.
 * @param name - Parameter name for error messages.
 * @throws Error if the value is not a positive integer.
 */
export function validatePositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`[canvas-forge] "${name}" must be a positive integer, received: ${value}`);
  }
}

/**
 * Validates that a value is a non-negative number.
 * @param value - The value to check.
 * @param name - Parameter name for error messages.
 * @throws Error if the value is negative.
 */
export function validateNonNegative(value: number, name: string): void {
  if (typeof value !== 'number' || value < 0 || isNaN(value)) {
    throw new Error(`[canvas-forge] "${name}" must be a non-negative number, received: ${value}`);
  }
}

/**
 * Validates that a number is within a range.
 * @param value - The value to check.
 * @param min - Minimum value (inclusive).
 * @param max - Maximum value (inclusive).
 * @param name - Parameter name for error messages.
 * @throws Error if the value is out of range.
 */
export function validateRange(value: number, min: number, max: number, name: string): void {
  if (typeof value !== 'number' || value < min || value > max || isNaN(value)) {
    throw new Error(
      `[canvas-forge] "${name}" must be between ${min} and ${max}, received: ${value}`,
    );
  }
}

/**
 * Validates that a string is non-empty.
 * @param value - The string to check.
 * @param name - Parameter name for error messages.
 * @throws Error if the string is empty or not a string.
 */
export function validateNonEmptyString(value: string, name: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`[canvas-forge] "${name}" must be a non-empty string.`);
  }
}

/**
 * Validates a ColorResolvable value.
 * @param color - The color value to validate.
 * @param name - Parameter name for error messages.
 * @returns True if the color is valid.
 * @throws Error if the color format is invalid.
 */
export function validateColor(color: ColorResolvable, name: string): boolean {
  if (typeof color === 'string') {
    // Allow CSS color names and hex colors
    return true;
  }
  if (Array.isArray(color)) {
    if (color.length === 3 || color.length === 4) {
      const allValid = color.every((c) => typeof c === 'number' && c >= 0 && c <= 255);
      if (color.length === 4) {
        const alpha = color[3];
        if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
          throw new Error(`[canvas-forge] "${name}" alpha value must be between 0 and 1.`);
        }
      }
      if (!allValid) {
        throw new Error(
          `[canvas-forge] "${name}" RGB values must be between 0 and 255.`,
        );
      }
      return true;
    }
  }
  throw new Error(`[canvas-forge] "${name}" is not a valid color format.`);
}

/**
 * Validates an ImageResolvable value.
 * @param image - The image source to validate.
 * @param name - Parameter name for error messages.
 * @throws Error if the image source is invalid.
 */
export function validateImage(image: ImageResolvable, name: string): void {
  if (typeof image === 'string' && image.length > 0) { return; }
  if (image instanceof Buffer && image.length > 0) { return; }
  if (image instanceof URL) { return; }
  throw new Error(
    `[canvas-forge] "${name}" must be a non-empty string (URL/path), Buffer, or URL instance.`,
  );
}

/**
 * Validates a ThemeMode value.
 * @param theme - The theme to validate.
 * @param name - Parameter name for error messages.
 * @throws Error if the theme is invalid.
 */
export function validateTheme(theme: ThemeMode, name: string): void {
  const validThemes: ThemeMode[] = ['dark', 'light', 'custom'];
  if (!validThemes.includes(theme)) {
    throw new Error(
      `[canvas-forge] "${name}" must be one of: ${validThemes.join(', ')}. Received: "${theme}"`,
    );
  }
}

/**
 * Validates a StatusType value.
 * @param status - The status to validate.
 * @param name - Parameter name for error messages.
 * @throws Error if the status is invalid.
 */
export function validateStatus(status: StatusType, name: string): void {
  const validStatuses: StatusType[] = ['online', 'idle', 'dnd', 'offline', 'streaming'];
  if (!validStatuses.includes(status)) {
    throw new Error(
      `[canvas-forge] "${name}" must be one of: ${validStatuses.join(', ')}. Received: "${status}"`,
    );
  }
}

/**
 * Validates an OutputFormat value.
 * @param format - The output format to validate.
 * @param name - Parameter name for error messages.
 * @throws Error if the format is invalid.
 */
export function validateOutputFormat(format: OutputFormat, name: string): void {
  const validFormats: OutputFormat[] = ['png', 'jpeg', 'webp'];
  if (!validFormats.includes(format)) {
    throw new Error(
      `[canvas-forge] "${name}" must be one of: ${validFormats.join(', ')}. Received: "${format}"`,
    );
  }
}

/**
 * Validates canvas dimensions.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @throws Error if dimensions are invalid.
 */
export function validateDimensions(width: number, height: number): void {
  validatePositiveInteger(width, 'width');
  validatePositiveInteger(height, 'height');
  if (width > 8192 || height > 8192) {
    throw new Error(
      `[canvas-forge] Canvas dimensions must not exceed 8192x8192. Received: ${width}x${height}`,
    );
  }
}
