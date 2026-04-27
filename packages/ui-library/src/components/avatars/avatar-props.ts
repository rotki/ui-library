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

export const AVATAR_SIZE_PX: Record<AvatarSize, number> = {
  'xs': 20,
  'sm': 24,
  'md': 32,
  'lg': 40,
  'xl': 48,
  '2xl': 64,
};

export const AVATAR_ICON_PX: Record<AvatarSize, number> = {
  'xs': 12,
  'sm': 14,
  'md': 18,
  'lg': 22,
  'xl': 28,
  '2xl': 36,
};

export const AVATAR_GROUP_SPACING_PX: Record<AvatarGroupSpacing, number> = {
  sm: -4,
  md: -8,
  lg: -12,
};

export function resolveAvatarSizePx(size: AvatarSize | number | undefined): number {
  if (typeof size === 'number')
    return size;
  return AVATAR_SIZE_PX[size ?? 'md'];
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

export interface AvatarGroupContext {
  size: AvatarSize | number;
  variant: AvatarVariant;
}

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<AvatarGroupContext>>
  = Symbol('avatarGroup');
