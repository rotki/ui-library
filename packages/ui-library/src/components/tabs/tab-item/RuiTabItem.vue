<script lang="ts" setup>
export interface Props {
  active?: boolean;
  value?: number | string;
  eager?: boolean;
  reverse?: boolean;
}

defineOptions({
  name: 'RuiTabItem',
});

const { active = false, eager = false, reverse = false } = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();
</script>

<template>
  <div
    role="tabpanel"
    :class="[$style.tab, { 'active-tab-item': active }]"
  >
    <Transition
      :enter-from-class="`opacity-0 ${reverse ? '-translate-x-8' : 'translate-x-8'}`"
      :leave-to-class="`opacity-0 !h-0 overflow-hidden ${
        reverse ? 'translate-x-8' : '-translate-x-8'
      }`"
      enter-active-class="w-full transform duration-300 transition"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="w-full transform duration-300 transition !h-0 overflow-hidden"
      leave-from-class="opacity-100 translate-x-0 !h-0 overflow-hidden"
    >
      <div
        v-if="active"
        class="w-full"
      >
        <slot />
      </div>
    </Transition>
    <div
      v-if="eager && !active"
      class="hidden"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
.tab {
  @apply w-full;
}
</style>
