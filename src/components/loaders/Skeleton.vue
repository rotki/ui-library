<script lang="ts" setup>
import {
  default as SkeletonBase,
  type Props as SkeletonBaseProps,
} from '@/components/loaders/SkeletonBase.vue';

export interface Props extends SkeletonBaseProps {
  type?:
    | 'text'
    | 'paragraph'
    | 'heading'
    | 'article'
    | 'button'
    | 'icon'
    | 'avatar'
    | 'thumbnail'
    | 'custom';
}

defineOptions({
  name: 'RuiSkeletonLoader',
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), {
  type: 'text',
  rounded: undefined,
});

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <SkeletonBase
    v-if="!['paragraph', 'article'].includes(type)"
    :class="css[`skeleton_${type}`]"
    :rounded="rounded"
    v-bind="attrs"
  />
  <div v-else :class="css[`skeleton_${type}`]" v-bind="attrs">
    <SkeletonBase
      v-if="type === 'article'"
      :class="css.skeleton_heading"
      :rounded="rounded"
    />
    <SkeletonBase :class="css.skeleton_text" :rounded="rounded" />
    <SkeletonBase :class="css.skeleton_text" :rounded="rounded" />
    <SkeletonBase :class="css.skeleton_text" :rounded="rounded" />
  </div>
</template>

<style lang="scss" module>
.skeleton {
  &_custom {
    @apply box-border;
  }

  &_text {
    @apply w-full h-4 rounded-md;
  }

  &_heading {
    @apply w-full h-6 rounded-md;
  }

  &_button {
    @apply w-full max-w-[6rem] h-[2.25rem] rounded-md;
  }

  &_icon {
    @apply w-6 h-6 rounded-full;
  }

  &_avatar {
    @apply w-10 h-10 rounded-full;
  }

  &_thumbnail {
    @apply w-14 h-14 rounded-sm;
  }

  &_paragraph,
  &_article {
    @apply flex flex-col gap-2;

    .skeleton_heading {
      @apply mb-1;
    }

    .skeleton_text {
      @apply h-3;

      &:nth-child(2) {
        @apply max-w-[80%];
      }

      &:last-child {
        @apply max-w-[90%];
      }
    }
  }
}
</style>
