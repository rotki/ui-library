import RuiTableLoadingState from '@/components/tables/RuiTableLoadingState.vue';
import preview from '~/.storybook/preview';

const meta = preview.meta({
  args: {
    compact: false,
    size: 40,
  },
  component: RuiTableLoadingState,
  tags: ['autodocs'],
  title: 'Data Display/Table States/Loading',
});

export const Default = meta.story({});

/** Less padding and no reserved height, for a table with little room. */
export const Compact = meta.story({
  args: { compact: true, size: 24 },
});

export default meta;
