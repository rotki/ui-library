import { expect, fn } from 'storybook/test';
import RuiTableErrorState from '@/components/tables/RuiTableErrorState.vue';
import preview from '~/.storybook/preview';

const meta = preview.meta({
  args: {
    message: 'The accounts could not be read: the request timed out.',
    onAction: fn(),
    title: 'Could not load the accounts',
  },
  component: RuiTableErrorState,
  tags: ['autodocs'],
  title: 'Data Display/Table States/Error',
});

/** The reason on its own: without `actionText`, no retry control is offered. */
export const Default = meta.story({
  async play({ canvas }) {
    await expect(canvas.getByText('Could not load the accounts')).toBeVisible();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
});

export const WithRetry = meta.story({
  args: { actionText: 'Try again' },
  async play({ args, canvas, userEvent }) {
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
});

export default meta;
