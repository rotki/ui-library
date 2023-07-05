import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Button from '@/components/buttons/Button.vue';

const createWrapper = (options: ComponentMountingOptions<typeof Button>) =>
  mount(Button, options);

describe('Button', () => {
  it('renders properly', () => {
    const label = 'Primary Button';
    const wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.classes()).toMatch(/_btn_/);
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'secondary',
        disabled: true,
        tile: true,
      },
      slots: {
        default: () => 'Secondary Button',
      },
    });
    expect(wrapper.classes()).toMatch(/_secondary_/);
    expect(wrapper.classes()).toMatch(/_tile_/);
    expect(wrapper.attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, color: 'primary' });
    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.classes()).toMatch(/_primary_/);
    await wrapper.setProps({ loading: true });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toMatch(/_loading_/);
    await wrapper.setProps({ loading: false });
    expect(wrapper.attributes('disabled')).toBeUndefined();
  });
});
