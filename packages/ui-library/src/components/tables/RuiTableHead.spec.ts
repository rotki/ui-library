import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTableHead, { type TableColumn } from '@/components/tables/RuiTableHead.vue';
import { SortDirection } from '@/components/tables/table-props';

interface TestItem {
  id: number;
  name: string;
  title: string;
}

const columns: TableColumn<TestItem>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
];

function createWrapper(
  options?: { props?: Record<string, unknown> },
): ReturnType<typeof mount> {
  return mount(RuiTableHead, {
    ...options,
    attachTo: (() => {
      const table = document.createElement('table');
      document.body.appendChild(table);
      return table;
    })(),
  });
}

describe('components/tables/RuiTableHead.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper.unmount();
    document.querySelectorAll('table').forEach(el => el.remove());
  });

  it('renders column headers from columns prop', () => {
    wrapper = createWrapper({
      props: { columns },
    });

    const headers = wrapper.findAll('th');
    expect(headers).toHaveLength(3);

    const texts = wrapper.findAll('[data-id="column-text"]');
    expect(texts).toHaveLength(3);
    expect(texts[0]?.text()).toBe('ID');
    expect(texts[1]?.text()).toBe('Name');
    expect(texts[2]?.text()).toBe('Title');
  });

  it('shows checkbox when selectable is true', () => {
    wrapper = createWrapper({
      props: { columns, selectable: true },
    });

    expect(wrapper.find('[data-id="table-toggle-check-all"]').exists()).toBeTruthy();
  });

  it('hides checkbox when selectable is false', () => {
    wrapper = createWrapper({
      props: { columns, selectable: false },
    });

    expect(wrapper.find('[data-id="table-toggle-check-all"]').exists()).toBeFalsy();
  });

  it('shows loading progress bar when loading is true', () => {
    wrapper = createWrapper({
      props: { columns, loading: true, colspan: 3 },
    });

    expect(wrapper.find('[data-id="thead-loader"]').exists()).toBeTruthy();
  });

  it('hides loading progress bar when loading is false', () => {
    wrapper = createWrapper({
      props: { columns, loading: false },
    });

    expect(wrapper.find('[data-id="thead-loader"]').exists()).toBeFalsy();
  });

  it('renders sort buttons for sortable columns', () => {
    wrapper = createWrapper({
      props: { columns },
    });

    const sortableHeaders = wrapper.findAll('[data-id="column-sortable"]');
    expect(sortableHeaders).toHaveLength(2);
  });

  it('shows sort icon with correct direction when column is sorted ascending', () => {
    wrapper = createWrapper({
      props: {
        columns,
        sortedMap: {
          name: { column: 'name', direction: SortDirection.asc },
        },
      },
    });

    const sortButtons = wrapper.findAll('[data-sorted]');
    expect(sortButtons).toHaveLength(1);
    expect(sortButtons[0]?.attributes('data-direction')).toBe('asc');
  });

  it('shows sort icon with correct direction when column is sorted descending', () => {
    wrapper = createWrapper({
      props: {
        columns,
        sortedMap: {
          name: { column: 'name', direction: SortDirection.desc },
        },
      },
    });

    const sortButtons = wrapper.findAll('[data-sorted]');
    expect(sortButtons).toHaveLength(1);
    expect(sortButtons[0]?.attributes('data-direction')).toBe('desc');
  });

  it('shows badge with sort index for multi-sort', () => {
    const sortData = [
      { column: 'name' as const, direction: SortDirection.asc },
      { column: 'title' as const, direction: SortDirection.desc },
    ];

    wrapper = createWrapper({
      props: {
        columns,
        sortData,
        sortedMap: {
          name: sortData[0],
          title: sortData[1],
        },
      },
    });

    const sortButtons = wrapper.findAll('[data-sorted]');
    expect(sortButtons).toHaveLength(2);
  });

  it('emits sort event when sort button is clicked', async () => {
    wrapper = createWrapper({
      props: { columns },
    });

    const sortableHeaders = wrapper.findAll('[data-id="column-sortable"]');
    const sortButton = sortableHeaders[0]?.find('button');
    expect(sortButton).toBeDefined();
    await sortButton?.trigger('click');

    const emitted = wrapper.emitted('sort');
    expect(emitted).toBeTruthy();
    expect(emitted).toHaveLength(1);
    expect(emitted?.[0]).toEqual([{ key: 'name', direction: SortDirection.asc }]);
  });

  it('emits select:all event when header checkbox is toggled', async () => {
    wrapper = createWrapper({
      props: { columns, selectable: true },
    });

    const checkbox = wrapper.find('[data-id="table-toggle-check-all"]');
    const input = checkbox.find('input');
    await input.setValue(true);

    const emitted = wrapper.emitted('select:all');
    expect(emitted).toBeTruthy();
    expect(emitted).toHaveLength(1);
  });

  it('applies sticky class when stickyHeader is true and stick is false', () => {
    wrapper = createWrapper({
      props: { columns, stickyHeader: true },
    });

    const thead = wrapper.find('[data-id="head-main"]');
    expect(thead.classes()).toContain('top-0');
    expect(thead.classes()).toContain('absolute');
  });

  it('applies fixed class when stickyHeader and stick are both true', () => {
    wrapper = createWrapper({
      props: { columns, stickyHeader: true, stick: true },
    });

    const thead = wrapper.find('[data-id="head-main"]');
    expect(thead.classes()).toContain('top-0');
    expect(thead.classes()).toContain('fixed');
  });

  it('does not apply sticky or fixed classes by default', () => {
    wrapper = createWrapper({
      props: { columns },
    });

    const thead = wrapper.find('[data-id="head-main"]');
    expect(thead.classes()).not.toContain('absolute');
    expect(thead.classes()).not.toContain('fixed');
  });

  it('applies dense variant class', () => {
    wrapper = createWrapper({
      props: { columns, dense: true },
    });

    const th = wrapper.find('th');
    expect(th.classes()).toContain('py-[0.38rem]');
  });

  it('uses custom columnAttr for header text', () => {
    const customColumns: TableColumn<TestItem>[] = [
      { key: 'id', label: 'ID', description: 'Identifier' },
      { key: 'name', label: 'Name', description: 'Full Name' },
    ];

    wrapper = createWrapper({
      props: {
        columns: customColumns,
        columnAttr: 'description',
      },
    });

    const texts = wrapper.findAll('[data-id="column-text"]');
    expect(texts[0]?.text()).toBe('Identifier');
    expect(texts[1]?.text()).toBe('Full Name');
  });
});
