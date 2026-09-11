import { expect } from 'storybook/test';
import RuiTable, { type Props } from '@/components/tables/RuiTable.vue';
import preview from '~/.storybook/preview';

const body = `
  <thead>
    <tr>
      <th scope="col">Node</th>
      <th scope="col">Weight</th>
      <th scope="col"></th>
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

function render(args: Props, slot: string = body) {
  return {
    components: { RuiTable },
    setup() {
      return { args };
    },
    template: `<RuiTable v-bind="args">${slot}</RuiTable>`,
  };
}

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
  title: 'Components/Tables/Table',
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
  args: {},
  // `p-0` is a plain class, so it beats the `:where()` cell rules unaided
  render: (args: Props) => render(args, `
    <thead>
      <tr>
        <th scope="col">Padded like the rest</th>
        <th class="p-0" scope="col">Flush</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>a</td><td class="p-0">b</td></tr>
    </tbody>
  `),
  async play({ canvas }) {
    const padded = canvas.getByText('Padded like the rest');
    const flush = canvas.getByText('Flush');

    await expect(window.getComputedStyle(padded).paddingLeft).toBe('16px');
    await expect(window.getComputedStyle(flush).paddingLeft).toBe('0px');
  },
});

export default meta;
