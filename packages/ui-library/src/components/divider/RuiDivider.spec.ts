import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiDivider from '@/components/divider/RuiDivider.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiDivider>) {
  return mount(RuiDivider, { ...options, stubs: { RuiIcon: true } });
}

describe('divider', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div')).toBeTruthy();
  });

  it('passes vertical props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.get('div').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/border-l/)]),
    );
    expect(wrapper.get('div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/border-t/)]),
    );
    await wrapper.setProps({ vertical: true });
    expect(wrapper.get('div').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/border-t/)]),
    );
    expect(wrapper.get('div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/border-l/)]),
    );
    await wrapper.setProps({ vertical: false });
    expect(wrapper.get('div').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/border-l/)]),
    );
    expect(wrapper.get('div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/border-t/)]),
    );
  });
});
