<script lang="ts" setup generic="TValue, TItem">
import type { KeyOfType } from '@/composables/dropdown-menu';
import type { VueClassValue } from '@/types/class-value';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { categoryPickerActivatorStyles, categoryPickerStyles, type CategoryPickerVariant } from '@/components/forms/category-picker/category-picker-styles';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiDialog, { type DialogProps } from '@/components/overlays/dialog/RuiDialog.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { Placement } from '@/composables/floating';
import { useCategoryPicker } from '@/composables/forms/category-picker/use-category-picker';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { cn } from '@/utils/tv';

export interface RuiCategoryPickerClassNames {
  root?: VueClassValue;
  rail?: VueClassValue;
  detail?: VueClassValue;
  search?: VueClassValue;
}

export type CategoryPickerBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface RuiCategoryPickerProps<TValue, TItem> {
  /** The full catalogue of selectable items. */
  items: TItem[];
  /** Resolve an item's category label. Takes precedence over `categoryAttr`. */
  categoryOf?: (item: TItem) => string;
  /** Resolve an item's category from one of its own properties. */
  categoryAttr?: keyof TItem;
  /** Property whose value becomes the model value. Omit to use the item itself. */
  keyAttr?: KeyOfType<TItem, TValue extends (infer U)[] ? U : TValue>;
  /** Property that produces an item's display text. */
  textAttr?: keyof TItem;
  /** Field label, and the title of the mobile sheet. */
  label?: string;
  /** Placeholder shown in the field while it is empty or being searched. */
  placeholder?: string;
  /** Allow filtering: type in the field (desktop) or the sheet's search box (mobile). */
  searchable?: boolean;
  /**
   * Custom predicate. Receives the resolved category label as the third
   * argument, matching the `RuiAutoComplete` filter signature.
   */
  filter?: (item: TItem, query: string, category: string) => boolean;
  /** Show the synthetic "All" pseudo-category as the first rail entry. */
  showAll?: boolean;
  /** Label for the "All" pseudo-category. */
  allLabel?: string;
  /** Text shown when no item matches the current search. */
  emptyText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  loading?: boolean;
  /** Trigger field style: underline (`default`), `outlined`, or `filled`. */
  variant?: CategoryPickerVariant;
  /** Marks the trigger field as required (renders the asterisk). */
  required?: boolean;
  /** Validation errors rendered under the trigger field. */
  errorMessages?: string | string[];
  /** Success messages rendered under the trigger field. */
  successMessages?: string | string[];
  /** Hint rendered under the trigger field. */
  hint?: string;
  /** Hide the details row (errors/success/hint) under the trigger field. */
  hideDetails?: boolean;
  /** Below this breakpoint the picker collapses to a single-pane drill-in. */
  mobileBreakpoint?: CategoryPickerBreakpoint;
  /** Forwarded to the mobile bottom-sheet (`RuiDialog`). */
  dialogOptions?: DialogProps;
  classNames?: RuiCategoryPickerClassNames;
}

defineOptions({
  name: 'RuiCategoryPicker',
  inheritAttrs: false,
});

const modelValue = defineModel<TValue>();
const searchInput = defineModel<string>('search', { default: '' });

const {
  items,
  categoryOf = undefined,
  categoryAttr = undefined,
  keyAttr = undefined,
  textAttr = undefined,
  label = 'Select',
  placeholder = 'Search',
  searchable = true,
  filter = undefined,
  showAll = true,
  allLabel = 'All',
  emptyText = 'No results',
  disabled = false,
  readOnly = false,
  dense = false,
  clearable = false,
  loading = false,
  variant = 'outlined',
  required = false,
  errorMessages = [],
  successMessages = [],
  hint = '',
  hideDetails = false,
  mobileBreakpoint = 'md',
  dialogOptions = undefined,
  classNames = undefined,
} = defineProps<RuiCategoryPickerProps<TValue, TItem>>();

const emit = defineEmits<{
  select: [item: TItem];
}>();

defineSlots<{
  'activator'?: (props: { attrs: { onClick?: () => void; onMouseover?: () => void; onMouseleave?: () => void }; isOpen: boolean; open: () => void; item: TItem | undefined; text: string | undefined }) => any;
  'activator.label'?: (props: { item: TItem | undefined }) => any;
  'selection'?: (props: { item: TItem }) => any;
  'selection.prepend'?: (props: { item: TItem }) => any;
  'category'?: (props: { category: string | null; label: string; active: boolean; count: number }) => any;
  'item'?: (props: { item: TItem; active: boolean; selected: boolean }) => any;
  'item.prepend'?: (props: { item: TItem; active: boolean; selected: boolean }) => any;
  'item.append'?: (props: { item: TItem; active: boolean; selected: boolean }) => any;
  'empty'?: () => any;
  'header'?: () => any;
  'footer'?: (props: { close: () => void }) => any;
}>();

