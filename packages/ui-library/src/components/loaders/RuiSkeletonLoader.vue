<script lang="ts" setup>
import RuiSkeletonBase, {
  type Props as SkeletonBaseProps,
} from '@/components/loaders/RuiSkeletonBase.vue';
import { SkeletonType } from '@/components/loaders/skeleton-type';
import { cn, tv } from '@/utils/tv';

export interface Props extends SkeletonBaseProps {
  type?: SkeletonType;
}

defineOptions({
  name: 'RuiSkeletonLoader',
  inheritAttrs: false,
});

const { type = SkeletonType.TEXT, rounded } = defineProps<Props>();

const multiLineTypes: SkeletonType[] = [SkeletonType.PARAGRAPH, SkeletonType.ARTICLE];

const skeletonType = tv({
  variants: {
    type: {
      [SkeletonType.CUSTOM]: 'box-border',
      [SkeletonType.TEXT]: 'w-full h-4 rounded-md',
      [SkeletonType.HEADING]: 'w-full h-6 rounded-md',
      [SkeletonType.BUTTON]: 'w-full max-w-[6rem] h-[2.25rem] rounded-md',
      [SkeletonType.ICON]: 'w-6 h-6 rounded-full',
      [SkeletonType.AVATAR]: 'w-10 h-10 rounded-full',
      [SkeletonType.THUMBNAIL]: 'w-14 h-14 rounded-sm',
      [SkeletonType.PARAGRAPH]: 'flex flex-col gap-2',
      [SkeletonType.ARTICLE]: 'flex flex-col gap-2',
    },
  },
});

const attrs = useAttrs();
const ui = computed<string>(() => skeletonType({ type, class: cn(attrs.class) }));
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
      class="w-full h-6 rounded-md mb-1"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-md"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-md max-w-[80%]"
      :rounded="rounded"
    />
    <RuiSkeletonBase
      class="w-full h-3 rounded-md max-w-[90%]"
      :rounded="rounded"
    />
  </div>
</template>
