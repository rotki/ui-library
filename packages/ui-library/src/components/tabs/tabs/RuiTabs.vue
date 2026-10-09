<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode, type VNode } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type TabAlignment, type TabIndicatorPosition, TabLayout, TabVariant } from '@/components/tabs/tab-props';
import { useTabIndicator } from '@/components/tabs/tabs/use-tab-indicator';
import { useTabKeyboard } from '@/components/tabs/tabs/use-tab-keyboard';
import { useTabRouting } from '@/components/tabs/tabs/use-tab-routing';
import { useTabScroll } from '@/components/tabs/tabs/use-tab-scroll';
import { tv } from '@/utils/tv';

type ChildNode = VNode & { props: Record<string, any> };

interface ResolvedTabProps {
  value?: string | number;
  to?: unknown;
  link?: boolean;
  exact?: boolean;
}

export interface Props {
  color?: ContextColorsType;
  vertical?: boolean;
  disabled?: boolean;
  grow?: boolean;
  align?: TabAlignment;
  indicatorPosition?: TabIndicatorPosition;
  variant?: TabVariant;
}

defineOptions({
  name: 'RuiTabs',
});

/**
 * The selected tab, defaulting to the first one. The default also narrows the
 * `update:modelValue` payload to `number | string`, so a consumer's handler
 * needs no undefined in its signature.
 */
const modelValue = defineModel<number | string>({ default: 0 });

const {
  color,
  vertical = false,
  disabled = false,
  grow = false,
  align = 'center',
  indicatorPosition = 'end',
  variant = TabVariant.underline,
} = defineProps<Props>();

const internalModelValue = ref<string | number>();
const bar = useTemplateRef<HTMLDivElement>('bar');
const wrapper = useTemplateRef<HTMLDivElement>('wrapper');

/**
 * The bar. The underline variant draws its 1px track as a `before` line along
 * the whole root, so the arrows sit on it too, and the 2px indicator, a layer
 * above, covers it under the active tab.
 */
