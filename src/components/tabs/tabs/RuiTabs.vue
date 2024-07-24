<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { throttleFilter } from '@vueuse/shared';
import { Fragment, type VNode, isVNode } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import type { Props as TabProps } from '@/components/tabs/tab/RuiTab.vue';
import type { ContextColorsType } from '@/consts/colors';

export interface Props {
  color?: ContextColorsType;
  vertical?: boolean;
  disabled?: boolean;
  grow?: boolean;
  modelValue?: number | string;
  align?: 'start' | 'center' | 'end';
}

defineOptions({
  name: 'RuiTabs',
});

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  vertical: false,
  disabled: false,
  grow: false,
  modelValue: undefined,
  align: 'center',
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: number | string): void;
}>();

const { color, grow, modelValue, disabled, vertical, align } = toRefs(props);

const internalModelValue = ref();
const bar = ref<HTMLDivElement>();
const wrapper = ref<HTMLDivElement>();
const showArrows: Ref<boolean> = ref(false);

// When using dynamic content with v-for the slot content can contain fragment,
// Go through the fragment and always return RuiTab only
function getChildrenTabs(children: VNode[]): VNode[] {
  return children.flatMap((item) => {
    if (item.type === Fragment && Array.isArray(item.children) && item.children.length > 0)
      return getChildrenTabs(item.children.filter(isVNode));

    return [item];
  }).flat();
}

const slots = useSlots();
const children = computed(() => {
  const slotContent = slots.default?.() ?? [];

  const tabs = getChildrenTabs(slotContent);

  const currentModelValue = get(internalModelValue);
  const inheritedProps = {
    color: get(color),
    grow: get(grow),
    disabled: get(disabled),
    vertical: get(vertical),
    align: get(align),
  };
  return tabs.map((tab, index) => {
    let tabValue = tab.props?.value ?? index;
    if (tab.props?.link !== false && tab.props?.to)
      tabValue = tab.props.to;

    const active = currentModelValue === tabValue;
    return {
      ...tab,
      props: {
        value: tabValue,
        active,
        ...inheritedProps,
        ...tab.props,
      },
    };
  });
});

function updateModelValue(newModelValue: string | number) {
  emit('update:modelValue', newModelValue);
  set(internalModelValue, newModelValue);
}

const route = useRoute();

function isPathMatch(path: string, { exactPath, exact }: { exactPath?: boolean; exact?: boolean }) {
  const currentRoute = route.fullPath;

  if (exactPath)
    return currentRoute === path;

  const routeWithoutQueryParams = new URL(path, window.location.origin)
    .pathname;

  if (exact)
    return currentRoute === routeWithoutQueryParams;

  return currentRoute.startsWith(routeWithoutQueryParams);
}

