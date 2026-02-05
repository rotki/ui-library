<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { ContextColorsType } from '@/consts/colors';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { generateId } from '@/utils/generate-id';

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

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  disabled: false,
  grow: false,
  value: generateId(),
  active: false,
  activeClass: '',
  link: false,
  to: '',
  target: '_self',
  exact: false,
  exactPath: false,
  vertical: false,
  align: 'center',
  indicatorPosition: 'end',
});

const emit = defineEmits<{
  (e: 'click', value: string | number): void;
}>();

const slots = defineSlots<{
  default?: (props?: object) => any;
  prepend?: (props?: object) => any;
  append?: (props?: object) => any;
}>();

const { target, grow, active, activeClass, disabled, vertical, align, value, indicatorPosition }
  = toRefs(props);

const css = useCssModule();

const isSelf = computed(() => get(target) === '_self');

const tabClass = computed(() => [
  css.tab,
  css[`tab--${get(align)}`],
  css[`tab-indicator--${get(indicatorPosition)}`],
  {
    [css['tab--grow'] ?? '']: get(grow),
    [`${css['tab--active']} active-tab ${get(activeClass)}`]: get(active),
    [css['tab--disabled'] ?? '']: get(disabled),
    [css['tab--vertical'] ?? '']: get(vertical),
  },
]);

function click() {
  emit('click', get(value));
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
    v-bind="$attrs"
  >
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </RuiButton>
  <RuiButton
    v-else-if="!link"
    :class="tabClass"
    :color="active ? color : undefined"
    role="tab"
    v-bind="$attrs"
    tabindex="-1"
    hide-focus-indicator
    variant="text"
    @click="click()"
  >
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
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
          [`${css['tab--active']} active-tab-link`]: exact
            ? isExactActive
            : isActive,
        },
      ]"
      :color="active || (exact ? isExactActive : isActive) ? color : undefined"
      :href="isSelf ? undefined : href"
      :target="target"
      role="tab"
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
        v-for="(_, name) in slots"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
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