const isOpen = ref<boolean>(false);
const focusedPane = ref<'rail' | 'detail'>('rail');
const highlightedItemIndex = ref<number>(0);
const drillStep = ref<'category' | 'detail'>('category');

const railRef = useTemplateRef<HTMLDivElement>('railRef');
const detailRef = useTemplateRef<HTMLDivElement>('detailRef');
const activatorRef = useTemplateRef<HTMLInputElement>('activatorRef');
const fieldRef = useTemplateRef<HTMLElement>('fieldRef');
const isHovered = ref<boolean>(false);

const { focused } = useFocus(activatorRef);
const { hasError, hasSuccess } = useFormTextDetail(() => errorMessages, () => successMessages);

const baseId = useId();
const breakpoints = useBreakpoints(breakpointsTailwind);

function resolveCategory(item: TItem): string {
  if (categoryOf)
    return categoryOf(item);
  if (categoryAttr !== undefined)
    return String(item[categoryAttr] ?? '');
  return '';
}

const {
  activeCategory,
  detailItems,
  detailRows,
  getIdentifier,
  getText,
  isEmpty,
  isSelected,
  railEntries,
  setActiveCategory,
  syncActiveToSelection,
} = useCategoryPicker<TValue, TItem>({
  allLabel: () => allLabel,
  categoryOf: resolveCategory,
  filter: () => filter,
  items: () => items,
  keyAttr,
  modelValue,
  search: searchInput,
  searchable: () => searchable,
  showAll: () => showAll,
  textAttr,
});

const isMobile = computed<boolean>(() => get(breakpoints.smaller(mobileBreakpoint)));

const mode = computed<'twoPane' | 'drill'>(() => (get(isMobile) ? 'drill' : 'twoPane'));

// Desktop anchors an outside-click popover under the field (RuiMenu); narrow
// width shows a full-width bottom sheet (RuiDialog). Each branch returns only
// its own shell's props so the other component's props never leak as attrs.
const shell = computed<typeof RuiMenu | typeof RuiDialog>(() => (get(isMobile) ? RuiDialog : RuiMenu));

const shellProps = computed<Record<string, unknown>>(() => {
  if (get(isMobile)) {
    return {
      ariaLabel: dialogOptions?.ariaLabel ?? label,
      bottomSheet: dialogOptions?.bottomSheet ?? true,
      maxWidth: dialogOptions?.maxWidth,
      persistent: dialogOptions?.persistent,
      width: dialogOptions?.width ?? '100%',
    };
  }
  return {
    // Anchor to the field box, not the wrapper, so the popover sits directly
    // under the input instead of below the reserved details row.
    anchorEl: get(fieldRef) ?? undefined,
    classNames: { menu: 'z-[9999]' },
    closeOnContentClick: false,
    disableAutoFocus: true,
    fullWidth: true,
    options: { placement: Placement.bottomStart },
    persistent: dialogOptions?.persistent,
    persistOnActivatorClick: true,
  };
});

const ui = computed<ReturnType<typeof categoryPickerStyles>>(() => categoryPickerStyles({
  dense,
  mode: get(mode),
}));

const selectedItem = computed<TItem | undefined>(() => {
  const value = get(modelValue);
  if (value === undefined)
    return undefined;
  return items.find(item => getIdentifier(item) === value);
});

const selectedText = computed<string | undefined>(() => {
  const selected = get(selectedItem);
  return selected ? getText(selected) : undefined;
});

const outlined = computed<boolean>(() => variant === 'outlined');

// Desktop lets the user type in the field itself (no separate search box);
// narrow width keeps a read-only trigger that opens the sheet's own search.
const canType = computed<boolean>(() => searchable && !get(isMobile) && !readOnly && !disabled);

const isTyping = computed<boolean>(() => get(isOpen) && get(canType));

const float = computed<boolean>(() => (get(isOpen) || get(selectedItem) !== undefined || get(focused)) && get(outlined));

