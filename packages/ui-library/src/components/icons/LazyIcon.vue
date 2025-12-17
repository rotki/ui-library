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

const props = withDefaults(defineProps<LazyIconProps>(), {
  size: 24,
});

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
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <RuiIcon
      v-if="isVisible"
      :name="props.name"
      :size="props.size"
    />
  </div>
</template>
