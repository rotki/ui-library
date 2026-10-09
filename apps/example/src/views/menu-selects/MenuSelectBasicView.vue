<script lang="ts" setup>
import { RuiMenuSelect } from '@rotki/ui-library';
import { createOptions } from '@/data/options';

const options = createOptions();

const defaultValue = ref<number>(1);
const hiddenLabelValue = ref<number>(1);
const denseValue = ref<number>(1);
const disabledValue = ref<number>(1);
const loadingValue = ref<number>();
const errorValue = ref<number>();
const successValue = ref<number>();
const hideDetailsValue = ref<number>();
const requiredValue = ref<number>();
const hintValue = ref<number>();
</script>

<template>
  <div data-id="menu-selects-basic">
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
          data-id="ms-basic-default"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Hidden label</h4>
        <RuiMenuSelect
          v-model="hiddenLabelValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Country"
          label-placement="hidden"
          data-id="ms-basic-hidden-label"
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
          data-id="ms-basic-dense"
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
          data-id="ms-basic-disabled"
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
          data-id="ms-basic-loading"
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
          data-id="ms-basic-error"
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
          data-id="ms-basic-success"
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
          data-id="ms-basic-hide-details"
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
          data-id="ms-basic-required"
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
          data-id="ms-basic-hint"
        />
      </div>
    </div>
  </div>
</template>
