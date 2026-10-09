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
    options: { placement: 'bottom' },
  },
  {
    disabled: false,
    buttonText: 'Top',
    buttonColor: 'secondary',
    options: { placement: 'top' },
  },
  {
    disabled: false,
    buttonText: 'Left',
    buttonColor: 'error',
    options: { placement: 'left' },
  },
  {
    disabled: false,
    buttonText: 'Right',
    buttonColor: 'info',
    options: { placement: 'right' },
  },
  {
    disabled: true,
    buttonText: 'Menu disabled',
    buttonColor: 'primary',
    options: { placement: 'bottom' },
  },
  {
    disabled: true,
    buttonText: 'Menu disabled',
    buttonColor: 'secondary',
    options: { placement: 'top' },
  },
  {
    disabled: true,
    buttonText: 'Menu disabled',
    buttonColor: 'error',
    options: { placement: 'left' },
  },
  {
    disabled: true,
    buttonText: 'Menu disabled',
    buttonColor: 'info',
    options: { placement: 'right' },
  },
  {
    disabled: false,
    buttonText: 'Bottom (Open on Hover)',
    buttonColor: 'primary',
    options: { placement: 'bottom' },
    openOnHover: true,
  },
  {
    disabled: false,
    buttonText: 'Top (Open on Hover)',
    buttonColor: 'secondary',
    options: { placement: 'top' },
    openOnHover: true,
  },
  {
    disabled: false,
    buttonText: 'Left (Open on Hover)',
    buttonColor: 'error',
    options: { placement: 'left' },
    openOnHover: true,
  },
  {
    disabled: false,
    buttonText: 'Right (Open on Hover)',
    buttonColor: 'info',
    options: { placement: 'right' },
    openOnHover: true,
  },
  {
    disabled: false,
    buttonText: 'Bottom (Close on Content Click)',
    buttonColor: 'primary',
    options: { placement: 'bottom' },
    closeOnContentClick: true,
  },
  {
    disabled: false,
    buttonText: 'Top (Close on Content Click)',
    buttonColor: 'secondary',
    options: { placement: 'top' },
    closeOnContentClick: true,
  },
  {
    disabled: false,
    buttonText: 'Left (Close on Content Click)',
    buttonColor: 'error',
    options: { placement: 'left' },
    closeOnContentClick: true,
  },
  {
    disabled: false,
    buttonText: 'Right (Close on Content Click)',
    buttonColor: 'info',
    options: { placement: 'right' },
    closeOnContentClick: true,
  },
  {
    disabled: false,
    buttonText: 'Bottom (Persistent)',
    buttonColor: 'primary',
    options: { placement: 'bottom' },
    persistent: true,
  },
]);

const persistentNestedOpen = ref<boolean>(false);
</script>

<template>
  <ComponentView data-id="menus">
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
          :data-id="`menu-${i}`"
          :open-delay="10"
        >
          <template #activator="{ attrs, disabled }">
            <RuiButton
              :color="menu.buttonColor"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-id': 'activator' }"
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

    <h6 class="text-h6 mt-8 mb-4">
      Nested menu
    </h6>

    <div class="py-4">
      <RuiMenu
        data-id="menu-nested"
        :open-delay="10"
        :options="{ placement: 'bottom' }"
      >
        <template #activator="{ attrs }">
          <RuiButton
            color="primary"
            v-bind="{ ...attrs, 'data-id': 'activator' }"
          >
            Open outer menu
          </RuiButton>
        </template>
        <div class="px-3 py-2 flex flex-col items-start gap-2">
          <span>This is the outer menu</span>
          <RuiMenu
            data-id="menu-nested-inner"
            :open-delay="10"
            :options="{ placement: 'right' }"
          >
            <template #activator="{ attrs }">
              <RuiButton
                color="secondary"
                size="sm"
                v-bind="{ ...attrs, 'data-id': 'inner-activator' }"
              >
                Open inner menu
              </RuiButton>
            </template>
            <div
              class="px-3 py-2"
              data-id="inner-content"
            >
              This is the inner menu
            </div>
          </RuiMenu>
        </div>
      </RuiMenu>
    </div>

    <h6 class="text-h6 mt-8 mb-4">
      Persistent nested menu
    </h6>

    <div class="py-4">
      <RuiMenu
        v-model="persistentNestedOpen"
        data-id="menu-persistent-nested"
        persistent
        :open-delay="10"
        :options="{ placement: 'bottom' }"
      >
        <template #activator="{ attrs }">
          <RuiButton
            color="primary"
            v-bind="{ ...attrs, 'data-id': 'activator' }"
          >
            Open persistent outer menu
          </RuiButton>
        </template>
        <div class="px-3 py-2 flex flex-col items-start gap-2">
          <span>Escape leaves this one open</span>
          <RuiMenu
            data-id="menu-persistent-nested-inner"
            :open-delay="10"
            :options="{ placement: 'right' }"
          >
            <template #activator="{ attrs }">
              <RuiButton
                color="secondary"
                size="sm"
                v-bind="{ ...attrs, 'data-id': 'persistent-inner-activator' }"
              >
                Open inner menu
              </RuiButton>
            </template>
            <div
              class="px-3 py-2"
              data-id="persistent-inner-content"
            >
              This is the inner menu
            </div>
          </RuiMenu>
          <RuiButton
            color="error"
            size="sm"
            data-id="persistent-close"
            @click="persistentNestedOpen = false"
          >
            Close
          </RuiButton>
        </div>
      </RuiMenu>
    </div>
  </ComponentView>
</template>
