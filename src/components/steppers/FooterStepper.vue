<script lang="ts" setup>
import RuiIcon from '@/components/icons/Icon.vue';
import RuiButton from '@/components/buttons/button/Button.vue';
import RuiProgress from '@/components/progress/Progress.vue';

export interface Props {
  pages: number;
  modelValue?: number;
  variant?: 'numeric' | 'bullet' | 'progress' | 'pill';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  variant: 'numeric',
});

const emit = defineEmits<{
  (event: 'update:modelValue', modelValue: number): void;
}>();

const css = useCssModule();

const { modelValue, pages } = toRefs(props);

const onChange = (delta: number) => {
  emit('update:modelValue', get(modelValue) + delta);
};

const onPrev = () => {
  const value = get(modelValue);
  if (value) {
    onChange(-1);
  }
};
const onNext = () => {
  const value = get(modelValue);
  if (value < get(pages)) {
    onChange(1);
  }
};

const onClick = (index: number) => {
  onChange(index - get(modelValue));
};
</script>

<template>
  <div :class="[css['footer-stepper'], css[variant ?? '']]">
    <template v-if="variant === 'pill'">
      <div :class="css.pills">
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.pill, { [css.active]: modelValue === i }]"
          @click="onClick(i)"
        />
      </div>
    </template>
    <template v-else>
      <RuiButton
        :disabled="modelValue <= 1"
        color="primary"
        tile
        variant="text"
        @click="onPrev()"
      >
        <template #prepend>
          <RuiIcon :size="18" name="arrow-left-s-line" />
        </template>
        <span>Back</span>
      </RuiButton>
      <span v-if="variant === 'numeric'" :class="css.numeric">
        {{ modelValue }}/{{ pages }}
      </span>
      <div v-else-if="variant === 'bullet'" :class="css.bullets">
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.bullet, { [css.active]: modelValue === i }]"
          @click="onClick(i)"
        />
      </div>
      <RuiProgress
        v-else-if="variant === 'progress'"
        :class="css.progress"
        :value="(modelValue / pages) * 100"
      />
      <RuiButton
        :disabled="modelValue >= pages"
        color="primary"
        tile
        variant="text"
        @click="onNext()"
      >
        <span>Next</span>
      </RuiButton>
    </template>
  </div>
</template>

<style lang="scss" module>
.footer-stepper {
  @apply flex items-center justify-between transition-all duration-150;

  .numeric {
    @apply text-black/[0.87];
  }

  .bullets,
  .pills {
    @apply flex;

    .bullet,
    .pill {
      @apply rounded-full h-2 bg-black/[0.26] hover:bg-rui-grey-300 cursor-pointer transition-colors;

      &.active {
        @apply bg-rui-primary hover:bg-rui-primary;
      }
    }

    .pill {
      @apply bg-rui-grey-200;
    }
  }

  .bullets {
    @apply mx-4 space-x-1;

    .bullet {
      @apply w-2;
    }
  }

  .pills {
    @apply w-full space-x-3;

    .pill {
      @apply w-full;
    }
  }

  .progress {
    @apply max-w-[60%] mx-4;
  }
}

:global(.dark) {
  .footer-stepper {
    .numeric {
      @apply text-white;
    }

    .bullets,
    .pills {
      .bullet,
      .pill {
        @apply bg-rui-grey-300 hover:bg-rui-grey-400;

        &.active {
          @apply bg-rui-primary hover:bg-rui-primary;
        }
      }
    }

    .bullets {
      .bullet {
        @apply bg-white/30;
      }
    }
  }
}
</style>
