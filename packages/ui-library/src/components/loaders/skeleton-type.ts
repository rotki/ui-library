export const SkeletonType = {
  TEXT: 'text',
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  ARTICLE: 'article',
  BUTTON: 'button',
  ICON: 'icon',
  AVATAR: 'avatar',
  THUMBNAIL: 'thumbnail',
  CUSTOM: 'custom',
} as const;

export type SkeletonType = (typeof SkeletonType)[keyof typeof SkeletonType];
