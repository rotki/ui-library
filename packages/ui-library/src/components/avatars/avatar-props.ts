import type { ComputedRef, InjectionKey } from 'vue';

export const AvatarSize = {
  'xs': 'xs',
  'sm': 'sm',
  'md': 'md',
  'lg': 'lg',
  'xl': 'xl',
  '2xl': '2xl',
} as const;

export type AvatarSize = (typeof AvatarSize)[keyof typeof AvatarSize];

export const AvatarVariant = {
  circular: 'circular',
  rounded: 'rounded',
  square: 'square',
} as const;

export type AvatarVariant = (typeof AvatarVariant)[keyof typeof AvatarVariant];

export const AvatarGroupSpacing = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export type AvatarGroupSpacing = (typeof AvatarGroupSpacing)[keyof typeof AvatarGroupSpacing];

const AVATAR_SIZE_PX: Record<AvatarSize, number> = {
  'xs': 20,
  'sm': 24,
  'md': 32,
  'lg': 40,
  'xl': 48,
  '2xl': 64,
};

const AVATAR_ICON_PX: Record<AvatarSize, number> = {
  'xs': 12,
  'sm': 14,
  'md': 18,
  'lg': 22,
  'xl': 28,
  '2xl': 36,
};

/**
 * How much of an avatar the next one covers, as a share of the avatar size.
 * Kept small enough that the trailing initial of a two-letter avatar stays
 * readable at every size, including the 2px ring.
 */
const AVATAR_GROUP_OVERLAP_RATIO: Record<AvatarGroupSpacing, number> = {
  sm: 0.04,
  md: 0.07,
  lg: 0.1,
};

/**
 * Resolves the inline margin between grouped avatars. A token scales with the
 * avatar size and a number is used as given, in pixels.
 */
export function resolveAvatarGroupSpacingPx(
  spacing: AvatarGroupSpacing | number,
  size: AvatarSize | number | undefined,
): number {
  if (typeof spacing === 'number')
    return spacing;
  return -Math.round(resolveAvatarSizePx(size) * AVATAR_GROUP_OVERLAP_RATIO[spacing]);
}

export function resolveAvatarSizePx(size: AvatarSize | number | undefined): number {
  if (typeof size === 'number')
    return size;
  return AVATAR_SIZE_PX[size ?? 'md'];
}

/**
 * Picks the size token whose text scale fits a size: the token itself, or for
 * a numeric size the largest token that is not bigger than it.
 */
export function resolveAvatarTextSize(size: AvatarSize | number | undefined): AvatarSize {
  if (typeof size !== 'number')
    return size ?? 'md';
  let match: AvatarSize = 'xs';
  for (const [token, px] of Object.entries(AVATAR_SIZE_PX)) {
    if (px <= size && isAvatarSize(token))
      match = token;
  }
  return match;
}

function isAvatarSize(value: string): value is AvatarSize {
  return value in AVATAR_SIZE_PX;
}

export function resolveAvatarIconPx(size: AvatarSize | number | undefined): number {
  if (typeof size === 'number')
    return Math.round(size * 0.56);
  return AVATAR_ICON_PX[size ?? 'md'];
}

export function computeInitials(source: string | undefined | null): string {
  if (!source)
    return '';
  const parts = source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0)
    return '';
  return parts.map(p => p.charAt(0).toUpperCase()).join('');
}

/**
 * Resolves the `text` prop for display. A short token such as `AL` or `BTC`
 * (1 to 3 characters, no whitespace) renders as given; anything else is
 * treated as a name and reduced to its initials.
 */
export function computeAvatarText(source: string | undefined | null): string {
  if (!source)
    return '';
  const trimmed = source.trim();
  if (trimmed.length > 0 && trimmed.length <= 3 && !/\s/.test(trimmed))
    return trimmed;
  return computeInitials(trimmed);
}

export interface AvatarGroupContext {
  size: AvatarSize | number;
  variant: AvatarVariant;
}

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<AvatarGroupContext>>
  = Symbol('avatarGroup');
