import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contextColors } from '@/consts/colors';
import { lineColors, neutralShades, radiusRoles, shadowRoles, stateColors, surfaceColors } from '@/consts/tokens';
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

  it('should not define the Material elevation scale', () => {
    expect(committed).not.toMatch(/--shadow-\d+:/);
  });

  it('should define every role token the class merger knows about', () => {
    for (const role of radiusRoles)
      expect(committed).toContain(`--radius-rui-${role}:`);
    for (const role of shadowRoles)
      expect(committed).toContain(`--shadow-rui-${role}:`);
  });

  it('should name Inter and Geist Mono first in the font stacks', () => {
    expect(committed).toContain(`--font-sans: 'Inter Variable', 'Inter',`);
    expect(committed).toContain(`--font-mono: 'Geist Mono Variable', 'Geist Mono',`);
  });

  it('should define the whole neutral ramp', () => {
    for (const shade of neutralShades)
      expect(committed).toContain(`--color-rui-neutral-${shade}:`);
  });

  // UPGRADING.md moves the dark surfaces apps copied from 2.x onto these; keep them while that table stands
  it('should keep a token for each 2.x surface apps copied', () => {
    for (const surface of ['background', 'surface', 'menu', 'overlay']) {
      for (const prefix of ['', 'dark-'])
        expect(committed).toContain(`--color-rui-${prefix}${surface}:`);
    }
  });

  it('should define each surface, line and state color for both themes and the adaptive one', () => {
    for (const color of [...surfaceColors, ...lineColors, ...stateColors]) {
      for (const prefix of ['', 'light-', 'dark-'])
        expect(committed).toContain(`--color-rui-${prefix}${color}:`);
    }
  });
});
