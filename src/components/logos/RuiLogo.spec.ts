import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';
import RuiLogo from '@/components/logos/RuiLogo.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiLogo>) {
  return mount(RuiLogo, { ...options });
}

describe('forms/Logo', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').find('img').exists()).toBeTruthy();
  });

  it('passes text props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ text: true });
    expect(wrapper.find('div').text()).toBe('rotki');
    await wrapper.setProps({ text: false });
    expect(wrapper.find('div').text()).toBe('');
  });

  it('passes logo props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ logo: 'website' });
    await promiseTimeout(1000);
    expect(wrapper.find('img[data-image=custom]').exists()).toBeTruthy();
    await wrapper.setProps({ uniqueKey: '10' });
    expect(wrapper.find('img[data-image=custom][src*="?key=10"]').exists()).toBeTruthy();
  });
});
