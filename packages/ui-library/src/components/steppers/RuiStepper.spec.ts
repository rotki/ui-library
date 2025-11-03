import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, it } from 'vitest';
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
