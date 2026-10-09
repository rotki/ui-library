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
import {
  chartColors,
  contextTints,
  dialogSizes,
  insetSurfaceColors,
  lineColors,
  neutralShades,
  type RadiusRole,
  type ShadowRole,
  stateColors,
  surfaceColors,
  zLayers,
} from '../consts/tokens';

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
  tracking?: string;
}

/**
 * The type scale, sized for Inter. Headings are semibold and step down
 * gently from 60px, tightening their letter spacing as they grow (see
 * `letterSpacing`); there are no light display sizes, no weights above
 * semibold and no uppercase. A size alone keeps that size's own line height.
 */
const typography: Typography[] = [
  { name: 'body-1', size: 'base' },
  { name: 'body-2', size: 'sm' },
  { name: 'caption', size: 'xs', lineHeight: '1.25rem' },
  // 10px, for a dense tag or a meta line under a value; the smallest size the scale allows
  { name: 'caption-2', size: '[0.625rem]', lineHeight: '1rem' },
  { name: 'h1', size: '6xl', lineHeight: '4.5rem', weight: 'semibold' },
  { name: 'h2', size: '5xl', lineHeight: '3.5rem', weight: 'semibold' },
  { name: 'h3', size: '4xl', lineHeight: '2.75rem', weight: 'semibold' },
  { name: 'h4', size: '3xl', lineHeight: '2.375rem', weight: 'semibold' },
  { name: 'h5', size: '2xl', lineHeight: '2rem', weight: 'semibold' },
  { name: 'h6', size: 'xl', lineHeight: '2rem', weight: 'semibold' },
  { name: 'overline', size: 'xs', lineHeight: '2rem', weight: 'medium', tracking: 'wide' },
  { name: 'subtitle-1', size: 'base', lineHeight: '1.75rem', weight: 'medium' },
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
        // the solid fill behind light text: `main` in light, the deep `darker` for a status color in dark
        `--color-rui-${prefix}${color}-fill: rgb(var(--rui-${prefix}${color}-fill));`,
        // `color-mix`, since the channels are comma separated and `rgb(r, g, b / a)` is not valid CSS
        ...Object.entries(contextTints).map(([tint, percent]) =>
          `--color-rui-${prefix}${color}-${tint}: color-mix(in oklab, rgb(var(--rui-${prefix}${color}-main)) ${percent}%, transparent);`),
      );
    }
    lines.push(
      `--color-rui-${prefix}text: var(--rui-${prefix}text-primary);`,
      `--color-rui-${prefix}text-secondary: var(--rui-${prefix}text-secondary);`,
      `--color-rui-${prefix}text-disabled: var(--rui-${prefix}text-disabled);`,
    );
  }

  /*
   * The semantic surfaces, lines and state layers. The adaptive ones follow the theme on their
   * own, one class instead of a `dark:` pair; the `light-` and `dark-` ones are for a part that
   * keeps one look.
   */
  for (const prefix of [...themes.map(theme => `${theme}-`), '']) {
    for (const surface of [...surfaceColors, ...insetSurfaceColors, ...chartColors, 'link'])
      lines.push(`--color-rui-${prefix}${surface}: rgb(var(--rui-${prefix}${surface}));`);
    for (const line of [...lineColors, ...stateColors])
      lines.push(`--color-rui-${prefix}${line}: var(--rui-${prefix}${line});`);
  }

  // text on a context fill; white for the library's colors, overridable for a light themed primary
  for (const color of contextColors)
    lines.push(`--color-rui-${color}-foreground: rgb(var(--rui-${color}-foreground));`);

  // a loading veil: the surface, slightly see-through
  lines.push('--color-rui-veil: color-mix(in oklab, rgb(var(--rui-surface)) 88%, transparent);');

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

/**
 * The font stacks. The library names the fonts and the app loads them, the
 * variable `@fontsource-variable` builds or the static `@fontsource` ones.
 * Inter's `cv05` (tailed l) and `cv08` (serifed capital I) tell l, I and 1
 * apart in labels and amounts.
 */
const fonts: string[] = [
  `--font-sans: 'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;`,
  `--font-sans--font-feature-settings: 'cv05', 'cv08';`,
  `--font-mono: 'Geist Mono Variable', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`,
];

/**
 * Inter's optical tracking: the bigger the size, the tighter. Each `text-<size>` utility applies
 * its own value, and an explicit `tracking-*` class still wins.
 */
const letterSpacing: Record<string, string> = {
  'sm': '-0.006em',
  'base': '-0.011em',
  'lg': '-0.014em',
  'xl': '-0.017em',
  '2xl': '-0.019em',
  '3xl': '-0.022em',
  '4xl': '-0.022em',
  '5xl': '-0.022em',
  '6xl': '-0.022em',
};

