<script setup lang="ts">
import { tv } from '@/utils/tv';

export interface Props {
  dense?: boolean;
}

defineOptions({
  name: 'RuiCardHeader',
  inheritAttrs: false,
});

const { dense = false } = defineProps<Props>();

const slots = defineSlots<{
  prepend?: () => any;
  header?: () => any;
  subheader?: () => any;
}>();

const cardHeader = tv({
  slots: {
    root: 'flex',
    prepend: 'rounded-full flex items-center justify-center bg-rui-neutral-200 text-rui-neutral-700 dark:bg-rui-neutral-700 dark:text-rui-neutral-200 overflow-hidden',
    // one title style whether or not there is a prepend: a card title is a section heading, not a page title
    header: 'text-base font-semibold text-rui-text dark:text-rui-dark-text',
  },
  variants: {
    dense: {
      true: {
        root: 'p-3 between:ml-2 between:mr-0',
        prepend: 'text-base p-[0.08rem] w-9 h-9',
      },
      false: {
        root: 'p-4 between:ml-4 between:mr-0',
        prepend: 'text-[1.25rem] w-10 h-10',
      },
    },
  },
  defaultVariants: { dense: false },
});

const ui = computed<ReturnType<typeof cardHeader>>(() => cardHeader({ dense }));
</script>

<template>
  <div
    :class="ui.root()"
    v-bind="$attrs"
  >
    <div
      v-if="slots.prepend"
      data-id="prepend"
      :class="ui.prepend()"
    >
      <slot name="prepend" />
    </div>
    <div class="flex flex-col justify-center">
      <h5
        v-if="slots.header"
        data-id="header"
        :class="ui.header()"
      >
        <slot name="header" />
      </h5>
      <p
        v-if="slots.subheader"
        data-id="subheader"
        class="text-rui-text-secondary dark:text-rui-dark-text-secondary text-body-2 mb-0"
      >
        <slot name="subheader" />
      </p>
    </div>
  </div>
</template>
