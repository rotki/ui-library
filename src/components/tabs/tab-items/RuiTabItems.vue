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

const children = computed(() => {
  const slotContent = slots.default?.() ?? [];

  // When using dynamic content with v-for the slot content is a single fragment
  // containing the children components.
  const tabs = slotContent.length === 1 && slotContent[0].type === Fragment
    ? Array.isArray(slotContent[0].children) ? slotContent[0].children.filter(isVNode) : []
    : slotContent;

  let anyActive = false;
  const children = tabs.map((tab, index) => {
    const value = tab.props?.value ?? index;
    const active = get(modelValue) === value;
    if (active) {
      anyActive = true;
      set(reverse, index < get(currIndex));
      set(currIndex, index);
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
  @apply grow transition-all;
  height: calc(v-bind(innerHeight) * 1px);
}
</style>
