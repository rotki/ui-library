import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Divider from './Divider.vue';

function createWrapper(options?: any) {
  return mount(Divider, { ...options, stubs: { RuiIcon: true } });
}

describe('divider', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div')).toBeTruthy();
  });

  it('passes vertical props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.get('div').classes()).not.toMatch(/border-l/);
    expect(wrapper.get('div').classes()).toMatch(/border-t/);
    await wrapper.setProps({ vertical: true });
    expect(wrapper.get('div').classes()).not.toMatch(/border-t/);
    expect(wrapper.get('div').classes()).toMatch(/border-l/);
    await wrapper.setProps({ vertical: false });
    expect(wrapper.get('div').classes()).not.toMatch(/border-l/);
    expect(wrapper.get('div').classes()).toMatch(/border-t/);
  });
});
