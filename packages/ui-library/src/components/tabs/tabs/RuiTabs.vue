<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode, type VNode } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type TabAlignment, type TabIndicatorPosition, TabLayout } from '@/components/tabs/tab-props';
import { useTabRouting } from '@/components/tabs/tabs/use-tab-routing';
import { useTabScroll } from '@/components/tabs/tabs/use-tab-scroll';
import { tv } from '@/utils/tv';

type ChildNode = VNode & { props: Record<string, any> };

interface ResolvedTabProps {
  value?: string | number;
  to?: unknown;
  link?: boolean;
  exact?: boolean;
  exactPath?: boolean;
}

export interface Props {
  color?: ContextColorsType;
  vertical?: boolean;
  disabled?: boolean;
  grow?: boolean;
  align?: TabAlignment;
  indicatorPosition?: TabIndicatorPosition;
}

defineOptions({
  name: 'RuiTabs',
});

const modelValue = defineModel<number | string>();

const {
  color,
  vertical = false,
  disabled = false,
  grow = false,
  align = 'center',
  indicatorPosition = 'end',
} = defineProps<Props>();

const internalModelValue = ref<string | number>();
const bar = useTemplateRef<HTMLDivElement>('bar');
const wrapper = useTemplateRef<HTMLDivElement>('wrapper');

const tabs = tv({
  slots: {
    root: '',
    arrow: '',
    bar: 'no-scrollbar max-h-full overflow-auto',
    wrapper: 'h-full inline-flex max-w-none',
  },
  variants: {
    layout: {
      [TabLayout.horizontal]: {
        root: 'flex h-fit',
        arrow: 'h-[3rem] w-10',
        bar: 'h-[3rem]',
        wrapper: '',
      },
      [TabLayout.vertical]: {
        root: 'inline-flex flex-col',
        arrow: 'min-h-[3rem] w-full',
        bar: '',
        wrapper: 'flex-col h-auto',
      },
    },
    wide: {
      true: {
        bar: 'w-full',
        wrapper: 'min-w-full',
      },
    },
  },
  defaultVariants: { layout: TabLayout.horizontal },
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

const layout = computed<TabLayout>(() => vertical ? TabLayout.vertical : TabLayout.horizontal);
const ui = computed<ReturnType<typeof tabs>>(() => tabs({ layout: get(layout), wide: vertical || grow }));

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

// When using dynamic content with v-for the slot content can contain fragment,
// Go through the fragment and always return RuiTab only
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
    exactPath: typeof props.exactPath === 'boolean' ? props.exactPath : undefined,
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
        class="w-full h-full !rounded-none"
        variant="text"
        :color="color"
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
      <div
        ref="wrapper"
        role="tablist"
        data-id="tabs-wrapper"
        :class="ui.wrapper()"
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
        class="w-full h-full !rounded-none"
        variant="text"
        :color="color"
        :disabled="nextArrowDisabled"
        @click="onNextSliderClick()"
      >
        <RuiIcon :name="vertical ? 'lu-chevron-down' : 'lu-chevron-right'" />
      </RuiButton>
    </div>
  </div>
</template>
