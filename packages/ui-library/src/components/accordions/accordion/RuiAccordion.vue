<script lang="ts" setup>
import type { VueClassValue } from '@/types/class-value';
import Icon from '@/components/icons/RuiIcon.vue';
import { cn, tv } from '@/utils/tv';

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
  /** @deprecated Use `classNames.header` instead */
  headerClass?: string;
  /** @deprecated Use `classNames.content` instead */
  contentClass?: string;
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
  headerClass = '',
  contentClass = '',
} = defineProps<AccordionProps>();

const emit = defineEmits<{
  click: [];
}>();

defineSlots<{
  header?: (props: { open: boolean }) => any;
  default?: () => any;
}>();

const inner = useTemplateRef<HTMLDivElement>('inner');

const triggerId = useId();
const contentId = useId();
const { height: innerHeight } = useElementSize(inner);

const contentHeight = computed<string>(() => (open ? `${get(innerHeight)}px` : '0px'));

function toggle(): void {
  emit('click');
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
  }
}

const rootStyle = tv({ base: 'flex flex-col items-start' });
</script>

<template>
  <div
    :class="rootStyle({ class: cn(classNames?.root ?? $attrs.class) })"
    :data-state="open ? 'open' : 'closed'"
    data-accordion
    v-bind="{ ...$attrs, class: undefined }"
  >
    <div
      v-if="$slots.header"
      :id="triggerId"
      class="flex gap-2 items-center cursor-pointer outline-none focus-visible:bg-rui-primary/10 rounded"
      :class="[classNames?.header ?? headerClass, { 'w-full': headerGrow }]"
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
        class="text-rui-text-secondary transition-transform"
        :class="{ '-rotate-180': open }"
        name="lu-chevron-down"
      />
    </div>
    <div
      v-if="open || eager"
      :id="contentId"
      class="grow transition-all overflow-hidden w-full"
      :class="classNames?.content ?? contentClass"
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
