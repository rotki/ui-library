/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never run. An app can register any
 * component globally, as rotki's premium bundle does. A generic component is typed as a function,
 * and `app.component()` rejects it if it declares a slot as required.
 */
import { createApp } from 'vue';
import {
  RuiAccordions,
  RuiAutoComplete,
  RuiButton,
  RuiButtonGroup,
  RuiCategoryPicker,
  RuiCheckbox,
  RuiCheckboxGroup,
  RuiDataTable,
  RuiDateTimePicker,
  RuiFileUpload,
  RuiMenuSelect,
  RuiRadio,
  RuiRadioGroup,
  RuiTabItems,
  RuiTabs,
} from '@/components';

const app = createApp({});

app.component('RuiAccordions', RuiAccordions);
app.component('RuiAutoComplete', RuiAutoComplete);
app.component('RuiButton', RuiButton);
app.component('RuiButtonGroup', RuiButtonGroup);
app.component('RuiCategoryPicker', RuiCategoryPicker);
app.component('RuiCheckbox', RuiCheckbox);
app.component('RuiCheckboxGroup', RuiCheckboxGroup);
app.component('RuiDataTable', RuiDataTable);
app.component('RuiDateTimePicker', RuiDateTimePicker);
app.component('RuiFileUpload', RuiFileUpload);
app.component('RuiMenuSelect', RuiMenuSelect);
app.component('RuiRadio', RuiRadio);
app.component('RuiRadioGroup', RuiRadioGroup);
app.component('RuiTabItems', RuiTabItems);
app.component('RuiTabs', RuiTabs);
