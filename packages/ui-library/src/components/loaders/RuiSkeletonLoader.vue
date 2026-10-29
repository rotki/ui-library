<script lang="ts" setup>
import RuiSkeletonBase, {
  type Props as SkeletonBaseProps,
} from '@/components/loaders/RuiSkeletonBase.vue';
import { SkeletonType } from '@/components/loaders/skeleton-type';
import { cn } from '@/utils/tv';
import { skeletonLoaderStyles } from './skeleton-loader-styles';

export interface Props extends SkeletonBaseProps {
  type?: SkeletonType;
}

defineOptions({
  name: 'RuiSkeletonLoader',
  inheritAttrs: false,
});

const { type = SkeletonType.TEXT, rounded } = defineProps<Props>();

const multiLineTypes: SkeletonType[] = [SkeletonType.PARAGRAPH, SkeletonType.ARTICLE];

const attrs = useAttrs();
const ui = computed<string>(() => skeletonLoaderStyles({ type, class: cn(attrs.class) }));
const isMultiLine = computed<boolean>(() => multiLineTypes.includes(type));
</script>

<template>
  <RuiSkeletonBase
    v-if="!isMultiLine"
    :class="ui"
    :rounded="rounded"
    v-bind="{ ...attrs, class: undefined }"
  />
  <div
    v-else
    :class="ui"
    v-bind="{ ...attrs, class: undefined }"
  >
    <RuiSkeletonBase
      v-if="type === SkeletonType.ARTICLE"
      class="w-full h-6 rounded-rui-control mb-1"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-rui-control"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-rui-control max-w-[80%]"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-rui-control max-w-[90%]"
      :rounded="rounded"
    />
  </div>
</template>
