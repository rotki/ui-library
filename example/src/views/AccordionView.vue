<script lang="ts" setup>
import { ref } from 'vue';
import {
  type AccordionsProps,
  RuiAccordion,
  RuiAccordions,
} from '@rotki/ui-library';

const accordions = ref<(AccordionsProps & { label: string })[]>([
  {
    modelValue: undefined,
    label: 'Single',
    multiple: false,
  },
  {
    modelValue: undefined,
    label: 'Multiple',
    multiple: true,
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="accordions"
    >
      Accordions
    </h2>
    <div
      class="grid gap-4 grid-cols-2 mb-14"
      data-cy="accordions-wrapper"
    >
      <template
        v-for="(accordion, i) in accordions"
        :key="i"
      >
        <div
          class="flex flex-col gap-3"
          :data-cy="`wrapper-${i}`"
        >
          <div>
            {{ accordion.label }}
          </div>
          <RuiAccordions
            v-model="accordion.modelValue"
            v-bind="accordion"
            data-cy="accordions"
          >
            <RuiAccordion header-class="py-4 border-y border-default">
              <template #header>
                <div class="text-rui-primary font-bold">
                  Accordion 1 Header
                </div>
              </template>
              <div class="p-4 border-b border-default">
                Accordion 1 Content
              </div>
            </RuiAccordion>
            <RuiAccordion header-class="py-4 border-b border-default">
              <template #header>
                <div class="text-rui-primary font-bold">
                  Accordion 2 Header
                </div>
              </template>
              <div class="p-4 border-b border-default">
                Accordion 2 Content
              </div>
            </RuiAccordion>
          </RuiAccordions>
          <div>Selected Value: {{ accordion.modelValue }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
