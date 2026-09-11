<script lang="ts" setup generic="T extends string | number">
import { Fragment, isVNode } from 'vue';

defineOptions({
  name: 'RuiTabItems',
  inheritAttrs: false,
});

/**
 * The tab whose panel is showing.
 *
 * The default matches RuiTabs. Without one, binding both components to the
 * same ref that starts as `undefined` leaves this component with
 * `modelValue === undefined`, so the `active = modelValue === value` check
 * fails for every tab: the panel renders but stays at height 0, which reads as
 * an element with no content.
 */
const modelValue = defineModel<T>({ default: () => 0 as T });

const slots = useSlots();

const reverse = ref<boolean>(false);
const currIndex = ref<number>(-1);
const activeIndex = ref<number>(-1);
const inner = useTemplateRef<HTMLDivElement>('inner');

const { height: innerHeight } = useElementSize(inner);

const children = computed<VNode[]>(() => {
  const slotContent = slots.default?.() ?? [];

  const tabs = getChildrenTabs(slotContent);

  let anyActive = false;
  const children = tabs.map((tab, index) => {
    const value = tab.props?.value ?? index;
    const active = get(modelValue) === value;
    if (active) {
      anyActive = true;
      if (index !== get(currIndex)) {
        set(reverse, index < get(currIndex));
        set(currIndex, index);
      }
    }

    return {
      ...tab,
      props: {
        value,
        ...tab.props,
      },
    };
  });

  if (!anyActive)
    set(currIndex, -1);

  return children;
});

/**
 * Unwraps the fragments a `v-for` in the slot produces, so only tab items come
 * back.
 *
 * @param children - the slot's vnodes
 * @returns the tab items among them
 */
function getChildrenTabs(children: VNode[]): VNode[] {
  return children
    .flatMap((item) => {
      if (item.type === Fragment && Array.isArray(item.children) && item.children.length > 0)
        return getChildrenTabs(item.children.filter(isVNode));

      return [item];
    })
    .flat();
}

watch(currIndex, (index) => {
  nextTick(() => {
    set(activeIndex, index);
  });
});
</script>

<template>
  <div
    class="grow transition-all overflow-hidden"
    :style="{ height: `${innerHeight}px` }"
    v-bind="$attrs"
  >
    <div ref="inner">
      <Component
        :is="child"
        v-for="(child, i) in children"
        :key="i"
        :reverse="reverse"
        :active="i === activeIndex"
      />
    </div>
  </div>
</template>
