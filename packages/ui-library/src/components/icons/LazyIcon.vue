<script lang="ts" setup>
import type { RuiIcons } from '@/icons';
import { set } from '@vueuse/shared';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface LazyIconProps {
  name: RuiIcons;
  size?: number | string;
}

defineOptions({
  name: 'LazyIcon',
});

const { name, size = 24 } = defineProps<LazyIconProps>();

const target = useTemplateRef<HTMLElement>('target');
const isVisible = ref<boolean>(false);

useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      set(isVisible, true);
    }
  },
  {
    rootMargin: '100px',
  },
);
</script>

<template>
  <div
    ref="target"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <RuiIcon
      v-if="isVisible"
      :name="name"
      :size="size"
    />
  </div>
</template>
