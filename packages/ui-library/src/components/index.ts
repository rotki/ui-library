/* eslint-disable @rotki/max-dependencies */
import type {
  TableColumn as DataTableColumn,
  GroupKeys as DataTableGroupKeys,
  SortColumn as DataTableSortColumn,
  TableSortData as DataTableSortData,
  GroupData,
} from '@/components/tables/RuiTableHead.vue';
import RuiAccordion, { type AccordionProps } from '@/components/accordions/accordion/RuiAccordion.vue';
import RuiAccordions, { type Props as AccordionsProps } from '@/components/accordions/accordions/RuiAccordions.vue';
import RuiAlert, { type Props as AlertProps } from '@/components/alerts/RuiAlert.vue';
import RuiButtonGroup, { type Props as ButtonGroupProps } from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton, { type Props as ButtonProps } from '@/components/buttons/button/RuiButton.vue';
import RuiCalendar, { type CalendarProps } from '@/components/calendar/RuiCalendar.vue';
import RuiCard, { type Props as CardProps } from '@/components/cards/RuiCard.vue';
import RuiCardHeader, { type Props as CardHeaderProps } from '@/components/cards/RuiCardHeader.vue';
import RuiChip, { type Props as ChipProps } from '@/components/chips/RuiChip.vue';
import RuiColorPicker from '@/components/color-picker/RuiColorPicker.vue';
import RuiDateTimePicker, { type RuiDateTimePickerProps } from '@/components/date-time-picker/RuiDateTimePicker.vue';
import RuiDivider, { type Props as DividerProps } from '@/components/divider/RuiDivider.vue';
import RuiAutoComplete, { type AutoCompleteProps } from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import RuiCheckbox, { type Props as CheckboxProps } from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiRadioGroup, { type Props as RadioGroupProps } from '@/components/forms/radio-button/radio-group/RuiRadioGroup.vue';
import RuiRadio, { type RadioProps } from '@/components/forms/radio-button/radio/RuiRadio.vue';
import RuiRevealableTextField, { type Props as RevealableTextFieldProps } from '@/components/forms/revealable-text-field/RuiRevealableTextField.vue';
import RuiMenuSelect, { type Props as MenuSelectProps } from '@/components/forms/select/RuiMenuSelect.vue';
import RuiSimpleSelect, { type Props as SimpleSelectProps } from '@/components/forms/select/RuiSimpleSelect.vue';
import RuiSlider, { type Props as SliderProps } from '@/components/forms/slider/RuiSlider.vue';
import RuiSwitch, { type Props as SwitchProps } from '@/components/forms/switch/RuiSwitch.vue';
import RuiTextArea, { type Props as TextAreaProps } from '@/components/forms/text-area/RuiTextArea.vue';
import RuiTextField, { type TextFieldProps } from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon, { type Props as IconProps } from '@/components/icons/RuiIcon.vue';
import RuiSkeletonLoader, { type Props as SkeletonLoaderProps } from '@/components/loaders/RuiSkeletonLoader.vue';
import RuiLogo, { type Props as LogoProps } from '@/components/logos/RuiLogo.vue';
import RuiBadge, { type Props as BadgeProps } from '@/components/overlays/badge/RuiBadge.vue';
import RuiBottomSheet, { type BottomSheetProps } from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import RuiDialog, { type DialogProps } from '@/components/overlays/dialog/RuiDialog.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import RuiNavigationDrawer, { type NavigationDrawerProps } from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';
import RuiNotification, { type NotificationProps } from '@/components/overlays/notification/RuiNotification.vue';
import RuiTooltip, { type Props as TooltipProps } from '@/components/overlays/tooltip/RuiTooltip.vue';
import RuiProgress, { type Props as ProgressProps } from '@/components/progress/RuiProgress.vue';
import RuiFooterStepper, { type Props as FooterStepperProps } from '@/components/steppers/RuiFooterStepper.vue';
import RuiStepper, { type Props as StepperProps } from '@/components/steppers/RuiStepper.vue';
import RuiDataTable, { type TableOptions as DataTableOptions, type Props as DataTableProps } from '@/components/tables/RuiDataTable.vue';
import RuiTableRowExpander, { type Props as ExpandButtonProps } from '@/components/tables/RuiExpandButton.vue';
import RuiTablePagination, { type TablePaginationData, type Props as TablePaginationProps } from '@/components/tables/RuiTablePagination.vue';
import RuiTabItem, { type Props as TabItemProps } from '@/components/tabs/tab-item/RuiTabItem.vue';
import RuiTabItems from '@/components/tabs/tab-items/RuiTabItems.vue';
import RuiTab, { type Props as TabProps } from '@/components/tabs/tab/RuiTab.vue';
import RuiTabs, { type Props as TabsProps } from '@/components/tabs/tabs/RuiTabs.vue';
import RuiTimePicker, { type RuiTimePickerProps } from '@/components/time-picker/RuiTimePicker.vue';

export type {
  AccordionProps,
  AccordionsProps,
  AlertProps,
  AutoCompleteProps,
  BadgeProps,
  BottomSheetProps,
  ButtonGroupProps,
  ButtonProps,
  CalendarProps,
  CardHeaderProps,
  CardProps,
  CheckboxProps,
  ChipProps,
  DataTableColumn,
  DataTableGroupKeys,
  DataTableOptions,
  DataTableProps,
  DataTableSortColumn,
  DataTableSortData,
  DialogProps,
  DividerProps,
  ExpandButtonProps,
  FooterStepperProps,
  GroupData,
  IconProps,
  LogoProps,
  MenuProps,
  MenuSelectProps,
  NavigationDrawerProps,
  NotificationProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  RevealableTextFieldProps,
  RuiDateTimePickerProps,
  RuiTimePickerProps,
  SimpleSelectProps,
  SkeletonLoaderProps,
  SliderProps,
  StepperProps,
  SwitchProps,
  TabItemProps,
  TablePaginationData,
  TablePaginationProps,
  TabProps,
  TabsProps,
  TextAreaProps,
  TextFieldProps,
  TooltipProps,
};

export {
  RuiAccordion,
  RuiAccordions,
  RuiAlert,
  RuiAutoComplete,
  RuiBadge,
  RuiBottomSheet,
  RuiButton,
  RuiButtonGroup,
  RuiCalendar,
  RuiCard,
  RuiCardHeader,
  RuiCheckbox,
  RuiChip,
  RuiColorPicker,
  RuiDataTable,
  RuiDateTimePicker,
  RuiDialog,
  RuiDivider,
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
  RuiTablePagination,
  RuiTableRowExpander,
  RuiTabs,
  RuiTextArea,
  RuiTextField,
  RuiTimePicker,
  RuiTooltip,
};
