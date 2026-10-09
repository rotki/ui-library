import { expect } from 'storybook/test';
import RuiTable, { type Props } from '@/components/tables/RuiTable.vue';
import preview from '~/.storybook/preview';

const body = `
  <thead>
    <tr>
      <th scope="col">Node</th>
      <th scope="col">Weight</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>etherscan</td>
      <td>40%</td>
      <td>connected</td>
    </tr>
    <tr>
      <td>ankr</td>
      <td>35%</td>
      <td>connected</td>
    </tr>
    <tr>
      <td>llamanodes</td>
      <td>25%</td>
      <td>disconnected</td>
    </tr>
  </tbody>
`;

/**
 * A render function for the given table markup. Storybook calls `render(args, context)`, so the
 * markup comes from this factory rather than a second parameter, which would receive the context.
 */
function renderWith(slot: string) {
  return (args: Props) => ({
    components: { RuiTable },
    setup() {
      return { args };
    },
    template: `<RuiTable v-bind="args">${slot}</RuiTable>`,
  });
}

const render = renderWith(body);

const meta = preview.meta({
  args: {
    dense: false,
    variant: 'outlined',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined'],
    },
  },
  component: RuiTable,
  render,
  tags: ['autodocs'],
  title: 'Data Display/Table',
});

export const Default = meta.story({
  args: {
    variant: 'default',
  },
});

export const Outlined = meta.story({
  args: {
    variant: 'outlined',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
  },
});

export const CellOverride = meta.story({
  args: { variant: 'outlined' },
  // `p-0` beats the `:where()` cell rules unaided; the column divider and label tint show the padding
  render: renderWith(`
    <thead>
      <tr>
        <th scope="col"><span class="bg-rui-primary-soft">Padded like the rest</span></th>
        <th class="p-0 border-l border-rui-divider" scope="col"><span class="bg-rui-primary-soft">Flush</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="bg-rui-primary-soft">a</span></td>
        <td class="p-0 border-l border-rui-divider"><span class="bg-rui-primary-soft">b</span></td>
      </tr>
    </tbody>
  `),
  async play({ canvas }) {
    const padded = canvas.getByRole('columnheader', { name: 'Padded like the rest' });
    const flush = canvas.getByRole('columnheader', { name: 'Flush' });

    await expect(window.getComputedStyle(padded).paddingLeft).toBe('16px');
    await expect(window.getComputedStyle(flush).paddingLeft).toBe('0px');
  },
});

export default meta;
