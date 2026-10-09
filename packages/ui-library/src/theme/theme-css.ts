/**
 * Builds `theme.css`, the Tailwind 4 theme a consumer imports right after
 * Tailwind itself, as `@import '@rotki/ui-library/theme.css'`.
 *
 * It maps the `--rui-*` runtime variables (shipped in `style.css`) onto
 * Tailwind colors and shadows, and defines the library's own utilities and
 * `dark` variant. It is generated from `src/consts` rather than written by
 * hand so a color added there reaches every utility; `pnpm run generate-theme`
 * writes it and a unit test fails when the committed file is stale.
 */
import { baseColors, baseColorsIntensities, contextColors } from '../consts/colors';

const themes = ['light', 'dark'] as const;

/** Material elevation shadows, `shadow-1` to `shadow-24`. */
const shadows: Record<number, string> = {
  1: '0px 2px 1px -1px var(--rui-shadow-primary), 0px 1px 1px var(--rui-shadow-secondary), 0px 1px 3px var(--rui-shadow-tertiary)',
  2: '0px 3px 1px -2px var(--rui-shadow-primary), 0px 2px 2px var(--rui-shadow-secondary), 0px 1px 5px var(--rui-shadow-tertiary)',
  3: '0px 3px 3px -2px var(--rui-shadow-primary), 0px 3px 4px var(--rui-shadow-secondary), 0px 1px 8px var(--rui-shadow-tertiary)',
  4: '0px 2px 4px -1px var(--rui-shadow-primary), 0px 4px 5px var(--rui-shadow-secondary), 0px 1px 10px var(--rui-shadow-tertiary)',
  5: '0px 3px 5px -1px var(--rui-shadow-primary), 0px 5px 8px var(--rui-shadow-secondary), 0px 1px 14px var(--rui-shadow-tertiary)',
  6: '0px 3px 5px -1px var(--rui-shadow-primary), 0px 6px 10px var(--rui-shadow-secondary), 0px 1px 18px var(--rui-shadow-tertiary)',
  7: '0px 4px 5px -2px var(--rui-shadow-primary), 0px 7px 10px 1px var(--rui-shadow-secondary), 0px 2px 16px 1px var(--rui-shadow-tertiary)',
  8: '0px 5px 5px -3px var(--rui-shadow-primary), 0px 8px 10px 1px var(--rui-shadow-secondary), 0px 3px 14px 2px var(--rui-shadow-tertiary)',
  9: '0px 5px 6px -3px var(--rui-shadow-primary), 0px 9px 12px 1px var(--rui-shadow-secondary), 0px 3px 16px 2px var(--rui-shadow-tertiary)',
  10: '0px 6px 6px -3px var(--rui-shadow-primary), 0px 10px 14px 1px var(--rui-shadow-secondary), 0px 4px 18px 3px var(--rui-shadow-tertiary)',
  11: '0px 6px 7px -4px var(--rui-shadow-primary), 0px 11px 15px 1px var(--rui-shadow-secondary), 0px 4px 20px 3px var(--rui-shadow-tertiary)',
  12: '0px 7px 8px -4px var(--rui-shadow-primary), 0px 12px 17px 2px var(--rui-shadow-secondary), 0px 5px 22px 4px var(--rui-shadow-tertiary)',
  13: '0px 7px 8px -4px var(--rui-shadow-primary), 0px 13px 19px 2px var(--rui-shadow-secondary), 0px 5px 24px 4px var(--rui-shadow-tertiary)',
  14: '0px 7px 9px -4px var(--rui-shadow-primary), 0px 14px 21px 2px var(--rui-shadow-secondary), 0px 5px 26px 4px var(--rui-shadow-tertiary)',
  15: '0px 8px 9px -5px var(--rui-shadow-primary), 0px 15px 22px 2px var(--rui-shadow-secondary), 0px 6px 28px 5px var(--rui-shadow-tertiary)',
  16: '0px 8px 10px -5px var(--rui-shadow-primary), 0px 16px 24px 2px var(--rui-shadow-secondary), 0px 6px 30px 5px var(--rui-shadow-tertiary)',
  17: '0px 8px 11px -5px var(--rui-shadow-primary), 0px 17px 26px 2px var(--rui-shadow-secondary), 0px 6px 32px 5px var(--rui-shadow-tertiary)',
  18: '0px 9px 11px -5px var(--rui-shadow-primary), 0px 18px 28px 2px var(--rui-shadow-secondary), 0px 7px 34px 6px var(--rui-shadow-tertiary)',
  19: '0px 9px 12px -6px var(--rui-shadow-primary), 0px 19px 29px 2px var(--rui-shadow-secondary), 0px 7px 36px 6px var(--rui-shadow-tertiary)',
  20: '0px 10px 13px -6px var(--rui-shadow-primary), 0px 20px 31px 3px var(--rui-shadow-secondary), 0px 8px 38px 7px var(--rui-shadow-tertiary)',
  21: '0px 10px 13px -6px var(--rui-shadow-primary), 0px 21px 33px 3px var(--rui-shadow-secondary), 0px 8px 40px 7px var(--rui-shadow-tertiary)',
  22: '0px 10px 14px -6px var(--rui-shadow-primary), 0px 22px 35px 3px var(--rui-shadow-secondary), 0px 8px 42px 7px var(--rui-shadow-tertiary)',
  23: '0px 11px 14px -7px var(--rui-shadow-primary), 0px 23px 36px 3px var(--rui-shadow-secondary), 0px 9px 44px 8px var(--rui-shadow-tertiary)',
  24: '0px 11px 15px -7px var(--rui-shadow-primary), 0px 24px 38px 3px var(--rui-shadow-secondary), 0px 9px 46px 8px var(--rui-shadow-tertiary)',
};

