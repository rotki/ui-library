<script lang="ts" setup>
import RuiIcon from '@/components/icons/Icon.vue';
import RuiButton from '@/components/buttons/Button.vue';
import RuiProgress from '@/components/progress/Progress.vue';

const props = withDefaults(
  defineProps<{
    pages: number;
    modelValue: number;
    type?: 'numeric' | 'bullet' | 'progress' | 'pill';
  }>(),
  {
    type: 'numeric',
  }
);

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
  <div :class="[css['footer-stepper'], css[type ?? '']]">
    <template v-if="type === 'pill'">
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
      <rui-button
        :disabled="modelValue <= 1"
        color="primary"
        tile
        variant="text"
        @click="onPrev()"
      >
        <template #prepend>
          <rui-icon class="-ml-[.8rem]" name="arrow-left-s-line" />
        </template>
        <span>Back</span>
      </rui-button>
      <span v-if="type === 'numeric'"> {{ modelValue }}/{{ pages }} </span>
      <div v-else-if="type === 'bullet'" :class="css.bullets">
        <span
          v-for="i in pages"
          :key="i"
          :class="[css.bullet, { [css.active]: modelValue === i }]"
          @click="onClick(i)"
        />
      </div>
      <rui-progress
        v-else-if="type === 'progress'"
        :class="css.progress"
        :value="modelValue / pages"
      />
      <rui-button
        :disabled="modelValue >= pages"
        color="primary"
        tile
        variant="text"
        @click="onNext()"
      >
        <span>Next</span>
      </rui-button>
    </template>
  </div>
</template>

<style lang="scss" module>
.footer-stepper {
  @apply flex items-center justify-between transition-all duration-150;

  .numeric {
    @apply flex;
  }

  .bullets,
  .pills {
    @apply flex;

    .bullet,
    .pill {
      @apply rounded-full h-2 bg-black/[0.26] cursor-pointer;

      &.active {
        @apply bg-rui-primary;
      }
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
</style>
