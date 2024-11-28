<script setup lang='ts'>
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';

defineOptions({
  name: 'RuiColorDisplay',
  inheritAttrs: false,
});

const props = defineProps<{
  color: string;
}>();

const { color } = toRefs(props);

const { copy, copied } = useClipboard({ source: color });
</script>

<template>
  <RuiTooltip
    :popper="{ placement: 'top' }"
    :close-delay="400"
    tooltip-class="text-center"
    v-bind="$attrs"
  >
    <template #activator>
      <div
        class="w-8 h-8 min-w-8 min-h-8 rounded-full cursor-pointer"
        data-cy="color-display"
        :style="{ background: color }"
        @click="copy()"
      />
    </template>
    <div :class="{ 'h-0 overflow-hidden': copied }">
      Click to copy
    </div>
    <div
      v-if="copied"
      class="text-rui-success"
    >
      COPIED!
    </div>
  </RuiTooltip>
</template>
