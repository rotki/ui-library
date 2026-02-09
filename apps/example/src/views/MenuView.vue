<script lang="ts" setup>
import {
  type ButtonProps,
  type MenuProps,
  RuiButton,
  RuiMenu,
} from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentView from '@/components/ComponentView.vue';

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
  {
    disabled: false,
    buttonText: 'Bottom (Persistent)',
    buttonColor: 'primary',
    popper: { placement: 'bottom' },
    persistent: true,
  },
]);
</script>

<template>
  <ComponentView data-cy="menus">
    <template #title>
      Menus
    </template>

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
              :color="menu.buttonColor"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-cy': 'activator' }"
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
  </ComponentView>
</template>
