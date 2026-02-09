import { type ComponentMountingOptions, mount, RouterLinkStub } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';
import { expectToHaveClass, expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(options?: ComponentMountingOptions<typeof RuiTab>) {
  return mount(RuiTab, {
    ...options,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    props: { tabValue: 'tab-1', ...options?.props },
  });
}

describe('components/tabs/tab/RuiTab.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Tab 1';
    wrapper = createWrapper({
      slots: {
        default: () => label,
        prepend: 'prepend',
      },
    });
    const elem = wrapper.find('button');
    expectToHaveClass(elem.element, /_text_/);
    expect(elem.text()).toContain('prepend');
    expect(elem.find('span').text()).toContain(label);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ link: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, link: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectWrapperToHaveClass(wrapper, 'button', /_grey_/);

    await wrapper.setProps({ active: true });
    expectWrapperToHaveClass(wrapper, 'button', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'button', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'button', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'button', /_success_/);
  });

  it('should pass grow props', async () => {
    wrapper = createWrapper({});

    expectWrapperNotToHaveClass(wrapper, 'button', /--grow_/);

    await wrapper.setProps({ grow: true });
    expectWrapperToHaveClass(wrapper, 'button', /--grow_/);
  });

  it('should pass align props', async () => {
    wrapper = createWrapper({});

    expectWrapperToHaveClass(wrapper, 'button', /_tab--center_/);

    await wrapper.setProps({ align: 'start' });
    expectWrapperToHaveClass(wrapper, 'button', /_tab--start_/);

    await wrapper.setProps({ align: 'end' });
    expectWrapperToHaveClass(wrapper, 'button', /_tab--end_/);
  });

  it('should pass indicatorPosition props', async () => {
    wrapper = createWrapper({});

    expectWrapperToHaveClass(wrapper, 'button', /_tab-indicator--end_/);

    await wrapper.setProps({ indicatorPosition: 'start' });
    expectWrapperToHaveClass(wrapper, 'button', /_tab-indicator--start_/);

    await wrapper.setProps({ indicatorPosition: 'end' });
    expectWrapperToHaveClass(wrapper, 'button', /_tab-indicator--end_/);
  });

  it('should tab as link', async () => {
    wrapper = createWrapper({
      props: {
        exact: true,
        exactPath: true,
        link: true,
        to: '/tabs',
      },
    });

    let elem = wrapper.find('a');
    expectToHaveClass(elem.element, /_tab_/);
    expect(elem.attributes().target).toMatch('_self');
    expect(elem.attributes().href).toBeUndefined();

    await wrapper.setProps({
      target: '_blank',
    });

    elem = wrapper.find('a');
    expect(elem.attributes().target).toMatch('_blank');
    expect(elem.attributes().href).toBeDefined();
  });

  it('should have role="tab" on button', () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('role')).toBe('tab');
  });

  it('should have aria-selected="false" when not active', () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('aria-selected')).toBe('false');
  });

  it('should have aria-selected="true" when active', () => {
    wrapper = createWrapper({ props: { active: true } });
    expect(wrapper.find('button').attributes('aria-selected')).toBe('true');
  });

  it('should have aria-selected on disabled tab', () => {
    wrapper = createWrapper({ props: { disabled: true } });
    expect(wrapper.find('button').attributes('aria-selected')).toBe('false');
    expect(wrapper.find('button').attributes('role')).toBe('tab');
  });

  it('should have role="tab" on link tab', () => {
    wrapper = createWrapper({
      props: { link: true, to: '/tabs' },
    });
    const link = wrapper.find('a');
    expect(link.attributes('role')).toBe('tab');
  });

  it('should update aria-selected when active changes', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('aria-selected')).toBe('false');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('button').attributes('aria-selected')).toBe('true');

    await wrapper.setProps({ active: false });
    expect(wrapper.find('button').attributes('aria-selected')).toBe('false');
  });

  it('should set tabindex to -1 for all tab variations', async () => {
    // Test disabled tab
    let wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });
    expect(wrapper.find('button').attributes('tabindex')).toBe('-1');

    // Test regular button tab
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('tabindex')).toBe('-1');

    // Test link tab
    wrapper = createWrapper({
      props: {
        link: true,
        to: '/tabs',
      },
    });
    expect(wrapper.find('a').attributes('tabindex')).toBe('-1');
  });
});