const legendText = computed<string>(() => {
  if (!get(float) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

const activatorUi = computed<ReturnType<typeof categoryPickerActivatorStyles>>(() => categoryPickerActivatorStyles({
  dense,
  disabled,
  filled: variant === 'filled',
  float: get(float),
  hasError: get(hasError),
  hasSuccess: get(hasSuccess) && !get(hasError),
  hovered: get(isHovered),
  opened: get(isOpen),
  outlined: get(outlined),
  readonly: readOnly,
}));

const activeRailIndex = computed<number>(() =>
  get(railEntries).findIndex(entry => entry.category === get(activeCategory)));

const showRail = computed<boolean>(() => get(mode) === 'twoPane' || get(drillStep) === 'category');
const showDetail = computed<boolean>(() => get(mode) === 'twoPane' || get(drillStep) === 'detail');

function clamp(value: number, max: number): number {
  if (value < 0)
    return 0;
  if (value > max)
    return max;
  return value;
}

function open(): void {
  if (disabled)
    return;
  set(isOpen, true);
}

function close(): void {
  set(isOpen, false);
}

function onInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement))
    return;
  set(searchInput, target.value);
  if (!get(isOpen))
    open();
}

function selectItem(item: TItem): void {
  if (readOnly)
    return;
  set(modelValue, getIdentifier(item));
  emit('select', item);
  close();
}

function clearSelection(): void {
  set(modelValue, undefined);
}

function onCategoryClick(category: string | null): void {
  setActiveCategory(category);
  if (get(mode) === 'drill')
    set(drillStep, 'detail');
  else
    focusPane('detail');
}

function focusPane(pane: 'rail' | 'detail'): void {
  set(focusedPane, pane);
  nextTick(() => {
    (pane === 'rail' ? get(railRef) : get(detailRef))?.focus();
  });
}

function moveRail(direction: 1 | -1): void {
  const entries = get(railEntries);
  if (entries.length === 0)
    return;
  const next = clamp(get(activeRailIndex) + direction, entries.length - 1);
  setActiveCategory(entries[next]?.category ?? null);
}

function moveItem(direction: 1 | -1): void {
  const total = get(detailItems).length;
  if (total === 0)
    return;
  set(highlightedItemIndex, clamp(get(highlightedItemIndex) + direction, total - 1));
}

function enterDetail(): void {
  if (get(detailItems).length === 0)
    return;
  resetHighlightToSelection();
  if (get(mode) === 'drill')
    set(drillStep, 'detail');
  focusPane('detail');
}

function selectHighlighted(): void {
  const item = get(detailItems)[get(highlightedItemIndex)];
  if (item !== undefined)
    selectItem(item);
}

// Enter from the field commits the best match for the current query, so a
// type-to-pick flow (type a few letters, press Enter) works without leaving the
// input. Does nothing when the field is empty.
function selectTopResult(): void {
  if (!get(searchInput).trim())
    return;
  const item = get(detailItems)[0];
  if (item !== undefined)
    selectItem(item);
}

function resetHighlightToSelection(): void {
  const index = get(detailItems).findIndex(item => isSelected(item));
  set(highlightedItemIndex, index >= 0 ? index : 0);
}

function backToRail(): void {
  if (get(mode) === 'drill')
    set(drillStep, 'category');
  else
    focusPane('rail');
}

function scrollActiveDescendantIntoView(container: HTMLElement | null, id: string): void {
  if (!container)
    return;
  nextTick(() => {
    container.querySelector(`#${id}`)?.scrollIntoView({ block: 'nearest' });
  });
}

// Reset the item highlight whenever the active category changes.
watch(activeCategory, () => {
  resetHighlightToSelection();
});

watch(highlightedItemIndex, (index) => {
  scrollActiveDescendantIntoView(get(detailRef), `${baseId}-opt-${index}`);
});

watch(activeRailIndex, (index) => {
  if (index >= 0)
    scrollActiveDescendantIntoView(get(railRef), `${baseId}-cat-${index}`);
});

watch(isOpen, (value) => {
  if (value) {
    syncActiveToSelection();
    set(focusedPane, 'rail');
    set(drillStep, 'category');
    resetHighlightToSelection();
    // Desktop is a combobox: keep focus in the field so the user can type
    // straight away (ArrowDown moves into the panes). The mobile sheet has no
    // typing field, so focus the rail instead.
    nextTick(() => (get(canType) ? get(activatorRef) : get(railRef))?.focus());
  }
  else {
    // Reset the query so the field shows the selection again next time, and
    // return focus to the trigger (APG dialog contract).
    set(searchInput, '');
    nextTick(() => get(activatorRef)?.focus());
  }
});
</script>

