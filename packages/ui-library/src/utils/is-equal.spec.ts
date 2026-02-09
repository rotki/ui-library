import { describe, expect, it } from 'vitest';
import { isEqual } from '@/utils/is-equal';

describe('utils/is-equal', () => {
  describe('primitives', () => {
    it('should return true for identical primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('a', 'b')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it('should return false for different types', () => {
      expect(isEqual(1, '1')).toBe(false);
      expect(isEqual(0, false)).toBe(false);
      expect(isEqual('', false)).toBe(false);
    });
  });

  describe('null and undefined', () => {
    it('should return true for null === null and undefined === undefined', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for null vs undefined', () => {
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(undefined, null)).toBe(false);
    });

    it('should return false for null/undefined vs value', () => {
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(0, null)).toBe(false);
      expect(isEqual(undefined, '')).toBe(false);
    });
  });

  describe('arrays', () => {
    it('should return true for identical arrays', () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('should return false for different length arrays', () => {
      expect(isEqual([1], [1, 2])).toBe(false);
      expect(isEqual([1, 2], [1])).toBe(false);
    });

    it('should return false for arrays with different elements', () => {
      expect(isEqual([1, 2], [1, 3])).toBe(false);
    });

    it('should compare nested arrays recursively', () => {
      expect(isEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
      expect(isEqual([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
    });

    it('should return false when comparing array to non-array', () => {
      expect(isEqual([1], 1)).toBe(false);
      expect(isEqual([1], { 0: 1 })).toBe(false);
    });
  });

  describe('objects', () => {
    it('should return true for identical objects', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should return false for objects with different keys count', () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('should return false for objects with different values', () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should compare nested objects recursively', () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it('should handle mixed arrays and objects', () => {
      expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
      expect(isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
    });
  });

  describe('same reference', () => {
    it('should return true for same reference', () => {
      const obj = { a: 1 };
      expect(isEqual(obj, obj)).toBe(true);

      const arr = [1, 2];
      expect(isEqual(arr, arr)).toBe(true);
    });

    it('should return true for same function reference', () => {
      const fn = () => {};
      expect(isEqual(fn, fn)).toBe(true);
    });
  });
});
