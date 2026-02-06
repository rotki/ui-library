<script lang="ts" setup>
import { RuiSimpleSelect } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const stringOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
const numberOptions: number[] = [10, 20, 30, 40, 50];

const defaultValue = ref<string>('Option 1');
const outlinedValue = ref<string>('Option 1');
const disabledValue = ref<string>('Option 1');
const disabledOutlinedValue = ref<string>('Option 1');
const namedValue = ref<string>('Option 1');
const numberValue = ref<number>(10);
</script>

<template>
  <ComponentView data-cy="simple-selects">
    <template #title>
      Simple Selects
    </template>

    <div class="grid gap-6 grid-cols-2">
      <div>
        <h3 class="text-subtitle-1 mb-2">
          Default
        </h3>
        <RuiSimpleSelect
          v-model="defaultValue"
          :options="stringOptions"
          label="Default select"
          data-cy="ss-default"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Outlined
        </h3>
        <RuiSimpleSelect
          v-model="outlinedValue"
          :options="stringOptions"
          label="Outlined select"
          variant="outlined"
          data-cy="ss-outlined"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Disabled
        </h3>
        <RuiSimpleSelect
          v-model="disabledValue"
          :options="stringOptions"
          label="Disabled select"
          disabled
          data-cy="ss-disabled"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Disabled Outlined
        </h3>
        <RuiSimpleSelect
          v-model="disabledOutlinedValue"
          :options="stringOptions"
          label="Disabled outlined select"
          disabled
          variant="outlined"
          data-cy="ss-disabled-outlined"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Named
        </h3>
        <RuiSimpleSelect
          v-model="namedValue"
          :options="stringOptions"
          label="Country select"
          name="country"
          data-cy="ss-named"
        />
      </div>

      <div>
        <h3 class="text-subtitle-1 mb-2">
          Number Options
        </h3>
        <RuiSimpleSelect
          v-model="numberValue"
          :options="numberOptions"
          label="Number select"
          data-cy="ss-number-options"
        />
      </div>
    </div>
  </ComponentView>
</template>
