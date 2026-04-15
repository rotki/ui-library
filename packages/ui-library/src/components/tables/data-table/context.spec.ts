import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed, defineComponent, ref } from 'vue';
import {
  type DataTableClasses,
  type DataTableColumnsContext,
  type DataTableContext,
  type DataTableExpansionContext,
  type DataTableGroupingContext,
  type DataTableRowIdentityContext,
  type DataTableSelectionContext,
  type DataTableStylingContext,
  provideDataTableColumns,
  provideDataTableContext,
  provideDataTableExpansion,
  provideDataTableGrouping,
  provideDataTableRowIdentity,
  provideDataTableSelection,
  provideDataTableStyling,
  useDataTableColumns,
  useDataTableContext,
  useDataTableExpansion,
  useDataTableGrouping,
  useDataTableRowIdentity,
  useDataTableSelection,
  useDataTableStyling,
} from '@/components/tables/data-table/context';

interface TestItem {
  id: number;
  name: string;
}

function stubClasses(): DataTableClasses {
  return {
    td: '',
    tr: '',
    trSelected: '',
    trExpandable: '',
    trGroup: '',
    trEmpty: '',
    checkbox: '',
    tbody: '',
    tbodyLoader: '',
    tbodyLoaderContent: '',
  };
}

function stubFullContext(): DataTableContext<TestItem, 'id'> {
  return {
    classes: computed<DataTableClasses>(() => stubClasses()),
    colspan: computed<number>(() => 0),
    dense: false,
    columns: computed<[]>(() => []),
    cellValue: (_row, _key) => 0,
    itemSlotKeys: new Set<string>(),
    selectedData: ref<number[] | undefined>(undefined),
    isSelected: () => false,
    isDisabledRow: () => false,
    onSelect: () => {},
    onCheckboxClick: () => {},
    expandable: computed<boolean>(() => false),
    isExpanded: () => false,
    onToggleExpand: () => {},
    groupExpandButtonPosition: 'start',
    groupKey: computed<string | undefined>(() => undefined),
    isExpandedGroup: () => false,
    onToggleExpandGroup: () => {},
    onUngroup: () => {},
    onCopyGroup: () => {},
    getRowId: (row: TestItem) => row.id,
    itemClass: '',
  };
}

