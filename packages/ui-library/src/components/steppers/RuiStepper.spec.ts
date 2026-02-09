import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiStepper from '@/components/steppers/RuiStepper.vue';
import { StepperOrientation, StepperState, type StepperStep } from '@/types/stepper';
import { expectToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options: ComponentMountingOptions<typeof RuiStepper>,
): VueWrapper<InstanceType<typeof RuiStepper>> {
  return mount(RuiStepper, options);
}

describe('components/steppers/RuiStepper.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiStepper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  const steps: StepperStep[] = [
    { description: 'lorem ipsum', state: StepperState.done, title: 'Step' },
    { description: 'lorem ipsum', state: StepperState.active, title: 'Step' },
    { description: 'lorem ipsum', state: StepperState.inactive, title: 'Step' },
  ];

  it('should render properly', () => {
    wrapper = createWrapper({ props: { steps } });
    expectToHaveClass(wrapper.element, /_stepper_/);
  });

  it('should have role="list" and aria-label on root', () => {
    wrapper = createWrapper({ props: { steps } });

    expect(wrapper.element.getAttribute('role')).toBe('list');
    expect(wrapper.element.getAttribute('aria-label')).toBe('Progress steps');
  });

  it('should have role="listitem" on each step', () => {
    wrapper = createWrapper({ props: { steps } });

    const items = wrapper.findAll('[role="listitem"]');
    expect(items).toHaveLength(3);
  });

  it('should have aria-current="step" on active step only', () => {
    wrapper = createWrapper({ props: { steps } });

    const items = wrapper.findAll('[role="listitem"]');
    expect(items[0]!.attributes('aria-current')).toBeUndefined(); // done
    expect(items[1]!.attributes('aria-current')).toBe('step'); // active
    expect(items[2]!.attributes('aria-current')).toBeUndefined(); // inactive
  });

  it('should render all step states', () => {
    const allStates: StepperStep[] = [
      { title: 'Inactive', state: StepperState.inactive },
      { title: 'Active', state: StepperState.active },
      { title: 'Done', state: StepperState.done },
      { title: 'Error', state: StepperState.error },
      { title: 'Warning', state: StepperState.warning },
      { title: 'Info', state: StepperState.info },
      { title: 'Success', state: StepperState.success },
    ];

    wrapper = createWrapper({ props: { steps: allStates } });

    const items = wrapper.findAll('[role="listitem"]');
    expect(items).toHaveLength(7);
    expectToHaveClass(items[0]!.element, /_inactive_/);
    expectToHaveClass(items[1]!.element, /_active_/);
    expectToHaveClass(items[2]!.element, /_done_/);
    expectToHaveClass(items[3]!.element, /_error_/);
    expectToHaveClass(items[4]!.element, /_warning_/);
    expectToHaveClass(items[5]!.element, /_info_/);
    expectToHaveClass(items[6]!.element, /_success_/);
  });

  it('should auto-assign step states when step prop is provided', () => {
    const plainSteps: StepperStep[] = [
      { title: 'Step 1' },
      { title: 'Step 2' },
      { title: 'Step 3' },
    ];

    wrapper = createWrapper({ props: { steps: plainSteps, step: 2 } });

    const items = wrapper.findAll('[role="listitem"]');
    expectToHaveClass(items[0]!.element, /_done_/);
    expectToHaveClass(items[1]!.element, /_active_/);
    expect(items[1]!.attributes('aria-current')).toBe('step');
    expectToHaveClass(items[2]!.element, /_inactive_/);
  });

  it('should render vertical orientation', () => {
    wrapper = createWrapper({
      props: { steps, orientation: StepperOrientation.vertical },
    });

    expectToHaveClass(wrapper.element, /_vertical_/);
  });

  it('should render custom stepper variant', () => {
    wrapper = createWrapper({
      props: { steps, custom: true },
    });

    expectToHaveClass(wrapper.element, /_custom_/);
  });

  it('should apply titleClass and subtitleClass when custom', () => {
    wrapper = createWrapper({
      props: {
        steps,
        custom: true,
        titleClass: 'text-rui-primary',
        subtitleClass: 'text-rui-info',
      },
    });

    const firstStep = wrapper.findAll('[role="listitem"]')[0]!;
    const label = firstStep.find('div[class*=label]');
    const spans = label.findAll('span');
    expect(spans[0]!.classes()).toContain('text-rui-primary');
    expect(spans[1]!.classes()).toContain('text-rui-info');
  });

  it('should render loading indicator on step', () => {
    const loadingSteps: StepperStep[] = [
      { title: 'Loading', state: StepperState.active, loading: true },
      { title: 'Idle', state: StepperState.inactive },
    ];

    wrapper = createWrapper({ props: { steps: loadingSteps } });

    const items = wrapper.findAll('[role="listitem"]');
    expect(items[0]!.find('[class*=indeterminate]').exists()).toBeTruthy();
    expect(items[1]!.find('[class*=indeterminate]').exists()).toBeFalsy();
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: { steps },
    });
    expectToHaveClass(wrapper.element, /_horizontal_/);

    await wrapper.setProps({ orientation: StepperOrientation.vertical });
    expectToHaveClass(wrapper.element, /_vertical_/);

    await wrapper.setProps({ iconTop: true });
    expectToHaveClass(wrapper.element, /_icon-top_/);
  });
});
