<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import { get, set } from '@vueuse/shared';
import {
  type AvatarSize,
  type AvatarVariant,
  computeInitials,
  resolveAvatarIconPx,
  resolveAvatarSizePx,
} from '@/components/avatars/avatar-props';
import { useAvatarGroup } from '@/components/avatars/use-avatar-group';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { tv } from '@/utils/tv';

export interface Props {
  src?: string | null;
  alt?: string;
  text?: string | null;
  icon?: RuiIcons | null;
  size?: AvatarSize | number;
  variant?: AvatarVariant;
  color?: 'default' | ContextColorsType;
  loading?: 'lazy' | 'eager';
}

defineOptions({
  name: 'RuiAvatar',
});

const {
  src = null,
  alt = '',
  text = null,
  icon = null,
  size,
  variant,
  color = 'default',
  loading = 'lazy',
} = defineProps<Props>();

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
}>();

const slots = defineSlots<{
  default?: () => any;
}>();

const group = useAvatarGroup();

const resolvedSize = computed<AvatarSize | number>(() => {
  if (size !== undefined)
    return size;
  if (group)
    return get(group).size;
  return 'md';
});

const resolvedVariant = computed<AvatarVariant>(() => {
  if (variant !== undefined)
    return variant;
  if (group)
    return get(group).variant;
  return 'circular';
});

const sizeToken = computed<AvatarSize | undefined>(() => {
  const value = get(resolvedSize);
  return typeof value === 'string' ? value : undefined;
});

const sizePx = computed<number>(() => resolveAvatarSizePx(get(resolvedSize)));
const iconPx = computed<number>(() => resolveAvatarIconPx(get(resolvedSize)));

const errored = ref<boolean>(false);

watch(() => src, () => {
  set(errored, false);
});

const initials = computed<string>(() => {
  const explicit = computeInitials(text ?? undefined);
  if (explicit)
    return explicit;
  return computeInitials(alt);
});

type DisplayMode = 'image' | 'slot' | 'initials' | 'icon' | 'empty';

const displayMode = computed<DisplayMode>(() => {
  if (src && !get(errored))
    return 'image';
  if (slots.default)
    return 'slot';
  if (icon)
    return 'icon';
  if (get(initials))
    return 'initials';
  return 'empty';
});

const decorative = computed<boolean>(() => alt === '' && !text);

const ariaLabel = computed<string | undefined>(() => {
  if (get(displayMode) === 'image')
    return undefined;
  if (get(decorative))
    return undefined;
  return text ?? alt ?? undefined;
});

const rootStyle = computed<Record<string, string>>(() => {
  const px = `${get(sizePx)}px`;
  return { width: px, height: px };
});

const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none font-medium align-middle',
    image: 'w-full h-full object-cover',
    fallback: 'w-full h-full flex items-center justify-center',
    initials: 'uppercase leading-none',
  },
  variants: {
    variant: {
      circular: { root: 'rounded-full' },
      rounded: { root: 'rounded-md' },
      square: { root: 'rounded-none' },
    },
    color: {
      default: { root: 'bg-rui-grey-200 text-rui-text dark:bg-rui-grey-800' },
      primary: { root: 'bg-rui-primary text-white' },
      secondary: { root: 'bg-rui-secondary text-white' },
      error: { root: 'bg-rui-error text-white' },
      warning: { root: 'bg-rui-warning text-white' },
      info: { root: 'bg-rui-info text-white' },
      success: { root: 'bg-rui-success text-white' },
    },
    size: {
      'xs': { initials: 'text-[0.625rem]' },
      'sm': { initials: 'text-[0.6875rem]' },
      'md': { initials: 'text-sm' },
      'lg': { initials: 'text-base' },
      'xl': { initials: 'text-lg' },
      '2xl': { initials: 'text-xl' },
    },
  },
  compoundSlots: [
    { slots: ['root'], color: ['warning', 'success', 'info'], class: 'dark:text-rui-light-text' },
  ],
  defaultVariants: {
    variant: 'circular',
    color: 'default',
    size: 'md',
  },
});

const ui = computed<ReturnType<typeof avatarStyles>>(() => avatarStyles({
  variant: get(resolvedVariant),
  color,
  size: get(sizeToken),
}));

function onLoad(event: Event): void {
  set(errored, false);
  emit('load', event);
}

function onError(event: Event): void {
  set(errored, true);
  emit('error', event);
}
</script>

<template>
  <span
    :class="ui.root()"
    :style="rootStyle"
    :role="displayMode === 'image' ? undefined : 'img'"
    :aria-label="ariaLabel"
    :data-id="$attrs['data-id'] ?? 'avatar-root'"
    :data-size="typeof resolvedSize === 'string' ? resolvedSize : undefined"
    :data-variant="resolvedVariant"
    :data-color="color"
  >
    <img
      v-if="displayMode === 'image' && src"
      :class="ui.image()"
      :src="src"
      :alt="alt"
      :loading="loading"
      :width="sizePx"
      :height="sizePx"
      data-id="avatar-image"
      @load="onLoad($event)"
      @error="onError($event)"
    />
    <span
      v-else
      :class="ui.fallback()"
      data-id="avatar-fallback"
      aria-hidden="true"
    >
      <slot v-if="displayMode === 'slot'" />
      <span
        v-else-if="displayMode === 'initials'"
        :class="ui.initials()"
        data-id="avatar-initials"
      >
        {{ initials }}
      </span>
      <RuiIcon
        v-else-if="displayMode === 'icon' && icon"
        :name="icon"
        :size="iconPx"
        data-id="avatar-icon"
      />
      <span v-else>&nbsp;</span>
    </span>
  </span>
</template>
