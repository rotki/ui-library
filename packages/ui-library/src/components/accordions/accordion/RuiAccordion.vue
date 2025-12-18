<script lang="ts" setup>
import Icon from '@/components/icons/RuiIcon.vue';

export interface AccordionProps {
  open?: boolean;
  eager?: boolean;
  headerGrow?: boolean;
  headerClass?: string;
  contentClass?: string;
}

defineOptions({
  name: 'RuiAccordion',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AccordionProps>(), {
  open: false,
  eager: false,
  headerGrow: false,
  headerClass: '',
  contentClass: '',
});

const emit = defineEmits<{
  click: [];
}>();

const triggerId = useId();
const contentId = useId();

const inner = ref<HTMLDivElement>();
const { height: innerHeight } = useElementSize(inner);

const contentHeight = computed<string>(() => (props.open ? `${get(innerHeight)}px` : '0px'));

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
    class="flex flex-col items-start"
    :data-state="open ? 'open' : 'closed'"
    data-accordion
    v-bind="$attrs"
  >
    <div
      v-if="$slots.header"
      :id="triggerId"
      class="flex gap-2 items-center cursor-pointer outline-none focus-visible:bg-rui-primary/10 rounded"
      :class="[headerClass, { 'w-full': headerGrow }]"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      :aria-controls="contentId"
      data-accordion-trigger
      @click="toggle()"
      @keydown="onKeydown($event)"
    >
      <div
        :class="{ grow: headerGrow }"
      >
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
      :class="contentClass"
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
