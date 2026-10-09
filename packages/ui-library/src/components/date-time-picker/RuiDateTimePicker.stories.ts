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
    // the gap keeps the readout off the field when there is no details row between them
    template: `<div class="flex flex-col gap-2">
      <RuiDateTimePicker v-bind="args" v-model="args.modelValue" />
      <div>
        <div class="text-rui-text">
          <span class='font-medium'>Date:</span> {{ iso }}
        </div>
        <div class="text-rui-text">
          <span class='font-medium'>Epoch</span> {{ epoch }}
        </div>
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
  title: 'Date & Time/Date Time Picker',
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
    // leave the story at rest, without a selected segment's focus ring
    input.blur();
    await expect(input).not.toHaveFocus();
  },
});

export const SecondAccuracy = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
  },
});

export const Optional = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    allowEmpty: true,
    modelValue: undefined,
  },
});

export const WithMaxNow = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    maxDate: 'now',
    modelValue: new Date(),
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    modelValue: new Date(),
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    modelValue: new Date(),
  },
});

export const Readonly = meta.story({
  args: {
    modelValue: new Date(),
    readonly: true,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['Date is out of range'],
    modelValue: new Date(),
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    modelValue: new Date(),
    successMessages: ['Date confirmed'],
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Select a date and time',
    modelValue: new Date(),
  },
});

/** A hint is set but not drawn, so nothing sits between the field and the readout below it. */
export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'This hint is only drawn when details are shown',
    modelValue: new Date(),
  },
});

/**
 * The menu gains a timezone selector, which starts at the browser's zone; the hint names it. The
 * play opens the menu to check the selector, then closes it again.
 */
export const WithTimezone = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    hint: `Read in ${new Intl.DateTimeFormat().resolvedOptions().timeZone}; change the zone from the menu`,
    modelValue: new Date(),
    showTimezone: true,
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await waitFor(() => expect(body.getByRole('menu').querySelector('[data-id="timezone-select"]')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    input.blur();
  },
});

export const AllActions = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    actions: ['now', 'today', 'clear'],
    allowEmpty: true,
    modelValue: new Date(),
  },
});

export const NoActions = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    actions: [],
    modelValue: new Date(),
  },
});

export const Required = meta.story({
  args: {
    modelValue: new Date(),
    required: true,
  },
});

export const InsideParentMenu = meta.story({
  args: {
    modelValue: new Date(),
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
