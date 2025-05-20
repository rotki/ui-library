import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

function createWrapper(options: ComponentMountingOptions<typeof RuiDateTimePicker>) {
  return mount(RuiDateTimePicker, { ...options });
}

describe('date-time-picker/RuiDateTimePicker', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
  });
});
