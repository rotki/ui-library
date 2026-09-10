<script lang="ts" setup generic="TItem">
import RuiButton from '@/components/buttons/button/RuiButton.vue';

export interface AutoCompleteOptionProps<TItem> {
  item: TItem;
  text: string | undefined;
  active: boolean;
  disabled: boolean;
  dense: boolean;
  highlighted: boolean;
  highlightedClass: string;
}

const {
  active,
  dense,
  disabled,
  highlighted,
  highlightedClass,
  item,
  text,
} = defineProps<AutoCompleteOptionProps<TItem>>();

const emit = defineEmits<{
  select: [item: TItem];
}>();

defineSlots<{
  prepend?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  default?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
  append?: (props: { disabled: boolean; item: TItem; active: boolean }) => any;
}>();

const slotProps = computed<{ disabled: boolean; item: TItem; active: boolean }>(() => ({
  active,
  disabled,
  item,
}));

function onClick(): void {
  if (!disabled)
    emit('select', item);
}
</script>

<template>
  <RuiButton
    :active="active"
    :aria-selected="active"
    :size="dense ? 'sm' : undefined"
    :disabled="disabled"
    tabindex="0"
    variant="list"
    :data-highlighted="highlighted"
    :data-disabled="disabled || undefined"
    :class="{ [highlightedClass]: !active && highlighted }"
    @click="onClick()"
  >
    <template #prepend>
      <slot
        name="prepend"
        v-bind="slotProps"
      />
    </template>
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
    <template #append>
      <slot
        name="append"
        v-bind="slotProps"
      />
    </template>
  </RuiButton>
</template>
