import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';
import RuiTabs from '@/components/tabs/tabs/RuiTabs.vue';
import { assertExists } from '~/tests/helpers/dom-helpers';

vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockImplementation(() => reactive({ fullPath: '/' })),
  useRouter: vi.fn().mockImplementation(() => ({
    resolve: vi.fn(),
  })),
  useLink: vi.fn().mockImplementation(() => ({
    href: ref('/'),
    isActive: ref(false),
    isExactActive: ref(false),
    navigate: vi.fn(),
    route: ref({ fullPath: '/' }),
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
        RuiTab,
      },
    },
    slots: {
      default: Array.from(new Array(4).keys(), item => (
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

    const buttons = wrapper.findAll('[data-id=tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expect(button0.attributes('data-active-tab')).toBe('true');
  });

  it('should pass vertical props', async () => {
    wrapper = createWrapper();

    expect(wrapper.element.getAttribute('data-vertical')).toBeNull();

    await wrapper.setProps({
      vertical: true,
    });
    await nextTick();
    expect(wrapper.element.getAttribute('data-vertical')).toBe('true');

    expect(wrapper.find('[data-id=tabs-wrapper] > button').attributes('data-vertical')).toBe('true');
  });

  it('should pass grow props', async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      grow: true,
    });

    expect(wrapper.find('[data-id=tabs-wrapper] > button').classes()).toContain('grow');
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

    expect(wrapper.find('button').attributes('data-align')).toBe('center');

    await wrapper.setProps({ align: 'start' });
    expect(wrapper.find('button').attributes('data-align')).toBe('start');

    await wrapper.setProps({ align: 'end' });
    expect(wrapper.find('button').attributes('data-align')).toBe('end');
  });

  it('should pass indicatorPosition props', async () => {
    wrapper = createWrapper({});

    expect(wrapper.find('button').attributes('data-indicator-position')).toBe('end');

    await wrapper.setProps({ indicatorPosition: 'start' });
    expect(wrapper.find('button').attributes('data-indicator-position')).toBe('start');

    await wrapper.setProps({ indicatorPosition: 'end' });
    expect(wrapper.find('button').attributes('data-indicator-position')).toBe('end');
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
    let buttons = wrapper.findAll('[data-id=tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expect(button0.attributes('data-active-tab')).toBe('true');

    const button1 = buttons[1];
    assertExists(button1);
    await button1.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(1);

    buttons = wrapper.findAll('[data-id=tabs-wrapper] > button');
    const button2 = buttons[2];
    assertExists(button2);
    await button2.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(2);

    buttons = wrapper.findAll('[data-id=tabs-wrapper] > button');
    const button3 = buttons[3];
    assertExists(button3);
    await button3.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(3);
  });

  it('works with custom tab value', async () => {
    wrapper = createWrapper({}, true);

    await nextTick();

    const buttons = wrapper.findAll('[data-id=tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    const button0 = buttons[0];
    assertExists(button0);
    expect(button0.attributes('data-active-tab')).toBe('true');
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

  it('should move and select with the arrow keys, Home and End', async () => {
    const modelValue = ref<number | string>(0);
    wrapper = createWrapper({
      attachTo: document.body,
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': async (e: number | string) => {
          set(modelValue, e);
          await wrapper.setProps({ modelValue: e });
        },
      },
    });

    await nextTick();
    const tabs = (): Element[] => wrapper.findAll('[role=tab]').map(tab => tab.element);
    /** Sends a key to the focused tab, from where it bubbles to the tablist. */
    const press = async (key: string): Promise<void> => {
      document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await nextTick();
    };

    wrapper.find<HTMLElement>('[role=tab]').element.focus();

    await press('ArrowRight');
    expect(get(modelValue)).toBe(1);
    expect(document.activeElement).toBe(tabs()[1]);

    await press('End');
    expect(get(modelValue)).toBe(3);

    // wraps around from the last tab
    await press('ArrowRight');
    expect(get(modelValue)).toBe(0);

    await press('ArrowLeft');
    expect(get(modelValue)).toBe(3);

    await press('Home');
    expect(get(modelValue)).toBe(0);
  });

  it('should render one indicator outside the tablist', async () => {
    wrapper = createWrapper();
    await nextTick();
    await nextTick();

    expect(wrapper.findAll('[data-id=tabs-indicator]')).toHaveLength(1);
    expect(wrapper.find('[role=tablist] [data-id=tabs-indicator]').exists()).toBe(false);
  });

  it('should pass the variant to the tabs', async () => {
    wrapper = createWrapper({ props: { variant: 'segmented' } });
    await nextTick();

    for (const tab of wrapper.findAll('[role=tab]'))
      expect(tab.attributes('data-variant')).toBe('segmented');
  });

  it('should mark a vertical tablist', () => {
    wrapper = createWrapper({ props: { vertical: true } });
    expect(wrapper.find('[role=tablist]').attributes('aria-orientation')).toBe('vertical');
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
