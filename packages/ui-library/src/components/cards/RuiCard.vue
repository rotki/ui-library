<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { computed } from 'vue';
import RuiCardHeader from '@/components/cards/RuiCardHeader.vue';
import { useKeyboardScroll } from '@/composables/keyboard-scroll';
import { cn } from '@/utils/tv';
import { cardStyles } from './card-styles';

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
  /**
   * Drops the content's top padding when a header renders, so the header's bottom padding is the
   * only gap between them (16px, 12px when `dense`) instead of both paddings stacked. Ignored with
   * `divide`, which draws a border there.
   */
  tightHeaderGap?: boolean;
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
  tightHeaderGap = false,
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

const content = useTemplateRef<HTMLDivElement>('content');
// a fixed-height card scrolls its content, which keyboard users need to reach when it holds no controls
const contentTabindex = useKeyboardScroll(content);

const hasHeadContent = computed<boolean>(() => !!slots.header || !!slots.subheader);

const contentPadding = computed<'none' | 'dense' | 'normal'>(() => {
  if (noPadding)
    return 'none';
  return dense ? 'dense' : 'normal';
});

// only under a header (built-in or `custom-header`), and not with `divide`, whose border needs space on both sides
const underHeader = computed<boolean>(() => tightHeaderGap && !divide && (get(hasHeadContent) || !!slots['custom-header']));

const ui = computed<ReturnType<typeof cardStyles>>(() => cardStyles({
  variant: cardVariant,
  rounded,
  divide,
  dense,
  padding: get(contentPadding),
  underHeader: get(underHeader),
}));
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