describe('dataTableContext', () => {
  describe('facade', () => {
    it('throws when useDataTableContext is called outside a provider', () => {
      const spy = vi.fn();
      const TestComponent = defineComponent({
        setup() {
          try {
            useDataTableContext();
          }
          catch (error: unknown) {
            spy(error);
          }
          return {};
        },
        template: '<div></div>',
      });

      mount(TestComponent);
      expect(spy).toHaveBeenCalledOnce();
      const thrownError = spy.mock.calls[0]?.[0];
      expect(thrownError).toBeInstanceOf(Error);
    });

    it('round-trips context through provide and inject', () => {
      const context = stubFullContext();
      let injected: DataTableContext<TestItem, 'id'> | undefined;

      const ChildComponent = defineComponent({
        setup() {
          injected = useDataTableContext<TestItem, 'id'>();
          return {};
        },
        template: '<span></span>',
      });

      const ParentComponent = defineComponent({
        components: { ChildComponent },
        setup() {
          provideDataTableContext<TestItem, 'id'>(context);
          return {};
        },
        template: '<div><ChildComponent /></div>',
      });

      mount(ParentComponent);
      expect(injected).toBeDefined();
      expect(injected!.dense).toBe(context.dense);
      expect(injected!.cellValue).toBe(context.cellValue);
      expect(injected!.getRowId).toBe(context.getRowId);
      expect(injected!.isSelected).toBe(context.isSelected);
      expect(injected!.isExpanded).toBe(context.isExpanded);
      expect(injected!.onUngroup).toBe(context.onUngroup);
    });
  });

  describe('per-concern pairs', () => {
    function roundTrip<C>(provideFn: (ctx: C) => void, useFn: () => C, context: C): C | undefined {
      let injected: C | undefined;

      const ChildComponent = defineComponent({
        setup() {
          injected = useFn();
          return {};
        },
        template: '<span></span>',
      });

      const ParentComponent = defineComponent({
        components: { ChildComponent },
        setup() {
          provideFn(context);
          return {};
        },
        template: '<div><ChildComponent /></div>',
      });

      mount(ParentComponent);
      return injected;
    }

    function expectThrowsOutsideProvider(useFn: () => unknown, name: string): void {
      const spy = vi.fn();
      const TestComponent = defineComponent({
        setup() {
          try {
            useFn();
          }
          catch (error: unknown) {
            spy(error);
          }
          return {};
        },
        template: '<div></div>',
      });

      mount(TestComponent);
      expect(spy).toHaveBeenCalledOnce();
      const thrownError = spy.mock.calls[0]?.[0];
      expect(thrownError).toBeInstanceOf(Error);
      expect(thrownError).toHaveProperty('message', `${name} must be used within a RuiDataTable`);
    }

    it('styling: round-trips and throws outside provider', () => {
      const context: DataTableStylingContext = {
        classes: computed<DataTableClasses>(() => stubClasses()),
        colspan: computed<number>(() => 5),
        dense: true,
      };
      const injected = roundTrip(provideDataTableStyling, useDataTableStyling, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableStyling, 'useDataTableStyling');
    });

    it('columns: round-trips and throws outside provider', () => {
      const context: DataTableColumnsContext<TestItem> = {
        columns: computed<[]>(() => []),
        cellValue: (_row, _key) => 0,
        itemSlotKeys: new Set<string>(['name']),
      };
      const injected = roundTrip(provideDataTableColumns<TestItem>, useDataTableColumns<TestItem>, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableColumns, 'useDataTableColumns');
    });

    it('selection: round-trips and throws outside provider', () => {
      const context: DataTableSelectionContext<TestItem, 'id'> = {
        selectedData: ref<number[] | undefined>(undefined),
        isSelected: () => false,
        isDisabledRow: () => false,
        onSelect: () => {},
        onCheckboxClick: () => {},
      };
      const injected = roundTrip(provideDataTableSelection<TestItem, 'id'>, useDataTableSelection<TestItem, 'id'>, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableSelection, 'useDataTableSelection');
    });

    it('expansion: round-trips and throws outside provider', () => {
      const context: DataTableExpansionContext<TestItem, 'id'> = {
        expandable: computed<boolean>(() => false),
        isExpanded: () => false,
        onToggleExpand: () => {},
      };
      const injected = roundTrip(provideDataTableExpansion<TestItem, 'id'>, useDataTableExpansion<TestItem, 'id'>, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableExpansion, 'useDataTableExpansion');
    });

    it('grouping: round-trips and throws outside provider', () => {
      const context: DataTableGroupingContext<TestItem> = {
        groupExpandButtonPosition: 'start',
        groupKey: computed<string | undefined>(() => undefined),
        isExpandedGroup: () => false,
        onToggleExpandGroup: () => {},
        onUngroup: () => {},
        onCopyGroup: () => {},
      };
      const injected = roundTrip(provideDataTableGrouping<TestItem>, useDataTableGrouping<TestItem>, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableGrouping, 'useDataTableGrouping');
    });

    it('row identity: round-trips and throws outside provider', () => {
      const context: DataTableRowIdentityContext<TestItem, 'id'> = {
        getRowId: (row: TestItem) => row.id,
        itemClass: '',
      };
      const injected = roundTrip(provideDataTableRowIdentity<TestItem, 'id'>, useDataTableRowIdentity<TestItem, 'id'>, context);
      expect(injected).toBe(context);
      expectThrowsOutsideProvider(useDataTableRowIdentity, 'useDataTableRowIdentity');
    });
  });
});
