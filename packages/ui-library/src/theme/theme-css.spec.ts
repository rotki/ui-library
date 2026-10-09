import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contextColors } from '@/consts/colors';
import { lineColors, neutralShades, radiusRoles, shadowRoles, surfaceColors } from '@/consts/tokens';
import { buildThemeCss } from '@/theme/theme-css';

const committed = readFileSync(path.resolve(import.meta.dirname, 'theme.css'), 'utf8');

describe('theme/theme-css', () => {
  it('should match the committed theme.css, so a change to the generator is regenerated', () => {
    expect(committed).toBe(buildThemeCss());
  });

  it('should define every context color for both themes and the adaptive one', () => {
    for (const color of contextColors) {
      for (const prefix of ['', 'light-', 'dark-']) {
        for (const suffix of ['', '-darker', '-lighter'])
          expect(committed).toContain(`--color-rui-${prefix}${color}${suffix}:`);
      }
    }
  });

  it('should define the elevation shadows 1 to 24', () => {
    for (let level = 1; level <= 24; level++)
      expect(committed).toContain(`--shadow-${level}:`);
  });

  it('should define every role token the class merger knows about', () => {
    for (const role of radiusRoles)
      expect(committed).toContain(`--radius-rui-${role}:`);
    for (const role of shadowRoles)
      expect(committed).toContain(`--shadow-rui-${role}:`);
  });

  it('should define the whole neutral ramp', () => {
    for (const shade of neutralShades)
      expect(committed).toContain(`--color-rui-neutral-${shade}:`);
  });

  it('should define each surface and line color for both themes and the adaptive one', () => {
    for (const color of [...surfaceColors, ...lineColors]) {
      for (const prefix of ['', 'light-', 'dark-'])
        expect(committed).toContain(`--color-rui-${prefix}${color}:`);
    }
  });
});
