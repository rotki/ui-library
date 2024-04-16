<script lang="ts" setup>
import { RuiIcon, type RuiIcons, ThemeMode, useRotkiTheme } from '@rotki/ui-library';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';

const css = useCssModule();
const { switchThemeScheme, state } = useRotkiTheme();

interface Theme {
  name: string;
  value: ThemeMode;
  icon: RuiIcons;
}

const themes: Theme[] = [
  { name: 'Light', value: ThemeMode.light, icon: 'sun-line' },
  { name: 'Dark', value: ThemeMode.dark, icon: 'moon-line' },
  { name: 'System', value: ThemeMode.auto, icon: 'macbook-line' },
];

const selectedTheme = computed<Theme | null>(
  () => themes.find(theme => theme.value === get(state)) ?? null,
);

const defaultTheme = themes.find(theme => theme.value === get(state));

const onSwitchTheme = ({ value }: Theme) => switchThemeScheme(value);
</script>

<template>
  <header :class="css.header">
    <div
      :class="css['header-wrapper']"
      class="wrapper"
    >
      <RouterLink
        :to="{ name: 'buttons' }"
        aria-label="Home page"
        class="flex items-center space-x-3"
      >
        <img
          alt="rotki"
          class="h-8"
          src="../assets/logo.png"
        />
      </RouterLink>
      <div
        class="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow"
      >
        <Listbox
          :default-value="defaultTheme"
          :value="selectedTheme"
          as="div"
          by="value"
          class="relative"
          @update:model-value="onSwitchTheme($event)"
        >
          <ListboxLabel class="sr-only">
            Theme
          </ListboxLabel>
          <ListboxButton
            :aria-label="selectedTheme?.name"
            :class="css.toggle"
          >
            <RuiIcon
              :class="[css['toggle-icon'], css.light]"
              :size="32"
              name="sun-line"
            />
            <RuiIcon
              :class="[css['toggle-icon'], css.dark]"
              :size="32"
              name="moon-line"
            />
          </ListboxButton>
          <ListboxOptions :class="css.options">
            <ListboxOption
              v-for="theme in themes"
              :key="theme.value"
              #default="{ active, selected }"
              :value="theme"
            >
              <div
                :class="[
                  css.option,
                  {
                    [css.selected]: selected,
                    [css.active]: active,
                  },
                ]"
              >
                <div :class="css['option-wrapper']">
                  <span
                    :class="[
                      selected ? css['option-selected-icon'] : 'fill-slate-400',
                    ]"
                    class="h-4 w-4"
                  >
                    <RuiIcon
                      :name="theme.icon"
                      :size="16"
                    />
                  </span>
                </div>
                <div class="ml-3">
                  {{ theme.name }}
                </div>
              </div>
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  @apply sticky top-0 z-50 flex flex-wrap items-center bg-white shadow-md shadow-slate-900/5;
  @apply transition duration-500 py-5;
}

.header-wrapper {
  @apply flex flex-wrap items-center justify-between;
}

.toggle {
  @apply flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5;
}

.toggle-icon {
  @apply h-4 w-4 fill-sky-400;

  &.light {
    @apply block;
  }

  &.dark {
    @apply hidden;
  }
}

.options {
  @apply absolute left-1/2 top-full mt-3 w-36 -translate-x-3/4 space-y-1 rounded-xl bg-white p-3;
  @apply text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5;

  .option {
    @apply flex cursor-pointer select-none items-center rounded-[0.625rem] p-1;
  }

  .option:not(.selected):not(.active) {
    @apply text-slate-700;
  }

  .option.active:not(.selected) {
    @apply text-slate-900;
  }

  .option-wrapper {
    @apply rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5;
  }

  .selected {
    @apply text-sky-500;
  }

  .active {
    @apply bg-slate-100;
  }

  .option-selected-icon {
    @apply fill-sky-400;
  }
}

:global(.dark) {
  .header {
    @apply bg-[#272727] shadow-none;
  }

  .toggle {
    @apply bg-slate-700 ring-inset ring-white/5;
  }

  .toggle-icon {
    &.light {
      @apply hidden;
    }

    &.dark {
      @apply block;
    }
  }

  .options {
    @apply bg-slate-800 ring-white/5;

    .option:not(.selected):not(.active) {
      @apply text-slate-400;
    }

    .option.active:not(.selected) {
      @apply text-white;
    }

    .option-wrapper {
      @apply bg-slate-700 ring-inset ring-white/5;
    }

    .selected {
      @apply text-sky-500;
    }

    .active {
      @apply bg-slate-900/40;
    }

    .option-selected-icon {
      @apply fill-sky-400;
    }
  }
}
</style>
