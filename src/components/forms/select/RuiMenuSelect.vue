<script lang="ts" setup generic="TValue, TItem">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { type KeyOfType, useDropdownMenu } from '@/composables/dropdown-menu';

export interface Props<TValue, TItem> {
  options: TItem[];
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem;
  disabled?: boolean;
  loading?: boolean;
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
  hideDetails?: boolean;
  autoSelectFirst?: boolean;
  hideNoData?: boolean;
  noDataText?: string;
}

defineOptions({
  name: 'RuiMenuSelect',
  inheritAttrs: false,
});

const modelValue = defineModel<TValue | undefined>({ required: true });

const props = withDefaults(defineProps<Props<TValue, TItem>>(), {
  disabled: false,
  loading: false,
  readOnly: false,
  dense: false,
  clearable: false,
  hideDetails: false,
  label: 'Select',
  prependWidth: 0,
  appendWidth: 0,
  variant: 'default',
  hint: undefined,
  keyAttr: undefined,
  textAttr: undefined,
  itemHeight: undefined,
  errorMessages: () => [],
  successMessages: () => [],
  autoSelectFirst: false,
  hideNoData: false,
  noDataText: 'No data available',
});

const { dense, options } = toRefs(props);

const menuRef = ref();
const activator = ref();
const { focused } = useFocus(activator);

const value = computed<TItem | undefined>({
  get: () => {
    const keyAttr = props.keyAttr;
    const value = get(modelValue);
    if (keyAttr)
      return props.options.find(option => option[keyAttr] === value);
    return value as unknown as TItem;
  },
  set: (selected?: TItem) => {
    const keyAttr = props.keyAttr;
    const selection = keyAttr && selected ? selected[keyAttr] : selected;
    set(modelValue, selection as TValue);
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
  menuWidth,
  getText,
  getIdentifier,
  isActiveItem,
  highlightedIndex,
  moveHighlight,
  valueKey,
} = useDropdownMenu<TValue, TItem>({
  itemHeight: props.itemHeight ?? (props.dense ? 30 : 48),
  keyAttr: props.keyAttr,
  textAttr: props.textAttr,
  options,
  autoFocus: true,
  dense,
  value,
  menuRef,
  autoSelectFirst: props.autoSelectFirst,
});

const outlined = computed(() => props.variant === 'outlined');

const float = computed(() => (get(isOpen) || !!get(value)) && get(outlined));

const virtualContainerProps = computed(() => ({
  style: containerProps.style as any,
  ref: containerProps.ref as any,
}));

function setValue(val: TItem, index?: number) {
  if (isDefined(index))
    set(highlightedIndex, index);

  set(value, val);
  set(focused, true);
}

function clear() {
  set(modelValue, undefined);
}
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="$style.wrapper"
    v-bind="{
      ...getRootAttrs($attrs),
      placement: 'bottom-start',
      closeOnContentClick: true,
      fullWidth: true,
      ...menuOptions,
      errorMessages,
      successMessages,
      hint,
      dense,
      showDetails: !hideDetails,
      disabled,
    }"
  >
    <template #activator="{ attrs, open, hasError, hasSuccess }">
      <slot
        name="activator"
        v-bind="{ disabled, value, variant, readOnly, attrs, open, hasError, hasSuccess }"
      >
        <button
          ref="activator"
          :disabled="disabled"
          :aria-disabled="disabled"
          type="button"
          :tabindex="disabled || readOnly ? -1 : 0"
          class="group"
          :class="[
            $style.activator,
            labelClass,
            {
              [$style.disabled]: disabled,
              [$style.readonly]: readOnly,
              [$style.outlined]: outlined,
              [$style.dense]: dense,
              [$style.float]: float,
              [$style.opened]: open,
              [$style['with-value']]: !!value,
              [$style['with-error']]: hasError,
              [$style['with-success']]: hasSuccess && !hasError,
            },
          ]"
          v-bind="{ ...getNonRootAttrs($attrs), ...(readOnly ? {} : attrs) }"
          data-id="activator"
          @keydown.up.prevent="moveHighlight(true)"
          @keydown.down.prevent="moveHighlight(false)"
        >
          <span
            v-if="outlined || !value"
            :class="[
              $style.label,
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
            :class="$style.value"
          >
            <slot
              name="selection.prepend"
              v-bind="{ item: value }"
            />
            <slot
              name="selection"
              v-bind="{ item: value }"
            >
              {{ getText(value) }}
            </slot>
          </span>

          <span
            v-if="clearable && value && !disabled"
            class="group-hover:!visible"
            :class="[$style.clear, focused && '!visible']"
            @click.stop.prevent="clear()"
          >
            <RuiIcon
              color="error"
              name="lu-x"
              size="18"
            />
          </span>

          <span :class="$style.icon__wrapper">
            <RuiIcon
              :class="[$style.icon, { 'rotate-180': open }]"
              :size="dense ? 16 : 24"
              name="lu-chevron-down"
            />
          </span>

          <RuiProgress
            v-if="loading"
            class="absolute left-0 bottom-0 w-full"
            color="primary"
            thickness="3"
            variant="indeterminate"
          />
        </button>
        <fieldset
          v-if="outlined"
          :class="$style.fieldset"
        >
          <legend :class="{ 'px-2': float }" />
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
        v-if="options.length > 0"
        :class="[$style.menu, menuClass]"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        v-bind="virtualContainerProps"
        @scroll="containerProps.onScroll"
        @keydown.up.prevent="moveHighlight(true)"
        @keydown.down.prevent="moveHighlight(false)"
      >
        <div
          v-bind="wrapperProps"
          ref="menuRef"
        >
          <RuiButton
            v-for="({ item, _index }) in renderedData"
            :key="_index"
            :active="isActiveItem(item)"
            :size="dense ? 'sm' : undefined"
            :model-value="getIdentifier(item)"
            variant="list"
            :class="{
              highlighted: highlightedIndex === _index,
              [$style.highlighted]: !isActiveItem(item) && highlightedIndex === _index,
            }"
            @update:model-value="setValue(item, _index)"
            @mousedown="highlightedIndex = _index"
          >
            <template #prepend>
              <slot
                name="item.prepend"
                v-bind="{ disabled, item, active: isActiveItem(item) }"
              />
            </template>
            <slot
              name="item"
              v-bind="{ disabled, item, active: isActiveItem(item) }"
            >
              {{ getText(item) }}
            </slot>
            <template #append>
              <slot
                name="item.append"
                v-bind="{ disabled, item, active: isActiveItem(item) }"
              />
            </template>
          </RuiButton>
        </div>
      </div>

      <div
        v-else-if="!hideNoData"
        :style="{ width: `${width}px`, minWidth: menuWidth }"
        :class="menuClass"
      >
        <slot name="no-data">
          <div class="p-4">
            {{ noDataText }}
          </div>
        </slot>
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
      @apply py-1.5 min-h-10;

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
          @apply border-black/[0.23] #{!important};
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
      @apply ml-auto shrink-0 invisible;
    }

    .icon {
      @apply text-rui-text transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute right-3 top-px bottom-0;
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

.highlighted {
  @apply bg-rui-grey-200 #{!important};

  &.active {
    @apply bg-rui-grey-300 #{!important};
  }
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

        &.disabled {
          ~ .fieldset {
            @apply border-white/[0.23] #{!important};
          }
        }

        &:hover {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }

  .highlighted {
    @apply bg-rui-grey-800 #{!important};

    &.active {
      @apply bg-rui-grey-700 #{!important};
    }
  }
}
</style>
