<script lang="ts" setup generic="T extends object | string, K extends keyof T = keyof T">
import { useDropdownMenu } from '@/composables/dropdown-menu';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';

export interface Props<T, K extends keyof T = keyof T> {
  options: T[];
  keyAttr?: K;
  textAttr?: keyof T;
  modelValue?: T extends string ? T : T[K];
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  menuOptions?: MenuProps;
  labelClass?: string;
  menuClass?: string;
  optionClass?: string;
  prependWidth?: number; // in rem
  appendWidth?: number; // in rem
  itemHeight?: number; // in px
  variant?: 'default' | 'filled' | 'outlined';
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  showDetails?: boolean;
}

defineOptions({
  name: 'RuiMenuSelect',
});

const props = withDefaults(defineProps<Props<T, K>>(), {
  disabled: false,
  readOnly: false,
  dense: false,
  clearable: false,
  showDetails: false,
  label: 'Select',
  menuOptions: () => ({
    popper: { placement: 'bottom-start' },
    closeOnContentClick: true,
  }),
  prependWidth: 0,
  appendWidth: 0,
  variant: 'default',
  hint: undefined,
  keyAttr: undefined,
  textAttr: undefined,
  itemHeight: undefined,
  errorMessages: () => [],
  successMessages: () => [],
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: T | T[K]): void;
}>();

const css = useCssModule();

const { dense, options } = toRefs(props);

const menuRef = ref();
const activator = ref();
const { focused } = useFocus(activator);

const value = computed<T | undefined>({
  get: () => {
    const keyAttr = props.keyAttr;
    if (keyAttr)
      return props.options.find(option => option[keyAttr] === props.modelValue);
    return props.modelValue as T;
  },
  set: (selected?: T) => {
    const keyAttr = props.keyAttr;
    const selection = keyAttr && selected ? selected[keyAttr] : selected;
    return emit('update:model-value', selection);
  },
});

const labelWithQuote = computed(() => {
  if (!props.label)
    return '"\\200B"';

  return `'  ${props.label}  '`;
});

const {
  containerProps,
  wrapperProps,
  renderedData,
  isOpen,
  valueKey,
  menuWidth,
  getText,
  getIdentifier,
  isActiveItem,
} = useDropdownMenu<T, K>({
  itemHeight: props.itemHeight ?? (props.dense ? 30 : 48),
  keyAttr: props.keyAttr,
  textAttr: props.textAttr,
  options,
  dense,
  value,
  menuRef,
});

const outlined = computed(() => props.variant === 'outlined');

const float = computed(() => (get(isOpen) || !!get(value)) && get(outlined));

const virtualContainerProps = computed(() => ({
  style: containerProps.style as any,
  ref: containerProps.ref as any,
}));

function setValue(val: T) {
  set(value, val);
  set(focused, true);
}
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="css.wrapper"
    full-width
    v-bind="{ ...menuOptions, errorMessages, successMessages, hint, dense, showDetails, disabled }"
  >
    <template #activator="{ on, open, hasError, hasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, variant, readOnly, on, open, hasError, hasSuccess }"
      >
        <button
          ref="activator"
          :disabled="disabled"
          :aria-disabled="disabled"
          :class="[
            css.activator,
            labelClass,
            {
              [css.disabled]: disabled,
              [css.readonly]: readOnly,
              [css.outlined]: outlined,
              [css.dense]: dense,
              [css.float]: float,
              [css.opened]: open,
              [css['with-value']]: !!value,
              [css['with-error']]: hasError,
              [css['with-success']]: hasSuccess && !hasError,
            },
          ]"
          data-id="activator"
          v-on="readOnly ? {} : on"
        >
          <span
            v-if="outlined || !value"
            :class="[
              css.label,
              {
                'absolute': outlined,
                'pr-2': !value && !open && outlined,
              },
            ]"
          >
            <slot
              name="activator.label"
              v-bind="{ value }"
            >
              {{ label }}
            </slot>
          </span>
          <span
            v-if="value"
            class="w-full"
            :class="css.value"
          >
            <slot
              name="activator.prepend"
              v-bind="{ value }"
            />
            <slot
              name="activator.text"
              v-bind="{ value }"
            >
              {{ getText(value) }}
            </slot>
          </span>

          <span
            v-if="clearable && value && !disabled"
            :class="css.clear"
            @click.stop.prevent="emit('update:model-value', undefined)"
          >
            <RuiIcon
              color="error"
              name="close-line"
              size="18"
            />
          </span>

          <span :class="css.icon__wrapper">
            <RuiIcon
              :class="[css.icon, { 'rotate-180': open }]"
              :size="dense ? 24 : 32"
              name="arrow-drop-down-fill"
            />
          </span>
        </button>
        <fieldset
          v-if="outlined"
          :class="css.fieldset"
        >
          <legend :class="{ 'px-2': float && !dense, 'px-1': float && dense }" />
        </fieldset>
      </slot>
      <input
        :value="valueKey"
        class="hidden"
        type="hidden"
      />
    </template>
    <template #default="{ width }">
      <div
        :class="[css.menu, menuClass]"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        v-bind="virtualContainerProps"
        @scroll="containerProps.onScroll"
      >
        <div
          v-bind="wrapperProps"
          ref="menuRef"
        >
          <RuiButton
            v-for="(option, i) in renderedData"
            :key="i"
            :active="isActiveItem(option)"
            :size="dense ? 'sm' : undefined"
            :model-value="getIdentifier(option)"
            variant="list"
            @update:model-value="setValue(option)"
          >
            <template #prepend>
              <slot
                name="item.prepend"
                v-bind="{ disabled, option, active: isActiveItem(option) }"
              />
            </template>
            <slot
              name="item.text"
              v-bind="{ disabled, option, active: isActiveItem(option) }"
            >
              {{ getText(option) }}
            </slot>
            <template #append>
              <slot
                name="item.append"
                v-bind="{ disabled, option, active: isActiveItem(option) }"
              />
            </template>
          </RuiButton>
        </div>
      </div>
    </template>
  </RuiMenu>
