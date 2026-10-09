<script lang="ts" setup>
import { Fragment, isVNode } from 'vue';

export interface Props {
  multiple?: boolean;
}

defineOptions({
  name: 'RuiAccordions',
  inheritAttrs: false,
});

const modelValue = defineModel<number[] | number>({ default: -1 });

const { multiple = false } = defineProps<Props>();

const internalValue = ref<number[] | number>();

const slots = useSlots();

/**
 * Unwraps the Fragments a `v-for` or `<template>` makes, so each accordion gets its own index.
 * The placeholder a false `v-if` leaves keeps its index, so hiding one does not renumber the rest.
 *
 * @param nodes - the slot's top-level vnodes
 * @returns the accordions in order
 */
function flattenSlotContent(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children))
      return flattenSlotContent(node.children.filter(isVNode));

    return [node];
  });
}

const children = computed<VNode[]>(() => {
  const accordions = flattenSlotContent(slots.default?.() ?? []);
  const currentValue = get(internalValue);

  return accordions.map((accordion, index) => {
    const open =
      multiple && Array.isArray(currentValue)
        ? currentValue.includes(index)
        : currentValue === index;

    return {
      ...accordion,
      props: {
        open,
        ...accordion.props,
      },
    };
  });
});

function updateValue(newModelValue: number): void {
  let newValue: number[] | number;
  const internal = get(internalValue);
  if (multiple && Array.isArray(internal)) {
    const temp = [...internal];
    const index = temp.indexOf(newModelValue);
    if (index === -1)
      temp.push(newModelValue);
    else temp.splice(index, 1);
    newValue = temp;
  }
  else {
    if (internal === newModelValue)
      newValue = -1;
    else newValue = newModelValue;
  }
  set(modelValue, newValue);
  set(internalValue, newValue);
}

watch(
  [modelValue, () => multiple],
  ([value, isMultiple]) => {
    let internal: number | number[] = value;
    if (isMultiple && !Array.isArray(internal))
      internal = internal === -1 ? [] : [internal];
    else if (!isMultiple && Array.isArray(internal))
      internal = internal[0] ?? -1;

    set(internalValue, internal);
  },
  { immediate: true },
);
</script>

<template>
  <div v-bind="$attrs">
    <Component
      :is="child"
      v-for="(child, i) in children"
      :key="i"
      @click="updateValue(i)"
    />
  </div>
</template>
