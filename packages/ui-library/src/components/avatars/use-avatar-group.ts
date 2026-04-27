import type { ComputedRef } from 'vue';
import { type AvatarGroupContext, avatarGroupInjectionKey } from '@/components/avatars/avatar-props';

export function useAvatarGroup(): ComputedRef<AvatarGroupContext> | undefined {
  return inject(avatarGroupInjectionKey, undefined);
}
