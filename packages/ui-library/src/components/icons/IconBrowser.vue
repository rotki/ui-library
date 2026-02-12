<script lang="ts" setup>
import { get } from '@vueuse/shared';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { RuiIcons } from '@/icons';

defineOptions({
  name: 'IconBrowser',
});

const ITEM_MIN_WIDTH = 140;
const ITEM_HEIGHT = 96;
const GAP = 12;

const search = ref<string>('');
const debouncedSearch = refDebounced(search, 200);
const { copy, copied, text: copiedText } = useClipboard({ copiedDuring: 1500 });

const gridRef = useTemplateRef<HTMLElement>('grid');
const { width: gridWidth } = useElementSize(gridRef);

const filteredIcons = computed<string[]>(() => {
  const query = get(debouncedSearch).toLowerCase().trim();
  if (!query)
    return [...RuiIcons];

  return RuiIcons.filter(icon => icon.toLowerCase().includes(query));
});

const columns = computed<number>(() => {
  const w = get(gridWidth);
  if (w <= 0)
    return 1;

  return Math.max(1, Math.floor((w + GAP) / (ITEM_MIN_WIDTH + GAP)));
});

const rows = computed<string[][]>(() => {
  const icons = get(filteredIcons);
  const cols = get(columns);
  const result: string[][] = [];
  for (let i = 0; i < icons.length; i += cols) result.push(icons.slice(i, i + cols));

  return result;
});

const { containerProps, list, wrapperProps } = useVirtualList<string[]>(rows, {
  itemHeight: ITEM_HEIGHT + GAP,
  overscan: 5,
});

function isCopied(icon: string): boolean {
  return get(copied) && get(copiedText) === icon;
}
</script>

<template>
  <div
    ref="grid"
    class="flex flex-col gap-4"
  >
    <div class="flex items-center gap-4 sticky top-0 bg-white dark:bg-rui-grey-900 py-2 z-10">
      <RuiTextField
        v-model="search"
        placeholder="Search icons..."
        prepend-icon="lu-search"
        clearable
        dense
        variant="outlined"
        class="flex-1 max-w-md"
      />
      <span class="text-xs text-rui-text-secondary whitespace-nowrap ml-auto">
        {{ filteredIcons.length }} icons
      </span>
    </div>

    <div
      v-if="filteredIcons.length > 0"
      v-bind="containerProps"
      class="max-h-[65vh] overflow-auto border border-rui-grey-300 dark:border-rui-grey-700 rounded-lg p-3"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="{ data: row, index } in list"
          :key="index"
          class="flex gap-3 pb-3"
        >
          <button
            v-for="icon in row"
            :key="icon"
            class="flex flex-col items-center p-3 rounded-lg border border-rui-grey-300 dark:border-rui-grey-700 bg-white dark:bg-rui-grey-800 cursor-pointer transition-all duration-150 hover:border-rui-primary hover:shadow-sm min-w-[140px] h-24 flex-[1_1_0]"
            :class="{ 'border-rui-success bg-rui-success/10': isCopied(icon) }"
            type="button"
            :title="`Click to copy: ${icon}`"
            @click="copy(icon)"
          >
            <span class="flex-1 flex items-center">
              <RuiIcon
                :name="icon"
                class="text-rui-text"
              />
            </span>
            <span class="text-xs text-center text-rui-text-secondary truncate w-full">
              {{ isCopied(icon) ? "Copied!" : icon }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center text-rui-text-secondary py-8"
    >
      No icons found matching "{{ search }}"
    </div>
  </div>
</template>
