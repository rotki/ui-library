<script lang="ts" setup>
import {
  type ButtonProps,
  type MenuProps,
  type MenuSelectProps,
  RuiButton,
  RuiIcon,
  RuiMenu,
  RuiMenuSelect,
} from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';

type SimpleMenu = MenuProps & { buttonColor?: ButtonProps['color']; buttonText: string };
const menus = ref<SimpleMenu[]>([
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
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    variant: 'outlined',
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
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: true,
    variant: 'outlined',
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
    label: 'Menu with very long name to test and see truncate behaviour',
    hint: 'lorem ipsum dolor',
    options,
  },
  {
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    dense: true,
    errorMessages: ['This is required'],
    hint: 'lorem ipsum dolor',
    options,
  },
  {
    disabled: false,
    label: 'primitive return',
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    successMessages: ['lgtm!'],
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
]);

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const menuSelectPrimitive = ref<MenuSelectProps<string>[]>([
  {
    modelValue: undefined,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    disabled: true,
    options: primitiveOptions,
  },
  {
    modelValue: 'Lorem',
    dense: true,
    disabled: true,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    disabled: true,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: 'Lorem',
    dense: true,
    disabled: true,
    variant: 'outlined',
    options: primitiveOptions,
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
        class="py-4"
      >
        <RuiMenu
          v-bind="objectOmit(menu, ['buttonColor'])"
          :data-cy="`menu-${i}`"
          :open-delay="10"
        >
          <template #activator="{ attrs, disabled }">
            <RuiButton
              data-cy="activator"
              :color="menu.buttonColor"
              :disabled="disabled"
              v-bind="attrs"
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
        class="py-4"
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
      Select Menus: custom activator content
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelectCustom"
        :key="i"
        class="py-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :data-cy="`select-menu-custom-${i}`"
        >
          <template #activator="{ attrs, disabled, open, value }">
            <RuiButton
              class="!rounded-md border"
              data-cy="activator"
              variant="list"
              :disabled="disabled"
              v-bind="attrs"
            >
              {{ value ? value.label : 'Choose option' }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="arrow-drop-down-fill"
                  size="32"
                />
              </template>
            </RuiButton>
          </template>
        </RuiMenuSelect>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="select-menus-custom-inner"
    >
      Select Menus: custom activator inner content
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(menu, i) in menuSelectCustom"
        :key="i"
        class="py-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :data-cy="`select-menu-custom-inner-${i}`"
          :item-height="menu.dense ? undefined : 80"
          clearable
          :label-class="menu.dense ? undefined : 'h-20'"
          variant="outlined"
        >
          <template #selection="{ item }">
            {{ item.id }} | {{ item.label }}
          </template>
          <template #item="{ item }">
            <span
              class="block"
              :class="{ 'my-4': !menu.dense }"
            >
              {{ item.label }}
            </span>
          </template>
        </RuiMenuSelect>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="select-menus-custom-options"
    >
      Select Menus: custom options
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelectCustom"
        :key="i"
        class="py-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`select-menu-custom-options-${i}`"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiMenuSelect>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="select-menus-custom-options"
    >
      Select Menus: primitive values
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelectPrimitive"
        :key="i"
        class="py-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`select-menu-custom-options-${i}`"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiMenuSelect>
      </div>
    </div><h4
      class="text-h6 mt-6"
      data-cy="select-menus-custom-readonly"
    >
      Select Menus: readonly
    </h4>
    <div class="grid gap-6 grid-cols-4">
      <div
        v-for="(menu, i) in menuSelectPrimitive"
        :key="i"
        class="py-4"
      >
        <RuiMenuSelect
          v-model="menu.modelValue"
          v-bind="objectOmit(menu, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`select-menu-custom-readonly-${i}`"
          read-only
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiMenuSelect>
      </div>
    </div>
  </div>
</template>
