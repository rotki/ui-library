<script lang="ts" setup>
export interface Props {
  modelValue?: number | string;
}

defineOptions({
  name: 'RuiTabItems',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
});

const { modelValue } = toRefs(props);

const slots = useSlots();
const reverse: Ref<boolean> = ref(false);
const currIndex: Ref<number> = ref(-1);
const activeIndex: Ref<number> = ref(-1);

watch(currIndex, (index) => {
  nextTick(() => {
    set(activeIndex, index);
  });
});

const children = computed(() => {
  const tabs = slots.default?.() ?? [];
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

  if (!anyActive) {
    set(currIndex, -1);
  }

  return children;
});

const wrapper = ref<HTMLDivElement>();
const inner = ref<HTMLDivElement>();

const { height: innerHeight } = useElementSize(inner);
const css = useCssModule();
</script>

<template>
  <div ref="wrapper" :class="css.tabs">
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