const tabs = tv({
  slots: {
    root: '',
    arrow: 'flex shrink-0 items-center justify-center',
    bar: 'no-scrollbar relative max-h-full overflow-auto',
    wrapper: 'inline-flex max-w-none',
    indicator: 'pointer-events-none absolute',
  },
  variants: {
    variant: {
      [TabVariant.underline]: {
        root: `relative before:pointer-events-none before:absolute before:bg-rui-divider before:content-['']`,
        indicator: 'z-1 bg-rui-primary',
      },
      [TabVariant.segmented]: {
        // neutral-200, not 100: on a near-white page (`#fafafa`) the lighter track all but disappeared
        root: 'rounded-rui-panel bg-rui-neutral-200 p-0.5 dark:bg-rui-neutral-800',
        wrapper: 'gap-0.5',
        indicator: 'rounded-rui-control bg-rui-surface shadow-rui-control dark:bg-rui-neutral-700',
      },
    },
    layout: {
      [TabLayout.horizontal]: { root: 'flex h-fit', arrow: 'w-8' },
      [TabLayout.vertical]: { root: 'inline-flex flex-col', arrow: 'h-8 w-full', wrapper: 'flex-col w-full' },
    },
    indicatorPosition: {
      start: {},
      end: {},
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
    wide: {
      true: { bar: 'w-full', wrapper: 'min-w-full' },
      false: {},
    },
    animated: {
      true: { indicator: 'transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none' },
      false: {},
    },
  },
  compoundVariants: [
    { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'end', class: { root: 'before:inset-x-0 before:bottom-0 before:h-px', indicator: 'bottom-0 h-0.5 rounded-t-full' } },
    { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'start', class: { root: 'before:inset-x-0 before:top-0 before:h-px', indicator: 'top-0 h-0.5 rounded-b-full' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, indicatorPosition: 'end', class: { root: 'before:inset-y-0 before:right-0 before:w-px', indicator: 'right-0 w-0.5 rounded-l-full' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, indicatorPosition: 'start', class: { root: 'before:inset-y-0 before:left-0 before:w-px', indicator: 'left-0 w-0.5 rounded-r-full' } },
    // the underline track spans its row, while a segmented control hugs its options unless it grows
    { variant: TabVariant.segmented, layout: TabLayout.horizontal, wide: false, class: { root: 'w-fit max-w-full' } },
    // `color` picks the underline's color; the segmented pill stays a neutral surface
    { variant: TabVariant.underline, color: 'secondary', class: { indicator: 'bg-rui-secondary' } },
    { variant: TabVariant.underline, color: 'error', class: { indicator: 'bg-rui-error' } },
    { variant: TabVariant.underline, color: 'warning', class: { indicator: 'bg-rui-warning' } },
    { variant: TabVariant.underline, color: 'info', class: { indicator: 'bg-rui-info' } },
    { variant: TabVariant.underline, color: 'success', class: { indicator: 'bg-rui-success' } },
  ],
  defaultVariants: { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'end' },
});

const slots = useSlots();

const {
  showArrows,
  prevArrowDisabled,
  nextArrowDisabled,
  onPrevSliderClick,
  onNextSliderClick,
  keepActiveTabVisible,
} = useTabScroll({ bar, wrapper, vertical: () => vertical });

const { resolveRoute, isPathMatch } = useTabRouting({
  onRouteChange: () => applyNewValue(true),
});

const { onKeydown } = useTabKeyboard({ wrapper, vertical: () => vertical });

const { style: indicatorStyle, animated, update: updateIndicator } = useTabIndicator({
  bar,
  wrapper,
  vertical: () => vertical,
  variant: () => variant,
});

const layout = computed<TabLayout>(() => vertical ? TabLayout.vertical : TabLayout.horizontal);
const ui = computed<ReturnType<typeof tabs>>(() => tabs({
  variant,
  layout: get(layout),
  indicatorPosition,
  color,
  wide: vertical || grow,
  animated: get(animated),
}));

const children = computed<ChildNode[]>(() => {
  const slotContent = slots.default?.() ?? [];

  const tabs = getChildrenTabs(slotContent);

  const currentModelValue = get(internalModelValue);
  const inheritedProps = {
    color,
    grow,
    disabled,
    vertical,
    align,
    indicatorPosition,
    variant,
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

/**
 * Unwraps the fragments a `v-for` in the slot produces, so only tabs come
 * back.
 *
 * @param children - the slot's vnodes
 * @returns the tabs among them
 */
function getChildrenTabs(children: VNode[]): VNode[] {
  return children.flatMap((item) => {
    if (item.type === Fragment && Array.isArray(item.children) && item.children.length > 0)
      return getChildrenTabs(item.children.filter(isVNode));

    return [item];
  }).flat();
}

function updateModelValue(newModelValue: string | number): void {
  set(modelValue, newModelValue);
  set(internalModelValue, newModelValue);
}

function getTabRouteProps(props: Record<string, unknown>): ResolvedTabProps {
  return {
    value: typeof props.value === 'string' || typeof props.value === 'number' ? props.value : undefined,
    to: props.to ?? undefined,
    link: typeof props.link === 'boolean' ? props.link : undefined,
    exact: typeof props.exact === 'boolean' ? props.exact : undefined,
  };
}

function resolveActiveValue(onlyLink: boolean): string | number | undefined {
  const enabledChildren = get(children).filter(child => !child.props?.disabled);
  if (enabledChildren.length === 0)
    return undefined;

  let result: string | number = get(modelValue) || 0;
  enabledChildren.forEach((child, index) => {
    const tabProps = getTabRouteProps(child.props);
    if (!onlyLink && index === 0 && tabProps.value)
      result = tabProps.value;

    const fullPath = resolveRoute(tabProps.to);

    if (tabProps.link !== false && fullPath && isPathMatch(fullPath, tabProps))
      result = fullPath;
  });
  return result;
}

function applyNewValue(onlyLink = false): void {
  const value = resolveActiveValue(onlyLink);
  if (value !== undefined)
    updateModelValue(value);

  keepActiveTabVisible();
}

watchImmediate(() => get(modelValue), (modelValue) => {
  set(internalModelValue, modelValue);
});

watch(internalModelValue, () => {
  keepActiveTabVisible();
});

watch(() => [vertical, variant, grow, align], () => nextTick(updateIndicator), { flush: 'post' });

onMounted(() => {
  if (get(modelValue) !== undefined)
    return;

  applyNewValue();
});
</script>

<template>
  <div
    :class="ui.root()"
    :data-vertical="vertical || undefined"
  >
    <div
      v-if="showArrows"
      :class="ui.arrow()"
    >
      <RuiButton
        variant="text"
        icon
        size="sm"
        tabindex="-1"
        :disabled="prevArrowDisabled"
        @click="onPrevSliderClick()"
      >
        <RuiIcon :name="vertical ? 'lu-chevron-up' : 'lu-chevron-left'" />
      </RuiButton>
    </div>
    <div
      ref="bar"
      :class="ui.bar()"
    >
      <span
        v-if="indicatorStyle"
        aria-hidden="true"
        data-id="tabs-indicator"
        :class="ui.indicator()"
        :style="indicatorStyle"
      />
      <div
        ref="wrapper"
        role="tablist"
        data-id="tabs-wrapper"
        :aria-orientation="vertical ? 'vertical' : undefined"
        :class="ui.wrapper()"
        @keydown="onKeydown($event)"
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
      :class="ui.arrow()"
    >
      <RuiButton
        variant="text"
        icon
        size="sm"
        tabindex="-1"
        :disabled="nextArrowDisabled"
        @click="onNextSliderClick()"
      >
        <RuiIcon :name="vertical ? 'lu-chevron-down' : 'lu-chevron-right'" />
      </RuiButton>
    </div>
  </div>
</template>
