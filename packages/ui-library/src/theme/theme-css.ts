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
import { lineColors, neutralShades, type RadiusRole, type ShadowRole, surfaceColors } from '../consts/tokens';

const themes = ['light', 'dark'] as const;

/**
 * Two soft shadows: a low one for parts that sit on a surface, a high one for
 * popups. Each is a tight key shadow under a wider, fainter ambient one;
 * `--rui-shadow-primary` and `--rui-shadow-secondary` deepen in dark mode so
 * they still read on a near-black page. Surfaces themselves have no shadow:
 * borders and background steps separate them.
 */
const lowShadow = '0px 1px 3px 0px var(--rui-shadow-primary), 0px 1px 2px -1px var(--rui-shadow-secondary)';
const highShadow = '0px 12px 24px -6px var(--rui-shadow-primary), 0px 4px 8px -4px var(--rui-shadow-secondary)';

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
 * are full colors already. Tailwind 3's `rui-surface` pointed at variables
 * that were never defined; the name now holds the card surface.
 */
function colorTokens(): string[] {
  const lines: string[] = [];

  for (const color of baseColors) {
    for (const intensity of baseColorsIntensities)
      lines.push(`--color-rui-${color}-${intensity}: rgb(var(--rui-${color}-${intensity}));`);
  }

  for (const shade of neutralShades)
    lines.push(`--color-rui-neutral-${shade}: rgb(var(--rui-neutral-${shade}));`);

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

  /*
   * The semantic surfaces and lines. The adaptive ones follow the theme on their own, one class
   * instead of a `dark:` pair; the `light-` and `dark-` ones are for a part that keeps one look.
   */
  for (const prefix of [...themes.map(theme => `${theme}-`), '']) {
    for (const surface of surfaceColors)
      lines.push(`--color-rui-${prefix}${surface}: rgb(var(--rui-${prefix}${surface}));`);
    for (const line of lineColors)
      lines.push(`--color-rui-${prefix}${line}: var(--rui-${prefix}${line});`);
  }

  return lines;
}

/**
 * Corner radii by role rather than by size, so the look changes in one place.
 * `sm` and `lg` are the ends of the `rounded` prop on cards and data tables;
 * its middle is the component's own role radius.
 */
const radii: Record<RadiusRole, string> = {
  control: '0.375rem',
  panel: '0.5rem',
  card: '0.5rem',
  sm: '0.375rem',
  lg: '0.75rem',
};

/** Shadows by role: popups get the high one, a raised control or a tooltip the low one. */
const roleShadows: Record<ShadowRole, string> = {
  menu: highShadow,
  drawer: highShadow,
  tooltip: lowShadow,
  control: lowShadow,
};

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
  const shadowTokens = Object.entries(roleShadows).map(([role, value]) => `--shadow-rui-${role}: ${value};`);
  const radiusTokens = Object.entries(radii).map(([role, value]) => `--radius-rui-${role}: ${value};`);

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
    // not `inline`: these stay variables, so a consumer can retune one by setting it
    '@theme {',
    indent([...radiusTokens, ...shadowTokens]),
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
