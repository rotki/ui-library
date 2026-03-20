<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';
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
  <div data-id="auto-completes-basic">
    <h2 class="text-2xl font-bold mb-6">
      Basic
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="defaultValue"
          clearable
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Default"
          data-id="ac-basic-default"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="outlinedValue"
          clearable
          variant="outlined"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Outlined"
          data-id="ac-basic-outlined"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="denseValue"
          clearable
          dense
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Dense"
          data-id="ac-basic-dense"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="disabledValue"
          disabled
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Disabled"
          data-id="ac-basic-disabled"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="disabledOutlinedValue"
          disabled
          variant="outlined"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Disabled Outlined"
          data-id="ac-basic-disabled-outlined"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="loadingValue"
          loading
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Loading"
          data-id="ac-basic-loading"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="errorValue"
          :error-messages="['This field is required']"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="With Error"
          data-id="ac-basic-error"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="successValue"
          :success-messages="['Looks good!']"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="With Success"
          data-id="ac-basic-success"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="hideDetailsValue"
          hide-details
          :error-messages="['This field is required']"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Hide Details"
          data-id="ac-basic-hide-details"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="requiredValue"
          required
          variant="outlined"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Required"
          data-id="ac-basic-required"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="hintValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          hint="Select your country"
          label="With Hint"
          data-id="ac-basic-hint"
        />
      </div>
    </div>
  </div>
</template>
