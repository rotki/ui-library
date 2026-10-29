<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { alertStyles } from './alert-styles';

export interface Props {
  title?: string;
  description?: string;
  type?: ContextColorsType;
  icon?: RuiIcons;
  variant?: 'default' | 'filled' | 'outlined';
  actionText?: string;
  closeable?: boolean;
}

defineOptions({
  name: 'RuiAlert',
  inheritAttrs: false,
});

const {
  title = '',
  description = '',
  type = 'primary',
  icon = undefined,
  variant = 'default',
  actionText = '',
  closeable = false,
} = defineProps<Props>();

const emit = defineEmits<{
  action: [];
  close: [];
}>();

const slots = defineSlots<{
  title?: () => any;
  default?: () => any;
}>();

const ui = computed<ReturnType<typeof alertStyles>>(() => alertStyles({ variant, type, titled: !!slots.title || !!title }));

const usedIcon = computed<RuiIcons | undefined>(() => {
  if (icon)
    return icon;

  const iconMap: Record<ContextColorsType, RuiIcons | undefined> = {
    primary: undefined,
    secondary: undefined,
    warning: 'lu-triangle-alert',
    info: 'lu-info',
    error: 'lu-circle-alert',
    success: 'lu-circle-check',
  };

  return iconMap[type];
});
</script>

<template>
  <div
    :class="ui.root()"
    v-bind="$attrs"
    :data-variant="variant"
    :data-type="type"
  >
    <div :class="ui.content()">
      <div
        v-if="usedIcon"
        :class="ui.icon()"
      >
        <RuiIcon
          :name="usedIcon"
          size="20"
        />
      </div>
      <div :class="ui.texts()">
        <div
          v-if="$slots.title || title"
          :class="{
            'font-medium': !!title,
          }"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div
          v-if="$slots.default || description"
          class="text-body-2"
        >
          <slot>
            {{ description }}
          </slot>
        </div>
      </div>
    </div>
    <div v-if="actionText">
      <RuiButton
        variant="text"
        size="sm"
        :color="variant === 'filled' ? undefined : type"
        :class="ui.action()"
        data-id="alert-action"
        @click="emit('action')"
      >
        {{ actionText }}
      </RuiButton>
    </div>
    <div v-if="closeable">
      <RuiButton
        :color="variant === 'filled' ? undefined : type"
        size="sm"
        icon
        variant="text"
        :class="ui.close()"
        data-id="alert-close"
        @click="emit('close')"
      >
        <RuiIcon
          name="lu-x"
          size="20"
        />
      </RuiButton>
    </div>
  </div>
</template>
