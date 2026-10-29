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
import { useKeyboardScroll } from '@/composables/keyboard-scroll';
import { tabsStyles } from './tabs-styles';

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
const barTabindex = useKeyboardScroll(bar);

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
const ui = computed<ReturnType<typeof tabsStyles>>(() => tabsStyles({
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
        aria-label="Scroll tabs back"
        :disabled="prevArrowDisabled"
        @click="onPrevSliderClick()"
      >
        <RuiIcon :name="vertical ? 'lu-chevron-up' : 'lu-chevron-left'" />
      </RuiButton>
    </div>
    <div
      ref="bar"
      :class="ui.bar()"
      :tabindex="barTabindex"
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
        aria-label="Scroll tabs forward"
        :disabled="nextArrowDisabled"
        @click="onNextSliderClick()"
      >
        <RuiIcon :name="vertical ? 'lu-chevron-down' : 'lu-chevron-right'" />
      </RuiButton>
    </div>
  </div>
</template>
