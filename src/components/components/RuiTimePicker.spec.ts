import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiTimePicker from './RuiTimePicker.vue';

function createWrapper(options: ComponentMountingOptions<typeof RuiTimePicker>) {
  return mount(RuiTimePicker, { ...options });
}

describe('components/RuiTimePicker', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
  });
});