/** Shadows by role: popups get the high one, a raised control or a tooltip the low one. */
const roleShadows: Record<ShadowRole, string> = {
  menu: highShadow,
  drawer: highShadow,
  tooltip: lowShadow,
  control: lowShadow,
};

function typographyUtility({ name, size, lineHeight, weight, tracking }: Typography): string {
  const applied = [`text-${size}`, weight ? `font-${weight}` : undefined, tracking ? `tracking-${tracking}` : undefined]
    .filter(Boolean)
    .join(' ');
  const body = [`  @apply ${applied};`];
  if (lineHeight)
    body.push(`  line-height: ${lineHeight};`);

  return `@utility text-${name} {\n${body.join('\n')}\n}`;
}

/** The layout tokens, each a reference to its `--rui-*` variable. */
function layoutTokens(): string[] {
  return [
    '--spacing-rui-app-bar: var(--rui-app-bar-height);',
    ...dialogSizes.map(size => `--container-rui-dialog-${size}: var(--rui-dialog-${size});`),
    '--container-rui-tooltip: var(--rui-tooltip-max-width);',
  ];
}

function indent(lines: string[]): string {
  return lines.map(line => `  ${line}`).join('\n');
}

/** The full contents of `theme.css`. */
export function buildThemeCss(): string {
  const shadowTokens = Object.entries(roleShadows).map(([role, value]) => `--shadow-rui-${role}: ${value};`);
  const radiusTokens = Object.entries(radii).map(([role, value]) => `--radius-rui-${role}: ${value};`);
  const trackingTokens = Object.entries(letterSpacing).map(([size, value]) => `--text-${size}--letter-spacing: ${value};`);

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
    /*
     * Layout tokens, held in `--rui-*` (`tokens.css`) so the library's own components read the same
     * values: the app bar height as a spacing (`h-`, `top-`, `mt-`, `scroll-pt-rui-app-bar`), and
     * the dialog and tooltip widths as containers (`max-w-rui-dialog-md`).
     */
    '@theme inline {',
    indent(layoutTokens()),
    '}',
    '',
    ...zLayers.map(layer => `@utility z-rui-${layer} {\n  z-index: var(--rui-z-${layer});\n}\n`),
    /*
     * A thin scrollbar in the neutral ramp, opt-in as `rui-scrollbar` on a scrolling element. The
     * standard properties cover Firefox and current Chromium; the pseudo-elements, older WebKit.
     */
    '@utility rui-scrollbar {',
    '  scrollbar-width: thin;',
    '  scrollbar-color: var(--rui-scrollbar-thumb) transparent;',
    '  &::-webkit-scrollbar {',
    '    width: 0.5rem;',
    '    height: 0.5rem;',
    '  }',
    '  &::-webkit-scrollbar-thumb {',
    '    border-radius: 9999px;',
    '    background-color: var(--rui-scrollbar-thumb);',
    '  }',
    '  &::-webkit-scrollbar-thumb:hover {',
    '    background-color: var(--rui-scrollbar-thumb-hover);',
    '  }',
    '  &::-webkit-scrollbar-thumb:active {',
    '    background-color: var(--rui-scrollbar-thumb-active);',
    '  }',
    '}',
    '',
    // not `inline`: these stay variables, so a consumer can retune one by setting it
    '@theme {',
    indent([...fonts, ...trackingTokens, ...radiusTokens, ...shadowTokens]),
    '}',
    '',
    '@utility border-default {',
    '  border-color: var(--rui-divider);',
    '}',
    '',
    /*
     * The one keyboard focus indicator, used as `focus-visible:focus-ring`. An outline with a gap
     * rather than a ring, so it never mixes with a control's own edge or shadow, both box-shadows.
     */
    '@utility focus-ring {',
    '  outline: 2px solid rgb(var(--rui-primary-main));',
    '  outline-offset: 2px;',
    '}',
    '',
    /*
     * A hover or pressed tint over whatever fill an element has, as `hover:state-layer` and
     * `active:state-layer-pressed`. It is a background image, so it stacks on the background
     * color and leaves the text alone.
     */
    '@utility state-layer {',
    '  background-image: linear-gradient(var(--rui-hover), var(--rui-hover));',
    '}',
    '',
    '@utility state-layer-pressed {',
    '  background-image: linear-gradient(var(--rui-pressed), var(--rui-pressed));',
    '}',
    '',
    ...typography.map(item => `${typographyUtility(item)}\n`),
  ].join('\n');
}
