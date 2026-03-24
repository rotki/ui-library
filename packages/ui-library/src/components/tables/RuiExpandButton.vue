<script lang="ts" setup>
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props {
  expanded: boolean;
  icon?: RuiIcons;
}

defineOptions({
  inheritAttrs: false,
});

const { expanded, icon = 'lu-chevron-down' } = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();
</script>

<template>
  <RuiButton
    class="relative"
    :aria-expanded="expanded"
    data-id="expand-button"
    icon
    size="sm"
    variant="text"
    v-bind="$attrs"
  >
    <slot>
      <RuiIcon
        class="transition"
        :class="{ 'rotate-180': expanded }"
        :name="icon"
      />
    </slot>
  </RuiButton>
</template>
