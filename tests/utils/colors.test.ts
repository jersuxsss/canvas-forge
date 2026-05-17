/**
 * Tests for the color utility module.
 */

import { describe, it, expect } from 'vitest';
import {
  resolveColor,
  hexToRgba,
  rgbaToHex,
  darken,
  lighten,
  withOpacity,
  isHexColor,
  createGradientStops,
  getGradientCoords,
} from '../../src/utils/colors';

describe('resolveColor', () => {
  it('should return string colors as-is', () => {
    expect(resolveColor('#e94560')).toBe('#e94560');
    expect(resolveColor('red')).toBe('red');
    expect(resolveColor('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('should convert RGB tuples', () => {
    expect(resolveColor([233, 69, 96])).toBe('rgb(233, 69, 96)');
    expect(resolveColor([0, 0, 0])).toBe('rgb(0, 0, 0)');
    expect(resolveColor([255, 255, 255])).toBe('rgb(255, 255, 255)');
  });

  it('should convert RGBA tuples', () => {
    expect(resolveColor([233, 69, 96, 0.5])).toBe('rgba(233, 69, 96, 0.5)');
    expect(resolveColor([0, 0, 0, 1])).toBe('rgba(0, 0, 0, 1)');
  });

  it('should throw on invalid color formats', () => {
    // @ts-expect-error Testing invalid input
    expect(() => resolveColor(12345)).toThrow('[canvas-forge]');
    // @ts-expect-error Testing invalid input
    expect(() => resolveColor([1])).toThrow('[canvas-forge]');
  });
});

describe('hexToRgba', () => {
  it('should parse 6-char hex colors', () => {
    expect(hexToRgba('#e94560')).toEqual({ r: 233, g: 69, b: 96, a: 1 });
    expect(hexToRgba('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hexToRgba('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('should parse 3-char shorthand hex colors', () => {
    expect(hexToRgba('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgba('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(hexToRgba('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('should parse 8-char hex with alpha', () => {
    const result = hexToRgba('#e9456080');
    expect(result.r).toBe(233);
    expect(result.g).toBe(69);
    expect(result.b).toBe(96);
    expect(result.a).toBeCloseTo(0.502, 2);
  });

  it('should handle without # prefix', () => {
    expect(hexToRgba('e94560')).toEqual({ r: 233, g: 69, b: 96, a: 1 });
  });

  it('should throw on invalid hex', () => {
    expect(() => hexToRgba('#xyz')).toThrow('[canvas-forge]');
    expect(() => hexToRgba('#12')).toThrow('[canvas-forge]');
    expect(() => hexToRgba('#1234567890')).toThrow('[canvas-forge]');
  });
});

describe('rgbaToHex', () => {
  it('should convert RGB to hex', () => {
    expect(rgbaToHex(233, 69, 96)).toBe('#e94560');
    expect(rgbaToHex(0, 0, 0)).toBe('#000000');
    expect(rgbaToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('should include alpha when < 1', () => {
    const result = rgbaToHex(233, 69, 96, 0.5);
    expect(result).toMatch(/^#e94560/);
    expect(result.length).toBe(9); // #RRGGBBAA
  });

  it('should clamp values to 0-255', () => {
    expect(rgbaToHex(300, -10, 128)).toBe('#ff0080');
  });
});

describe('darken', () => {
  it('should darken a color', () => {
    const result = darken('#ffffff', 50);
    expect(result).toBe('#808080');
  });

  it('should return black at 100%', () => {
    expect(darken('#ffffff', 100)).toBe('#000000');
  });

  it('should return original at 0%', () => {
    expect(darken('#e94560', 0)).toBe('#e94560');
  });
});

describe('lighten', () => {
  it('should lighten a color', () => {
    const result = lighten('#000000', 50);
    expect(result).toBe('#808080');
  });

  it('should return white at 100%', () => {
    expect(lighten('#000000', 100)).toBe('#ffffff');
  });

  it('should return original at 0%', () => {
    expect(lighten('#e94560', 0)).toBe('#e94560');
  });
});

describe('withOpacity', () => {
  it('should add opacity to a color', () => {
    expect(withOpacity('#e94560', 0.5)).toBe('rgba(233, 69, 96, 0.5)');
  });

  it('should clamp opacity to 0-1', () => {
    expect(withOpacity('#e94560', 1.5)).toBe('rgba(233, 69, 96, 1)');
    expect(withOpacity('#e94560', -0.5)).toBe('rgba(233, 69, 96, 0)');
  });
});

describe('isHexColor', () => {
  it('should validate correct hex colors', () => {
    expect(isHexColor('#e94560')).toBe(true);
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#AABBCC')).toBe(true);
    expect(isHexColor('#aabb')).toBe(true); // 4-char
    expect(isHexColor('#aabbccdd')).toBe(true); // 8-char
  });

  it('should reject invalid hex colors', () => {
    expect(isHexColor('e94560')).toBe(false); // Missing #
    expect(isHexColor('#xyz')).toBe(false);
    expect(isHexColor('#12')).toBe(false);
    expect(isHexColor('red')).toBe(false);
    expect(isHexColor('')).toBe(false);
  });
});

describe('createGradientStops', () => {
  it('should create evenly distributed stops', () => {
    const stops = createGradientStops({ colors: ['#e94560', '#0f3460'] });
    expect(stops).toEqual([[0, '#e94560'], [1, '#0f3460']]);
  });

  it('should handle 3 colors', () => {
    const stops = createGradientStops({ colors: ['#ff0000', '#00ff00', '#0000ff'] });
    expect(stops).toHaveLength(3);
    expect(stops[0]![0]).toBe(0);
    expect(stops[1]![0]).toBe(0.5);
    expect(stops[2]![0]).toBe(1);
  });

  it('should throw with fewer than 2 colors', () => {
    expect(() => createGradientStops({ colors: ['#ff0000'] })).toThrow('[canvas-forge]');
  });
});

describe('getGradientCoords', () => {
  it('should return horizontal gradient coords', () => {
    expect(getGradientCoords(800, 400, 'horizontal')).toEqual({ x0: 0, y0: 0, x1: 800, y1: 0 });
  });

  it('should return vertical gradient coords', () => {
    expect(getGradientCoords(800, 400, 'vertical')).toEqual({ x0: 0, y0: 0, x1: 0, y1: 400 });
  });

  it('should return diagonal gradient coords', () => {
    expect(getGradientCoords(800, 400, 'diagonal')).toEqual({ x0: 0, y0: 0, x1: 800, y1: 400 });
  });

  it('should return radial gradient coords (center)', () => {
    expect(getGradientCoords(800, 400, 'radial')).toEqual({ x0: 400, y0: 200, x1: 400, y1: 200 });
  });

  it('should default to horizontal', () => {
    expect(getGradientCoords(800, 400)).toEqual({ x0: 0, y0: 0, x1: 800, y1: 0 });
  });
});
