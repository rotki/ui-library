<script lang="ts" setup>
import { get } from '@vueuse/shared';
import { Comment, defineComponent, Fragment, Text, type VNode } from 'vue';
import {
  AVATAR_GROUP_SPACING_PX,
  avatarGroupInjectionKey,
  AvatarGroupSpacing,
  type AvatarSize,
  type AvatarVariant,
  resolveAvatarSizePx,
} from '@/components/avatars/avatar-props';
import RuiAvatar from '@/components/avatars/RuiAvatar.vue';
import { tv } from '@/utils/tv';

export interface Props {
  size?: AvatarSize | number;
  variant?: AvatarVariant;
  max?: number;
  total?: number;
  spacing?: AvatarGroupSpacing | number;
}

defineOptions({
  name: 'RuiAvatarGroup',
});

const {
  size,
  variant = 'circular',
  max,
  total,
  spacing = AvatarGroupSpacing.md,
} = defineProps<Props>();

const slots = defineSlots<{
  default?: () => VNode[];
  surplus?: (props: { count: number }) => any;
}>();

const resolvedSize = computed<AvatarSize | number>(() => size ?? 'md');

const VNodeRenderer = defineComponent<{ vnode: VNode }>({
  props: ['vnode'],
  setup(props) {
    return (): VNode => props.vnode;
  },
});

provide(avatarGroupInjectionKey, computed(() => ({ size: get(resolvedSize), variant })));

const groupStyles = tv({
  slots: {
    root: 'inline-flex items-center isolate',
    item: 'relative ring-2 ring-white dark:ring-rui-grey-900 rounded-full',
  },
});

function flattenChildren(nodes: VNode[] | undefined): VNode[] {
  if (!nodes)
    return [];
  const out: VNode[] = [];
  for (const node of nodes) {
    if (node.type === Comment)
      continue;
    if (node.type === Text && typeof node.children === 'string' && node.children.trim() === '')
      continue;
    if (node.type === Fragment && Array.isArray(node.children)) {
      const inner = node.children.filter((c): c is VNode => typeof c === 'object' && c !== null && 'type' in c);
      out.push(...flattenChildren(inner));
      continue;
    }
    out.push(node);
  }
  return out;
}

const children = computed<VNode[]>(() => flattenChildren(slots.default?.()));

const visible = computed<VNode[]>(() => {
  if (max === undefined)
    return get(children);
  return get(children).slice(0, max);
});

const surplusCount = computed<number>(() => {
  const totalCount = total ?? get(children).length;
  const shown = get(visible).length;
  return Math.max(0, totalCount - shown);
});

const spacingPx = computed<number>(() => {
  if (typeof spacing === 'number')
    return spacing;
  return AVATAR_GROUP_SPACING_PX[spacing];
});

const ringOffsetPx = computed<number>(() =>
  // ring-2 is 2px. Keep items overlapping by the configured spacing
  // (negative margin). spacing is already negative for tokens.
  get(spacingPx),
);

const itemStyle = computed<Record<string, string>>(() => ({
  marginInlineStart: `${get(ringOffsetPx)}px`,
}));

const firstItemStyle = computed<Record<string, string>>(() => ({
  marginInlineStart: '0',
}));

const avatarPx = computed<number>(() => resolveAvatarSizePx(get(resolvedSize)));

const ui = computed<ReturnType<typeof groupStyles>>(() => groupStyles());
</script>

<template>
  <div
    :class="ui.root()"
    data-id="avatar-group"
    :data-size="typeof resolvedSize === 'string' ? resolvedSize : undefined"
    :data-variant="variant"
  >
    <span
      v-for="(child, index) in visible"
      :key="child.key ?? index"
      :class="ui.item()"
      :style="index === 0 ? firstItemStyle : itemStyle"
    >
      <VNodeRenderer :vnode="child" />
    </span>
    <span
      v-if="surplusCount > 0"
      :class="ui.item()"
      :style="visible.length === 0 ? firstItemStyle : itemStyle"
      data-id="avatar-group-surplus"
    >
      <slot
        name="surplus"
        :count="surplusCount"
      >
        <RuiAvatar
          :size="resolvedSize"
          :variant="variant"
          :alt="`+${surplusCount} more`"
          :style="{ width: `${avatarPx}px`, height: `${avatarPx}px` }"
        >
          <span class="leading-none">+{{ surplusCount }}</span>
        </RuiAvatar>
      </slot>
    </span>
  </div>
</template>
