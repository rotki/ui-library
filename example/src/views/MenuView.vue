<script lang="ts" setup>
import {
  type ButtonProps,
  type MenuProps,
  RuiButton,
  RuiMenu,
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
            This is menu
          </div>
        </RuiMenu>
      </div>
    </div>
  </div>
</template>
