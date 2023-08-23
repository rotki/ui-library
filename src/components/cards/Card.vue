<script setup lang="ts">
import { computed } from 'vue';
import CardHeader from './CardHeader.vue';

export interface Props {
  dense?: boolean;
  divide?: boolean;
  elevation?: number;
  variant?: 'flat' | 'outlined';
}

defineOptions({
  name: 'RuiCard',
});

withDefaults(defineProps<Props>(), {
  divide: false,
  dense: false,
  elevation: 0,
  variant: 'outlined',
});

const css = useCssModule();
const slots = useSlots();

const hasHeadContent = computed(() => !!slots.header || !!slots.subheader);
</script>

<template>
  <div
    :class="[
      css.card,
      `shadow-${elevation}`,
      {
        [css.outlined]: variant === 'outlined',
        [css.dense]: dense,
        [css.divide]: divide,
      },
    ]"
  >
    <div v-if="slots.image" :class="css.image">
      <slot name="image" />
    </div>
    <slot name="custom-header">
      <CardHeader v-if="hasHeadContent" :dense="dense">
        <template v-if="slots.prepend" #prepend>
          <slot name="prepend" />
        </template>
        <template v-if="slots.header" #header>
          <slot name="header" />
        </template>
        <template v-if="slots.subheader" #subheader>
          <slot name="subheader" />
        </template>
      </CardHeader>
    </slot>
    <div v-if="slots.default" :class="css.content">
      <slot />
    </div>
    <div v-if="slots.footer" :class="css.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" module>
.card {
  @apply flex flex-col h-full w-full rounded bg-white;

  .image {
    @apply rounded-t overflow-hidden;
  }

  .content {
    @apply p-4 text-body-1 text-rui-light-text overflow-y-auto;
  }

  .footer {
    @apply py-2 px-1 flex space-x-2 items-center justify-start mt-auto;
  }

  &.flat {
    @apply border-none;
  }

  &.outlined {
    @apply border border-black/[0.12];
  }

  &.divide {
    @apply divide-y divide-black/[0.12];
  }

  &.dense {
    .content {
      @apply p-3;
    }

    .footer {
      @apply py-1 flex space-x-2;
    }
  }
}

:global(.dark) {
  .card {
    @apply bg-white/[0.05];
    .content {
      @apply text-rui-dark-text;
    }

    &.outlined {
      @apply border-white/[0.12];
    }

    &.divide {
      @apply divide-white/[0.12];
    }
  }
}
</style>
