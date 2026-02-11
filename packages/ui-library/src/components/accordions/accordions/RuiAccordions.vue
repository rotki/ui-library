<script lang="ts" setup>
export interface Props {
  multiple?: boolean;
}

defineOptions({
  name: 'RuiAccordions',
  inheritAttrs: false,
});

const modelValue = defineModel<number[] | number>({ default: -1 });

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
});

const { multiple } = toRefs(props);

const internalValue = ref();

const slots = useSlots();
const children = computed(() => {
  const accordions = slots.default?.() ?? [];
  const currentValue = get(internalValue);
  const multipleVal = get(multiple);

  return accordions.map((accordion, index) => {
    const open = multipleVal && Array.isArray(currentValue) ? currentValue.includes(index) : currentValue === index;

    return {
      ...accordion,
      props: {
        open,
        ...accordion.props,
      },
    };
  });
});

function updateValue(newModelValue: number) {
  let newValue: number[] | number;
  const internal = get(internalValue);
  if (get(multiple) && Array.isArray(internal)) {
    const temp = [...get(internal)];
    const index = temp.indexOf(newModelValue);
    if (index === -1)
      temp.push(newModelValue);
    else
      temp.splice(index, 1);
    newValue = temp;
  }
  else {
    if (internal === newModelValue)
      newValue = -1;
    else
      newValue = newModelValue;
  }
  set(modelValue, newValue);
  set(internalValue, newValue);
}

watch([modelValue, multiple], ([value, multiple]) => {
  let internal: number | number[] = value;
  if (multiple && !Array.isArray(internal))
    internal = internal === -1 ? [] : [internal];
  else if (!multiple && Array.isArray(internal))
    internal = internal[0] ?? -1;

  set(internalValue, internal);
}, { immediate: true });
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
