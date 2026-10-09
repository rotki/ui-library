import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiFooterStepper from '@/components/steppers/RuiFooterStepper.vue';

function createWrapper(
  options: ComponentMountingOptions<typeof RuiFooterStepper>,
): VueWrapper<InstanceType<typeof RuiFooterStepper>> {
  return mount(RuiFooterStepper, options);
}

describe('components/steppers/RuiFooterStepper.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiFooterStepper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
      },
    });
    expect(wrapper.element.getAttribute('data-variant')).toBe('numeric');
    expect(wrapper.find('[data-id=numeric]').exists()).toBeTruthy();
  });

  it('should have role="navigation" and aria-label on root', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
      },
    });

    expect(wrapper.element.getAttribute('role')).toBe('navigation');
    expect(wrapper.element.getAttribute('aria-label')).toBe('Step navigation');
  });

  it('should have aria-label on navigation buttons', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 2,
        pages: 5,
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]!.attributes('aria-label')).toBe('Previous');
    expect(buttons[1]!.attributes('aria-label')).toBe('Next');
  });

  it('should render correct number of pages in numeric variant', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 3,
        pages: 5,
      },
    });

    expect(wrapper.find('[data-id=numeric]').text()).toBe('3/5');
  });

  it('should emit update:modelValue on next and back click', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 2,
        pages: 5,
      },
    });

    const buttons = wrapper.findAll('button');

    // Click Next (2 → 3)
    await buttons[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);

    // Click Back (3 → 2, since defineModel updates internal state)
    await buttons[0]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2]);
  });

  it('should disable Back button on first page and Next on last page', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 3,
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons[0]!.attributes('disabled')).toBeDefined();
    expect(buttons[1]!.attributes('disabled')).toBeUndefined();

    await wrapper.setProps({ modelValue: 3 });
    expect(buttons[0]!.attributes('disabled')).toBeUndefined();
    expect(buttons[1]!.attributes('disabled')).toBeDefined();
  });

  it('should have aria-current="step" on active bullet', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 2,
        pages: 5,
        variant: 'bullet',
      },
    });

    const bullets = wrapper.findAll('[data-id=bullets] button');
    expect(bullets).toHaveLength(5);
    expect(bullets[1]!.attributes('aria-current')).toBe('step');
    expect(bullets[0]!.attributes('aria-current')).toBeUndefined();
  });

  it('should jump to a step from its bullet, which is a labelled button', async () => {
    wrapper = createWrapper({
      props: {
        'modelValue': 1,
        'pages': 4,
        'variant': 'bullet',
        'onUpdate:modelValue': async (value: number) => wrapper.setProps({ modelValue: value }),
      },
    });

    const third = wrapper.findAll('[data-id=bullets] button')[2]!;
    expect(third.attributes('aria-label')).toBe('Step 3');
    expect(third.attributes('type')).toBe('button');
    await third.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3]);
  });

  it('should have aria-current="step" on active pill', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 4,
        pages: 5,
        variant: 'pill',
      },
    });

    const pills = wrapper.findAll('[data-id=pills] span');
    expect(pills).toHaveLength(5);
    expect(pills[3]!.attributes('aria-current')).toBe('step');
    expect(pills[0]!.attributes('aria-current')).toBeUndefined();
  });

  it('should hide buttons when hideButtons is true', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
        hideButtons: true,
        variant: 'bullet',
      },
    });

    // only the step bullets are left
    expect(wrapper.find('button[aria-label=Previous]').exists()).toBe(false);
    expect(wrapper.find('button[aria-label=Next]').exists()).toBe(false);
    expect(wrapper.findAll('button')).toHaveLength(5);
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
        variant: 'bullet',
      },
    });

    await wrapper.setProps({ variant: 'progress' });
    expect(wrapper.element.getAttribute('data-variant')).toBe('progress');

    const next = wrapper.find('button ~ button [data-id=btn-label] span');
    expect(next.exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'pill' });
    expect(wrapper.element.getAttribute('data-variant')).toBe('pill');
  });
});
