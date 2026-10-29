<script setup lang="ts">
import { cardHeaderStyles } from './card-header-styles';

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

const ui = computed<ReturnType<typeof cardHeaderStyles>>(() => cardHeaderStyles({ dense }));
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
        class="text-rui-text-secondary text-body-2 mb-0"
      >
        <slot name="subheader" />
      </p>
    </div>
  </div>
</template>
