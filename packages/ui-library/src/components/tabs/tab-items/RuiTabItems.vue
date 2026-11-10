<script lang="ts" setup generic="T extends string | number">
import type { ModelValueEmits } from '@/composables/prop-model';
import { Fragment, type HTMLAttributes, isVNode } from 'vue';
import { useClipWhileResizing } from '@/composables/clip-while-resizing';

defineOptions({
  name: 'RuiTabItems',
  inheritAttrs: false,
});

const { modelValue } = defineProps<{
  /** The tab whose panel is showing. */
  modelValue?: T;
} & /* @vue-ignore */ HTMLAttributes>();

/*
 * Declared so `v-model` binds the same ref RuiTabs updates. The panels only follow the model,
 * so the component never emits it.
 */
defineEmits<ModelValueEmits<T>>();

/**
 * The selected tab, the first one while the model is unbound or undefined, as in RuiTabs.
 * Without that fallback, binding both components to a ref that starts as `undefined` fails the
 * `active` check for every tab: the panel renders but stays at height 0, which reads as an
 * element with no content.
 */
const selected = computed<string | number>(() => modelValue ?? 0);

const slots = useSlots();

const currIndex = ref<number>(-1);
const activeIndex = ref<number>(-1);
const inner = useTemplateRef<HTMLDivElement>('inner');
const root = useTemplateRef<HTMLDivElement>('root');

const { height: innerHeight } = useElementSize(inner);

// clip only while the height follows a panel change, so sticky content inside a panel works
const clipped = useClipWhileResizing(root, () => get(innerHeight));

const children = computed<VNode[]>(() => {
  const slotContent = slots.default?.() ?? [];

  const tabs = getChildrenTabs(slotContent);

  let anyActive = false;
  const children = tabs.map((tab, index) => {
    const value = tab.props?.value ?? index;
    const active = get(selected) === value;
    if (active) {
      anyActive = true;
      if (index !== get(currIndex))
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
    ref="root"
    class="grow transition-[height] duration-200 ease-out motion-reduce:transition-none"
    :class="{ 'overflow-hidden': clipped }"
    :data-clipped="clipped || undefined"
    :style="{ height: `${innerHeight}px` }"
    v-bind="$attrs"
  >
    <div ref="inner">
      <component
        :is="child"
        v-for="(child, i) in children"
        :key="i"
        :active="i === activeIndex"
      />
    </div>
  </div>
</template>
