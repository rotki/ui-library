<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { ContextColorsType } from '@/consts/colors';
import type { VueClassValue } from '@/types/class-value';
import { TabAlignment, TabIndicatorPosition, TabLayout, TabVariant } from '@/components/tabs/tab-props';
import { useTabLink } from '@/components/tabs/tab/use-tab-link';
import { cn, tv } from '@/utils/tv';

export interface RuiTabClassNames {
  root?: VueClassValue;
  active?: VueClassValue;
}

export interface Props {
  color?: ContextColorsType;
  disabled?: boolean;
  grow?: boolean;
  value?: number | string;
  active?: boolean;
  classNames?: RuiTabClassNames;
  link?: boolean;
  target?: string;
  to?: RouteLocationRaw;
  exact?: boolean;
  vertical?: boolean;
  align?: TabAlignment;
  indicatorPosition?: TabIndicatorPosition;
  variant?: TabVariant;
}

defineOptions({
  name: 'RuiTab',
  inheritAttrs: false,
});

const {
  color,
  disabled = false,
  grow = false,
  value = useId(),
  active = false,
  classNames,
  link = false,
  to = '',
  target = '_self',
  exact = false,
  vertical = false,
  align = TabAlignment.center,
  indicatorPosition = TabIndicatorPosition.end,
  variant = TabVariant.underline,
} = defineProps<Props>();

const emit = defineEmits<{
  click: [value: string | number];
}>();

const slots = defineSlots<{
  default?: (props?: object) => any;
  prepend?: (props?: object) => any;
  append?: (props?: object) => any;
}>();

/**
 * A tab is a plain button or link: RuiTabs draws the active indicator, so a tab
 * only sets its label color, and its hover fill. On the underline bar the fill
 * hugs the label rather than the 40px cell, so the bar stays calm.
 */
const tab = tv({
  slots: {
    root: [
      'group relative inline-flex shrink-0 items-center whitespace-nowrap rounded-rui-control',
      'text-sm font-medium text-rui-text-secondary transition-colors duration-150 [--rui-icon-size:1rem]',
      // inset, since the scrolling bar would clip a ring drawn outside the tab
      'outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    ].join(' '),
    content: 'inline-flex items-center gap-2 rounded-rui-control transition-colors duration-150',
  },
  variants: {
    variant: {
      [TabVariant.underline]: { root: 'px-1', content: 'h-8 px-2' },
      // above the sliding pill, which RuiTabs renders behind the tabs
      [TabVariant.segmented]: { root: 'z-1 h-8 px-3' },
    },
    layout: {
      [TabLayout.horizontal]: {},
      [TabLayout.vertical]: { root: 'w-full' },
    },
    align: {
      start: { root: 'justify-start text-left rtl:justify-end rtl:text-right' },
      center: { root: 'justify-center text-center' },
      end: { root: 'justify-end text-right rtl:justify-start rtl:text-left' },
    },
    grow: {
      true: { root: 'grow' },
    },
    active: {
      true: { root: 'text-rui-text' },
      false: {},
    },
    disabled: {
      true: { root: 'cursor-not-allowed text-rui-text-disabled' },
      false: { root: 'cursor-pointer hover:text-rui-text' },
    },
  },
  compoundVariants: [
    { variant: TabVariant.underline, layout: TabLayout.horizontal, class: { root: 'h-10' } },
    { variant: TabVariant.underline, layout: TabLayout.horizontal, disabled: false, class: { content: 'group-hover:bg-rui-hover' } },
    // a vertical list fills the whole row on hover and keeps that fill on the selected row
    { variant: TabVariant.underline, layout: TabLayout.vertical, class: { root: 'min-h-9 px-3', content: 'h-auto px-0 py-2' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, disabled: false, class: { root: 'hover:bg-rui-hover' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, active: true, class: { root: 'bg-rui-hover' } },
  ],
  defaultVariants: {
    variant: TabVariant.underline,
    layout: TabLayout.horizontal,
    align: 'center',
    active: false,
    disabled: false,
  },
});

const { isRouteActive, href: linkHref, navigate, isLink } = useTabLink({
  link: () => link,
  to: () => to,
  exact: () => exact,
});

const layout = computed<TabLayout>(() => vertical ? TabLayout.vertical : TabLayout.horizontal);
const isSelf = computed<boolean>(() => target === '_self');
const isEffectivelyActive = computed<boolean>(() => active || get(isRouteActive));
const ui = computed<ReturnType<typeof tab>>(() => tab({
  variant,
  layout: get(layout),
  align,
  grow,
  disabled,
  active: get(isEffectivelyActive),
}));

function onClick(event: MouseEvent): void {
  if (disabled) {
    event.preventDefault();
    return;
  }

  emit('click', value);
  if (navigate && get(isSelf))
    navigate(event);
}
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :type="isLink ? undefined : 'button'"
    :class="[
      ui.root({ class: cn(classNames?.root) }),
      isEffectivelyActive && classNames?.active,
    ]"
    :data-active-tab="isEffectivelyActive || undefined"
    :data-align="align"
    :data-indicator-position="indicatorPosition"
    :data-vertical="vertical || undefined"
    :data-variant="variant"
    :data-color="isEffectivelyActive ? color : undefined"
    :disabled="isLink ? undefined : disabled"
    :aria-disabled="isLink && disabled ? 'true' : undefined"
    :href="isLink && !isSelf && !disabled ? linkHref : undefined"
    :target="isLink ? target : undefined"
    role="tab"
    :aria-selected="isEffectivelyActive"
    :tabindex="isEffectivelyActive && !disabled ? 0 : -1"
    v-bind="$attrs"
    @click="onClick($event)"
  >
    <span :class="ui.content()">
      <slot
        v-if="slots.prepend"
        name="prepend"
      />
      <slot />
      <slot
        v-if="slots.append"
        name="append"
      />
    </span>
  </component>
</template>
