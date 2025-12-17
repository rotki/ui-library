<script lang="ts" setup>
import { get } from '@vueuse/shared';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import LazyIcon from '@/components/icons/LazyIcon.vue';
import { RuiIcons } from '@/icons';

defineOptions({
  name: 'IconBrowser',
});

const search = ref<string>('');

const debouncedSearch = refDebounced(search, 200);

const filteredIcons = computed<string[]>(() => {
  const query = get(debouncedSearch).toLowerCase().trim();
  if (!query)
    return [...RuiIcons];

  return RuiIcons.filter(icon => icon.toLowerCase().includes(query));
});

const { copy, copied, text: copiedText } = useClipboard({ copiedDuring: 1500 });

function isCopied(icon: string): boolean {
  return get(copied) && get(copiedText) === icon;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4 sticky top-0 bg-white dark:bg-rui-grey-900 py-2 z-10">
      <RuiTextField
        v-model="search"
        placeholder="Search icons..."
        prepend-icon="lu-search"
        clearable
        dense
        class="flex-1 max-w-md"
      />
      <span class="text-sm text-rui-text-secondary whitespace-nowrap">
        {{ filteredIcons.length }} icons
      </span>
    </div>

    <div class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
      <button
        v-for="icon in filteredIcons"
        :key="icon"
        class="flex flex-col items-center gap-2 p-3 rounded-lg border border-rui-grey-300 dark:border-rui-grey-700 bg-white dark:bg-rui-grey-800 cursor-pointer transition-all duration-150 hover:border-rui-primary hover:shadow-sm"
        :class="{ 'border-rui-success bg-rui-success/10': isCopied(icon) }"
        type="button"
        :title="`Click to copy: ${icon}`"
        @click="copy(icon)"
      >
        <LazyIcon
          :name="icon"
          class="text-rui-text"
        />
        <span class="text-xs text-center text-rui-text-secondary break-all leading-tight min-h-[2.5em]">
          {{ isCopied(icon) ? 'Copied!' : icon }}
        </span>
      </button>
    </div>

    <div
      v-if="filteredIcons.length === 0"
      class="text-center text-rui-text-secondary py-8"
    >
      No icons found matching "{{ search }}"
    </div>
  </div>
</template>
