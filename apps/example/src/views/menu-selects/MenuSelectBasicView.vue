<script lang="ts" setup>
import { RuiMenuSelect } from '@rotki/ui-library';
import { createOptions } from '@/data/options';

const options = createOptions();

const defaultValue = ref<number>(1);
const outlinedValue = ref<number>(1);
const denseValue = ref<number>(1);
const disabledValue = ref<number>(1);
const disabledOutlinedValue = ref<number>(1);
const loadingValue = ref<number>();
const errorValue = ref<number>();
const successValue = ref<number>();
const hideDetailsValue = ref<number>();
const requiredValue = ref<number>();
const hintValue = ref<number>();
</script>

<template>
  <div data-cy="menu-selects-basic">
    <h2 class="text-2xl font-bold mb-6">
      Menu Selects: Basic
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="flex flex-col space-y-2">
        <h4>Default</h4>
        <RuiMenuSelect
          v-model="defaultValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          data-cy="ms-basic-default"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Outlined</h4>
        <RuiMenuSelect
          v-model="outlinedValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          variant="outlined"
          data-cy="ms-basic-outlined"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Dense</h4>
        <RuiMenuSelect
          v-model="denseValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          dense
          data-cy="ms-basic-dense"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Disabled</h4>
        <RuiMenuSelect
          v-model="disabledValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          disabled
          data-cy="ms-basic-disabled"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Disabled Outlined</h4>
        <RuiMenuSelect
          v-model="disabledOutlinedValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          disabled
          variant="outlined"
          data-cy="ms-basic-disabled-outlined"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Loading</h4>
        <RuiMenuSelect
          v-model="loadingValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          loading
          data-cy="ms-basic-loading"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Error</h4>
        <RuiMenuSelect
          v-model="errorValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          :error-messages="['This field is required']"
          data-cy="ms-basic-error"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Success</h4>
        <RuiMenuSelect
          v-model="successValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          :success-messages="['Looks good!']"
          data-cy="ms-basic-success"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Hide Details</h4>
        <RuiMenuSelect
          v-model="hideDetailsValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          hide-details
          :error-messages="['This field is required']"
          data-cy="ms-basic-hide-details"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Required</h4>
        <RuiMenuSelect
          v-model="requiredValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          required
          variant="outlined"
          data-cy="ms-basic-required"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Hint</h4>
        <RuiMenuSelect
          v-model="hintValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          hint="Pick a country"
          data-cy="ms-basic-hint"
        />
      </div>
    </div>
  </div>
</template>
