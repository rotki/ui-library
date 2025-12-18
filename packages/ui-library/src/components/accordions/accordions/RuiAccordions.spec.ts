import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Accordion from '@/components/accordions/accordion/RuiAccordion.vue';
import Accordions from '@/components/accordions/accordions/RuiAccordions.vue';
import { assert } from '@/utils/assert';

function createWrapper(
  options?: ComponentMountingOptions<typeof Accordions>,
): VueWrapper<InstanceType<typeof Accordions>> {
  return mount(Accordions, {
    ...options,
    global: {
      stubs: {
        Accordion,
      },
    },
    slots: {
      default: [
        {
          template: `
          <Accordion>
            <template #header>Accordion 1 Header</template>
            Accordion 1 Content
          </Accordion>
        `,
        },
        {
          template: `
          <Accordion>
            <template #header>Accordion 2 Header</template>
            Accordion 2 Content
          </Accordion>
        `,
        },
      ],
    },
  });
}

describe('components/accordions/accordions/RuiAccordions.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof Accordions>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const modelValue = ref();
    wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('[data-accordion]');
    expect(accordions).toHaveLength(2);
  });

  it('should work with multiple=`false`', async () => {
    const modelValue = ref();
    wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('[data-accordion]');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(0);
    expect(get(modelValue)).toBe(undefined);

    // Click first accordion
    const firstAccordionHeader = wrapper.findAll('[data-accordion-trigger]')[0];
    assert(firstAccordionHeader);
    await firstAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(0);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(1);
    expect(wrapper.find('[data-accordion-content]').text()).contains('Accordion 1 Content');

    // Click second accordion
    const secondAccordionHeader = wrapper.findAll('[data-accordion-trigger]')[1];
    assert(secondAccordionHeader);
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(1);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(1);
    expect(wrapper.find('[data-accordion-content]').text()).contains('Accordion 2 Content');

    // Click second accordion, it should be closed now
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(-1);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(0);
  });

  it('should work with multiple=`true`', async () => {
    const modelValue = ref();
    wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'multiple': true,
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    const accordions = wrapper.findAll('[data-accordion]');
    expect(accordions).toHaveLength(2);
    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(0);
    expect(get(modelValue)).toBe(undefined);

    // Click first accordion
    const firstAccordionHeader = wrapper.findAll('[data-accordion-trigger]')[0];
    assert(firstAccordionHeader);
    await firstAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0]);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(1);
    expect(wrapper.find('[data-accordion-content]').text()).contains('Accordion 1 Content');

    // Click second accordion, both should be opened
    const secondAccordionHeader = wrapper.findAll('[data-accordion-trigger]')[1];
    assert(secondAccordionHeader);
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0, 1]);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(2);

    // Click second accordion, only close this accordion
    await secondAccordionHeader.trigger('click');
    await nextTick();
    expect(get(modelValue)).toStrictEqual([0]);

    expect(wrapper.findAll('[data-accordion-content]')).toHaveLength(1);
    expect(wrapper.find('[data-accordion-content]').text()).contains('Accordion 1 Content');
  });
});
