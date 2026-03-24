<script lang="ts" setup>
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { FooterStepperVariant } from '@/components/steppers/footer-stepper-variant';
import { tv } from '@/utils/tv';

export interface Props {
  pages: number;
  variant?: FooterStepperVariant;
  arrowButtons?: boolean;
  hideButtons?: boolean;
}

defineOptions({
  name: 'RuiFooterStepper',
});

const modelValue = defineModel<number>({ default: 1 });

const {
  pages,
  variant: variantProp = FooterStepperVariant.numeric,
  arrowButtons = false,
  hideButtons = false,
} = defineProps<Props>();

const footerStepper = {
  arrowButton: '!bg-white !disabled:bg-white/60 dark:!disabled:bg-[rgb(50,50,50)]',
  bullet: tv({
    base: 'rounded-full h-2 w-2 bg-black/[0.26] dark:bg-white/30 transition-colors cursor-pointer hover:bg-rui-grey-300 dark:hover:bg-rui-grey-400',
    variants: {
      active: {
        true: 'bg-rui-primary dark:bg-rui-primary hover:bg-rui-primary dark:hover:bg-rui-primary',
      },
    },
  }),
  pill: tv({
    base: 'rounded-full h-2 w-full bg-rui-grey-200 dark:bg-rui-grey-300 transition-colors',
    variants: {
      active: {
        true: 'bg-rui-primary dark:bg-rui-primary',
      },
    },
  }),
};

function onChange(delta: number): void {
  set(modelValue, get(modelValue) + delta);
}

function onPrev(): void {
  if (get(modelValue) > 1)
    onChange(-1);
}

function onNext(): void {
  if (get(modelValue) < pages)
    onChange(1);
}

function onClick(index: number): void {
  onChange(index - get(modelValue));
}
</script>

<template>
  <div
    role="navigation"
    aria-label="Step navigation"
    class="flex items-center justify-between gap-x-4 transition-all duration-150"
    :data-variant="variantProp"
  >
    <template v-if="variantProp === FooterStepperVariant.pill">
      <div
        data-id="pills"
        class="flex w-full gap-x-3"
      >
        <span
          v-for="i in pages"
          :key="i"
          :aria-current="modelValue === i ? 'step' : undefined"
          :class="footerStepper.pill({ active: modelValue === i })"
        />
      </div>
    </template>
    <template v-else>
      <RuiButton
        v-if="!hideButtons"
        aria-label="Previous"
        :class="arrowButtons ? footerStepper.arrowButton : undefined"
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
            name="lu-chevron-left"
          />
        </template>
        <span v-if="!arrowButtons">Back</span>
        <RuiIcon
          v-else
          :size="24"
          name="lu-arrow-left"
        />
      </RuiButton>
      <span
        v-if="variantProp === FooterStepperVariant.numeric"
        data-id="numeric"
        class="text-rui-text"
      >
        {{ modelValue }}/{{ pages }}
      </span>
      <div
        v-else-if="variantProp === FooterStepperVariant.bullet"
        data-id="bullets"
        class="flex gap-x-1"
      >
        <span
          v-for="i in pages"
          :key="i"
          :aria-current="modelValue === i ? 'step' : undefined"
          :class="footerStepper.bullet({ active: modelValue === i })"
          @click="onClick(i)"
        />
      </div>
      <RuiProgress
        v-else-if="variantProp === FooterStepperVariant.progress"
        class="max-w-[60%]"
        color="primary"
        :value="(modelValue / pages) * 100"
      />
      <RuiButton
        v-if="!hideButtons"
        aria-label="Next"
        :class="arrowButtons ? footerStepper.arrowButton : undefined"
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
          name="lu-arrow-right"
        />
        <template
          v-if="!arrowButtons"
          #append
        >
          <RuiIcon
            :size="18"
            name="lu-chevron-right"
          />
        </template>
      </RuiButton>
    </template>
  </div>
</template>
