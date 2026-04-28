import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { TimeAccuracy } from '@/consts/time-accuracy';
import preview from '~/.storybook/preview';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

function render(args: ComponentPropsAndSlots<typeof RuiDateTimePicker>) {
  return {
    components: { RuiDateTimePicker },
    setup() {
      const iso = computed<string>(() => {
        if (args.modelValue) {
          return new Date(args.modelValue).toISOString();
        }
        return '-';
      });

      const epoch = computed<string>(() => {
        if (args.modelValue) {
          const epoch = new Date(args.modelValue).getTime();
          return epoch >= 0 ? epoch.toString() : '-';
        }
        return '-';
      });

      return { args, epoch, iso };
    },
    template: `<div>
      <RuiDateTimePicker v-bind="args" v-model="args.modelValue" />
      <div class="text-rui-text">
        <span class='font-medium'>Date:</span> {{ iso }}
      </div>
      <div class="text-rui-text">
        <span class='font-medium'>Epoch</span> {{ epoch }}
      </div>
    </div>`,
  };
}

const meta = preview.meta({
  argTypes: {
    accuracy: {
      control: 'select',
      options: [TimeAccuracy.SECOND, TimeAccuracy.MINUTE, TimeAccuracy.MILLISECOND],
      table: {
        defaultValue: {
          summary: TimeAccuracy.MINUTE,
        },
      },
    },
    modelValue: {
      control: 'date',
    },
    required: {
      control: 'boolean',
      table: { category: 'State' },
    },
  },
  component: RuiDateTimePicker,
  render,
  tags: ['autodocs'],
  title: 'Components/DateTimePicker',
});

export const Default = meta.story({
  args: {
    modelValue: new Date(),
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export const Outlined = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Optional = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    allowEmpty: true,
    modelValue: undefined,
    variant: 'outlined',
  },
});

export const WithMaxNow = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    maxDate: 'now',
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Filled = meta.story({
  args: {
    modelValue: new Date(),
    variant: 'filled',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Readonly = meta.story({
  args: {
    modelValue: new Date(),
    readonly: true,
    variant: 'outlined',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['Date is out of range'],
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    modelValue: new Date(),
    successMessages: ['Date confirmed'],
    variant: 'outlined',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Select a date and time',
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'This hint should not be rendered',
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Required = meta.story({
  args: {
    modelValue: new Date(),
    required: true,
    variant: 'outlined',
  },
});

export const InsideParentMenu = meta.story({
  args: {
    modelValue: new Date(),
    variant: 'outlined',
  },
  render: args => ({
    components: { RuiButton, RuiDateTimePicker, RuiMenu },
    setup() {
      const open = ref<boolean>(false);
      const pickerMenuOpen = ref<boolean>(false);
      return { args, open, pickerMenuOpen };
    },
    template: `<div class="p-8">
      <RuiMenu v-model="open" :persistent="pickerMenuOpen" :close-on-content-click="false">
        <template #activator="{ attrs }">
          <RuiButton v-bind="attrs">Open parent menu</RuiButton>
        </template>
        <div class="p-4 w-[360px]">
          <RuiDateTimePicker
            v-bind="args"
            v-model="args.modelValue"
            v-model:menu-open="pickerMenuOpen"
          />
        </div>
      </RuiMenu>
    </div>`,
  }),
});

export default meta;
