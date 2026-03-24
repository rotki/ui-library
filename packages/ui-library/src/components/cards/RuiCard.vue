<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { computed } from 'vue';
import RuiCardHeader from '@/components/cards/RuiCardHeader.vue';
import { cn, tv } from '@/utils/tv';

export interface RuiCardClassNames {
  root?: VueClassValue;
  content?: VueClassValue;
  footer?: VueClassValue;
  image?: VueClassValue;
}

export interface Props {
  dense?: boolean;
  divide?: boolean;
  elevation?: number;
  variant?: 'flat' | 'outlined';
  rounded?: 'sm' | 'md' | 'lg';
  noPadding?: boolean;
  classNames?: RuiCardClassNames;
  /** @deprecated Use `classNames.content` instead */
  contentClass?: string;
}

defineOptions({
  name: 'RuiCard',
  inheritAttrs: false,
});

const {
  divide = false,
  dense = false,
  elevation = 0,
  variant: cardVariant = 'outlined',
  rounded = 'md',
  noPadding = false,
  classNames,
  contentClass = '',
} = defineProps<Props>();

const slots = defineSlots<{
  'image'?: () => any;
  'custom-header'?: () => any;
  'prepend'?: () => any;
  'header'?: () => any;
  'subheader'?: () => any;
  'default'?: () => any;
  'footer'?: () => any;
}>();

const card = tv({
  slots: {
    root: 'flex flex-col h-full w-full bg-white dark:bg-[#1E1E1E]',
    image: 'overflow-hidden',
    content: 'text-body-1 text-rui-light-text dark:text-rui-dark-text overflow-y-auto',
    footer: 'flex space-x-2 items-center justify-start mt-auto',
  },
  variants: {
    variant: {
      flat: { root: '' },
      outlined: { root: 'border border-black/[0.12] dark:border-white/[0.12]' },
    },
    rounded: {
      sm: { root: 'rounded-[.25rem]', image: 'rounded-t-[.25rem]' },
      md: { root: 'rounded-[.5rem]', image: 'rounded-t-[.5rem]' },
      lg: { root: 'rounded-[1rem]', image: 'rounded-t-[1rem]' },
    },
    divide: {
      true: { root: 'divide-y divide-black/[0.12] dark:divide-white/[0.12]' },
    },
    padding: {
      none: { content: 'p-0' },
      dense: { content: 'p-3' },
      normal: { content: 'p-4' },
    },
    dense: {
      true: { footer: 'py-1' },
      false: { footer: 'p-4 pt-2' },
    },
  },
  defaultVariants: { variant: 'outlined', rounded: 'md', padding: 'normal', dense: false },
});

const hasHeadContent = computed<boolean>(() => !!slots.header || !!slots.subheader);

const contentPadding = computed<'none' | 'dense' | 'normal'>(() => {
  if (noPadding)
    return 'none';
  return dense ? 'dense' : 'normal';
});

const ui = computed<ReturnType<typeof card>>(() => card({ variant: cardVariant, rounded, divide, dense, padding: contentPadding.value }));
</script>

<template>
  <div
    :class="ui.root({ class: [`shadow-${elevation}`, cn(classNames?.root)] })"
    v-bind="$attrs"
  >
    <div
      v-if="slots.image"
      data-id="card-image"
      :class="ui.image({ class: cn(classNames?.image) })"
    >
      <slot name="image" />
    </div>
    <slot name="custom-header">
      <RuiCardHeader
        v-if="hasHeadContent"
        :dense="dense"
      >
        <template
          v-if="slots.prepend"
          #prepend
        >
          <slot name="prepend" />
        </template>
        <template
          v-if="slots.header"
          #header
        >
          <slot name="header" />
        </template>
        <template
          v-if="slots.subheader"
          #subheader
        >
          <slot name="subheader" />
        </template>
      </RuiCardHeader>
    </slot>
    <div
      v-if="slots.default"
      data-id="card-content"
      :class="ui.content({ class: cn(classNames?.content) ?? contentClass })"
    >
      <slot />
    </div>
    <div
      v-if="slots.footer"
      data-id="card-footer"
      :class="ui.footer({ class: cn(classNames?.footer) })"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
