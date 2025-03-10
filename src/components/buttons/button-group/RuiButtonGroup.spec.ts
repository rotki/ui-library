import RuiButtonGroup from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

function createWrapper(options?: ComponentMountingOptions<typeof RuiButtonGroup>) {
  return mount(RuiButtonGroup, {
    slots: {
      default: [RuiButton, RuiButton, RuiButton],
    },
    ...options,
  });
}

describe('button/ButtonGroup', () => {
  it('passes vertical props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/vertical/)]),
    );
    await wrapper.setProps({ vertical: true });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/vertical/)]),
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_text_/)]),
    );
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_text_/)]),
    );
  });

  it('passes size props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_sm_/)]),
    );
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_lg_/)]),
    );
    await wrapper.setProps({ size: 'sm' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_sm_/)]),
    );
    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_lg_/)]),
    );
  });

  it('toggleable button group', async () => {
    const wrapper = createWrapper({
      props: {
        'modelValue': 0,
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
      },
    });

    const buttons = wrapper.findAll('button');

    // only first button active
    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    // on click, second button should take active state
    await buttons[1].trigger('click');
    expect(wrapper.props('modelValue')).toEqual(1);

    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    // on click, third button should take active state
    await buttons[2].trigger('click');
    expect(wrapper.props('modelValue')).toEqual(2);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    // on click, active button should lose state
    await buttons[2].trigger('click');
    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toBeUndefined();

    // set as required
    await wrapper.setProps({ required: true });
    await buttons[2].trigger('click');
    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toEqual(2);

    // required so, can't deselect the active item
    await buttons[2].trigger('click');
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toEqual(2);
  });

  it('multiple toggleable button group', async () => {
    const wrapper = createWrapper({
      props: {
        'modelValue': [0],
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
      },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    // on click, second button should also be active
    await buttons[1].trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1]);

    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    // on click, third button should also be active
    await buttons[2].trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1, 2]);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );

    await buttons[0].trigger('click');
    await buttons[1].trigger('click');
    await buttons[2].trigger('click');

    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toEqual([]);

    // set required
    await wrapper.setProps({ required: true });
    await buttons[2].trigger('click');
    expect(buttons[0].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[1].classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toEqual([2]);

    // required so, can't deselect the active only item
    await buttons[2].trigger('click');
    expect(buttons[2].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_active_/)]),
    );
    expect(wrapper.props('modelValue')).toEqual([2]);

    await wrapper.setProps({ gap: 'md' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated__md/)]),
    );

    await wrapper.setProps({ gap: 'sm' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated__sm/)]),
    );

    await wrapper.setProps({ gap: 'lg' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_separated__lg/)]),
    );
  });

  it('disabled button group', async () => {
    const modelValue = ref([0]);
    const updateModelValue = vi.fn((value: number[]) => set(modelValue, value));
    const wrapper = createWrapper({
      data() {
        return { selected: get(modelValue) };
      },
      props: {
        'onUpdate:modelValue': (e: any) => updateModelValue(e),
      },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('disabled')).toBeUndefined();
    expect(buttons[1].attributes('disabled')).toBeUndefined();
    expect(buttons[2].attributes('disabled')).toBeUndefined();

    await wrapper.setProps({ disabled: true });

    expect(buttons[0].attributes('disabled')).toBeDefined();
    expect(buttons[1].attributes('disabled')).toBeDefined();
    expect(buttons[2].attributes('disabled')).toBeDefined();
  });
});
