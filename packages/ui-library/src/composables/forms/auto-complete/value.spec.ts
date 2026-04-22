import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref, shallowRef, toValue } from 'vue';
import { useAutoCompleteValue, type UseAutoCompleteValueDeps, type UseAutoCompleteValueOptions, type UseAutoCompleteValueReturn } from '@/composables/forms/auto-complete/value';

interface Harness<TValue, TItem> {
  result: UseAutoCompleteValueReturn<TItem>;
  modelValue: Ref<TValue | undefined>;
  options: ShallowRef<TItem[]>;
  updateInternalSearch: ReturnType<typeof vi.fn>;
  unmount: () => void;
}

function setup<TValue, TItem>(
  initialModelValue: TValue | undefined,
  initialOptions: TItem[],
  opts: UseAutoCompleteValueOptions<TItem>,
  depsOverride: Partial<UseAutoCompleteValueDeps<TItem>> = {},
): Harness<TValue, TItem> {
  const modelValue = ref(initialModelValue) as Ref<TValue | undefined>;
  const options = shallowRef<TItem[]>(initialOptions);
  const updateInternalSearch = vi.fn();
  let result!: UseAutoCompleteValueReturn<TItem>;

  const TestComponent = defineComponent({
    setup() {
      const keyAttr = toValue(opts.keyAttr);
      const deps: UseAutoCompleteValueDeps<TItem> = {
        getIdentifier: (item: any) => keyAttr ? item[keyAttr] : item,
        getText: (item: any) => keyAttr ? String(item[keyAttr]) : String(item),
        textValueToProperValue: (val: any, returnObject?: boolean) => {
          if (!keyAttr || returnObject)
            return val as TItem;
          return { [keyAttr]: val } as TItem;
        },
        shouldApplyValueAsSearch: true,
        isOpen: false,
        multiple: false,
        updateInternalSearch,
        ...depsOverride,
      };
      result = useAutoCompleteValue<TValue, TItem>(modelValue, options, opts, deps);
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);
  return { result, modelValue, options, updateInternalSearch, unmount: () => wrapper.unmount() };
}

describe('composables/forms/auto-complete/value', () => {
  let unmount: () => void;

  afterEach(() => {
    unmount?.();
  });

  it('should not throw when custom-value starts as an empty string', () => {
    expect(() => {
      const h = setup<string, string>('', ['apple', 'banana'], { customValue: true });
      unmount = h.unmount;
      expect(h.result.value.value).toEqual(['']);
    }).not.toThrow();
  });

  it('should not throw when custom-value starts as the number zero', () => {
    expect(() => {
      const h = setup<number, number>(0, [1, 2, 3], { customValue: true });
      unmount = h.unmount;
      expect(h.result.value.value).toEqual([0]);
    }).not.toThrow();
  });

  it('should treat null modelValue as empty selection', () => {
    const h = setup<string | null, string>(null, ['apple', 'banana'], { customValue: true });
    unmount = h.unmount;
    expect(h.result.value.value).toEqual([]);
  });

  it('should resolve modelValue that matches an option', () => {
    const h = setup<string, string>('apple', ['apple', 'banana'], {});
    unmount = h.unmount;
    expect(h.result.value.value).toEqual(['apple']);
  });

  it('should sync displayed text when options arrive after modelValue is set', async () => {
    // Reproduces the LoginForm race where loadSettings() sets username before
    // loadProfiles() populates the options list. The watcher must re-sync the
    // input text once options arrive and the value can be resolved — otherwise
    // the input renders empty while modelValue is still pointing at a valid
    // (now-existing) option.
    const h = setup<string, string>('alice', [], {});
    unmount = h.unmount;

    // Initial watch fires with empty options — value cannot resolve, search
    // gets cleared (called with no argument).
    expect(h.updateInternalSearch).toHaveBeenCalledTimes(1);
    expect(h.updateInternalSearch).toHaveBeenLastCalledWith();

    // Options arrive later; value should re-resolve and the displayed text
    // should be updated to the option's label.
    set(h.options, ['alice', 'bob']);
    await nextTick();

    expect(h.result.value.value).toEqual(['alice']);
    expect(h.updateInternalSearch).toHaveBeenLastCalledWith('alice');
  });

  it('should not throw when custom-value matches an empty-string option identifier', () => {
    interface Item { id: string; label: string }
    const options: Item[] = [{ id: '', label: 'Unknown' }, { id: 'a', label: 'Apple' }];
    expect(() => {
      const h = setup<string, Item>('', options, { customValue: true, keyAttr: 'id' });
      unmount = h.unmount;
      expect(h.result.value.value).toEqual([{ id: '', label: 'Unknown' }]);
    }).not.toThrow();
  });
});
