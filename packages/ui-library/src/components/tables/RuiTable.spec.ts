import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTable from '@/components/tables/RuiTable.vue';

const rows = `
  <thead>
    <tr><th scope="col">Name</th><th class="p-0" scope="col">Actions</th></tr>
  </thead>
  <tbody>
    <tr><td>Alice</td><td>edit</td></tr>
  </tbody>
`;

function createWrapper(options?: ComponentMountingOptions<typeof RuiTable>) {
  return mount(RuiTable, {
    slots: { default: rows },
    ...options,
  });
}

describe('components/tables/RuiTable.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render the slot markup inside a table', () => {
    wrapper = createWrapper();

    const table = wrapper.find('table');
    expect(table.exists()).toBeTruthy();
    expect(table.findAll('thead th')).toHaveLength(2);
    expect(table.findAll('tbody td')).toHaveLength(2);
  });

  it('should scroll the wrapper rather than the table', () => {
    wrapper = createWrapper();

    expect(wrapper.classes()).toContain('overflow-y-auto');
    expect(wrapper.find('table').classes()).not.toContain('overflow-y-auto');
  });

  it('should carry a border in the outlined variant, which is the default', () => {
    wrapper = createWrapper();

    expect(wrapper.classes()).toContain('border');
    expect(wrapper.classes()).toContain('rounded-md');
  });

  it('should drop the border in the default variant', () => {
    wrapper = createWrapper({ props: { variant: 'default' } });

    expect(wrapper.classes()).not.toContain('border');
    expect(wrapper.classes()).not.toContain('rounded-md');
  });

  it('should tighten the cell padding when dense', () => {
    wrapper = createWrapper({ props: { dense: true } });

    const classes = wrapper.find('table').classes();
    expect(classes).toContain('[:where(&)_th]:py-1');
    expect(classes).toContain('[:where(&)_th]:px-2');
    expect(classes).not.toContain('[:where(&)_th]:py-2');
  });

  it('should keep every cell rule at element specificity so a consumer class wins', () => {
    wrapper = createWrapper();

    const cellRules = wrapper
      .find('table')
      .classes()
      .filter(name => /_(?:th|td)\]:/.test(name));

    // `[&_th]:px-4` would outrank a cell's own class and force `!important` on the consumer
    expect(cellRules.length).toBeGreaterThan(0);
    expect(cellRules.every(name => name.includes(':where(&)'))).toBeTruthy();
  });

  it('should show no state row while the table simply has rows', () => {
    wrapper = createWrapper();

    expect(wrapper.find('[data-id=table-loading]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=table-error]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id=empty-label]').exists()).toBeFalsy();
  });

  it('should show a spinner while loading', () => {
    wrapper = createWrapper({ props: { loading: true } });

    expect(wrapper.find('[data-id=table-loading]').exists()).toBeTruthy();
  });

  it('should describe a failed read and offer the retry it was given a label for', async () => {
    wrapper = createWrapper({
      props: { error: 'Connection refused', errorTitle: 'Could not read nodes', retryText: 'Retry' },
    });

    const error = wrapper.find('[data-id=table-error]');
    expect(error.exists()).toBeTruthy();
    expect(error.text()).toContain('Could not read nodes');
    expect(error.text()).toContain('Connection refused');

    await error.find('button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });

  it('should leave out the retry control when no label was given for it', () => {
    wrapper = createWrapper({ props: { error: 'Connection refused' } });

    expect(wrapper.find('[data-id=table-error]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=table-error] button').exists()).toBeFalsy();
  });

  it('should say a table is empty, without the illustration', () => {
    wrapper = createWrapper({ props: { empty: { label: 'No nodes for this chain' } } });

    expect(wrapper.find('[data-id=empty-label]').text()).toBe('No nodes for this chain');
    expect(wrapper.find('img').exists()).toBeFalsy();
  });

  it('should prefer a failed read over an empty one, since rows that did not arrive are not absent', () => {
    wrapper = createWrapper({
      props: { empty: { label: 'No nodes' }, error: 'Connection refused' },
    });

    expect(wrapper.find('[data-id=table-error]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=empty-label]').exists()).toBeFalsy();
  });

  it('should prefer loading over both, so a read in flight never reads as a failure', () => {
    wrapper = createWrapper({
      props: { empty: true, error: 'Connection refused', loading: true },
    });

    expect(wrapper.find('[data-id=table-loading]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=table-error]').exists()).toBeFalsy();
  });

  it('should let a consumer replace a state wholesale', () => {
    wrapper = createWrapper({
      props: { empty: true },
      slots: { default: rows, empty: '<p data-id="mine">nothing here</p>' },
    });

    expect(wrapper.find('[data-id=mine]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=empty-label]').exists()).toBeFalsy();
  });

  it('should pass attributes through to the scroll container', () => {
    wrapper = createWrapper({
      attrs: { 'class': 'bg-white dark:bg-transparent', 'data-id': 'nodes' },
    });

    expect(wrapper.attributes('data-id')).toBe('nodes');
    expect(wrapper.classes()).toContain('bg-white');
    expect(wrapper.find('table').attributes('data-id')).toBeUndefined();
  });
});
