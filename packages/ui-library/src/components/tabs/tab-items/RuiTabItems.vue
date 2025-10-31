<script lang="ts" setup generic='T extends string | number'>
import { Fragment, isVNode } from 'vue';

export interface Props<T> {
  modelValue?: T;
}

defineOptions({
  name: 'RuiTabItems',
  inheritAttrs: false,
});

const modelValue = defineModel<Props<T>['modelValue']>();

const slots = useSlots();
const reverse = ref<boolean>(false);
const currIndex = ref<number>(-1);
const activeIndex = ref<number>(-1);

watch(currIndex, (index) => {
  nextTick(() => {
    set(activeIndex, index);
  });
});

// When using dynamic content with v-for the slot content can contain fragment,
// Go through the fragment and always return RuiTabItem only
function getChildrenTabs(children: VNode[]): VNode[] {
  return children.flatMap((item) => {
    if (item.type === Fragment && Array.isArray(item.children) && item.children.length > 0)
      return getChildrenTabs(item.children.filter(isVNode));

    return [item];
  }).flat();
}

const children = computed(() => {
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

const wrapper = ref<HTMLDivElement>();
const inner = ref<HTMLDivElement>();

const { height: innerHeight } = useElementSize(inner);
</script>

<template>
  <div
    ref="wrapper"
    :class="$style.tabs"
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

<style lang="scss" module>
.tabs {
  @apply grow transition-all overflow-hidden;
  height: calc(v-bind(innerHeight) * 1px);
}
</style>
