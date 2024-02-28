<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import type { RuiIcons } from '~/src';

export interface Props {
  expanded: boolean;
  icon?: RuiIcons;
}

withDefaults(defineProps<Props>(), { icon: 'arrow-down-s-line' });

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <Button
    :class="[
      css.tr__expander_button,
      {
        [css.tr__expander_button_open]: expanded,
      },
    ]"
    icon
    size="sm"
    variant="text"
    v-bind="attrs"
  >
    <slot>
      <Icon
        :class="css.tr__expander_button_icon"
        :name="icon"
      />
    </slot>
  </Button>
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
