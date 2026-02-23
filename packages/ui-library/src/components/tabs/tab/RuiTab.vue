<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

export interface Props {
  color?: ContextColorsType;
  disabled?: boolean;
  grow?: boolean;
  value?: number | string;
  active?: boolean;
  activeClass?: string;
  link?: boolean;
  target?: string;
  to?: RouteLocationRaw;
  exact?: boolean;
  exactPath?: boolean;
  vertical?: boolean;
  align?: 'start' | 'center' | 'end';
  indicatorPosition?: 'start' | 'end';
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
  activeClass = '',
  link = false,
  to = '',
  target = '_self',
  exact = false,
  exactPath = false,
  vertical = false,
  align = 'center',
  indicatorPosition = 'end',
} = defineProps<Props>();

const emit = defineEmits<{
  click: [value: string | number];
}>();

const slots = defineSlots<{
  default?: (props?: object) => any;
  prepend?: (props?: object) => any;
  append?: (props?: object) => any;
}>();

const css = useCssModule();

const isSelf = computed<boolean>(() => target === '_self');

const tabClass = computed<(string | undefined | Record<string, string | boolean>)[]>(() => [
  css.tab,
  css[`tab--${align}`],
  css[`tab-indicator--${indicatorPosition}`],
  {
    [css['tab--grow'] ?? '']: grow,
    [`${css['tab--active']} active-tab ${activeClass}`]: active,
    [css['tab--disabled'] ?? '']: disabled,
    [css['tab--vertical'] ?? '']: vertical,
  },
]);

function click(): void {
  emit('click', value);
}
</script>

<template>
  <RuiButton
    v-if="disabled"
    variant="text"
    disabled
    :class="tabClass"
    hide-focus-indicator
    tabindex="-1"
    role="tab"
    :aria-selected="active"
    v-bind="$attrs"
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
  <RuiButton
    v-else-if="!link"
    :class="tabClass"
    :color="active ? color : undefined"
    role="tab"
    :aria-selected="active"
    v-bind="$attrs"
    tabindex="-1"
    hide-focus-indicator
    variant="text"
    @click="click()"
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
  <RouterLink
    v-else
    #default="{ href, navigate, isActive, isExactActive }"
    :to="to"
    :exact="exact"
    :exact-path="exactPath"
    custom
  >
    <RuiButton
      :class="[
        ...tabClass,
        {
          [`${css['tab--active']} active-tab-link`]: exact ? isExactActive : isActive,
        },
      ]"
      :color="active || (exact ? isExactActive : isActive) ? color : undefined"
      :href="isSelf ? undefined : href"
      :target="target"
      role="tab"
      :aria-selected="active || (exact ? isExactActive : isActive)"
      no-outline
      tag="a"
      hide-focus-indicator
      tabindex="-1"
      v-bind="$attrs"
      variant="text"
      @click="
        click();
        isSelf ? navigate($event) : undefined;
      "
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
  </RouterLink>
</template>

<style lang="scss" module>
.tab {
  @apply h-full min-w-[90px] max-w-[360px] flex items-center rounded-none cursor-pointer relative whitespace-nowrap shrink-0;
  @apply px-4 #{!important};

  &--vertical {
    @apply h-[2.625rem] w-full max-w-none;
  }

  &--grow {
    @apply grow max-w-none;
  }

  &--active {
    &:after {
      content: '';
      @apply absolute h-0 w-full bottom-0 left-0 border-b-2 border-current;
    }

    &.tab-indicator--start {
      &:after {
        @apply top-0 bottom-auto;
      }
    }

    &.tab--vertical {
      &:after {
        @apply h-full w-0 right-0 left-auto border-b-0 border-r-2;
      }

      &.tab-indicator--start {
        &:after {
          @apply left-0 right-auto;
        }
      }
    }
  }

  &--disabled {
    @apply cursor-not-allowed;
  }

  &--start {
    @apply justify-start text-left rtl:justify-end rtl:text-right;
  }

  &--center {
    @apply justify-center text-center;
  }

  &--end {
    @apply justify-end text-right rtl:justify-start rtl:text-left;
  }
}
</style>