function keepActiveTabVisible() {
  nextTick(() => {
    if (!get(showArrows))
      return;

    const elem = get(wrapper);
    const barElem = get(bar);
    if (elem) {
      const activeTab = (elem.querySelector('.active-tab')
        ?? elem.querySelector('.active-tab-link')) as HTMLElement;

      if (!activeTab || !barElem)
        return;

      const childLeft = activeTab.offsetLeft - elem.offsetLeft;
      const childTop = activeTab.offsetTop - elem.offsetTop;
      const childWidth = activeTab.offsetWidth;
      const childHeight = activeTab.offsetHeight;
      const parentScrollLeft = barElem.scrollLeft;
      const parentScrollTop = barElem.scrollTop;
      const parentWidth = barElem.offsetWidth;
      const parentHeight = barElem.offsetHeight;

      const scrollLeft = Math.max(
        Math.min(parentScrollLeft, childLeft),
        childLeft + childWidth - parentWidth,
      );

      const scrollTop = Math.max(
        Math.min(parentScrollTop, childTop),
        childTop + childHeight - parentHeight,
      );

      barElem.scrollTo({
        left: scrollLeft,
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  });
}

function applyNewValue(onlyLink = false) {
  const enabledChildren = get(children).filter(
    child => !child.props.disabled,
  );
  if (enabledChildren.length > 0) {
    let newModelValue: string | number = get(modelValue) || 0;
    enabledChildren.forEach((child, index) => {
      const props = child.props as TabProps;
      if (!onlyLink && index === 0 && props.value)
        newModelValue = props.value;

      if (props.link !== false && props.to && isPathMatch(props.to, props))
        newModelValue = props.to;
    });
    updateModelValue(newModelValue);
  }
  keepActiveTabVisible();
}

onMounted(() => {
  if (get(modelValue) !== undefined)
    return;

  applyNewValue();
});

watch(route, () => {
  applyNewValue(true);
});

const css = useCssModule();

const { width, height } = useElementSize(bar);
const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapper);
const { arrivedState, x, y } = useScroll(bar, { behavior: 'smooth' });

const { top, bottom, left, right } = toRefs(arrivedState);

const { trigger: triggerHorizontal, stop: stopHorizontal } = watchTriggerable(
  [wrapperWidth, width],
  ([ww, w]) => {
    if (w > 0)
      set(showArrows, ww > w);
  },
  {
    eventFilter: throttleFilter(50),
  },
);

const { trigger: triggerVertical, stop: stopVertical } = watchTriggerable(
  [wrapperHeight, height],
  ([wh, h]) => {
    if (h > 0)
      set(showArrows, wh > h);
  },
  {
    eventFilter: throttleFilter(500),
  },
);

watchImmediate(vertical, (vertical) => {
  if (vertical) {
    triggerVertical();
    stopHorizontal();
  }
  else {
    triggerHorizontal();
    stopVertical();
  }
});

const prevArrowDisabled = computed(() => {
  if (!get(vertical))
    return get(left);

  return get(top);
});

const nextArrowDisabled = computed(() => {
  if (!get(vertical))
    return get(right);

  return get(bottom);
});

function onPrevSliderClick() {
  if (!get(vertical))
    set(x, get(x) - get(width));
  else
    set(y, get(y) - get(height));
}

function onNextSliderClick() {
  if (!get(vertical))
    set(x, get(x) + get(width));
  else
    set(y, get(y) + get(height));
}

useResizeObserver(bar, () => {
  keepActiveTabVisible();
});

watchImmediate(modelValue, (modelValue) => {
  set(internalModelValue, modelValue);
});

watch(internalModelValue, () => {
  keepActiveTabVisible();
});
</script>

<template>
  <div :class="[css.tabs, { [css['tabs--vertical']]: vertical }]">
    <div
      v-if="showArrows"
      :class="[css.arrow, { [css['arrow--vertical']]: vertical }]"
    >
      <RuiButton
        class="w-full h-full !rounded-none"
        variant="text"
        :color="color"
        :disabled="prevArrowDisabled"
        @click="onPrevSliderClick()"
      >
        <RuiIcon :name="vertical ? 'arrow-up-s-line' : 'arrow-left-s-line'" />
      </RuiButton>
    </div>
    <div
      ref="bar"
      class="no-scrollbar"
      :class="[
        css['tabs-bar'],
        { [css['tabs-bar--vertical']]: vertical },
        { [css['tabs-bar--grow']]: grow },
      ]"
    >
      <div
        ref="wrapper"
        role="tablist"
        :class="[
          css['tabs-wrapper'],
          { [css['tabs-wrapper--vertical']]: vertical },
          { [css['tabs-wrapper--grow']]: grow },
        ]"
      >
        <Component
          :is="child"
          v-for="(child, i) in children"
          :key="i"
          @click="updateModelValue($event)"
        />
      </div>
    </div>
    <div
      v-if="showArrows"
      :class="[css.arrow, { [css['arrow--vertical']]: vertical }]"
    >
      <RuiButton
        class="w-full h-full !rounded-none"
        variant="text"
        :color="color"
        :disabled="nextArrowDisabled"
        @click="onNextSliderClick()"
      >
        <RuiIcon :name="vertical ? 'arrow-down-s-line' : 'arrow-right-s-line'" />
      </RuiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
.tabs {
  @apply flex h-[2.625rem];

  &--vertical {
    @apply h-auto max-h-full flex-col;
  }

  &-bar {
    @apply max-h-full overflow-auto;

    &--vertical,
    &--grow {
      @apply w-full;
    }
  }

  &-wrapper {
    @apply h-full inline-flex max-w-none;

    &--vertical {
      @apply flex-col h-auto;
    }

    &--vertical,
    &--grow {
      @apply min-w-full;
    }
  }
}

.arrow {
  @apply h-full w-10;

  &--vertical {
    @apply min-h-[2.625rem] w-full h-auto;
  }
}
</style>
