import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { RouterLinkStub } from '@vue/test-utils';
import Tab from '@/components/tabs/tab/Tab.vue';
const createWrapper = (options?: ComponentMountingOptions<typeof Tab>) =>
  mount(Tab, {
    ...options,
    props: { tabValue: 'tab-1', ...options?.props },
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });

describe('Tabs/Tab', () => {
  it('renders properly', () => {
    const label = 'Tab 1';
    const wrapper = createWrapper({
      slots: {
        prepend: 'prepend',
        default: () => label,
      },
    });
    const elem = wrapper.find('button');
    expect(elem.classes()).toMatch(/_text_/);
    expect(elem.text()).toContain('prepend');
    expect(elem.find('span').text()).toContain(label);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ link: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, link: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.find('button').classes()).toMatch(/_grey_/);

    await wrapper.setProps({ active: true });
    expect(wrapper.find('button').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('button').classes()).toMatch(/_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('button').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('button').classes()).toMatch(/_success_/);
  });

  it('passes grow props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.find('button').classes()).not.toMatch(/--grow_/);

    await wrapper.setProps({ grow: true });
    expect(wrapper.find('button').classes()).toMatch(/--grow_/);
  });

  it('passes align props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.find('button').classes()).toMatch(/_tab--center_/);

    await wrapper.setProps({ align: 'start' });
    expect(wrapper.find('button').classes()).toMatch(/_tab--start_/);

    await wrapper.setProps({ align: 'end' });
    expect(wrapper.find('button').classes()).toMatch(/_tab--end_/);
  });

  it('tab as link', async () => {
    const wrapper = createWrapper({
      props: {
        link: true,
        to: '/tabs',
        exact: true,
        exactPath: true,
      },
    });

    let elem = wrapper.find('a');
    expect(elem.classes()).toMatch(/_tab_/);
    expect(elem.attributes().target).toMatch('_self');
    expect(elem.attributes().href).toBeUndefined();

    await wrapper.setProps({
      target: '_blank',
    });

    elem = wrapper.find('a');
    expect(elem.attributes().target).toMatch('_blank');
    expect(elem.attributes().href).toBeDefined();
  });
});
