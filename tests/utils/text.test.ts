/**
 * Tests for the text utility module.
 */

import { describe, it, expect } from 'vitest';
import { formatNumber, formatRank, buildFontString, centerTextVertically } from '../../src/utils/text';

describe('formatNumber', () => {
  it('should return numbers under 1000 as-is', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('should abbreviate thousands', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(10000)).toBe('10K');
    expect(formatNumber(999999)).toBe('1000K');
  });

  it('should abbreviate millions', () => {
    expect(formatNumber(1000000)).toBe('1M');
    expect(formatNumber(2500000)).toBe('2.5M');
    expect(formatNumber(10000000)).toBe('10M');
  });

  it('should abbreviate billions', () => {
    expect(formatNumber(1000000000)).toBe('1B');
    expect(formatNumber(2500000000)).toBe('2.5B');
  });
});

describe('formatRank', () => {
  it('should format with default prefix', () => {
    expect(formatRank(1)).toBe('#1');
    expect(formatRank(42)).toBe('#42');
    expect(formatRank(100)).toBe('#100');
  });

  it('should support custom prefix', () => {
    expect(formatRank(1, 'No. ')).toBe('No. 1');
    expect(formatRank(5, '')).toBe('5');
  });
});

describe('buildFontString', () => {
  it('should build a font string with defaults', () => {
    expect(buildFontString(16)).toBe('normal 16px sans-serif');
  });

  it('should build with custom family and weight', () => {
    expect(buildFontString(24, 'Arial', 'bold')).toBe('bold 24px Arial');
  });

  it('should handle various sizes', () => {
    expect(buildFontString(12, 'Helvetica')).toBe('normal 12px Helvetica');
    expect(buildFontString(48, 'Impact', 'bold')).toBe('bold 48px Impact');
  });
});

describe('centerTextVertically', () => {
  it('should calculate vertical center', () => {
    expect(centerTextVertically(100, 20)).toBe(60);
    expect(centerTextVertically(200, 30)).toBe(115);
  });

  it('should handle edge cases', () => {
    expect(centerTextVertically(0, 0)).toBe(0);
    expect(centerTextVertically(50, 50)).toBe(50);
  });
});
