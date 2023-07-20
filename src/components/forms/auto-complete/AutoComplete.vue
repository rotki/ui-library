<script lang="ts" setup>
import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue';
import Icon from '@/components/icons/Icon.vue';
import TextField from '@/components/forms/text-field/TextField.vue';
import { type ContextColorsType } from '@/consts/colors';
import AutoCompleteSelection from '@/components/forms/auto-complete/AutoCompleteSelection.vue';

export type Option = Record<string, any>;

export type ModelValue = Option | Option[] | null;

export interface Props {
  data: Option[];
  modelValue: ModelValue;
  nullable?: boolean;
  disabled?: boolean;
  searchQuery?: string;
  searchProp?: string;
  placeholder?: string;
  label?: string;
  keyProp?: string;
  textProp?: string;
  itemDisabledProp?: string;
  variant?: 'default' | 'filled' | 'outlined';
  color?: 'grey' | ContextColorsType;
  dense?: boolean;
  hint?: string;
  errorMessages?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  keyProp: 'id',
  textProp: 'text',
  itemDisabledProp: 'disabled',
  searchProp: '',
  searchQuery: '',
  placeholder: '',
  label: '',
  disabled: false,
  nullable: false,
  variant: 'default',
  color: 'grey',
  dense: false,
  hint: '',
  errorMessages: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: ModelValue): void;
}>();

const css = useCssModule();
const slots = useSlots();

const {
  data,
  modelValue,
  searchQuery,
  searchProp,
  textProp,
  keyProp,
  itemDisabledProp,
  hint,
  errorMessages,
} = toRefs(props);

const query = ref(get(searchQuery) ?? '');
const button = ref<{ el: HTMLButtonElement }>();

const filtered = computed(() => {
  const search = get(query)?.toLowerCase();
  const searchKey = get(searchProp);
  const textKey = get(textProp);
  return !search
    ? get(data)
    : get(data).filter((item) => {
        if (searchKey) {
          return (
            item[textKey].toLowerCase().includes(search) ||
            item[searchKey].toLowerCase().includes(search)
          );
        }
        return item[textKey].toLowerCase().includes(search);
      });
});

const multiple = computed(() => Array.isArray(get(modelValue)));

const hasValue = computed(() => {
  const value = get(modelValue);
  return Array.isArray(value) ? !!get(value)?.length : !!value;
});

const hideDetails = computed(() => !(get(hint) || get(errorMessages)?.length));

const onChange = (newVal: ModelValue) => {
  const value = get(modelValue);
  if (!(newVal && value) || newVal !== value) {
    emit('update:modelValue', newVal);
  }
};

const setQuery = (q: string) => {
  set(query, q);
};

const toggleDropdown = () => {
  get(button)?.el?.click();
};

const onClear = () => {
  emit('update:modelValue', get(multiple) ? [] : null);
  setQuery('');
};

const onRemove = (option: unknown) => {
  const value = get(modelValue);

  if (!get(multiple) || !Array.isArray(value)) {
    return;
  }

  const key = get(keyProp);

  emit(
    'update:modelValue',
    value.filter((opt: Option) => opt[key] !== (option as Option)[key]),
  );
};

watch(multiple, (newVal) => {
  const value = get(modelValue);
  if (newVal) {
    emit('update:modelValue', get(hasValue) ? [value] : []);
  } else if (Array.isArray(value)) {
    emit('update:modelValue', value[0] ?? null);
  } else {
    emit('update:modelValue', null);
  }
});
</script>

