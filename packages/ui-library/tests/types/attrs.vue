<script setup lang="ts">
/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never rendered. Every component that
 * forwards `$attrs` must accept the HTML attributes and listeners of the element they reach.
 */
import {
  RuiAccordion,
  RuiAccordions,
  RuiAlert,
  RuiAutoComplete,
  RuiAvatar,
  RuiAvatarGroup,
  RuiBadge,
  RuiBottomSheet,
  RuiButton,
  RuiButtonGroup,
  RuiCard,
  RuiCardHeader,
  RuiCategoryPicker,
  RuiCheckbox,
  RuiCheckboxGroup,
  RuiChip,
  RuiColorPicker,
  RuiDataTable,
  RuiDateTimePicker,
  RuiDialog,
  RuiDivider,
  RuiFileUpload,
  RuiFooterStepper,
  RuiIcon,
  RuiLogo,
  RuiMenu,
  RuiMenuSelect,
  RuiNavigationDrawer,
  RuiNotification,
  RuiProgress,
  RuiRadio,
  RuiRadioGroup,
  RuiRevealableTextField,
  RuiSimpleSelect,
  RuiSkeletonLoader,
  RuiSlider,
  RuiStepper,
  RuiSwitch,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
  RuiTable,
  RuiTableEmptyState,
  RuiTableErrorState,
  RuiTableLoadingState,
  RuiTablePagination,
  RuiTabs,
  RuiTextArea,
  RuiTextField,
  RuiTimePicker,
  RuiTimezoneSelect,
  RuiTooltip,
} from '@/components';

interface Option {
  id: string;
  label: string;
}

const options: Option[] = [{ id: 'a', label: 'A' }];
const rows: Option[] = [{ id: 'a', label: 'A' }];

const text = ref<string>('');
const open = ref<boolean>(false);
const timezone = ref<string | undefined>();
const time = ref<Date | undefined>();
const pagination = ref<{ page: number; total: number; limit: number }>({ page: 1, total: 10, limit: 10 });

function onMouse(event: MouseEvent): number {
  return event.button;
}

function onKey(event: KeyboardEvent): string {
  return event.key;
}

function onFocus(event: FocusEvent): string {
  return event.type;
}

function onText(value: string): string {
  return value;
}
</script>

<template>
  <RuiButton
    id="button"
    aria-label="Save"
    title="Save"
    tabindex="0"
    @click="onMouse($event)"
    @keydown="onKey($event)"
  />
  <RuiButton
    tag="a"
    href="https://rotki.com"
    target="_blank"
    rel="noopener"
    download="file.txt"
  />
  <RuiButtonGroup
    role="toolbar"
    aria-label="Actions"
  />

  <RuiTextField
    v-model="text"
    autocomplete="current-password"
    maxlength="20"
    name="field"
    type="password"
    inputmode="numeric"
    aria-describedby="hint"
    @keydown="onKey($event)"
    @focus="onFocus($event)"
  />
  <RuiRevealableTextField
    v-model="text"
    autocomplete="new-password"
    name="secret"
    @keydown.enter="onKey($event)"
  />
  <RuiTextArea
    v-model="text"
    rows="3"
    maxlength="200"
    name="notes"
    @keydown="onKey($event)"
  />
  <RuiCheckbox
    id="check"
    name="agree"
    aria-label="Agree"
    @click="onMouse($event)"
  />
  <RuiRadio
    value="a"
    name="choice"
    aria-label="A"
  />
  <RuiSwitch
    name="toggle"
    aria-label="Toggle"
  />
  <RuiSlider
    name="volume"
    aria-label="Volume"
  />
  <RuiFileUpload
    :model-value="undefined"
    accept=".csv"
    name="upload"
  />
  <RuiCheckboxGroup aria-label="Checkboxes" />
  <RuiRadioGroup aria-label="Radios" />
  <RuiMenuSelect
    model-value="a"
    :options="options"
    key-attr="id"
    text-attr="label"
    name="select"
    aria-label="Select"
    @keydown="onKey($event)"
  />
  <RuiAutoComplete
    model-value="a"
    :options="options"
    key-attr="id"
    text-attr="label"
    aria-label="Search"
  />
  <RuiCategoryPicker
    model-value="a"
    :items="options"
    key-attr="id"
    text-attr="label"
    aria-label="Pick"
  />
  <RuiSimpleSelect
    model-value="a"
    :options="['a']"
    aria-label="Simple"
  />
  <RuiTimezoneSelect
    v-model="timezone"
    aria-label="Timezone"
  />
  <RuiDateTimePicker
    v-model="time"
    type="date"
    aria-label="Date"
  />
  <RuiTimePicker
    v-model="time"
    aria-label="Time"
  />
  <RuiColorPicker aria-label="Color" />

  <RuiCard
    role="region"
    aria-labelledby="title"
    @mouseenter="onMouse($event)"
  />
  <RuiCardHeader id="title" />
  <RuiAlert
    type="info"
    role="status"
  />
  <RuiAvatar
    src="avatar.png"
    title="Avatar"
  />
  <RuiAvatarGroup title="Avatars" />
  <RuiChip
    title="Chip"
    tabindex="0"
  />
  <RuiDivider aria-hidden="true" />
  <RuiIcon
    name="lu-x"
    aria-hidden="true"
    focusable="false"
  />
  <RuiLogo title="rotki" />
  <RuiProgress aria-label="Loading" />
  <RuiSkeletonLoader aria-busy="true" />
  <RuiBadge title="Badge" />
  <RuiTooltip id="tooltip" />
  <RuiMenu id="menu" />
  <RuiDialog
    v-model="open"
    aria-label="Dialog"
  />
  <RuiBottomSheet
    v-model="open"
    aria-label="Sheet"
  />
  <RuiNavigationDrawer
    v-model="open"
    aria-label="Navigation"
  />
  <RuiNotification
    v-model="open"
    :timeout="1000"
    role="alert"
  />

  <RuiAccordions aria-label="Sections" />
  <RuiAccordion title="Section" />
  <RuiStepper
    :steps="[]"
    aria-label="Steps"
  />
  <RuiFooterStepper
    :pages="2"
    aria-label="Pages"
  />
  <RuiTabs aria-label="Tabs" />
  <RuiTab title="Tab" />
  <RuiTabItems aria-live="polite" />
  <RuiTabItem title="Panel" />

  <RuiDataTable
    :rows="rows"
    row-attr="id"
    aria-label="Table"
  />
  <RuiTable aria-label="Simple table" />
  <RuiTableEmptyState role="status" />
  <RuiTableErrorState role="alert" />
  <RuiTableLoadingState aria-label="Loading rows" />
  <RuiTablePagination
    v-model="pagination"
    aria-label="Pagination"
  />

  <!-- @vue-expect-error strict templates still reject a prop no component or element takes -->
  <RuiButton not-an-attribute="x" />
  <!-- @vue-expect-error a button listener gets a MouseEvent, not a string -->
  <RuiButton @click="onText($event)" />
  <!-- @vue-expect-error RuiTextField forwards to an input, which has no rows -->
  <RuiTextField
    v-model="text"
    rows="3"
  />
</template>
