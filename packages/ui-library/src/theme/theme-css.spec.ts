import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contextColors } from '@/consts/colors';
import {
  chartColors,
  contextTints,
  dialogSizes,
  insetSurfaceColors,
  lineColors,
  neutralShades,
  radiusRoles,
  shadowRoles,
  stateColors,
  surfaceColors,
  zLayers,
} from '@/consts/tokens';
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
    for (const color of [...surfaceColors, ...insetSurfaceColors, ...lineColors, ...stateColors, ...chartColors, 'link']) {
      for (const prefix of ['', 'light-', 'dark-'])
        expect(committed).toContain(`--color-rui-${prefix}${color}:`);
    }
  });

  it('should define the fill, foreground and tints of each context color', () => {
    for (const color of contextColors) {
      expect(committed).toContain(`--color-rui-${color}-fill: rgb(var(--rui-${color}-fill));`);
      expect(committed).toContain(`--color-rui-${color}-foreground:`);
      for (const [tint, percent] of Object.entries(contextTints))
        expect(committed).toContain(`--color-rui-${color}-${tint}: color-mix(in oklab, rgb(var(--rui-${color}-main)) ${percent}%, transparent);`);
    }
  });

  it('should give every stacking layer a utility', () => {
    for (const layer of zLayers)
      expect(committed).toContain(`@utility z-rui-${layer} {\n  z-index: var(--rui-z-${layer});`);
  });

  // a page's fixed parts sit on `floating`, so a table's sticky header or pagination bar never covers them
  it('should define every stacking layer, in rising order', () => {
    const tokens = readFileSync(path.resolve(import.meta.dirname, '../styles/tokens.css'), 'utf8');
    const values = zLayers.map((layer) => {
      const match = new RegExp(`--rui-z-${layer}: (\\d+);`).exec(tokens);
      expect(match, `--rui-z-${layer} is defined`).not.toBeNull();
      return Number(match?.[1]);
    });
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
  });

  it('should map the layout tokens onto Tailwind', () => {
    expect(committed).toContain('--spacing-rui-app-bar: var(--rui-app-bar-height);');
    expect(committed).toContain('--container-rui-tooltip: var(--rui-tooltip-max-width);');
    for (const size of dialogSizes)
      expect(committed).toContain(`--container-rui-dialog-${size}: var(--rui-dialog-${size});`);
  });
});

describe('styles/*.css', () => {
  const colors = readFileSync(path.resolve(import.meta.dirname, '../styles/colors.css'), 'utf8');
  const tokens = readFileSync(path.resolve(import.meta.dirname, '../styles/tokens.css'), 'utf8');

  it('should set a value behind every color variable the theme reads', () => {
    const read = new Set(Array.from(committed.matchAll(/var\((--rui-[\w-]+)\)/g), match => match[1]));
    const defined = new Set(Array.from(`${colors}${tokens}`.matchAll(/(--rui-[\w-]+):/g), match => match[1]));

    expect([...read].filter(name => !defined.has(name))).toEqual([]);
  });

  it('should alias each new adaptive color in both theme blocks', () => {
    const blocks = colors.split(/html\[data-theme='(?:light|dark)'\]/).slice(1);
    expect(blocks).toHaveLength(2);
    for (const block of blocks) {
      for (const color of [...insetSurfaceColors, ...chartColors, 'link', 'scrollbar-thumb'])
        expect(block).toContain(`--rui-${color}:`);
      for (const color of contextColors)
        expect(block).toContain(`--rui-${color}-fill:`);
    }
  });
});
