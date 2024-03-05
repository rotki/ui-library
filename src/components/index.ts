/* eslint-disable import/max-dependencies */
import {
  type Props as AlertProps,
  default as RuiAlert,
} from '@/components/alerts/Alert.vue';
import {
  type Props as AutoCompleteProps,
  default as RuiAutoComplete,
} from '@/components/forms/auto-complete/AutoComplete.vue';
import {
  type Props as ButtonProps,
  default as RuiButton,
} from '@/components/buttons/button/Button.vue';
import {
  type Props as ButtonGroupProps,
  default as RuiButtonGroup,
} from '@/components/buttons/button-group/ButtonGroup.vue';
import {
  type Props as IconProps,
  default as RuiIcon,
} from '@/components/icons/Icon.vue';
import {
  type Props as CheckboxProps,
  default as RuiCheckbox,
} from '@/components/forms/checkbox/Checkbox.vue';
import {
  default as RuiSwitch,
  type Props as SwitchProps,
} from '@/components/forms/switch/Switch.vue';
import {
  default as RuiSlider,
  type Props as SliderProps,
} from '@/components/forms/slider/Slider.vue';
import {
  type Props as ChipProps,
  default as RuiChip,
} from '@/components/chips/Chip.vue';
import {
  type Props as DividerProps,
  default as RuiDivider,
} from '@/components/divider/Divider.vue';
import {
  default as RuiStepper,
  type Props as StepperProps,
} from '@/components/steppers/Stepper.vue';
import {
  default as RuiTextArea,
  type Props as TextAreaProps,
} from '@/components/forms/text-area/TextArea.vue';
import {
  default as RuiTextField,
  type TextFieldProps,
} from '@/components/forms/text-field/TextField.vue';
import {
  default as RuiTooltip,
  type Props as TooltipProps,
} from '@/components/overlays/tooltip/Tooltip.vue';
import {
  type Props as MenuProps,
  default as RuiMenu,
} from '@/components/overlays/menu/Menu.vue';
import {
  type Props as BadgeProps,
  default as RuiBadge,
} from '@/components/overlays/badge/Badge.vue';
import {
  type Props as DialogProps,
  default as RuiDialog,
} from '@/components/overlays/dialog/Dialog.vue';
import {
  type Props as FooterStepperProps,
  default as RuiFooterStepper,
} from '@/components/steppers/FooterStepper.vue';
import {
  type Props as ProgressProps,
  default as RuiProgress,
} from '@/components/progress/Progress.vue';
import {
  type Props as RadioGroupProps,
  default as RuiRadioGroup,
} from '@/components/forms/radio-button/radio-group/RadioGroup.vue';
import {
  type RadioProps,
  default as RuiRadio,
} from '@/components/forms/radio-button/radio/Radio.vue';
import {
  type Props as RevealableTextFieldProps,
  default as RuiRevealableTextField,
} from '@/components/forms/revealable-text-field/RevealableTextField.vue';
import {
  type Props as LogoProps,
  default as RuiLogo,
} from '@/components/logos/Logo.vue';
import {
  default as RuiSimpleSelect,
  type Props as SimpleSelectProps,
} from '@/components/forms/select/SimpleSelect.vue';
import {
  type TableOptions as DataTableOptions,
  type Props as DataTableProps,
  default as RuiDataTable,
} from '@/components/tables/DataTable.vue';
import {
  type Props as ExpandButtonProps,
  default as RuiTableRowExpander,
} from '@/components/tables/ExpandButton.vue';
import {
  default as RuiTablePagination,
  type TablePaginationData,
  type Props as TablePaginationProps,
} from '@/components/tables/TablePagination.vue';
import {
  type Props as CardProps,
  default as RuiCard,
} from '@/components/cards/Card.vue';
import {
  type Props as CardHeaderProps,
  default as RuiCardHeader,
} from '@/components/cards/CardHeader.vue';
import {
  default as RuiTabs,
  type Props as TabsProps,
} from '@/components/tabs/tabs/Tabs.vue';
import {
  default as RuiTab,
  type Props as TabProps,
} from '@/components/tabs/tab/Tab.vue';
import {
  default as RuiTabItems,
  type Props as TabItemsProps,
} from '@/components/tabs/tab-items/TabItems.vue';
import {
  default as RuiTabItem,
  type Props as TabItemProps,
} from '@/components/tabs/tab-item/TabItem.vue';
import {
  default as RuiSkeletonLoader,
  type Props as SkeletonLoaderProps,
} from '@/components/loaders/Skeleton.vue';
import {
  type Props as MenuSelectProps,
  default as RuiMenuSelect,
} from '@/components/forms/select/MenuSelect.vue';
import {
  type Props as AccordionsProps,
  default as RuiAccordions,
} from '@/components/accordions/accordions/Accordions.vue';
import {
  type AccordionProps,
  default as RuiAccordion,
} from '@/components/accordions/accordion/Accordion.vue';
import type {
  TableColumn as DataTableColumn,
  GroupKeys as DataTableGroupKeys,
  SortColumn as DataTableSortColumn,
  TableSortData as DataTableSortData,
} from '@/components/tables/TableHead.vue';

export {
  RuiAlert,
  RuiAutoComplete,
  RuiBadge,
  RuiButton,
  RuiButtonGroup,
  RuiCheckbox,
  RuiChip,
  RuiFooterStepper,
  RuiIcon,
  RuiLogo,
  RuiProgress,
  RuiRadio,
  RuiRadioGroup,
  RuiRevealableTextField,
  RuiStepper,
  RuiSwitch,
  RuiTextField,
  RuiTooltip,
  RuiMenu,
  RuiDataTable,
  RuiSimpleSelect,
  RuiDialog,
  RuiCard,
  RuiCardHeader,
  RuiTabs,
  RuiTab,
  RuiTabItems,
  RuiTabItem,
  RuiTablePagination,
  RuiSkeletonLoader,
  RuiTextArea,
  RuiDivider,
  RuiTableRowExpander,
  RuiMenuSelect,
  RuiSlider,
  RuiAccordions,
  RuiAccordion,
  AutoCompleteProps,
  ChipProps,
  TooltipProps,
  MenuProps,
  SimpleSelectProps,
  DataTableProps,
  DataTableColumn,
  DataTableSortColumn,
  DataTableOptions,
  TablePaginationData,
  DialogProps,
  ButtonProps,
  ButtonGroupProps,
  CardProps,
  CardHeaderProps,
  BadgeProps,
  AlertProps,
  CheckboxProps,
  SwitchProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  LogoProps,
  StepperProps,
  TextFieldProps,
  IconProps,
  FooterStepperProps,
  TabsProps,
  TabProps,
  TabItemsProps,
  TabItemProps,
  TablePaginationProps,
  RevealableTextFieldProps,
  SkeletonLoaderProps,
  DividerProps,
  TextAreaProps,
  ExpandButtonProps,
  DataTableSortData,
  DataTableGroupKeys,
  MenuSelectProps,
  SliderProps,
  AccordionsProps,
  AccordionProps,
};
