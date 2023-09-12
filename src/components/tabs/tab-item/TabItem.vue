<script lang="ts" setup>
import { TransitionRoot } from '@headlessui/vue';

export interface Props {
  active?: boolean;
  value: number | string;
  eager?: boolean;
  reverse?: boolean;
}

defineOptions({
  name: 'RuiTabItem',
});

withDefaults(defineProps<Props>(), {
  eager: false,
  active: false,
  reverse: false,
});

const css = useCssModule();
</script>

<template>
  <div :class="[css.tab, { 'active-tab-item': active }]">
    <TransitionRoot
      :key="reverse.toString()"
      :show="active"
      class="w-full transform duration-300 transition"
      :enter-from="`opacity-0 ${reverse ? '-translate-x-8' : 'translate-x-8'}`"
      enter-to="opacity-100 translate-x-0"
      leave-from="opacity-100 translate-x-0 !h-0 overflow-hidden"
      :leave-to="`opacity-0 !h-0 overflow-hidden ${
        reverse ? 'translate-x-8' : '-translate-x-8'
      }`"
    >
      <slot />
    </TransitionRoot>
    <div v-if="eager && !active" class="hidden">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
.tab {
  @apply w-full;
}
</style>
