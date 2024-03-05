<script lang="ts" setup>
import Icon from '@/components/icons/Icon.vue';

export interface AccordionProps {
  open?: boolean;
  eager?: boolean;
  headerGrow?: boolean;
  headerClass?: string;
  contentClass?: string;
}

defineOptions({
  name: 'RuiAccordion',
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
const css = useCssModule();

const slots = useSlots();
</script>

<template>
  <div
    class="accordion"
    :class="[css.accordion, { [css.open]: open }]"
  >
    <div
      v-if="slots.header"
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
        :class="css.icon"
        name="arrow-down-s-line"
      />
    </div>
    <div
      v-if="open || eager"
      :class="[contentClass, css.accordion__content]"
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
