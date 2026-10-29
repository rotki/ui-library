<script lang="ts" setup>
import type { VueClassValue } from '@/types/class-value';
import Icon from '@/components/icons/RuiIcon.vue';
import { useClipWhileResizing } from '@/composables/clip-while-resizing';
import { cn } from '@/utils/tv';
import { accordionStyles } from './accordion-styles';

export interface RuiAccordionClassNames {
  root?: VueClassValue;
  header?: VueClassValue;
  content?: VueClassValue;
}

export interface AccordionProps {
  open?: boolean;
  eager?: boolean;
  headerGrow?: boolean;
  classNames?: RuiAccordionClassNames;
}

defineOptions({
  name: 'RuiAccordion',
  inheritAttrs: false,
});

const {
  open = false,
  eager = false,
  headerGrow = false,
  classNames,
} = defineProps<AccordionProps>();

const emit = defineEmits<{
  click: [];
}>();

defineSlots<{
  header?: (props: { open: boolean }) => any;
  default?: () => any;
}>();

const inner = useTemplateRef<HTMLDivElement>('inner');
const content = useTemplateRef<HTMLDivElement>('content');

const triggerId = useId();
const contentId = useId();
const { height: innerHeight } = useElementSize(inner);

const contentHeight = computed<string>(() => (open ? `${get(innerHeight)}px` : '0px'));

const resizing = useClipWhileResizing(content, contentHeight);

// a closed `eager` panel keeps its content at height 0, so it clips; an open one only while it resizes, so sticky content works
const clipped = computed<boolean>(() => !open || get(resizing));

function toggle(): void {
  emit('click');
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
  }
}
</script>

<template>
  <div
    :class="accordionStyles({ class: cn(classNames?.root ?? $attrs.class) })"
    :data-state="open ? 'open' : 'closed'"
    data-accordion
    v-bind="{ ...$attrs, class: undefined }"
  >
    <!-- rounded only while focused: a permanent radius bent any border an app draws on the header -->
    <div
      v-if="$slots.header"
      :id="triggerId"
      class="group flex gap-2 items-center cursor-pointer outline-hidden focus-visible:focus-ring focus-visible:rounded-rui-control"
      :class="[classNames?.header, { 'w-full': headerGrow }]"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      :aria-controls="contentId"
      data-accordion-trigger
      @click="toggle()"
      @keydown="onKeydown($event)"
    >
      <div :class="{ grow: headerGrow }">
        <slot
          name="header"
          :open="open"
        />
      </div>
      <Icon
        class="shrink-0 text-rui-text-secondary transition-[rotate,color] duration-200 ease-out group-hover:text-rui-text motion-reduce:transition-none"
        :class="{ '-rotate-180': open }"
        name="lu-chevron-down"
        :size="16"
      />
    </div>
    <div
      v-if="open || eager"
      :id="contentId"
      ref="content"
      class="grow transition-[height] duration-200 ease-out w-full motion-reduce:transition-none"
      :class="[{ 'overflow-hidden': clipped }, classNames?.content]"
      :data-clipped="clipped || undefined"
      :style="{ height: contentHeight }"
      role="region"
      :aria-labelledby="triggerId"
      data-accordion-content
    >
      <div ref="inner">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
