<script setup lang="ts">
export interface Props {
  dense?: boolean;
}

defineOptions({
  name: 'RuiCardHeader',
  inheritAttrs: false,
});

const { dense = false } = defineProps<Props>();

defineSlots<{
  prepend?: () => any;
  header?: () => any;
  subheader?: () => any;
}>();
</script>

<template>
  <div
    :class="[
      $style.head,
      {
        [$style.dense]: dense,
        [$style.has_prepend]: !!$slots.prepend,
      },
    ]"
    v-bind="$attrs"
  >
    <div
      v-if="$slots.prepend"
      :class="$style.prepend"
    >
      <slot name="prepend" />
    </div>
    <div :class="$style.headers">
      <h5
        v-if="$slots.header"
        :class="$style.header"
      >
        <slot name="header" />
      </h5>
      <p
        v-if="$slots.subheader"
        :class="$style.subheader"
      >
        <slot name="subheader" />
      </p>
    </div>
  </div>
</template>

<style lang="scss" module>
.head {
  @apply p-4 flex space-x-4;

  .prepend {
    @apply rounded-full flex items-center justify-center w-10 h-10;
    @apply text-[1.25rem] text-white bg-rui-grey-400 overflow-hidden;
  }

  .headers {
    @apply flex flex-col justify-center;
  }

  .header {
    @apply text-rui-text text-h6;
  }

  .subheader {
    @apply text-rui-text-secondary text-body-2 mb-0;
  }

  &.has_prepend {
    .header {
      @apply text-body-1;
    }
  }

  &.dense {
    @apply p-3 space-x-2;

    .prepend {
      @apply text-base p-[0.08rem] w-9 h-9;
    }
  }
}

:global(.dark) {
  .head {
    .prepend {
      @apply bg-rui-grey-700 text-black/90;
    }

    .header {
      @apply text-rui-dark-text;
    }

    .subheader {
      @apply text-rui-dark-text-secondary;
    }
  }
}
</style>
