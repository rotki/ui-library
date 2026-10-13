import { expect } from 'storybook/test';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';
import preview from '~/.storybook/preview';

const meta = preview.meta({
  args: {
    compact: false,
    description: 'Start by adding an account.',
    label: 'No accounts',
  },
  component: RuiTableEmptyState,
  tags: ['autodocs'],
  title: 'Data Display/Table States/Empty',
});

export const Default = meta.story({});

/** Without the illustration or the reserved height, for a table with room only to say it is empty. */
export const Compact = meta.story({
  args: { compact: true },
  async play({ canvas }) {
    await expect(canvas.getByText('No accounts')).toBeVisible();
    await expect(canvas.queryByRole('img')).toBeNull();
  },
});

export default meta;
