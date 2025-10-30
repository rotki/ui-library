<script lang="ts" setup>
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props {
  expanded: boolean;
  icon?: RuiIcons;
}

defineOptions({
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), { icon: 'lu-chevron-down' });
</script>

<template>
  <RuiButton
    :class="[
      $style.tr__expander_button,
      {
        [$style.tr__expander_button_open ?? '']: expanded,
      },
    ]"
    icon
    size="sm"
    variant="text"
    v-bind="$attrs"
  >
    <slot>
      <RuiIcon
        :class="$style.tr__expander_button_icon"
        :name="icon"
      />
    </slot>
  </RuiButton>
</template>

<style lang="scss" module>
.tr__expander {
  &_button {
    @apply relative;

    &_icon {
      @apply transition rotate-0;
    }

    &_open .tr__expander_button_icon {
      @apply rotate-180;
    }
  }
}
</style>