interface Typography {
  name: string;
  size: string;
  lineHeight?: string;
  weight?: string;
  transform?: string;
}

/** The Material type scale. A size alone keeps that size's own line height. */
const typography: Typography[] = [
  { name: 'body-1', size: 'base' },
  { name: 'body-2', size: 'sm' },
  { name: 'caption', size: 'xs', lineHeight: '1.25rem' },
  { name: 'h1', size: '8xl', lineHeight: '7rem', weight: 'light' },
  { name: 'h2', size: '6xl', lineHeight: '4.5rem', weight: 'light' },
  { name: 'h3', size: '5xl', lineHeight: '3.5rem' },
  { name: 'h4', size: '4xl', lineHeight: '2.625rem', weight: 'semibold' },
  { name: 'h5', size: '2xl', lineHeight: '2rem' },
  { name: 'h6', size: 'xl', lineHeight: '2rem', weight: 'medium' },
  { name: 'overline', size: 'xs', lineHeight: '2rem', transform: 'uppercase' },
  { name: 'subtitle-1', size: 'base', lineHeight: '1.75rem' },
  { name: 'subtitle-2', size: 'sm', lineHeight: '1.25rem', weight: 'medium' },
];

/**
 * The color tokens: the raw palette, the context colors per theme, and the
 * adaptive ones that follow whichever theme is showing. The `--rui-*`
 * variables hold bare RGB channels, so each is wrapped in `rgb()`; text colors
 * are full colors already. Tailwind 3's `rui-surface` colors are gone: their
 * variables were never defined.
 */
function colorTokens(): string[] {
  const lines: string[] = [];

  for (const color of baseColors) {
    for (const intensity of baseColorsIntensities)
      lines.push(`--color-rui-${color}-${intensity}: rgb(var(--rui-${color}-${intensity}));`);
  }

  for (const prefix of [...themes.map(theme => `${theme}-`), '']) {
    for (const color of contextColors) {
      lines.push(
        `--color-rui-${prefix}${color}: rgb(var(--rui-${prefix}${color}-main));`,
        `--color-rui-${prefix}${color}-darker: rgb(var(--rui-${prefix}${color}-darker));`,
        `--color-rui-${prefix}${color}-lighter: rgb(var(--rui-${prefix}${color}-lighter));`,
      );
    }
    lines.push(
      `--color-rui-${prefix}text: var(--rui-${prefix}text-primary);`,
      `--color-rui-${prefix}text-secondary: var(--rui-${prefix}text-secondary);`,
      `--color-rui-${prefix}text-disabled: var(--rui-${prefix}text-disabled);`,
    );
  }

  return lines;
}

function typographyUtility({ name, size, lineHeight, weight, transform }: Typography): string {
  const applied = [`text-${size}`, weight ? `font-${weight}` : undefined, transform].filter(Boolean).join(' ');
  const body = [`  @apply ${applied};`];
  if (lineHeight)
    body.push(`  line-height: ${lineHeight};`);

  return `@utility text-${name} {\n${body.join('\n')}\n}`;
}

function indent(lines: string[]): string {
  return lines.map(line => `  ${line}`).join('\n');
}

/** The full contents of `theme.css`. */
export function buildThemeCss(): string {
  const shadowTokens = Object.entries(shadows).map(([level, value]) => `--shadow-${level}: ${value};`);

  return [
    '/* Generated by `pnpm run generate-theme` from src/theme/theme-css.ts. Do not edit. */',
    '',
    /*
     * `:is()` rather than Tailwind's usual `:where()`: it carries the specificity Tailwind 3's
     * `dark:` had, so `dark:border-x` still beats `disabled:border-y` on the same element.
     */
    '/* Dark mode follows the theme the library sets on <html>, as a class or as data-theme. */',
    '@custom-variant dark (&:is(.dark *, [data-theme="dark"] *));',
    '',
    /*
     * `inline` puts the `var(--rui-*)` reference straight into each utility rather than going
     * through a `--color-*` variable resolved once on :root, so a subtree that switches theme by
     * setting its own `--rui-*` variables still recolors, as it did with Tailwind 3.
     */
    '@theme inline {',
    indent(colorTokens()),
    '}',
    '',
    '@theme {',
    indent(shadowTokens),
    '}',
    '',
    '@utility border-default {',
    '  border-color: rgb(var(--rui-grey-200));',
    '',
    '  .dark & {',
    '    border-color: rgb(var(--rui-grey-800));',
    '  }',
    '}',
    '',
    ...typography.map(item => `${typographyUtility(item)}\n`),
  ].join('\n');
}
