import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isRuiIcon, RuiIcons } from '@/icons';

/**
 * Guardrail for the generated lucide icon set. The generation is gitignored
 * and rebuilt from the `lucide` dependency, and `RuiIcons` is typed as plain
 * `string`, so nothing else catches a version bump that silently drops icons
 * consumers rely on.
 */
describe('generated icons', () => {
  it('should keep every name a release shipped', () => {
    const file = path.resolve(import.meta.dirname, '../scripts/published-icons.json');
    const published: string[] = JSON.parse(readFileSync(file, 'utf8'));
    expect(published.filter(name => !isRuiIcon(name))).toEqual([]);
  });

  it('has no duplicate names', () => {
    expect(new Set(RuiIcons).size).toBe(RuiIcons.length);
  });

  it('keeps the icons the library components require', () => {
    const required = [
      'lu-x',
      'lu-check',
      'lu-info',
      'lu-chevron-down',
      'lu-arrow-right',
      'lu-circle-check',
      'lu-circle-x',
      'lu-eye',
      'lu-eye-off',
      'lu-clock',
    ];
    for (const name of required)
      expect(RuiIcons, name).toContain(name);
  });

  it('should keep the pre-v1 names lucide renamed, so consumers using them keep working', () => {
    for (const name of ['lu-waves', 'lu-text-select', 'lu-x-circle'])
      expect(RuiIcons, name).toContain(name);
  });

  it('should keep the numbered names lucide turned into aliases spelled as published (lu-trash-2, not lu-trash2)', () => {
    for (const name of ['lu-trash-2', 'lu-building-2', 'lu-flip-horizontal-2', 'lu-flip-vertical-2'])
      expect(RuiIcons, name).toContain(name);
    for (const name of ['lu-trash2', 'lu-building2', 'lu-flip-horizontal2', 'lu-flip-vertical2'])
      expect(RuiIcons, name).not.toContain(name);
  });

  it('should ship no third-party brand logo, which an app registers itself', () => {
    for (const name of [
      'lu-github',
      'lu-discord',
      'lu-x-twitter',
      'lu-reddit',
      'lu-paypal',
      'lu-os-apple',
      'lu-os-windows',
    ])
      expect(RuiIcons, name).not.toContain(name);
  });

  it('isRuiIcon reflects membership', () => {
    expect(isRuiIcon('lu-check')).toBe(true);
    expect(isRuiIcon('lu-definitely-not-an-icon')).toBe(false);
  });
});
