import type { ScanResult } from './types';
import { describe, expect, it } from 'vitest';
import { assert } from '@/utils/assert';
import {
  extractIconsFromSource,
  generateVirtualModule,
  iconNameToExportName,
  validateIcons,
} from './scanner';

describe('scanner', () => {
  describe('extractIconsFromSource', () => {
    it('should extract icons from static name attribute with double quotes', () => {
      const source = '<RuiIcon name="lu-star" />';
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-star');
      expect(icons.size).toBe(1);
    });

    it('should extract icons from static name attribute with single quotes', () => {
      const source = `<RuiIcon name='lu-check' />`;
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-check');
    });

    it('should extract icons from dynamic bound name with string literal', () => {
      const source = `<RuiIcon :name="'lu-arrow-down'" />`;
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-arrow-down');
    });

    it('should extract icons from template literal', () => {
      const source = '<RuiIcon :name="`lu-home`" />';
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-home');
    });

    it('should extract icons from string literals in TypeScript', () => {
      const source = `const icon = 'lu-settings';`;
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-settings');
    });

    it('should extract multiple icons from a file', () => {
      const source = `
        <template>
          <RuiIcon name="lu-star" />
          <RuiIcon name="lu-check" />
          <RuiIcon :name="'lu-arrow-down'" />
        </template>
        <script setup>
        const defaultIcon = 'lu-home';
        </script>
      `;
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-star');
      expect(icons).toContain('lu-check');
      expect(icons).toContain('lu-arrow-down');
      expect(icons).toContain('lu-home');
      expect(icons.size).toBe(4);
    });

    it('should handle icons with numbers in the name', () => {
      const source = '<RuiIcon name="lu-2fa" />';
      const icons = extractIconsFromSource(source);
      expect(icons).toContain('lu-2fa');
    });

    it('should not extract non-lu prefixed names', () => {
      const source = `
        <RuiIcon name="ri-star" />
        <SomeIcon name="icon-check" />
      `;
      const icons = extractIconsFromSource(source);
      expect(icons.size).toBe(0);
    });

    it('should handle empty source', () => {
      const icons = extractIconsFromSource('');
      expect(icons.size).toBe(0);
    });

    it('should deduplicate icons', () => {
      const source = `
        <RuiIcon name="lu-star" />
        <RuiIcon name="lu-star" />
        const icon = 'lu-star';
      `;
      const icons = extractIconsFromSource(source);
      expect(icons.size).toBe(1);
      expect(icons).toContain('lu-star');
    });
  });

  describe('validateIcons', () => {
    it('should add valid icons to result', () => {
      const detectedIcons = new Set(['lu-star', 'lu-check']);
      const validIcons = new Set(['lu-star', 'lu-check', 'lu-home']);
      const result: ScanResult = {
        icons: new Set(),
        invalidIcons: new Map(),
      };

      validateIcons(detectedIcons, validIcons, '/test/file.vue', result);

      expect(result.icons).toContain('lu-star');
      expect(result.icons).toContain('lu-check');
      expect(result.icons.size).toBe(2);
      expect(result.invalidIcons.size).toBe(0);
    });

    it('should track invalid icons with file paths', () => {
      const detectedIcons = new Set(['lu-star', 'lu-invalid']);
      const validIcons = new Set(['lu-star', 'lu-check']);
      const result: ScanResult = {
        icons: new Set(),
        invalidIcons: new Map(),
      };

      validateIcons(detectedIcons, validIcons, '/test/file.vue', result);

      expect(result.icons).toContain('lu-star');
      expect(result.icons.size).toBe(1);
      expect(result.invalidIcons.has('lu-invalid')).toBe(true);
      expect(result.invalidIcons.get('lu-invalid')).toContain('/test/file.vue');
    });

    it('should accumulate invalid icon file paths across multiple calls', () => {
      const validIcons = new Set(['lu-star']);
      const result: ScanResult = {
        icons: new Set(),
        invalidIcons: new Map(),
      };

      validateIcons(new Set(['lu-invalid']), validIcons, '/test/file1.vue', result);
      validateIcons(new Set(['lu-invalid']), validIcons, '/test/file2.vue', result);

      expect(result.invalidIcons.get('lu-invalid')).toEqual([
        '/test/file1.vue',
        '/test/file2.vue',
      ]);
    });
  });

  describe('iconNameToExportName', () => {
    it('should convert simple icon name', () => {
      expect(iconNameToExportName('lu-star')).toBe('LuStar');
    });

    it('should convert multi-part icon name', () => {
      expect(iconNameToExportName('lu-arrow-down')).toBe('LuArrowDown');
    });

    it('should convert icon name with numbers', () => {
      expect(iconNameToExportName('lu-2fa')).toBe('Lu2fa');
    });

    it('should handle long icon names', () => {
      expect(iconNameToExportName('lu-chevron-double-down')).toBe('LuChevronDoubleDown');
    });
  });

  describe('generateVirtualModule', () => {
    it('should generate empty module for no icons', () => {
      const result = generateVirtualModule(new Set());
      expect(result).toContain('// No icons detected');
      expect(result).toContain('export default [];');
    });

    it('should generate module with single icon', () => {
      const icons = new Set(['lu-star']);
      const result = generateVirtualModule(icons);

      expect(result).toContain('import {');
      expect(result).toContain('LuStar,');
      expect(result).toContain('} from \'@rotki/ui-library\';');
      expect(result).toContain('export default [');
      expect(result).toContain('LuStar,');
    });

    it('should generate module with multiple icons sorted alphabetically', () => {
      const icons = new Set(['lu-star', 'lu-arrow-down', 'lu-check']);
      const result = generateVirtualModule(icons);

      // Should be sorted: arrow-down, check, star
      // eslint-disable-next-line regexp/strict
      const importMatch = result.match(/import {([^}]+)}/);
      assert(importMatch);
      const importContent = importMatch[1];
      assert(importContent);
      const arrowIndex = importContent.indexOf('LuArrowDown');
      const checkIndex = importContent.indexOf('LuCheck');
      const starIndex = importContent.indexOf('LuStar');

      expect(arrowIndex).toBeLessThan(checkIndex);
      expect(checkIndex).toBeLessThan(starIndex);
    });

    it('should generate valid JavaScript module', () => {
      const icons = new Set(['lu-star', 'lu-check']);
      const result = generateVirtualModule(icons);

      // Should have proper structure
      expect(result).toContain('import {');
      expect(result).toContain('} from \'@rotki/ui-library\';');
      expect(result).toContain('export default [');
      expect(result).toContain('];\n');
    });
  });
});
