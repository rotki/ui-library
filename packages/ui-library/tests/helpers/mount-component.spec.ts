import { describe, expect, it } from 'vitest';
import { defineComponent, h, inject, type Plugin } from 'vue';
import { createMounter, mergeGlobalOptions, mergeMountingOptions } from '~/tests/helpers/mount-component';

const first: Plugin = { install: (): void => {} };
const second: Plugin = { install: (): void => {} };
const key = Symbol('key');
const A = defineComponent({ render: () => h('a') });
const B = defineComponent({ render: () => h('b') });
const B2 = defineComponent({ render: () => h('em') });

describe('tests/helpers/mount-component', () => {
  describe('mergeGlobalOptions', () => {
    it('should combine stubs given as arrays and as objects, the override winning per key', () => {
      const stub = defineComponent({ render: () => h('i') });

      expect(mergeGlobalOptions(
        { stubs: ['rui-icon', 'rui-progress'] },
        { stubs: { 'rui-button': stub, 'rui-progress': false } },
      ).stubs).toEqual({ 'rui-button': stub, 'rui-icon': true, 'rui-progress': false });
    });

    it('should merge provide per key, symbol keys included', () => {
      expect(mergeGlobalOptions(
        { provide: { [key]: 'default', other: 1 } },
        { provide: { [key]: 'override' } },
      ).provide).toEqual({ [key]: 'override', other: 1 });
    });

    it('should run the default plugins before the override plugins', () => {
      expect(mergeGlobalOptions({ plugins: [first] }, { plugins: [second] }).plugins).toEqual([first, second]);
    });

    it('should merge components, directives and mocks per key', () => {
      const merged = mergeGlobalOptions(
        { components: { A, B }, directives: { focus: {} }, mocks: { $t: 'default' } },
        { components: { B: B2 }, directives: { tooltip: {} }, mocks: { $t: 'override' } },
      );

      expect(merged.components).toEqual({ A, B: B2 });
      expect(merged.directives).toEqual({ focus: {}, tooltip: {} });
      expect(merged.mocks).toEqual({ $t: 'override' });
    });

    it('should let the override replace scalar options', () => {
      expect(mergeGlobalOptions(
        { renderStubDefaultSlot: false },
        { renderStubDefaultSlot: true },
      ).renderStubDefaultSlot).toBe(true);
    });
  });

  describe('mergeMountingOptions', () => {
    it('should merge props, attrs and slots per key, the test winning', () => {
      const merged = mergeMountingOptions(
        { attrs: { id: 'a', title: 't' }, props: { color: 'primary', size: 'sm' }, slots: { default: 'd', header: 'h' } },
        { attrs: { id: 'b' }, props: { size: 'lg' }, slots: { header: 'H' } },
      );

      expect(merged.attrs).toEqual({ id: 'b', title: 't' });
      expect(merged.props).toEqual({ color: 'primary', size: 'lg' });
      expect(merged.slots).toEqual({ default: 'd', header: 'H' });
    });

    it('should keep the defaults when the test passes no options', () => {
      const merged = mergeMountingOptions({ global: { stubs: ['rui-icon'] }, props: { color: 'primary' } });

      expect(merged.global?.stubs).toEqual({ 'rui-icon': true });
      expect(merged.props).toEqual({ color: 'primary' });
    });

    it('should keep the default global options when the test passes its own', () => {
      const merged = mergeMountingOptions(
        { global: { provide: { [key]: 'default' }, stubs: ['rui-icon'] } },
        { global: { stubs: ['rui-progress'] } },
      );

      expect(merged.global?.stubs).toEqual({ 'rui-icon': true, 'rui-progress': true });
      expect(merged.global?.provide).toEqual({ [key]: 'default' });
    });

    it('should let the test replace any other option', () => {
      const target = document.createElement('div');

      expect(mergeMountingOptions({ shallow: false }, { attachTo: target, shallow: true })).toMatchObject({
        attachTo: target,
        shallow: true,
      });
    });
  });

  describe('createMounter', () => {
    const Probe = defineComponent({
      props: {
        label: { default: '', type: String },
        size: { default: 'md', type: String },
      },
      setup(props) {
        const injected = inject(key, 'none');
        return (): ReturnType<typeof h> => h('div', `${props.label}:${props.size}:${injected}`);
      },
    });

    it('should mount with the defaults merged under the test options', () => {
      const createWrapper = createMounter(Probe, {
        global: { provide: { [key]: 'provided' } },
        props: { label: 'default', size: 'sm' },
      });

      expect(createWrapper().text()).toBe('default:sm:provided');
      expect(createWrapper({ props: { size: 'lg' } }).text()).toBe('default:lg:provided');
      expect(createWrapper({ global: { provide: { [key]: 'test' } } }).text()).toBe('default:sm:test');
    });
  });
});
