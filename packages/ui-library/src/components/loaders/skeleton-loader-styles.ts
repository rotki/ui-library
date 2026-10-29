import { SkeletonType } from '@/components/loaders/skeleton-type';
import { tv } from '@/utils/tv';

export const skeletonLoaderStyles = tv({
  variants: {
    type: {
      [SkeletonType.CUSTOM]: 'box-border',
      [SkeletonType.TEXT]: 'w-full h-4 rounded-rui-control',
      [SkeletonType.HEADING]: 'w-full h-6 rounded-rui-control',
      [SkeletonType.BUTTON]: 'w-full max-w-24 h-9 rounded-rui-control',
      [SkeletonType.ICON]: 'w-6 h-6 rounded-full',
      [SkeletonType.AVATAR]: 'w-10 h-10 rounded-full',
      [SkeletonType.THUMBNAIL]: 'w-14 h-14 rounded-xs',
      [SkeletonType.PARAGRAPH]: 'flex flex-col gap-2',
      [SkeletonType.ARTICLE]: 'flex flex-col gap-2',
    },
  },
});
