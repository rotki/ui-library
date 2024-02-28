<script lang="ts" setup>
import {
  type ButtonProps,
  type MenuProps,
  type MenuSelectProps,
  RuiButton,
  RuiIcon,
  RuiMenu,
  RuiMenuSelect,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const menus = ref<
(MenuProps & { buttonColor?: ButtonProps['color']; buttonText: string })[]
  >([
    {
      disabled: false,
      buttonText: 'Bottom',
      buttonColor: 'primary',
      popper: { placement: 'bottom' },
    },
    {
      disabled: false,
      buttonText: 'Top',
      buttonColor: 'secondary',
      popper: { placement: 'top' },
    },
    {
      disabled: false,
      buttonText: 'Left',
      buttonColor: 'error',
      popper: { placement: 'left' },
    },
    {
      disabled: false,
      buttonText: 'Right',
      buttonColor: 'info',
      popper: { placement: 'right' },
    },
    {
      disabled: true,
      buttonText: 'Menu disabled',
      buttonColor: 'primary',
      popper: { placement: 'bottom' },
    },
    {
      disabled: true,
      buttonText: 'Menu disabled',
      buttonColor: 'secondary',
      popper: { placement: 'top' },
    },
    {
      disabled: true,
      buttonText: 'Menu disabled',
      buttonColor: 'error',
      popper: { placement: 'left' },
    },
    {
      disabled: true,
      buttonText: 'Menu disabled',
      buttonColor: 'info',
      popper: { placement: 'right' },
    },
    {
      disabled: false,
      buttonText: 'Bottom (Open on Hover)',
      buttonColor: 'primary',
      popper: { placement: 'bottom' },
      openOnHover: true,
    },
    {
      disabled: false,
      buttonText: 'Top (Open on Hover)',
      buttonColor: 'secondary',
      popper: { placement: 'top' },
      openOnHover: true,
    },
    {
      disabled: false,
      buttonText: 'Left (Open on Hover)',
      buttonColor: 'error',
      popper: { placement: 'left' },
      openOnHover: true,
    },
    {
      disabled: false,
      buttonText: 'Right (Open on Hover)',
      buttonColor: 'info',
      popper: { placement: 'right' },
      openOnHover: true,
    },
    {
      disabled: false,
      buttonText: 'Bottom (Close on Content Click)',
      buttonColor: 'primary',
      popper: { placement: 'bottom' },
      closeOnContentClick: true,
    },
    {
      disabled: false,
      buttonText: 'Top (Close on Content Click)',
      buttonColor: 'secondary',
      popper: { placement: 'top' },
      closeOnContentClick: true,
    },
    {
      disabled: false,
      buttonText: 'Left (Close on Content Click)',
      buttonColor: 'error',
      popper: { placement: 'left' },
      closeOnContentClick: true,
    },
    {
      disabled: false,
      buttonText: 'Right (Close on Content Click)',
      buttonColor: 'info',
      popper: { placement: 'right' },
      closeOnContentClick: true,
    },
  ]);

interface SelectOption { id: string | number; label: string | number }

const options: SelectOption[] = [
  { id: '1', label: 'Germany' },
  { id: '2', label: 'Nigeria' },
  { id: '3', label: 'Greece' },
  { id: '4', label: 'Indonesia' },
  { id: '5', label: 'Spain' },
  { id: '6', label: 'India' },
  { id: '7', label: 'France' },
  { id: '8', label: 'Option with very long name to test and see truncate behaviour' },
  ...[...new Array(5000).keys()].map(index => ({
    id: index + 9,
    label: index + 9,
  })),
];

const menuSelect = ref<MenuSelectProps<SelectOption>[]>([
  {
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: false,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: false,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: true,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
]);

const menuSelectCustom = ref<MenuSelectProps<SelectOption>[]>([
  {
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: false,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    outlined: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="menus"
    >
      Menus
    </h2>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menus"
        :key="i"
        class="p-4"
      >
        <RuiMenu
          v-bind="objectOmit(menu, ['buttonColor'])"
          :data-cy="`menu-${i}`"
        >
          <template #activator="{ on }">
            <RuiButton
              data-cy="activator"
              :color="menu.buttonColor"
              v-on="on"
            >
              {{ menu.buttonText }}
            </RuiButton>
          </template>
          <div class="px-3 py-2">
            This is menu {{ i }}
          </div>
        </RuiMenu>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="select-menus"
    >
      Select Menus
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelect"
        :key="i"
        class="p-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :data-cy="`select-menu-${i}`"
        />
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="select-menus-custom"
    >
      Select Menus: custom activator
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelectCustom"
        :key="i"
        class="p-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :data-cy="`select-menu-custom-${i}`"
        >
          <template #activator="{ on, disabled, open }">
            <RuiButton
              data-cy="activator"
              :disabled="disabled"
              v-on="on"
            >
              Menu
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="arrow-drop-down-fill"
                  size="24"
                />
              </template>
            </RuiButton>
          </template>
        </RuiMenuSelect>
      </div>
    </div>
  </div>
</template>
