<script lang="ts" setup>
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

export interface Props {
  pages: number;
  modelValue?: number;
  variant?: 'numeric' | 'bullet' | 'progress' | 'pill';
  arrowButtons?: boolean;
}

defineOptions({
  name: 'RuiFooterStepper',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  variant: 'numeric',
  arrowButtons: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', modelValue: number): void;
}>();

const css = useCssModule();

const { modelValue, pages } = toRefs(props);

function onChange(delta: number) {
  emit('update:modelValue', get(modelValue) + delta);
}

function onPrev() {
  const value = get(modelValue);
  if (value)
    onChange(-1);
}

function onNext() {
  const value = get(modelValue);
  if (value < get(pages))
    onChange(1);
}

function onClick(index: number) {
  onChange(index - get(modelValue));
}
</script>

<template>
  <div :class="[css['footer-stepper'], css[variant ?? '']]">
    <template v-if="variant === 'pill'">
      <div :class="css.pills">
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.pill, { [css.active]: modelValue === i }]"
        />
      </div>
    </template>
    <template v-else>
      <RuiButton
        :class="{ [css.arrow__button]: arrowButtons }"
        :disabled="modelValue <= 1"
        :icon="arrowButtons"
        :variant="arrowButtons ? 'outlined' : 'text'"
        color="primary"
        @click="onPrev()"
      >
        <template
          v-if="!arrowButtons"
          #prepend
        >
          <RuiIcon
            :size="18"
            name="arrow-left-s-line"
          />
        </template>
        <span v-if="!arrowButtons">Back</span>
        <RuiIcon
          v-else
          :size="24"
          name="arrow-left-line"
        />
      </RuiButton>
      <span
        v-if="variant === 'numeric'"
        :class="css.numeric"
      >
        {{ modelValue }}/{{ pages }}
      </span>
      <div
        v-else-if="variant === 'bullet'"
        :class="css.bullets"
      >
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
        color="primary"
        :value="(modelValue / pages) * 100"
      />
      <RuiButton
        :class="{ [css.arrow__button]: arrowButtons }"
        :disabled="modelValue >= pages"
        :icon="arrowButtons"
        :variant="arrowButtons ? 'outlined' : 'text'"
        color="primary"
        @click="onNext()"
      >
        <span v-if="!arrowButtons">Next</span>
        <RuiIcon
          v-else
          :size="24"
          name="arrow-right-line"
        />
        <template
          v-if="!arrowButtons"
          #append
        >
          <RuiIcon
            :size="18"
            name="arrow-right-s-line"
          />
        </template>
      </RuiButton>
    </template>
  </div>
</template>

<style lang="scss" module>
.footer-stepper {
  @apply flex items-center justify-between transition-all duration-150;

  .numeric {
    @apply text-rui-text;
  }

  .bullets,
  .pills {
    @apply flex;

    .bullet,
    .pill {
      @apply rounded-full h-2 bg-black/[0.26] transition-colors;

      &.active {
        @apply bg-rui-primary;
      }
    }

    .bullet {
      @apply hover:bg-rui-grey-300 cursor-pointer;

      &.active {
        @apply hover:bg-rui-primary;
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

  .arrow__button {
    @apply bg-white disabled:bg-white/60 #{!important};
  }
}

:global(.dark) {
  .footer-stepper {
    .bullets,
    .pills {
      .bullet,
      .pill {
        @apply bg-rui-grey-300;

        &.active {
          @apply bg-rui-primary;
        }
      }

      .bullet {
        @apply hover:bg-rui-grey-400;

        &.active {
          @apply hover:bg-rui-primary;
        }
      }
    }

    .bullets {
      .bullet {
        @apply bg-white/30;
      }
    }

    .arrow__button {
      @apply disabled:bg-[rgb(50,50,50)] #{!important};
    }
  }
}
</style>