<template>
  <div :class="[multiple ? css.multiple : css.single, css[variant ?? '']]">
    <Combobox
      #default="{ open }"
      :by="keyProp"
      :class="[
        {
          [css.disabled]: disabled,
          [css.has_details]: !hideDetails,
        },
      ]"
      :disabled="disabled"
      :model-value="modelValue"
      :multiple="multiple"
      :nullable="nullable"
      @update:model-value="onChange($event)"
    >
      <div class="relative">
        <TextField
          v-model="query"
          :as="AutoCompleteSelection"
          :color="color"
          :data="modelValue"
          :dense="dense"
          :disabled="disabled"
          :error-messages="errorMessages"
          :has-value="hasValue"
          :hide-details="hideDetails"
          :hint="hint"
          :item-disabled-prop="itemDisabledProp"
          :key-prop="keyProp"
          :label="label"
          :placeholder="placeholder"
          :text-prop="textProp"
          :variant="variant"
          @remove="onRemove($event)"
          @focus-input="!open && toggleDropdown()"
        >
          <template #append>
            <div class="flex space-x-1 items-center">
              <button
                v-if="nullable && hasValue"
                :class="css.clear_button"
                :disabled="disabled"
                tabindex="-1"
                type="button"
                @click.prevent.stop="onClear()"
              >
                <Icon :class="css.clear_icon" name="close-line" />
              </button>
              <ComboboxButton
                ref="button"
                :class="[{ [css.toggle_disabled]: disabled }]"
                :disabled="disabled"
              >
                <Icon
                  :class="[css.toggle_icon, { 'rotate-180': open }]"
                  name="arrow-drop-down-fill"
                />
              </ComboboxButton>
            </div>
          </template>
        </TextField>
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
          @after-leave="setQuery('')"
        >
          <ComboboxOptions :class="css.options">
            <div
              v-if="filtered.length === 0 && query !== ''"
              :class="css.empty"
            >
              Nothing options found.
            </div>
            <ComboboxOption
              v-for="item in filtered"
              :key="item[keyProp]"
              #default="{ selected, disabled: itemDisabled }"
              :disabled="!!itemDisabledProp && item[itemDisabledProp]"
              :value="item"
              as="template"
            >
              <li
                :class="[
                  css.option,
                  {
                    [css.option__disabled]: itemDisabled,
                    [css.option__selected]: selected,
                    [css.option__prefixed]: !!slots.prefix,
                  },
                ]"
              >
                <span v-if="!!slots.prefix" :class="{ prefix: !!slots.prefix }">
                  <slot class="prefix" name="prefix" v-bind="item" />
                </span>
                <span class="block truncate">
                  <template v-if="slots.default">
                    <slot v-bind="item" />
                  </template>
                  <template v-else> {{ item[textProp] }} </template>
                </span>
                <span v-if="selected" :class="css.option__selected_icon">
                  <Icon aria-hidden="true" class="h-5 w-5" name="check-line" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  </div>
</template>

<style lang="scss" module>
.toggle_icon {
  @apply text-gray-400 hover:text-gray-600 transition-all;
}

.clear {
  &_button {
    @apply inset-y-0 px-2 flex items-center focus:outline-none;
  }

  &_icon {
    @apply text-gray-400 hover:text-gray-500;
  }
}

.has_details {
  .options {
    @apply -mt-5;
  }
}

.multiple,
.single {
  @apply max-w-full;
}

.default,
.filled,
.outlined {
  @apply visible;
}

.options {
  @apply absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-8;

  .empty {
    @apply relative cursor-default select-none py-2 px-4 text-gray-700 pointer-events-none;
  }

  .option {
    @apply relative cursor-pointer select-none py-2 pr-10 pl-4 text-gray-900;
    @apply hover:bg-gray-100;

    &__selected {
      @apply bg-gray-100/50;

      &_icon {
        @apply absolute inset-y-0 right-0 flex items-center pr-3 text-rui-primary;
      }
    }

    &__disabled {
      @apply cursor-default hover:bg-transparent text-gray-400;
    }

    &__prefixed {
      @apply flex items-center;
    }
  }
}

:global(.dark) {
  .clear {
    &_icon {
      @apply hover:text-gray-300;
    }
  }

  .toggle_icon {
    @apply hover:text-gray-300;
  }

  .options {
    @apply bg-white/[0.12];
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.12) 100%
      ),
      #121212;

    .empty {
      @apply text-gray-300;
    }

    .option {
      @apply text-white hover:bg-gray-100/20;

      &__selected {
        @apply bg-gray-100/10;
        @apply hover:bg-gray-100/20;

        &.option__disabled {
          @apply hover:bg-gray-100/10;
        }

        &_icon {
          @apply text-white;
        }
      }

      &__disabled {
        @apply hover:bg-transparent text-white/50;
      }
    }
  }
}
</style>
