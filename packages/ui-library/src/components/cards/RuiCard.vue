<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { computed } from 'vue';
import RuiCardHeader from '@/components/cards/RuiCardHeader.vue';
import { useKeyboardScroll } from '@/composables/keyboard-scroll';
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
  variant?: 'flat' | 'outlined';
  rounded?: 'sm' | 'md' | 'lg';
  noPadding?: boolean;
  classNames?: RuiCardClassNames;
}

defineOptions({
  name: 'RuiCard',
  inheritAttrs: false,
});

const {
  divide = false,
  dense = false,
  variant: cardVariant = 'outlined',
  rounded = 'md',
  noPadding = false,
  classNames,
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
    root: 'flex flex-col h-full w-full bg-rui-surface',
    image: 'overflow-hidden',
    content: 'text-sm/6 text-rui-text overflow-y-auto outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    // a leading text button moves out by its side padding to align its label; unquoted selectors, quoted ones break consumer builds
    footer: [
      'flex between:ml-2 between:mr-0 items-center justify-start mt-auto',
      '[&>[data-variant=text][data-size=xs]:first-child]:-ms-1',
      '[&>[data-variant=text][data-size=sm]:first-child]:-ms-1.5',
      '[&>[data-variant=text][data-size=md]:first-child]:-ms-2',
      '[&>[data-variant=text][data-size=lg]:first-child]:-ms-2.5',
      '[&>[data-variant=text][data-size$=xl]:first-child]:-ms-2.5',
    ],
  },
  variants: {
    variant: {
      flat: { root: '' },
      outlined: { root: 'border border-rui-divider' },
    },
    rounded: {
      sm: { root: 'rounded-rui-sm', image: 'rounded-t-rui-sm' },
      md: { root: 'rounded-rui-card', image: 'rounded-t-rui-card' },
      lg: { root: 'rounded-rui-lg', image: 'rounded-t-rui-lg' },
    },
    divide: {
      true: { root: 'between:border-t between:border-b-0 between:border-rui-divider' },
    },
    padding: {
      none: { content: 'p-0' },
      dense: { content: 'p-3' },
      normal: { content: 'p-4' },
    },
    dense: {
      // the footer keeps the content's side padding, so its buttons line up with the text above
      true: { footer: 'p-3 pt-1' },
      false: { footer: 'p-4 pt-2' },
    },
  },
  defaultVariants: { variant: 'outlined', rounded: 'md', padding: 'normal', dense: false },
});

const content = useTemplateRef<HTMLDivElement>('content');
// a fixed-height card scrolls its content, which keyboard users need to reach when it holds no controls
const contentTabindex = useKeyboardScroll(content);

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
    :class="ui.root({ class: cn(classNames?.root ?? $attrs.class) })"
    v-bind="{ ...$attrs, class: undefined }"
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
      ref="content"
      data-id="card-content"
      :tabindex="contentTabindex"
      :class="ui.content({ class: cn(classNames?.content) })"
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
