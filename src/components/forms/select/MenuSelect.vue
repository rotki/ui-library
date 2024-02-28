<script lang="ts" setup generic="T extends object, K extends keyof T = keyof T">
import RuiButton from '@/components/buttons/button/Button.vue';
import RuiMenu, { type Props as MenuProps } from '@/components/overlays/menu/Menu.vue';
import RuiIcon from '@/components/icons/Icon.vue';

export interface Props<T, K extends keyof T = keyof T> {
  options: T[];
  keyAttr: K;
  textAttr: K;
  modelValue?: T | null;
  disabled?: boolean;
  dense?: boolean;
  outlined?: boolean;
  label?: string;
  menuOptions?: MenuProps;
  labelClass?: string;
  menuClass?: string;
}

defineOptions({
  name: 'RuiMenuSelect',
});

const props = withDefaults(defineProps<Props<T, K>>(), {
  disabled: false,
  dense: false,
  outlined: false,
  label: 'Select',
  menuOptions: () => ({
    popper: { placement: 'bottom-start' },
    closeOnContentClick: true,
  }),
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: T | null): void;
}>();

const css = useCssModule();

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList<T>(
  toRef(props, 'options'),
  {
    itemHeight: props.dense ? 30 : 48,
    overscan: 1,
  },
);

const renderedData: ComputedRef<T[]> = useArrayMap(list, ({ data }) => data);

const isOpen = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:model-value', value),
});

const menuWidth = computed(() => {
  const widths = { min: 0, max: 0 };
  const maxWidth = 30;
  const paddingX = 1.5;
  const fontMultiplier = props.dense ? 12 : 13;

  props.options.forEach((option) => {
    const length = getText(option)?.toString()?.length ?? 0;
    if (widths.min === 0 && widths.max === 0) {
      widths.min = length;
      widths.max = length;
    }
    else if (length < widths.min) {
      widths.min = length;
    }
    else if (length > widths.max) {
      widths.max = length;
    }
  });

  const difference = widths.max - widths.min;

  function computeValue(width: number) {
    return `${Math.min((width * fontMultiplier) / 16 + paddingX, maxWidth)}rem`;
  }

  if (difference <= 5)
    return computeValue(widths.max);

  return computeValue(widths.min + difference / 2);
});

function getText(item: T): T[K] {
  return item[props.textAttr];
}

function getIdentifier(item: T): T[K] {
  return item[props.keyAttr];
}

function isActiveItem(item: T): boolean {
  if (!props.modelValue)
    return false;

  return item[props.keyAttr] === props.modelValue[props.keyAttr];
}

function updateOpen(open: boolean) {
  const value = props.modelValue;
  if (open && value) {
    nextTick(() => {
      scrollTo(get(props.options).findIndex(isActiveItem));
    });
  }
}

watch(isOpen, updateOpen);
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="css.wrapper"
    v-bind="menuOptions"
  >
    <template #activator="{ on, open }">
      <slot
        name="activator"
        v-bind="{ disabled, value, outlined, on, open }"
      >
        <label
          :class="[
            css.activator,
            labelClass,
            {
              [css.disabled]: disabled,
              [css.outlined]: outlined,
              [css.dense]: dense,
            },
          ]"
          :aria-disabled="disabled"
          v-on="disabled ? {} : on"
        >
          <span :class="css.label">
            {{ value ? getText(value) : label }}
          </span>

          <span :class="css.icon__wrapper">
            <RuiIcon
              :class="[css.icon, { 'rotate-180': open }]"
              name="arrow-drop-down-fill"
              size="24"
            />
          </span>
        </label>
      </slot>
    </template>
    <div
      v-bind="containerProps"
      :class="[css.menu, menuClass]"
      :style="{ width: menuWidth }"
    >
      <div v-bind="wrapperProps">
        <RuiButton
          v-for="(option, i) in renderedData"
          :key="i"
          :value="getIdentifier(option)"
          :active="isActiveItem(option)"
          :size="dense ? 'sm' : undefined"
          variant="list"
          @update:value="value = option"
        >
          {{ getText(option) }}
        </RuiButton>
      </div>
    </div>
  </RuiMenu>
</template>

<style module lang="scss">
.wrapper {
  @apply max-w-full;

  .activator {
    @apply relative inline-flex items-center overflow-hidden;
    @apply outline-none focus:outline-none cursor-pointer h-9 pl-4 py-2 pr-8 rounded;
    @apply m-0 bg-white hover:bg-gray-50 transition text-caption;

    &.dense {
      @apply h-7 pl-2 py-1;
    }

    &.disabled {
      @apply bg-black/[.12] text-rui-text-disabled active:text-rui-text-disabled cursor-default;
    }

    &.outlined {
      @apply border border-rui-text-disabled;

      &.disabled {
        @apply border-transparent;
      }
    }

    .label {
      @apply block truncate;
    }

    .icon {
      @apply text-rui-text-disabled transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute right-1 top-px bottom-0;
      }
    }
  }
}

.menu {
  @apply max-h-60 min-w-[2.5rem];
}

:global(.dark) {
  .wrapper {
    .activator {
      @apply bg-transparent hover:bg-white/10 text-rui-text-disabled;

      &.disabled {
        @apply bg-white/10;
      }

      &.outlined {
        @apply border border-rui-text-disabled;
      }
    }
  }
}
</style>
