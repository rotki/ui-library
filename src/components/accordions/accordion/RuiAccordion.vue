<script lang="ts" setup>
import Icon from '@/components/icons/RuiIcon.vue';

export interface AccordionProps {
  open?: boolean;
  eager?: boolean;
  headerGrow?: boolean;
  headerClass?: string;
  contentClass?: string;
}

defineOptions({
  name: 'RuiAccordion',
  inheritAttrs: false,
});

withDefaults(defineProps<AccordionProps>(), {
  open: false,
  eager: false,
  headerGrow: false,
  headerClass: '',
  contentClass: '',
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

function click() {
  emit('click');
}

const inner = ref<HTMLDivElement>();

const { height: innerHeight } = useElementSize(inner);
</script>

<template>
  <div
    class="accordion"
    :class="[$style.accordion, { [$style.open]: open }]"
    v-bind="$attrs"
  >
    <div
      v-if="$slots.header"
      class="accordion__header flex gap-2 items-center"
      :class="[headerClass, { 'w-full': headerGrow }]"
      role="button"
      @click="click()"
    >
      <div
        :class="{ grow: headerGrow }"
      >
        <slot
          name="header"
          :open="open"
        />
      </div>
      <Icon
        class="text-rui-text-secondary"
        :class="$style.icon"
        name="lu-chevron-down"
      />
    </div>
    <div
      v-if="open || eager"
      :class="[contentClass, $style.accordion__content]"
      class="accordion__content"
    >
      <div
        ref="inner"
      >
        <slot
          name="default"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.accordion {
  @apply flex flex-col items-start;

  &.open {
    .accordion {
      &__content {
        height: calc(v-bind(innerHeight) * 1px);
      }
    }

    .icon {
      @apply transform -rotate-180;
    }
  }

  &__content {
    @apply grow transition-all overflow-hidden h-0 w-full;
  }

  .icon {
    @apply transition-all;
  }
}
</style>
