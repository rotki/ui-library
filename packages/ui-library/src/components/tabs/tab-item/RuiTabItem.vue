<script lang="ts" setup>
export interface Props {
  active?: boolean;
  value?: number | string;
  eager?: boolean;
}

defineOptions({
  name: 'RuiTabItem',
});

const { active = false, value, eager = false } = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();
</script>

<template>
  <div
    role="tabpanel"
    class="w-full"
    :data-value="value"
    :data-active="active || undefined"
  >
    <!-- the new panel fades in while the old one collapses at once, rather than Material's sideways swipe -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="w-full transition-opacity duration-150 ease-out motion-reduce:transition-none"
      enter-to-class="opacity-100"
      leave-active-class="w-full h-0! overflow-hidden"
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