<template>
  <component
    :is="shell"
    v-model="isOpen"
    v-bind="{ ...$attrs, ...shellProps }"
  >
    <template #activator="{ attrs }">
      <slot
        name="activator"
        v-bind="{ attrs, isOpen, item: selectedItem, open, text: selectedText }"
      >
        <div :class="activatorUi.wrapper()">
          <div
            ref="fieldRef"
            role="combobox"
            data-id="activator"
            :class="activatorUi.activator()"
            aria-haspopup="dialog"
            :aria-controls="isOpen ? `${baseId}-panel` : undefined"
            :aria-expanded="isOpen"
            :aria-disabled="disabled || undefined"
            :aria-readonly="(readOnly || !canType) || undefined"
            :aria-required="required || undefined"
            :aria-invalid="hasError || undefined"
            :aria-busy="loading || undefined"
            v-bind="readOnly ? {} : attrs"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
          >
            <span
              v-if="outlined || (!selectedItem && !isTyping)"
              :class="activatorUi.label()"
            >
              <slot
                name="activator.label"
                v-bind="{ item: selectedItem }"
              >
                {{ label }}
              </slot>
              <span
                v-if="required"
                :class="activatorUi.required()"
              >
                ﹡
              </span>
            </span>
            <span
              v-if="selectedItem && !isTyping && $slots.selection"
              class="absolute inset-y-0 left-4 right-8 flex items-center gap-2 pointer-events-none"
              :class="[activatorUi.value()]"
            >
              <slot
                name="selection.prepend"
                v-bind="{ item: selectedItem }"
              />
              <slot
                name="selection"
                v-bind="{ item: selectedItem }"
              />
            </span>
            <input
              ref="activatorRef"
              data-id="search-input"
              :value="isTyping ? searchInput : (($slots.selection && selectedItem) ? '' : (selectedText ?? ''))"
              :placeholder="isTyping ? placeholder : ''"
              :readonly="!canType"
              :disabled="disabled"
              :aria-invalid="hasError || undefined"
              class="bg-transparent outline-none"
              :class="[activatorUi.value(), !canType && 'cursor-pointer']"
              @input="onInput($event)"
              @keydown.down.prevent="focusPane('rail')"
              @keydown.enter.prevent="selectTopResult()"
              @keydown.esc="close()"
            />
            <span
              v-if="clearable && selectedItem && !disabled && !readOnly"
              data-id="clear"
              :class="[activatorUi.clear(), focused && '!visible']"
              @click.stop.prevent="clearSelection()"
            >
              <RuiIcon
                color="error"
                name="lu-x"
                size="18"
              />
            </span>
            <span :class="activatorUi.iconWrapper()">
              <RuiIcon
                :class="activatorUi.icon()"
                :size="dense ? 16 : 24"
                name="lu-chevron-down"
              />
            </span>
            <RuiProgress
              v-if="loading"
              :class="activatorUi.progress()"
              color="primary"
              thickness="3"
              variant="indeterminate"
            />
            <fieldset
              v-if="outlined"
              :class="activatorUi.fieldset()"
            >
              <legend :class="activatorUi.legend()">
                {{ legendText }}
              </legend>
            </fieldset>
          </div>
          <RuiFormTextDetail
            v-if="!hideDetails"
            class="px-3 pt-1"
            :error-messages="errorMessages"
            :success-messages="successMessages"
            :hint="hint"
          />
        </div>
      </slot>
    </template>

    <div
      :id="`${baseId}-panel`"
      :class="ui.root({ class: cn(classNames?.root) })"
      data-id="panel"
    >
      <!-- On desktop the field itself is the search input, so the panel only
           needs its own search box in the mobile sheet. -->
      <div
        v-if="isMobile || $slots.header"
        :class="ui.header()"
      >
        <slot name="header">
          <div :class="ui.title()">
            {{ label }}
          </div>
        </slot>
        <RuiTextField
          v-if="searchable && isMobile"
          v-model="searchInput"
          :class="cn(classNames?.search)"
          :placeholder="placeholder"
          :dense="dense"
          variant="outlined"
          prepend-icon="lu-search"
          hide-details
          clearable
          data-id="search"
        />
      </div>

      <div :class="ui.body()">
        <!-- Category rail (master) -->
        <div
          v-show="showRail"
          ref="railRef"
          :class="ui.rail({ class: cn(classNames?.rail) })"
          role="tablist"
          aria-orientation="vertical"
          :aria-label="label"
          :aria-activedescendant="focusedPane === 'rail' && activeRailIndex >= 0 ? `${baseId}-cat-${activeRailIndex}` : undefined"
          tabindex="0"
          data-id="rail"
          @focus="focusedPane = 'rail'"
          @keydown.down.prevent="moveRail(1)"
          @keydown.up.prevent="moveRail(-1)"
          @keydown.right.prevent="enterDetail()"
          @keydown.enter.prevent="enterDetail()"
          @keydown.home.prevent="setActiveCategory(railEntries[0]?.category ?? null)"
          @keydown.end.prevent="setActiveCategory(railEntries[railEntries.length - 1]?.category ?? null)"
        >
          <RuiButton
            v-for="(entry, index) in railEntries"
            :id="`${baseId}-cat-${index}`"
            :key="entry.category ?? '__all__'"
            role="tab"
            variant="list"
            :size="dense ? 'sm' : undefined"
            :active="entry.category === activeCategory"
            :aria-selected="entry.category === activeCategory"
            tabindex="-1"
            :data-highlighted="focusedPane === 'rail' && index === activeRailIndex"
            :data-category="entry.category ?? '__all__'"
            @click="onCategoryClick(entry.category)"
          >
            <slot
              name="category"
              v-bind="{ active: entry.category === activeCategory, category: entry.category, count: entry.count, label: entry.label }"
            >
              <span class="truncate">{{ entry.label }}</span>
              <span :class="ui.railCount()">{{ entry.count }}</span>
            </slot>
          </RuiButton>
        </div>

        <!-- Detail pane -->
        <div
          v-show="showDetail"
          ref="detailRef"
          :class="ui.detail({ class: cn(classNames?.detail) })"
          role="listbox"
          :aria-label="activeCategory ?? allLabel"
          :aria-activedescendant="focusedPane === 'detail' && !isEmpty ? `${baseId}-opt-${highlightedItemIndex}` : undefined"
          tabindex="0"
          data-id="detail"
          @focus="focusedPane = 'detail'"
          @keydown.down.prevent="moveItem(1)"
          @keydown.up.prevent="moveItem(-1)"
          @keydown.left.prevent="backToRail()"
          @keydown.home.prevent="highlightedItemIndex = 0"
          @keydown.end.prevent="highlightedItemIndex = detailItems.length - 1"
          @keydown.enter.prevent="selectHighlighted()"
          @keydown.space.prevent="selectHighlighted()"
        >
          <template v-if="mode === 'drill' && showDetail">
            <button
              type="button"
              :class="ui.backButton()"
              data-id="back"
              @click="backToRail()"
            >
              <RuiIcon
                name="lu-chevron-left"
                size="18"
              />
              <span>{{ activeCategory ?? allLabel }}</span>
            </button>
          </template>

          <slot
            v-if="isEmpty"
            name="empty"
          >
            <div :class="ui.empty()">
              {{ emptyText }}
            </div>
          </slot>

          <template
            v-for="row in detailRows"
            v-else
            :key="row.type === 'header' ? `h-${row.category}` : `i-${row.index}`"
          >
            <div
              v-if="row.type === 'header'"
              :class="ui.subheader()"
              role="presentation"
            >
              {{ row.category }}
            </div>
            <RuiButton
              v-else
              :id="`${baseId}-opt-${row.index}`"
              role="option"
              variant="list"
              :size="dense ? 'sm' : undefined"
              :active="isSelected(row.item)"
              :aria-selected="isSelected(row.item)"
              tabindex="-1"
              :data-highlighted="focusedPane === 'detail' && row.index === highlightedItemIndex"
              :class="{ [ui.highlighted()]: focusedPane === 'detail' && row.index === highlightedItemIndex && !isSelected(row.item) }"
              @click="selectItem(row.item)"
            >
              <template
                v-if="$slots['item.prepend']"
                #prepend
              >
                <slot
                  name="item.prepend"
                  v-bind="{ active: row.index === highlightedItemIndex, item: row.item, selected: isSelected(row.item) }"
                />
              </template>
              <slot
                name="item"
                v-bind="{ active: row.index === highlightedItemIndex, item: row.item, selected: isSelected(row.item) }"
              >
                {{ getText(row.item) }}
              </slot>
              <template
                v-if="$slots['item.append']"
                #append
              >
                <slot
                  name="item.append"
                  v-bind="{ active: row.index === highlightedItemIndex, item: row.item, selected: isSelected(row.item) }"
                />
              </template>
            </RuiButton>
          </template>
        </div>
      </div>

      <div
        v-if="$slots.footer"
        :class="ui.footer()"
      >
        <slot
          name="footer"
          v-bind="{ close }"
        />
      </div>
    </div>
  </component>
</template>
