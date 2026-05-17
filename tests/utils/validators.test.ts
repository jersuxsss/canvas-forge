/**
 * Tests for the validator utility module.
 */

import { describe, it, expect } from 'vitest';
import {
  validatePositiveInteger,
  validateNonNegative,
  validateRange,
  validateNonEmptyString,
  validateColor,
  validateImage,
  validateTheme,
  validateStatus,
  validateOutputFormat,
  validateDimensions,
} from '../../src/utils/validators';

describe('validatePositiveInteger', () => {
  it('should pass for positive integers', () => {
    expect(() => validatePositiveInteger(1, 'test')).not.toThrow();
    expect(() => validatePositiveInteger(100, 'test')).not.toThrow();
    expect(() => validatePositiveInteger(9999, 'test')).not.toThrow();
  });

  it('should throw for zero', () => {
    expect(() => validatePositiveInteger(0, 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for negative numbers', () => {
    expect(() => validatePositiveInteger(-1, 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for non-integers', () => {
    expect(() => validatePositiveInteger(1.5, 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateNonNegative', () => {
  it('should pass for zero and positive numbers', () => {
    expect(() => validateNonNegative(0, 'test')).not.toThrow();
    expect(() => validateNonNegative(1.5, 'test')).not.toThrow();
    expect(() => validateNonNegative(100, 'test')).not.toThrow();
  });

  it('should throw for negative numbers', () => {
    expect(() => validateNonNegative(-1, 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for NaN', () => {
    expect(() => validateNonNegative(NaN, 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateRange', () => {
  it('should pass for values within range', () => {
    expect(() => validateRange(5, 0, 10, 'test')).not.toThrow();
    expect(() => validateRange(0, 0, 10, 'test')).not.toThrow();
    expect(() => validateRange(10, 0, 10, 'test')).not.toThrow();
  });

  it('should throw for values outside range', () => {
    expect(() => validateRange(-1, 0, 10, 'test')).toThrow('[canvas-forge]');
    expect(() => validateRange(11, 0, 10, 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for NaN', () => {
    expect(() => validateRange(NaN, 0, 10, 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateNonEmptyString', () => {
  it('should pass for non-empty strings', () => {
    expect(() => validateNonEmptyString('hello', 'test')).not.toThrow();
    expect(() => validateNonEmptyString('a', 'test')).not.toThrow();
  });

  it('should throw for empty strings', () => {
    expect(() => validateNonEmptyString('', 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for whitespace-only strings', () => {
    expect(() => validateNonEmptyString('   ', 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for non-strings', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateNonEmptyString(123, 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateColor', () => {
  it('should pass for hex strings', () => {
    expect(validateColor('#e94560', 'test')).toBe(true);
  });

  it('should pass for CSS color names', () => {
    expect(validateColor('red', 'test')).toBe(true);
  });

  it('should pass for RGB tuples', () => {
    expect(validateColor([255, 0, 0], 'test')).toBe(true);
  });

  it('should pass for RGBA tuples', () => {
    expect(validateColor([255, 0, 0, 0.5], 'test')).toBe(true);
  });

  it('should throw for invalid tuple lengths', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateColor([255, 0], 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for invalid types', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateColor(12345, 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateImage', () => {
  it('should pass for URL strings', () => {
    expect(() => validateImage('https://example.com/img.png', 'test')).not.toThrow();
  });

  it('should pass for file paths', () => {
    expect(() => validateImage('./image.png', 'test')).not.toThrow();
  });

  it('should pass for Buffer', () => {
    expect(() => validateImage(Buffer.from([1, 2, 3]), 'test')).not.toThrow();
  });

  it('should pass for URL objects', () => {
    expect(() => validateImage(new URL('https://example.com/img.png'), 'test')).not.toThrow();
  });

  it('should throw for empty strings', () => {
    expect(() => validateImage('', 'test')).toThrow('[canvas-forge]');
  });

  it('should throw for empty buffers', () => {
    expect(() => validateImage(Buffer.alloc(0), 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateTheme', () => {
  it('should pass for valid themes', () => {
    expect(() => validateTheme('dark', 'test')).not.toThrow();
    expect(() => validateTheme('light', 'test')).not.toThrow();
    expect(() => validateTheme('custom', 'test')).not.toThrow();
  });

  it('should throw for invalid themes', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateTheme('neon', 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateStatus', () => {
  it('should pass for valid statuses', () => {
    expect(() => validateStatus('online', 'test')).not.toThrow();
    expect(() => validateStatus('idle', 'test')).not.toThrow();
    expect(() => validateStatus('dnd', 'test')).not.toThrow();
    expect(() => validateStatus('offline', 'test')).not.toThrow();
    expect(() => validateStatus('streaming', 'test')).not.toThrow();
  });

  it('should throw for invalid statuses', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateStatus('away', 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateOutputFormat', () => {
  it('should pass for valid formats', () => {
    expect(() => validateOutputFormat('png', 'test')).not.toThrow();
    expect(() => validateOutputFormat('jpeg', 'test')).not.toThrow();
    expect(() => validateOutputFormat('webp', 'test')).not.toThrow();
  });

  it('should throw for invalid formats', () => {
    // @ts-expect-error Testing invalid input
    expect(() => validateOutputFormat('gif', 'test')).toThrow('[canvas-forge]');
  });
});

describe('validateDimensions', () => {
  it('should pass for valid dimensions', () => {
    expect(() => validateDimensions(800, 600)).not.toThrow();
    expect(() => validateDimensions(1, 1)).not.toThrow();
    expect(() => validateDimensions(8192, 8192)).not.toThrow();
  });

  it('should throw for dimensions exceeding max', () => {
    expect(() => validateDimensions(8193, 100)).toThrow('[canvas-forge]');
    expect(() => validateDimensions(100, 8193)).toThrow('[canvas-forge]');
  });

  it('should throw for zero or negative dimensions', () => {
    expect(() => validateDimensions(0, 100)).toThrow('[canvas-forge]');
    expect(() => validateDimensions(100, -1)).toThrow('[canvas-forge]');
  });
});
