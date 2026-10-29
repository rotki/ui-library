<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { ContextColorsType } from '@/consts/colors';
import type { VueClassValue } from '@/types/class-value';
import { TabAlignment, TabIndicatorPosition, TabLayout, TabVariant } from '@/components/tabs/tab-props';
import { useTabLink } from '@/components/tabs/tab/use-tab-link';
import { cn } from '@/utils/tv';
import { tabStyles } from './tab-styles';

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

const { isRouteActive, href: linkHref, navigate, isLink } = useTabLink({
  link: () => link,
  to: () => to,
  exact: () => exact,
});

const layout = computed<TabLayout>(() => vertical ? TabLayout.vertical : TabLayout.horizontal);
const isSelf = computed<boolean>(() => target === '_self');
const isEffectivelyActive = computed<boolean>(() => active || get(isRouteActive));
const ui = computed<ReturnType<typeof tabStyles>>(() => tabStyles({
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
