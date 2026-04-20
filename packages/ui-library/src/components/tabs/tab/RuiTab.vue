<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { ContextColorsType } from '@/consts/colors';
import type { VueClassValue } from '@/types/class-value';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { TabAlignment, TabIndicatorPosition, TabLayout } from '@/components/tabs/tab-props';
import { useTabLink } from '@/components/tabs/tab/use-tab-link';
import { tv } from '@/utils/tv';

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
  /** @deprecated Use `classNames.active` instead */
  activeClass?: string;
  link?: boolean;
  target?: string;
  to?: RouteLocationRaw;
  exact?: boolean;
  /** @deprecated No longer used — vue-router's `useLink` handles route matching internally */
  exactPath?: boolean;
  vertical?: boolean;
  align?: TabAlignment;
  indicatorPosition?: TabIndicatorPosition;
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
  activeClass = '',
  link = false,
  to = '',
  target = '_self',
  exact = false,
  vertical = false,
  align = TabAlignment.center,
  indicatorPosition = TabIndicatorPosition.end,
} = defineProps<Props>();

const emit = defineEmits<{
  click: [value: string | number];
}>();

const slots = defineSlots<{
  default?: (props?: object) => any;
  prepend?: (props?: object) => any;
  append?: (props?: object) => any;
}>();

const tab = tv({
  base: 'min-w-[5.625rem] max-w-[22.5rem] flex items-center rounded-none cursor-pointer relative whitespace-nowrap shrink-0 !px-4',
  variants: {
    layout: {
      [TabLayout.horizontal]: '',
      // `min-h` instead of `h`: keep the 48px floor so simple text tabs
      // match horizontal layout, but let tabs grow to fit richer content
      // (logo + label, multi-line text) instead of clipping against the
      // scroll container's `overflow-auto`.
      [TabLayout.vertical]: '!min-h-[3rem] w-full max-w-none',
    },
    align: {
      start: 'justify-start text-left rtl:justify-end rtl:text-right',
      center: 'justify-center text-center',
      end: 'justify-end text-right rtl:justify-start rtl:text-left',
    },
    grow: {
      true: 'grow max-w-none',
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
    active: {
      true: '',
      false: '',
    },
    indicatorPosition: {
      start: '',
      end: '',
    },
  },
  compoundVariants: [
    // Horizontal active indicator (bottom/top border)
    { active: true, layout: TabLayout.horizontal, indicatorPosition: 'end', class: `after:content-[''] after:absolute after:border-current after:h-0 after:w-full after:bottom-0 after:left-0 after:border-b-2` },
    { active: true, layout: TabLayout.horizontal, indicatorPosition: 'start', class: `after:content-[''] after:absolute after:border-current after:h-0 after:w-full after:top-0 after:left-0 after:border-b-2` },
    // Vertical active indicator (right/left border)
    { active: true, layout: TabLayout.vertical, indicatorPosition: 'end', class: `after:content-[''] after:absolute after:border-current after:h-full after:w-0 after:right-0 after:left-auto after:border-r-2` },
    { active: true, layout: TabLayout.vertical, indicatorPosition: 'start', class: `after:content-[''] after:absolute after:border-current after:h-full after:w-0 after:left-0 after:right-auto after:border-r-2` },
  ],
  defaultVariants: { layout: TabLayout.horizontal, align: 'center', indicatorPosition: 'end', active: false },
});

const { isRouteActive, href: linkHref, navigate, isLink } = useTabLink({
  link: () => link,
  to: () => to,
  exact: () => exact,
});

const layout = computed<TabLayout>(() => vertical ? TabLayout.vertical : TabLayout.horizontal);
const isSelf = computed<boolean>(() => target === '_self');
const isEffectivelyActive = computed<boolean>(() => active || get(isRouteActive));

function onClick(event?: MouseEvent): void {
  emit('click', value);
  if (navigate && get(isSelf) && event)
    navigate(event);
}
</script>

<template>
  <RuiButton
    :class="[
      tab({ layout, align, indicatorPosition, grow, disabled, active: isEffectivelyActive }),
      isEffectivelyActive && (classNames?.active ?? activeClass),
    ]"
    :data-active-tab="isEffectivelyActive || undefined"
    :data-align="align"
    :data-indicator-position="indicatorPosition"
    :data-vertical="vertical || undefined"
    :color="isEffectivelyActive ? color : undefined"
    :disabled="disabled"
    :href="isLink && !isSelf ? linkHref : undefined"
    :target="isLink ? target : undefined"
    :tag="isLink ? 'a' : undefined"
    :no-outline="isLink"
    role="tab"
    :aria-selected="isEffectivelyActive"
    tabindex="-1"
    hide-focus-indicator
    variant="text"
    v-bind="$attrs"
    @click="disabled ? undefined : onClick($event)"
  >
    <template
      v-if="slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>
    <slot />
    <template
      v-if="slots.append"
      #append
    >
      <slot name="append" />
    </template>
  </RuiButton>
</template>
