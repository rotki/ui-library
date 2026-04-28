import type { ComputedRef, Ref } from 'vue';
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import type { GroupExpandButtonPosition } from '@/components/tables/table-props';
import type { GroupHeader } from '@/composables/tables/data-table/types';

export interface DataTableClasses {
  td: string;
  tr: string;
  trSelected: string;
  trExpandable: string;
  trGroup: string;
  trEmpty: string;
  checkbox: string;
  tbody: string;
  tbodyLoader: string;
  tbodyLoaderContent: string;
}

// --- Per-concern context interfaces ---

export interface DataTableStylingContext {
  classes: ComputedRef<DataTableClasses>;
  colspan: ComputedRef<number>;
  dense: boolean;
}

export interface DataTableColumnsContext<T extends object = any> {
  columns: ComputedRef<TableColumn<T>[]>;
  cellValue: (row: T, key: TableColumn<T>['key']) => T[keyof T];
  itemSlotKeys: Set<string>;
}

export interface DataTableSelectionContext<T extends object = any, IdType extends keyof T = keyof T> {
  selectedData: Ref<T[IdType][] | undefined>;
  isSelected: (id: T[IdType]) => boolean;
  isDisabledRow: (id: T[IdType]) => boolean;
  onSelect: (selected: boolean, id: T[IdType], userAction: boolean) => void;
  onCheckboxClick: (event: MouseEvent, id: T[IdType], index: number) => void;
}

export interface DataTableExpansionContext<T extends object = any, IdType extends keyof T = keyof T> {
  expandable: ComputedRef<boolean>;
  isExpanded: (id: T[IdType]) => boolean;
  onToggleExpand: (row: T) => void;
}

export interface DataTableGroupingContext<T extends object = any> {
  groupExpandButtonPosition: GroupExpandButtonPosition;
  groupKey: ComputedRef<string | undefined>;
  isExpandedGroup: (group: Partial<T>) => boolean;
  onToggleExpandGroup: (group: Partial<T>, identifier: string) => void;
  onUngroup: () => void;
  onCopyGroup: (header: GroupHeader<T>) => void;
}

export interface DataTableRowIdentityContext<T extends object = any, IdType extends keyof T = keyof T> {
  getRowId: (row: T) => T[IdType];
  itemClass: ((item: T) => string) | string;
}

// --- Backward-compatible merged type ---

export type DataTableContext<T extends object = any, IdType extends keyof T = keyof T> =
  DataTableStylingContext &
  DataTableColumnsContext<T> &
  DataTableSelectionContext<T, IdType> &
  DataTableExpansionContext<T, IdType> &
  DataTableGroupingContext<T> &
  DataTableRowIdentityContext<T, IdType>;

// --- Per-concern symbols ---

const DATA_TABLE_STYLING = Symbol('data-table-styling');
const DATA_TABLE_COLUMNS = Symbol('data-table-columns');
const DATA_TABLE_SELECTION = Symbol('data-table-selection');
const DATA_TABLE_EXPANSION = Symbol('data-table-expansion');
const DATA_TABLE_GROUPING = Symbol('data-table-grouping');
const DATA_TABLE_ROW_IDENTITY = Symbol('data-table-row-identity');

// --- Per-concern provide/use pairs ---

function injectOrThrow<C>(key: symbol, name: string): C {
  const context = inject<C>(key);
  if (context === undefined)
    throw new Error(`${name} must be used within a RuiDataTable`);

  return context;
}

export function provideDataTableStyling(context: DataTableStylingContext): void {
  provide(DATA_TABLE_STYLING, context);
}

export function useDataTableStyling(): DataTableStylingContext {
  return injectOrThrow<DataTableStylingContext>(DATA_TABLE_STYLING, 'useDataTableStyling');
}

export function provideDataTableColumns<T extends object>(context: DataTableColumnsContext<T>): void {
  provide(DATA_TABLE_COLUMNS, context);
}

export function useDataTableColumns<T extends object = any>(): DataTableColumnsContext<T> {
  return injectOrThrow<DataTableColumnsContext<T>>(DATA_TABLE_COLUMNS, 'useDataTableColumns');
}

export function provideDataTableSelection<T extends object, IdType extends keyof T>(context: DataTableSelectionContext<T, IdType>): void {
  provide(DATA_TABLE_SELECTION, context);
}

export function useDataTableSelection<T extends object = any, IdType extends keyof T = keyof T>(): DataTableSelectionContext<T, IdType> {
  return injectOrThrow<DataTableSelectionContext<T, IdType>>(DATA_TABLE_SELECTION, 'useDataTableSelection');
}

export function provideDataTableExpansion<T extends object, IdType extends keyof T>(context: DataTableExpansionContext<T, IdType>): void {
  provide(DATA_TABLE_EXPANSION, context);
}

export function useDataTableExpansion<T extends object = any, IdType extends keyof T = keyof T>(): DataTableExpansionContext<T, IdType> {
  return injectOrThrow<DataTableExpansionContext<T, IdType>>(DATA_TABLE_EXPANSION, 'useDataTableExpansion');
}

export function provideDataTableGrouping<T extends object>(context: DataTableGroupingContext<T>): void {
  provide(DATA_TABLE_GROUPING, context);
}

export function useDataTableGrouping<T extends object = any>(): DataTableGroupingContext<T> {
  return injectOrThrow<DataTableGroupingContext<T>>(DATA_TABLE_GROUPING, 'useDataTableGrouping');
}

export function provideDataTableRowIdentity<T extends object, IdType extends keyof T>(context: DataTableRowIdentityContext<T, IdType>): void {
  provide(DATA_TABLE_ROW_IDENTITY, context);
}

export function useDataTableRowIdentity<T extends object = any, IdType extends keyof T = keyof T>(): DataTableRowIdentityContext<T, IdType> {
  return injectOrThrow<DataTableRowIdentityContext<T, IdType>>(DATA_TABLE_ROW_IDENTITY, 'useDataTableRowIdentity');
}

// --- Backward-compatible facade ---

export function provideDataTableContext<T extends object, IdType extends keyof T>(context: DataTableContext<T, IdType>): void {
  provideDataTableStyling({ classes: context.classes, colspan: context.colspan, dense: context.dense });
  provideDataTableColumns<T>({ columns: context.columns, cellValue: context.cellValue, itemSlotKeys: context.itemSlotKeys });
  provideDataTableSelection<T, IdType>({ selectedData: context.selectedData, isSelected: context.isSelected, isDisabledRow: context.isDisabledRow, onSelect: context.onSelect, onCheckboxClick: context.onCheckboxClick });
  provideDataTableExpansion<T, IdType>({ expandable: context.expandable, isExpanded: context.isExpanded, onToggleExpand: context.onToggleExpand });
  provideDataTableGrouping<T>({ groupExpandButtonPosition: context.groupExpandButtonPosition, groupKey: context.groupKey, isExpandedGroup: context.isExpandedGroup, onToggleExpandGroup: context.onToggleExpandGroup, onUngroup: context.onUngroup, onCopyGroup: context.onCopyGroup });
  provideDataTableRowIdentity<T, IdType>({ getRowId: context.getRowId, itemClass: context.itemClass });
}

export function useDataTableContext<T extends object, IdType extends keyof T = keyof T>(): DataTableContext<T, IdType> {
  return {
    ...useDataTableStyling(),
    ...useDataTableColumns<T>(),
    ...useDataTableSelection<T, IdType>(),
    ...useDataTableExpansion<T, IdType>(),
    ...useDataTableGrouping<T>(),
    ...useDataTableRowIdentity<T, IdType>(),
  };
}
