import { describe, expect, it } from 'vitest';
import { isRuiIcon, RuiIcons } from '@/icons';

// Guardrail for the generated lucide icon set. The generation itself is
// gitignored and rebuilt from the `lucide` dependency, so nothing else catches
// a version bump that silently drops icons consumers rely on (`RuiIcons` is
// typed as plain `string`). These assertions fail the build if that happens.
describe('generated icons', () => {
  it('exposes a large icon set', () => {
    // lucide ships ~1700 icons plus official aliases and custom SVGs; a sharp
    // drop below this floor means a bump removed a large chunk of the set.
    expect(RuiIcons.length).toBeGreaterThan(1900);
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

  it('keeps pre-v1 lucide names available via official aliases', () => {
    // Renamed in lucide v1 but kept as official aliases; consumers using the
    // old names must keep working.
    for (const name of ['lu-waves', 'lu-text-select', 'lu-x-circle'])
      expect(RuiIcons, name).toContain(name);
  });

  it('ships no third-party brand logos (registered per-app instead)', () => {
    // The library is intentionally brand-free: brand/logo marks are third-party
    // trademarks and belong in the consuming app (see README "App-provided
    // (brand/custom) icons"). Crypto network marks are kept.
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
