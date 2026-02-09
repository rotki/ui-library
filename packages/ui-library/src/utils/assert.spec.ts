import { describe, expect, it } from 'vitest';
import { assert } from '@/utils/assert';

describe('utils/assert', () => {
  it('should not throw for truthy values', () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(1)).not.toThrow();
    expect(() => assert('non-empty')).not.toThrow();
    expect(() => assert({})).not.toThrow();
    expect(() => assert([])).not.toThrow();
  });

  it('should throw AssertionError for falsy values', () => {
    expect(() => assert(false)).toThrow('AssertionError');
    expect(() => assert(0)).toThrow('AssertionError');
    expect(() => assert('')).toThrow('AssertionError');
    expect(() => assert(null)).toThrow('AssertionError');
    expect(() => assert(undefined)).toThrow('AssertionError');
  });

  it('should throw with custom message', () => {
    expect(() => assert(false, 'custom error')).toThrow('custom error');
  });

  it('should throw an instance of Error', () => {
    try {
      assert(false);
    }
    catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).name).toBe('AssertionError');
    }
  });
});
