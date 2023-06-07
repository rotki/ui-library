<script lang="ts" setup>
import { RuiButton, RuiIcon } from '@rotki/ui-library';
import { ref, useCssModule } from 'vue';

const css = useCssModule();

const buttons = ref([
  { clicks: 0, color: 'primary', disabled: false },
  { clicks: 0, color: 'secondary', disabled: false },
  { clicks: 0, color: 'error', disabled: false },
  { clicks: 0, color: 'warning', disabled: false },
  { clicks: 0, color: 'info', disabled: false },
  { clicks: 0, color: 'success', disabled: false },

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

  { clicks: 0, color: 'primary', text: true },
  { clicks: 0, color: 'secondary', text: true },
  { clicks: 0, color: 'error', text: true },
  { clicks: 0, color: 'warning', text: true },
  { clicks: 0, color: 'info', text: true },
  { clicks: 0, color: 'success', text: true },

  { clicks: 0, color: 'primary', disabled: true },
  { clicks: 0, color: 'secondary', disabled: true },
  { clicks: 0, color: 'error', disabled: true },
  { clicks: 0, color: 'warning', disabled: true },
  { clicks: 0, color: 'info', disabled: true },
  { clicks: 0, color: 'success', disabled: true },

  { clicks: 0, color: 'primary', disabled: false, tile: true },
  { clicks: 0, color: 'secondary', disabled: false, tile: true },
  { clicks: 0, color: 'error', disabled: false, tile: true },
  { clicks: 0, color: 'warning', disabled: false, tile: true },
  { clicks: 0, color: 'info', disabled: false, tile: true },
  { clicks: 0, color: 'success', disabled: false, tile: true },

  { clicks: 0, color: 'primary', text: true, tile: true },
  { clicks: 0, color: 'secondary', text: true, tile: true },
  { clicks: 0, color: 'error', text: true, tile: true },
  { clicks: 0, color: 'warning', text: true, tile: true },
  { clicks: 0, color: 'info', text: true, tile: true },
  { clicks: 0, color: 'success', text: true, tile: true },

  { clicks: 0, color: 'primary', disabled: true, tile: true },
  { clicks: 0, color: 'secondary', disabled: true, tile: true },
  { clicks: 0, color: 'error', disabled: true, tile: true },
  { clicks: 0, color: 'warning', disabled: true, tile: true },
  { clicks: 0, color: 'info', disabled: true, tile: true },
  { clicks: 0, color: 'success', disabled: true, tile: true },
]);

const icons = ref([
  { name: 'moon-line', size: 24 },
  { name: 'sun-line', size: 24 },
  { name: 'arrow-right-line', size: 24 },
]);
</script>

<template>
  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="buttons">Buttons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <rui-button
        v-for="(button, i) in buttons"
        :key="i"
        v-bind="button"
        @click="button.clicks++"
      >
        <template v-if="button.prepend" #prepend>
          <rui-icon :name="button.prepend" />
        </template>
        <span class="capitalize"> {{ button.color }} {{ button.clicks }} </span>
        <template v-if="button.append" #append>
          <rui-icon :name="button.append" />
        </template>
      </rui-button>
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="icons">Icons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <rui-icon v-for="(icon, i) in icons" :key="i" v-bind="icon" />
    </div>
  </div>
</template>

<style lang="scss" module>
.section {
  @apply mb-14;
}
</style>