</template>

<style lang="scss" module>
.wrapper {
  @apply w-full inline-flex flex-col;

  .activator {
    @apply relative inline-flex items-center w-full;
    @apply outline-none focus:outline-none cursor-pointer min-h-14 pl-3 py-2 pr-8 rounded;
    @apply m-0 bg-white transition-all text-body-1 text-left hover:border-black;

    &:not(.outlined) {
      @apply hover:bg-gray-100 focus-within:bg-gray-100;
    }

    &.dense {
      @apply py-1 min-h-10;

      ~ .fieldset {
        @apply px-2;
      }
    }

    &.disabled {
      @apply opacity-65 text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none;
    }

    &.readonly {
      @apply opacity-80 pointer-events-none cursor-default bg-gray-50;
    }

    &.outlined {
      @apply border-none hover:border-none;

      &.opened,
      &:focus {
        @apply border-rui-primary;

        ~ .fieldset {
          @apply border-rui-primary #{!important};
          @apply border-2 #{!important};
        }
      }

      ~ .fieldset {
        @apply border border-black/[0.23];
      }

      &:hover {
        ~ .fieldset {
          @apply border-black;
        }
      }

      &.disabled {
        ~ .fieldset {
          @apply border-dotted;
        }
      }

      &.with-success {
        .label {
          @apply text-rui-success #{!important};
        }

        ~ .fieldset {
          @apply border-rui-success #{!important};
        }
      }

      &.with-error {
        .label {
          @apply text-rui-error #{!important};
        }

        ~ .fieldset {
          @apply border-rui-error #{!important};
        }
      }
    }

    .label {
      @apply text-rui-text-secondary;
      max-width: calc(100% - 2.5rem);
    }

    .label,
    .value {
      @apply block truncate transition-all duration-75;
    }

    .clear {
      @apply ml-auto shrink-0;
    }

    .icon {
      @apply text-rui-text transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute right-1 top-px bottom-0;
      }
    }

    &.float {
      .label {
        @apply -translate-y-2 top-0 text-xs px-1;
      }

      ~ .fieldset {
        legend {
          &:after {
            content: v-bind(labelWithQuote);
          }
        }
      }

      &.opened,
      &.opened.with-value,
      &:focus,
      &:focus.with-value {
        .label {
          @apply text-rui-primary;
        }

        ~ .fieldset {
          @apply border-rui-primary;
          @apply border-2 #{!important};
        }
      }
    }
  }

  .fieldset {
    @apply absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0 rounded pointer-events-none px-2 transition-all -mt-2;

    legend {
      @apply opacity-0 text-xs truncate;
      max-width: calc(100% - 1rem);

      &:before {
        content: ' ';
      }

      &:after {
        @apply truncate max-w-full leading-[0];
        content: '\200B';
      }
    }
  }
}

.menu {
  @apply overflow-y-auto max-h-60 min-w-[2.5rem];
}

:global(.dark) {
  .wrapper {
    .activator {
      @apply bg-transparent text-rui-text;

      &:not(.outlined) {
        @apply hover:bg-white/10 focus-within:bg-white/10;

        &.disabled {
          @apply bg-white/10;
        }
      }

      &.readonly {
        @apply bg-white/10;
      }

      &.outlined {
        ~ .fieldset {
          @apply border-white/[0.23];
        }

        &:hover {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }
}
</style>
