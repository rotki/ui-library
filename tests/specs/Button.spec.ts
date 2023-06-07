import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/buttons/Button.vue';

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, {
      props: {},
      slots: {
        default: () => 'Primary Button',
      },
    });
    expect(wrapper.text()).toContain('Primary Button');
    expect(wrapper.classes()).toMatch(/_btn_/);
  });

  it('passes props correctly', async () => {
    const wrapper = mount(Button, {
      props: { color: 'secondary', disabled: true, tile: true },
      slots: {
        default: () => 'Secondary Button',
      },
    });
    expect(wrapper.classes()).toMatch(/_secondary_/);
    expect(wrapper.classes()).toMatch(/_tile_/);
    expect(wrapper.attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, color: 'primary' });
    expect(wrapper.attributes('disabled')).toBe(undefined);
    expect(wrapper.classes()).toMatch(/_primary_/);
    await wrapper.setProps({ loading: true });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toMatch(/_loading_/);
    await wrapper.setProps({ loading: false });
    expect(wrapper.attributes('disabled')).toBe(undefined);
  });
});
