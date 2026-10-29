<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import { get, set } from '@vueuse/shared';
import {
  type AvatarSize,
  type AvatarVariant,
  computeAvatarText,
  computeInitials,
  resolveAvatarIconPx,
  resolveAvatarSizePx,
  resolveAvatarTextSize,
} from '@/components/avatars/avatar-props';
import { useAvatarGroup } from '@/components/avatars/use-avatar-group';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { avatarStyles } from './avatar-styles';

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

// A numeric size borrows the text scale of the nearest token below it
const textSize = computed<AvatarSize>(() => resolveAvatarTextSize(get(resolvedSize)));

const sizePx = computed<number>(() => resolveAvatarSizePx(get(resolvedSize)));
const iconPx = computed<number>(() => resolveAvatarIconPx(get(resolvedSize)));

const errored = ref<boolean>(false);

watch(() => src, () => {
  set(errored, false);
});

const initials = computed<string>(() => {
  const explicit = computeAvatarText(text);
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

const ui = computed<ReturnType<typeof avatarStyles>>(() => avatarStyles({
  variant: get(resolvedVariant),
  color,
  size: get(textSize),
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
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="displayMode !== 'image' && decorative ? 'true' : undefined"
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
