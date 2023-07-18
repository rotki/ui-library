<script lang="ts" setup>
import { RuiButton, RuiIcon } from '@rotki/ui-library';
import { ref } from 'vue';

const buttons = ref([
  { clicks: 0, color: 'primary' },
  { clicks: 0, color: 'secondary' },
  { clicks: 0, color: 'error' },
  { clicks: 0, color: 'warning' },
  { clicks: 0, color: 'info' },
  { clicks: 0, color: 'success' },

  { clicks: 0, color: 'primary', variant: 'outlined' },
  { clicks: 0, color: 'secondary', variant: 'outlined' },
  { clicks: 0, color: 'error', variant: 'outlined' },
  { clicks: 0, color: 'warning', variant: 'outlined' },
  { clicks: 0, color: 'info', variant: 'outlined' },
  { clicks: 0, color: 'success', variant: 'outlined' },

  { clicks: 0, color: 'primary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'error', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'warning', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'info', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'success', prepend: 'arrow-right-line' },

  { clicks: 0, color: 'primary', append: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', append: 'arrow-right-line' },
  { clicks: 0, color: 'error', append: 'arrow-right-line' },
  { clicks: 0, color: 'warning', append: 'arrow-right-line' },
  { clicks: 0, color: 'info', append: 'arrow-right-line' },
  { clicks: 0, color: 'success', append: 'arrow-right-line' },

  { clicks: 0, color: 'primary', variant: 'text' },
  { clicks: 0, color: 'secondary', variant: 'text' },
  { clicks: 0, color: 'error', variant: 'text' },
  { clicks: 0, color: 'warning', variant: 'text' },
  { clicks: 0, color: 'info', variant: 'text' },
  { clicks: 0, color: 'success', variant: 'text' },

  { clicks: 0, color: 'primary', disabled: true },
  { clicks: 0, color: 'secondary', disabled: true },
  { clicks: 0, color: 'error', disabled: true },
  { clicks: 0, color: 'warning', disabled: true },
  { clicks: 0, color: 'info', disabled: true },
  { clicks: 0, color: 'success', disabled: true },

  { clicks: 0, color: 'primary', disabled: false, rounded: true },
  { clicks: 0, color: 'secondary', disabled: false, rounded: true },
  { clicks: 0, color: 'error', disabled: false, rounded: true },
  { clicks: 0, color: 'warning', disabled: false, rounded: true },
  { clicks: 0, color: 'info', disabled: false, rounded: true },
  { clicks: 0, color: 'success', disabled: false, rounded: true },

  { clicks: 0, color: 'primary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'warning', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'success', variant: 'outlined', rounded: true },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },

  { clicks: 0, color: 'primary', variant: 'text', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'text', rounded: true },
  { clicks: 0, color: 'error', variant: 'text', rounded: true },
  { clicks: 0, color: 'warning', variant: 'text', rounded: true },
  { clicks: 0, color: 'info', variant: 'text', rounded: true },
  { clicks: 0, color: 'success', variant: 'text', rounded: true },

  { clicks: 0, color: 'primary', disabled: true, rounded: true },
  { clicks: 0, color: 'secondary', disabled: true, rounded: true },
  { clicks: 0, color: 'error', disabled: true, rounded: true },
  { clicks: 0, color: 'warning', disabled: true, rounded: true },
  { clicks: 0, color: 'info', disabled: true, rounded: true },
  { clicks: 0, color: 'success', disabled: true, rounded: true },

  { clicks: 0, color: 'primary', variant: 'fab' },
  { clicks: 0, color: 'secondary', variant: 'fab' },
  { clicks: 0, color: 'error', variant: 'fab' },
  { clicks: 0, color: 'warning', variant: 'fab' },
  { clicks: 0, color: 'info', variant: 'fab' },
  { clicks: 0, color: 'success', variant: 'fab' },

  {
    clicks: 0,
    color: 'primary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="buttons">Buttons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6 justify-items-start">
      <RuiButton
        v-for="(button, i) in buttons"
        :key="i"
        :class="{ 'w-full': !button.icon && button.variant !== 'fab' }"
        v-bind="button"
        @click="button.clicks++"
      >
        <template v-if="button.prepend" #prepend>
          <RuiIcon :name="button.prepend" />
        </template>
        <span v-if="!button.icon" class="capitalize">
          {{ button.color }} {{ button.clicks }}
        </span>
        <RuiIcon v-else :name="button.iconName" />
        <template v-if="button.append" #append>
          <RuiIcon :name="button.append" />
        </template>
      </RuiButton>
    </div>
  </div>
</template>
