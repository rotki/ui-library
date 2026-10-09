# Upgrading to 3.0

3.0 moves the library to Tailwind CSS 4 and replaces the Material look with a neutral one
([#585](https://github.com/rotki/ui-library/issues/585)). This guide lists what an app has to change. It
grows with the release branch.

## Tailwind setup

The app's own Tailwind 4 build now generates the library's classes. Replace the 2.x setup, the Tailwind 3
plugin and the `style.css` import, with one line in your Tailwind CSS entry:

```css
@import 'tailwindcss';
@import '@rotki/ui-library/tailwind.css';
```

Remove `import '@rotki/ui-library/style.css'` (and any `dist/style.css` path) from your app code. The
prebuilt `style.css` still exists for an app without Tailwind, but loaded next to `tailwind.css` it ships
every class twice and, loading later, overrides your responsive classes: a `grid-cols-1 lg:grid-cols-3` in
your app stayed one column whenever a library component used `grid-cols-1`.

`@rotki/ui-library/theme.css` still exports the tokens alone, for a stylesheet that needs them without the
components.

Also drop the `@rotki/ui-library/theme` plugin from `tailwind.config.ts` (3.0 no longer exports it), along
with `mode: 'jit'` and `darkMode: 'class'`: the library defines the `dark` variant on `.dark`.

### Running the codemod

Tailwind's upgrade tool does most of the app-side move, but check its output before committing:

- **Pin the version.** `pnpm dlx @tailwindcss/upgrade@<version> --force` refuses a
  `"tailwindcss": "catalog:"` specifier. Write the installed version into the app's `package.json` for the
  run and put `catalog:` back afterwards.
- **It renames bare words, not just classes.** Any word that matches a renamed v3 utility is rewritten
  wherever it appears: `blur` → `blur-sm`, `ring` → `ring-3`, `rounded` → `rounded-sm`,
  `shadow` → `shadow-sm`, `outline-none` → `outline-hidden`. In rotki it hit a custom `.blur` utility (some
  call sites became invalid unquoted object keys, `{ blur-sm: x }`), an `app.directive('blur')` name, emit
  names in specs (`'blur'` → `'blur-sm'`) and test titles ("should ring-3 only..."). In rotki the spec
  changes were all of this kind, so `git restore` on the spec files was the quickest fix. Then search
  the diff for `blur-sm`, `ring-3`, `rounded-sm`, `shadow-sm` and `outline-hidden` outside class strings.
- **`@apply` in scoped styles** needs `@reference 'tailwindcss';` at the top of the `<style>` block.
- **Classes that did nothing on v3 may work now.** v4 builds numeric utilities from the spacing scale,
  so a class outside v3's fixed scale that was silently ignored now applies. In rotki a notification
  had `text-body-2 leading-2`: on v3 `leading-2` did not exist, on v4 it is an 8px line height and the
  lines overlap. Search for `leading-0`, `leading-1`, `leading-2` and `leading-11` and up, and check
  any class that surprises you in the browser's computed styles.
- **Unlayered third-party CSS now beats utilities.** Tailwind 4 puts utilities in `@layer utilities`,
  and a rule outside any layer wins over every layered one, whatever its specificity. vue-echarts
  adopts `x-vue-echarts { height: 100% }`, so a chart's `h-72` lost and the chart drew 0px tall
  inside an auto-height parent. Mark the size important (`h-72!`) or size a wrapper instead. In rotki:
  `NetWorthChart`, `AccountingOverlaySparkline`; in premium-components the four `<VChart>` graphs.
- **v4 default changes** (bare `border` and `ring` colors and widths, placeholder color, button cursor)
  are not part of the codemod. The tool adds a border-color fallback to your CSS entry; keep it until
  you have checked the screens.

## Fonts

The library no longer sets Roboto on every element. It names Inter and Geist Mono in the theme's font
stacks, and the app loads them:

```bash
pnpm remove @fontsource/roboto
pnpm add -D @fontsource-variable/inter @fontsource-variable/geist-mono
```

```typescript
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/geist-mono';
```

## Text fields, selects and pickers

Fields show their label above a plain bordered box instead of floating it into the border. The box is
36px tall (32px `dense`) with 14px text, so a labelled field takes about 60px, close to the 56px of a
2.x outlined field. This covers `RuiTextField`, `RuiRevealableTextField`, `RuiTextArea`, `RuiMenuSelect`,
`RuiAutoComplete`, `RuiDateTimePicker`, `RuiTimezoneSelect` and `RuiCategoryPicker`.

A new `labelPlacement` prop picks where the label goes:

| Value    | Use it for                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `top`    | the default: forms in dialogs and pages                                                                                   |
| `hidden` | search and filter fields, and rows that already name the field; the label stays for screen readers, the placeholder shows |

The 2.x floating label is gone, and with it the `variant` prop (`default`, `filled`, `outlined`) on all eight
fields: every field draws the bordered box. Delete `variant="..."` from these components. Only a typed
`defineProps` or a strict template check reports a leftover one; otherwise Vue passes it to the DOM as a
stray attribute (see [Finding removed props](#finding-removed-props)). The `activator.label` slot of `RuiMenuSelect`, `RuiAutoComplete` and `RuiCategoryPicker`, which
only filled the floating label, is removed too, as is `variant` from their `activator` slot props.

Set the placement once instead of on every field:

```typescript
// every field in the app
createRui({ defaults: { field: { labelPlacement: 'hidden' } } });
```

```vue
<!-- every field below, for example in a settings row that shows its own title -->
<RuiFieldDefaults label-placement="hidden">
  <RuiTextField v-model="value" label="Interval" />
</RuiFieldDefaults>
```

A field's own prop wins over `RuiFieldDefaults`, which wins over the app default.

Labels are now linked to their field: text inputs through `for`, selects and pickers through
`aria-labelledby`. A test that looked for the label or the required mark (`﹡`) inside the activator finds
it in the label above, `[data-id=field-label]`.

Things to check in an app:

- A button placed next to a field and sized to the 56px or 40px box (`h-10`, `mt-1` in an `items-start`
  row) lines up with the label now. Align the row to the end (`items-end`), or set `label-placement="hidden"`
  on a field that sits in a toolbar.
- Overrides that reach into the field keep working where they target the border (`[&_fieldset]`), since the
  border is still drawn by a `fieldset`. Overrides that style the field's `<label>` element do not: there is
  no label inside the field any more.
- A field with neither `label` nor `placeholder` is an empty box. Give search and filter fields a `label`
  with `label-placement="hidden"` and a `placeholder`.
- `RuiMenuSelect` and `RuiAutoComplete` options are 40px tall (32px `dense`), and `itemHeight` now defaults
  to those heights instead of 48 (30 `dense`), which left a gap under the last option. Pass `item-height`
  only for an `#item` slot of another height. A `list` button at size `sm` grows from 24px to 32px with it.
- `RuiMenuSelect` follows the select-only combobox pattern: its activator is `role="combobox"`, the
  popup is `role="listbox"` and each option is `role="option"`. `RuiAutoComplete`, `RuiTimezoneSelect`
  included, opens a `listbox` of `option`s too. Tests that found the activator as a `button` or the popup
  as `menu` look for `combobox`, `listbox` and `option` instead (`getByRole('option', { name: 'EUR' })`).
- In `RuiAutoComplete` (and `RuiTimezoneSelect`) the search input is the combobox (ARIA 1.2), not the box
  around it: `role="combobox"`, `aria-expanded`, `aria-required`, `aria-readonly`, `aria-busy`,
  `aria-invalid` and `aria-activedescendant` sit on the input, and an `aria-label` passed to the component
  lands there too. The box (`[data-id=activator]`) is no longer a tab stop; Tab goes straight to the input,
  and focus stays on it after a pick, with the picked value still shown. A disabled field disables the
  input rather than setting `aria-disabled` on the box. Tests that read those attributes or that focus off
  `[data-id=activator]` read them from `getByRole('combobox')`; clicks on the box work as before.
- Chips never take focus. Backspace or ← on an empty input selects a chip (drawn with a ring, marked
  `data-selected`, and announced to screen readers) while focus stays in the input, so a browser that maps
  Backspace to Back (Vivaldi) cannot navigate away. Tests that expected a chip to be focused check
  `data-selected` instead.

## Shadows and elevation

Surfaces have no shadow any more; borders and background steps separate them. The Material elevation
scale is gone:

| 2.x                          | 3.0                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `shadow-1` to `shadow-24`    | removed. Use a role shadow below, or Tailwind's own `shadow-sm` to `shadow-2xl` |
| `RuiCard` `elevation` prop   | removed. Use `variant="outlined"` (the default) or `variant="flat"`             |
| `RuiButton` `elevation` prop | removed. The `fab` variant keeps a shadow of its own                            |
| `--rui-shadow-tertiary`      | removed                                                                         |

The role shadows are `shadow-rui-menu` and `shadow-rui-drawer` for popups, `shadow-rui-tooltip`, and
`shadow-rui-control` for a part raised off a surface, like a slider thumb.

## Surface colors

The surfaces moved to the zinc ramp in dark mode: page `#09090b`, card `#18181b`, menu and overlay
`#27272a`. Light mode stays white. An app that copied the 2.x dark surfaces into its own colors will
now show two greys side by side, so move those colors onto the theme's surface tokens:

| 2.x color you may have copied | 3.0 class           |
| ----------------------------- | ------------------- |
| page, `#121212`               | `bg-rui-background` |
| card, `#1E1E1E`               | `bg-rui-surface`    |
| menu, `#2E2E2E`               | `bg-rui-menu`       |
| overlay, `#363636`            | `bg-rui-overlay`    |

The plain tokens follow the theme, so a `bg-white dark:bg-<your card color>` pair becomes one
`bg-rui-surface`, and opacity works as usual (`bg-rui-surface/90`). When only one side should change,
keep the light class and use the dark token: `bg-rui-grey-50 dark:bg-rui-dark-background`. Every surface
also has `light-` and `dark-` versions for a part that keeps one look in both themes, and the same names
work in other color utilities (`to-rui-surface` in a gradient, `border-rui-menu`).

Lines follow the same pattern: `border-rui-divider` between rows and `border-rui-outline` around an
outlined control. `border-default` now uses the divider color too.

`border-rui-outline` is the edge that identifies a control, and it now reaches 3:1 against the page,
the card and the menu in both themes (WCAG 1.4.11): text fields, selects, outlined grey buttons and
chips, the switch's off track and the slider rail all use it. Use it for an edge someone has to see to
find a control, and `border-rui-divider` for anything decorative; an app that used `border-rui-outline`
for a card or a separator will now draw it darker. Disabled fields drop to the divider.

A bare `border` (no color class) takes the divider color in both themes. Tailwind 3 gave it a fixed
light grey that drew a bright line in dark mode. The base placeholder color is now 4.8:1 on white
(6.9:1 on the dark card) instead of Tailwind 3's 2.5:1.

The Material grey ramp (`rui-grey-*`) is still defined but the library no longer uses it. Prefer the zinc
ramp, `rui-neutral-50` to `rui-neutral-950`, so your greys match the components. Match by lightness, not
by number: from `300` up, zinc runs darker, so `grey-800` is closest to `neutral-700` and `grey-900` to
`neutral-800`.

The other Material hues are gone: `rui-red-*`, `rui-pink-*`, `rui-purple-*`, `rui-deep-purple-*`,
`rui-indigo-*`, `rui-blue-*`, `rui-light-blue-*`, `rui-cyan-*`, `rui-teal-*`, `rui-green-*`,
`rui-light-green-*`, `rui-lime-*`, `rui-yellow-*`, `rui-amber-*`, `rui-orange-*`, `rui-deep-orange-*` and
`rui-blue-gray-*`, with their `--rui-*` variables. Use a status color for status (`rui-error`,
`rui-success` and the rest, or a `tonal` chip), and Tailwind's own palette for anything else.

## Status colors

Error, warning, info and success are calmer than the Material colors they replace, and in dark mode
they split into a text tone and a fill tone:

| Color   | Light `main` | Dark `main` (text) | Dark `darker` (fill) |
| ------- | ------------ | ------------------ | -------------------- |
| error   | `#c42b2b`    | `#f47067`          | `#c42b2b`            |
| warning | `#a35a00`    | `#d9a441`          | `#a35a00`            |
| info    | `#0369a1`    | `#6cb6ff`          | `#0369a1`            |
| success | `#1f7a3d`    | `#57ab5a`          | `#1f7a3d`            |

In dark mode `main` is a tone that reads as text on every surface, and `darker` is the deep fill, the
same color as light `main`. The library's filled buttons, chips, badges, avatars, alerts, switches and
checkboxes use `darker` in dark mode with white text, where 2.x used a bright fill with black text. Every
pair reaches 4.5:1.

`text-rui-success` and the other text uses keep working in both themes. A solid fill of your own behind
text should use `bg-rui-error-fill text-rui-error-foreground`: the fill is `main` in light and `darker`
in dark, so one class replaces a `bg-rui-error dark:bg-rui-error-darker text-white` set and matches the
components.

## Text colors and type

The text tokens are solid zinc colors instead of black or white at partial opacity:

| Token                  | Light     | Dark      |
| ---------------------- | --------- | --------- |
| `--rui-text-primary`   | `#09090b` | `#fafafa` |
| `--rui-text-secondary` | `#52525b` | `#a1a1aa` |
| `--rui-text-disabled`  | `#a1a1aa` | `#71717a` |

Text on a colored background no longer picks up that color through the transparency. Where you relied on
it, set the color yourself.

Each text size now applies Inter's letter spacing, slightly tighter as the size grows. An explicit
`tracking-*` class still wins. Headings no longer add `tracking-tight`, and no component uses a weight
above semibold.

Dark primary and secondary are a little brighter, so that their text reaches 4.5:1 contrast. In dark
mode, colored text on outlined and text buttons, outlined chips and error hints uses the color's
`-lighter` tone for primary, secondary and error.

## Design tokens for app code

3.0 ships the values the rotki apps kept writing by hand, so the library is the one place they are set.
Each is a `--rui-*` variable (an app can retune it) with Tailwind utilities on top, and the library's own
components read the same variables.

| Need                   | Utilities                                                                                    | Variables                                        |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Status and brand tints | `bg-rui-<color>-subtle` (5%), `-soft` (10%), `border-rui-<color>-border` (30%)               | from `--rui-<color>-main`                        |
| Solid fill behind text | `bg-rui-<color>-fill text-rui-<color>-foreground`                                            | `--rui-<color>-fill`, `--rui-<color>-foreground` |
| Quiet surfaces         | `bg-rui-surface-muted` (tracks, wells), `bg-rui-surface-sunken` (inset panel)                | `--rui-surface-muted`, `--rui-surface-sunken`    |
| Hover and pressed tint | `bg-rui-hover`, `bg-rui-pressed`, or `hover:state-layer` over any fill                       | `--rui-hover`, `--rui-pressed`                   |
| Loading veil           | `bg-rui-veil` (the surface at 88%)                                                           | `--rui-surface`                                  |
| Links                  | `text-rui-link`                                                                              | `--rui-link`                                     |
| Charts and legends     | `bg-rui-chart-1` to `-8`, `bg-rui-chart-other` (any color utility)                           | `--rui-chart-*`                                  |
| Scrollbars             | `rui-scrollbar` on a scrolling element                                                       | `--rui-scrollbar-thumb(-hover, -active)`         |
| 10px text              | `text-caption-2`                                                                             |                                                  |
| App bar height         | `h-rui-app-bar`, `top-rui-app-bar`, `mt-rui-app-bar`, `scroll-pt-rui-app-bar`                | `--rui-app-bar-height` (56px, 64px from md)      |
| Stacking               | `z-rui-<layer>`: raised, floating, app-bar, drawer, dialog, menu, tooltip, toast or blocking | `--rui-z-*` (10, 15, 20, 30, 1000 to 2000)       |
| Dialog widths          | `<RuiDialog size="md">`, or `max-w-rui-dialog-sm` to `-2xl`                                  | `--rui-dialog-*` (400, 500, 600, 800, 1000px)    |
| Tooltip width          | wraps at 20rem by default; a `max-w-*` in `classNames.tooltip` replaces it                   | `--rui-tooltip-max-width`                        |

The components moved onto the stacking layers: dialogs sit on `dialog` (was `z-index: 9999`, now a
`zIndex` default of `var(--rui-z-dialog)`), menus and the category picker on `menu`, tooltips on
`tooltip` (all were 9999), notifications on `toast` (was `z-50`), a modal drawer and its scrim on `drawer`
(was 10000, above every dialog) and a docked drawer on `app-bar` (was `z-7`). A menu opened inside a
dialog now sits above it without a raised `z-index`, a dialog opened from a modal drawer is no longer
hidden behind it, and a toast shows over an open dialog. Drop `z-index="10000"` on dialogs and
`z-[10001]` on their menus; put the app's own fixed parts on a layer (`z-rui-app-bar` for the app bar).

**Move fixed page parts onto `floating`.** A data table's pagination bar now sticks to the bottom of
the view on `raised` (10), like its stuck header at the top. A part the app fixes over the page with a
smaller number, such as a task dock in a corner (`z-7`), a side tab or a FAB, ends up under the bar.
Give it `z-rui-floating` (15): above the sticky parts of the content, below the app bar. In rotki:
`TaskDock`, `PinnedSidebar`, the scroll-to-top FAB in `AppCore` and the dashboard's message banner.

On top, a part in the bottom corner would hide the bar's page buttons. While a bar is stuck to the page,
the table sets `--rui-sticky-bottom` on the root to the bar's height (`0px` otherwise), so lift the part
by it: `bottom-[calc(1rem+var(--rui-sticky-bottom))] transition-[bottom]`. In rotki: `TaskDock` and the
scroll-to-top FAB.

A bar sticks only to the page, or to an area that really scrolls. An ancestor with `overflow: hidden` or
`auto` that never scrolls (a `RuiCard`'s content, a `RuiAccordion`, an app root with `overflow-hidden`)
holds it in place; frame such a table without the card, and use `overflow-clip` on a root that only has
to cut off overflow.

**Drawers below the app bar.** `RuiNavigationDrawer` takes `below-app-bar`: the drawer, and a modal
drawer's overlay, start under the app bar (`--rui-app-bar-height`, 56px and 64px from md), so the app
bar stays uncovered and its buttons keep working while the drawer is open. Without it a drawer runs the
full height and a modal one covers the app bar. Drop global rules that pushed every `aside` down (rotki's
`aside { !top-[3.5rem] md:!top-[4rem] }`: on v4 its `!important` in the base layer beats a drawer's own
`top-0!`) and pass the prop instead. An app bar of another height sets `--rui-app-bar-height`, measured
if it can wrap.

Values to move onto tokens, from the rotki apps:

| Written today                                                                 | 3.0                                                                         |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `dark-elevated`, `#1E1E1E`, `bg-white dark:bg-rui-grey-900`                   | `bg-rui-surface`                                                            |
| `dark-surface`, `#121212`                                                     | `bg-rui-background`                                                         |
| `#363636` (2.x menu surface)                                                  | `bg-rui-menu`                                                               |
| `border-default`, `border-rui-grey-200`, `divide-rui-grey-200/800`, `*/[.12]` | `border-rui-divider`, `divide-rui-divider`                                  |
| `border-rui-grey-300/400` (dark 700/800), `border-black/[0.23]`               | `border-rui-outline`                                                        |
| `bg-rui-grey-200 dark:bg-rui-grey-800`                                        | `bg-rui-surface-muted`                                                      |
| `bg-rui-grey-50 dark:bg-rui-grey-900`                                         | `bg-rui-surface-sunken`                                                     |
| `hover:bg-rui-grey-100 dark:hover:bg-rui-grey-800`                            | `hover:bg-rui-hover`                                                        |
| `bg-white/80 dark:bg-rui-grey-900/80` loading veils                           | `bg-rui-veil`                                                               |
| `bg-black/50` to `/80` scrims                                                 | `bg-rui-neutral-950/40 dark:bg-black/60`, as RuiDialog                      |
| `bg-rui-primary/[0.04]`, `/5`; `/10`, `/[0.08]`; `border-rui-primary/20`      | `-subtle`; `-soft`; `-border`                                               |
| `text-rui-grey-*`, `text-gray-*`, `text-black/[.54]`                          | `text-rui-text-secondary` or `-disabled`                                    |
| `text-white` on `bg-rui-<color>`                                              | `bg-rui-<color>-fill text-rui-<color>-foreground`                           |
| `text-[10px]`, `text-[0.625rem]`, `text-[11px]`                               | `text-caption-2`                                                            |
| `h-[3.5rem] md:h-16`, `top-[3.5rem] md:top-[4rem]`, `calc(100vh-4rem)`        | `h-rui-app-bar`, `top-rui-app-bar`, `calc(100vh-var(--rui-app-bar-height))` |
| dialog `max-width` 400 / 500 / 600 / 800 / 1000                               | `size="sm"` / `md` / `lg` / `xl` / `2xl`                                    |
| tooltip `max-w-[16rem]`, `max-w-80`                                           | drop it, or keep it to override the default                                 |
| Tailwind default chart colors (`bg-emerald-500`, `bg-blue-500`, ...)          | `bg-rui-chart-1` and on                                                     |
| the custom scrollbar in `main.css`                                            | `rui-scrollbar`                                                             |
| `rounded-md` / `rounded-lg` / `rounded-xl`                                    | `rounded-rui-control` / `rounded-rui-card` / `rounded-rui-lg`               |
| `shadow-sm`; `shadow-md`, `shadow-lg`                                         | `shadow-rui-control`; `shadow-rui-menu`                                     |

The 2.x color variables that apps read directly (`--rui-light-primary-main`, `--rui-primary-main`,
`--rui-dark-text-secondary`, `--rui-grey-*`) keep their names and their comma-separated channel format,
so `rgb(var(--rui-primary-main))` and `rgba(var(--rui-grey-800), 0.5)` still work.

## Icons

Icons draw with a 1.75 stroke instead of Lucide's 2. Set `--rui-icon-stroke` on any ancestor to change
it, for example `[--rui-icon-stroke:2]`. An icon inside a button inherits a smaller size: md is now 16px
(was 18px) and sm is 14px (was 16px). A `size` prop on `RuiIcon` still wins.

## Buttons, chips and controls

- Hover and pressed tints are the same across components. Colored text and outlined buttons tint at 6%
  on hover and 10% when pressed. Grey buttons and highlighted menu options share one neutral tint.
- Checkbox, radio, switch and slider labels are 14px, like field text. Group labels take the field
  label style.
- Disabled chips and checkbox and radio marks turn neutral instead of fading with opacity.
- `RuiChip` has a new `tonal` variant: a light tint of the color with deeper text. Use it for status
  tags (`color="success" variant="tonal"`) and keep `filled` for the few chips that should stand out;
  a column of filled status chips is the loudest thing on a table. The default variant stays `filled`.
- Its default close icon is `lu-x` (was `lu-circle-x`), at 14px (sm 12px), and tile chips use the
  small radius.
- A clickable chip tints on hover and press with the shared state layer instead of a brightness
  filter, so its text keeps its color. Enter and Space activate it.
- Only a `clickable` chip has `role="button"` and a tab stop. A plain chip is no longer announced as a
  button or focused by Tab; a test that finds chips by the button role needs a `data-id` or the
  `clickable` prop.
- The new `state-layer` and `state-layer-pressed` utilities (`hover:state-layer`,
  `active:state-layer-pressed`) give a custom row or item the same tints, over any background.
- The calendar marks the selected day with a rounded square and today with a ring.

### Button groups

`RuiButtonGroup` now reaches every `RuiButton` inside it, at any depth, instead of only its direct
children. A button wrapped in a `RuiTooltip`, a `RuiMenu` activator or your own component joins the
group: it takes the group's variant, color, size and disabled state, the joined edges stay square and
the outer corners round. The buttons inside a menu, tooltip or dialog that opens from the group stay
plain.

- **Give every selectable button a `model-value`.** A `v-model` group no longer falls back to a
  button's position, so a button without a value is never pressed and clicking it changes nothing:

  ```vue
  <RuiButtonGroup v-model="period">
    <RuiButton model-value="day">Day</RuiButton>
    <RuiButton model-value="week">Week</RuiButton>
  </RuiButtonGroup>
  ```

- **Remove hand-written seams from split buttons.** Classes that joined wrapped buttons by hand
  (`rounded-l-none`, `rounded-r-none`, `rounded-none`, `border-r ...`, `-ml-[1px]`, `outline-0`) are not
  needed any more, and a leftover border now draws a second line next to the group's divider. See the
  `SplitButton` story for the pattern.
- A button's own classes now win over the group's, where before the group's won.

## Tabs

`RuiTabs` drops the Material bar (48px uppercase buttons, 90px minimum width, a tinted block under the
active tab) for two variants:

- `variant="underline"`, the default: 40px, sentence-case labels sized to their text on a 1px divider
  track. Idle labels are secondary text; the active one takes the full text color, and a 2px line slides
  to it. Hover fills a rounded box around the label. Vertical tabs fill the whole row on hover and keep
  that fill on the selected row.
- `variant="segmented"`: a raised pill sliding on a sunken track, for a few short options that switch a
  view in place (chart ranges, list or grid). It sits inline with other controls.

What changes for an app:

- `RuiTab` is its own `<button>` (or `<a>` for a link tab), no longer a `RuiButton`. Its
  `data-variant` is `underline` or `segmented` instead of `text`, and button classes or props passed
  through to it no longer apply.
- `color` only colors the underline. The active label stays the text color, and the segmented pill
  ignores it.
- The keyboard follows the WAI-ARIA tabs pattern: only the selected tab is a tab stop, the arrow keys
  move to the next or previous enabled tab and select it, and Home and End jump to the ends. Before,
  no tab could be reached with Tab at all.
- The active indicator is one element, `[data-id=tabs-indicator]`, beside the tablist rather than an
  `::after` on each tab, so a style that targeted `[data-active-tab]::after` has nothing to hit.
- `grow`, `align`, `vertical`, `indicatorPosition`, `disabled` and the `classNames` hooks work as before.
- A tab panel in `RuiTabItems` fades in instead of sliding sideways, so `RuiTabItem` no longer takes
  `reverse`.

## Other component changes

These change markup that an app's tests or styles may select on:

- **Steppers:** one marker component draws every step (an outlined number ahead, a filled number
  for the current step, a tinted check behind); the custom stepper's marker is 32px instead of 40px.
  `RuiFooterStepper` bullets are `<button>` elements labelled "Step N" instead of `<span>`s.
- **Time picker:** hours, minutes, seconds and AM/PM are `<button>` elements with `aria-pressed` on the
  part being edited, instead of `div[role=button]`. Select them with `getByRole('button', { name })`
  or `button[aria-label="Select hours"]`.
- **Calendar:** the month and year title is a `<button>` instead of an `<h3>`; its `data-id`
  (`header-title`) is unchanged.
- **Color picker:** the Hex/RGB toggle is a segmented `RuiTabs` above the field
  (`[data-id=color-format]`, tabs "Hex" and "RGB") instead of an icon button and an uppercase caption.
- **Skeleton loader:** the bars are `aria-hidden` with `data-id="skeleton"` instead of `role="alert"`,
  which made a screen reader announce every bar.
- **Navigation drawer:** a docked drawer sits on the page surface with a hairline edge; a temporary one
  keeps the overlay surface and its shadow.
- **Slider:** the rail is neutral in every color, and the thumb is a white knob with a colored edge
  that gains a halo instead of growing.
- **Badge:** the `aria-label="Badge"` is gone, so a screen reader announces the badge's text (the
  count) instead of the word "Badge". An icon-only badge is round, the icon is 60% of the badge height,
  and a `sm` badge uses 10px text.

## Data table pagination

`RuiDataTable` has one pagination bar instead of two. It sits under the rows and sticks to the bottom of
the view (or of a scrolling dialog body) while the table runs past it, so a long page can be turned from
wherever you are. The bar starts to stick once the table's header and first rows are on screen, and
stays inside its own table, so stacked and side-by-side tables each keep their own bar. A table nested
in an expanded row never sticks its bar, and drops it altogether when it pages its own rows and they all
fit the smallest page size (a breakdown of a few rows). A top-level table keeps its bar as a summary.

**Column labels show as written.** A label in `cols` was title-cased ("% of net value" became "% Of Net
Value"), and the labels a table makes up from row keys were not: the condition was the wrong way round.
Now only the made-up labels are title-cased. Drop `[&_th]:normal-case` workarounds, and capitalize any
`cols` label that relied on the old behavior.

After a page change, the table scrolls back to its first row, but only when its top had scrolled out of
view. When the top is showing, nothing moves. The scroll leaves room for the `stickyOffset` app bar.

| 2.x                            | 3.0                             |
| ------------------------------ | ------------------------------- |
| bar above and below the rows   | one bar, below the rows, sticky |
| `hide-default-header`          | removed: there is no top bar    |
| `hide-default-footer`          | removed; see below              |
| both props, to hide pagination | `hide-pagination`               |

For each `hide-default-footer`: in 2.x it meant "keep only the top bar", so a table that should still
page drops the prop, and one that should not page uses `hide-pagination`. A lone `hide-default-header`
is dropped.

Tests that picked the top bar with `.first()` on `[data-id=table-pagination-*]` still work, since only
one bar is left.

**Table surfaces.** A table paints its own surface (`bg-rui-surface`), and its column header and
pagination bar share a grey tint (`bg-rui-surface-muted`), so they frame the body the same way on the
page or in a card. An expanded row and its panel share a translucent grey band (7% black, 9% white in
dark mode) and a 2px primary rail on their left edge. An open row inside another table's panel takes a
darker band (11% black, 14% white), so the two levels never share a grey, and each level draws its own
rail. A nested table's header and pagination step by depth the same way: lighter one panel deep,
darker two deep. In 2.x the table was transparent and only a stuck header and a sticky bar painted `bg-rui-background`,
which read as a band of page color on any surface. Drop `bg-white` / `dark:bg-…` classes added to tables
or their wrappers to get a surface. An expanded row insets its content 16px on every side; drop margins
added for spacing there.

## Removed props

The props deprecated during 2.x are gone. Each has had its replacement since then, so the change can be
made on 2.x before upgrading.

### Finding removed props

Vue treats a prop a component no longer declares as a plain attribute, so a removed prop does not fail
`vue-tsc` by default: it lands on the root element, or is dropped where the component does not inherit
attributes. To list them, turn on `checkUnknownProps` for one typecheck run:

```json
{
  "vueCompilerOptions": {
    "checkUnknownProps": true
  }
}
```

The run also reports pass-through attributes such as `data-testid` and `aria-*` on components; skip those
and look for library props (`variant`, `content-class`, `hide-default-footer` and the ones below). Run it
once on 2.x as well, since props that were already unknown there are not part of this upgrade.

| Component                         | Removed                                     | Use instead                                  |
| --------------------------------- | ------------------------------------------- | -------------------------------------------- |
| `RuiMenu`, `RuiTooltip`           | `popper`                                    | `options` (same `placement`, `offset`, etc.) |
| `RuiMenu`                         | `wrapper-class`, `menu-class`               | `:class-names="{ wrapper, menu }"`           |
| `RuiTooltip`                      | `tooltip-class`                             | `:class-names="{ tooltip }"`                 |
| `RuiCard`, `RuiDialog`, `RuiChip` | `content-class`                             | `:class-names="{ content }"`                 |
| `RuiNavigationDrawer`             | `content-class`                             | `:class-names="{ content }"`                 |
| `RuiAccordion`                    | `header-class`, `content-class`             | `:class-names="{ header, content }"`         |
| `RuiStepper`                      | `title-class`, `subtitle-class`             | `:class-names="{ title, subtitle }"`         |
| `RuiSlider`                       | `slider-class`, `tick-class`                | `:class-names="{ slider, tick }"`            |
| `RuiTab`                          | `active-class`                              | `:class-names="{ active }"`                  |
| `RuiTab`                          | `exact-path`                                | `exact`, which ignores the query string      |
| `RuiMenuSelect`                   | `label-class`, `menu-class`, `option-class` | `:class-names="{ label, menu, option }"`     |
| `RuiAutoComplete`                 | `label-class`, `menu-class`                 | `:class-names="{ label, menu }"`             |

The `PopperOptions` type and `toFloatingOptions()` are removed with `popper`; type options as
`FloatingOptions`.
