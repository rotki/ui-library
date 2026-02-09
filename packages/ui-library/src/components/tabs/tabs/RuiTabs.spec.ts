import { type ComponentMountingOptions, mount, RouterLinkStub } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';
import RuiTabs from '@/components/tabs/tabs/RuiTabs.vue';
import {
  assertExists,
  expectNotToHaveClass,
  expectToHaveClass,
  expectWrapperNotToHaveClass,
  expectWrapperToHaveClass,
} from '~/tests/helpers/dom-helpers';

vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockImplementation(() => ref()),
  useRouter: vi.fn().mockImplementation(() => ({
    resolve: vi.fn(),
  })),
}));

function createWrapper(
  options: ComponentMountingOptions<typeof RuiTabs> = {},
  customTabValue: boolean = false,
) {
  return mount(RuiTabs, {
    ...options,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        RuiTab,
      },
    },
    slots: {
      default: [...new Array(4).keys()].map(item => (
        {
          template: customTabValue
            ? `<RuiTab value="tab-${item}"><div>Tab ${item}</div></RuiTab>`
            : `<RuiTab><div>Tab ${item}</div></RuiTab>`,
        }
      )),
    },
  });
}

describe('components/tabs/tabs/RuiTabs.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', async () => {
    wrapper = createWrapper();

    await nextTick();

    const buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expectToHaveClass(button0.element, /active-tab/);
  });

  it('should pass vertical props', async () => {
    wrapper = createWrapper();

    expectNotToHaveClass(wrapper.element, /_tabs--vertical_/);

    await wrapper.setProps({
      vertical: true,
    });
    await nextTick();
    expectToHaveClass(wrapper.element, /_tabs--vertical_/);

    expectWrapperToHaveClass(wrapper, 'div[class*=_tabs-wrapper] > button', /_tab--vertical_/);
  });

  it('should pass grow props', async () => {
    wrapper = createWrapper();

    expectWrapperNotToHaveClass(wrapper, 'div[class*=tabs-bar]', /_tabs-bar--grow/);

    await wrapper.setProps({
      grow: true,
    });
    expectWrapperToHaveClass(wrapper, 'div[class*=tabs-bar]', /_tabs-bar--grow/);

    expectWrapperToHaveClass(wrapper, 'div[class*=_tabs-wrapper] > button', /_tab--grow/);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();

    await wrapper.setProps({
      disabled: true,
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should pass align props', async () => {
    wrapper = createWrapper();

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

  it('should change modelValue when tab is clicked', async () => {
    const modelValue = ref();
    wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    await nextTick();
    let buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expectToHaveClass(button0.element, /active-tab/);

    const button1 = buttons[1];
    assertExists(button1);
    await button1.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(1);

    buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');
    const button2 = buttons[2];
    assertExists(button2);
    await button2.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(2);

    buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');
    const button3 = buttons[3];
    assertExists(button3);
    await button3.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(3);
  });

  it('works with custom tab value', async () => {
    wrapper = createWrapper({}, true);

    await nextTick();

    const buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expectToHaveClass(button0.element, /active-tab/);
  });

  it('should have role="tablist" on tab container', () => {
    wrapper = createWrapper();

    const tablist = wrapper.find('[role="tablist"]');
    expect(tablist.exists()).toBeTruthy();
  });

  it('should have role="tab" on each tab', async () => {
    wrapper = createWrapper();

    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs).toHaveLength(4);
  });

  it('should have aria-selected on active tab only', async () => {
    wrapper = createWrapper();

    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('aria-selected')).toBe('true');
    expect(tabs[1]!.attributes('aria-selected')).toBe('false');
    expect(tabs[2]!.attributes('aria-selected')).toBe('false');
    expect(tabs[3]!.attributes('aria-selected')).toBe('false');
  });

  it('should update aria-selected when tab changes', async () => {
    const modelValue = ref<number>();
    wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    await nextTick();

    let tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('aria-selected')).toBe('true');

    const button2 = tabs[2];
    assertExists(button2);
    await button2.trigger('click');
    await nextTick();

    tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('aria-selected')).toBe('false');
    expect(tabs[2]!.attributes('aria-selected')).toBe('true');
  });
});
