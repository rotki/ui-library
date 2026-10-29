import { tv } from '@/utils/tv';

export const navigationDrawerStyles = tv({
  base: 'transition-[transform,translate,width] duration-200 ease-in-out bottom-0 fixed text-rui-text',
  variants: {
    belowAppBar: {
      true: 'top-rui-app-bar',
      false: 'top-0',
    },
    // a temporary drawer floats on the overlay surface; a docked one is part of the page, edged by a hairline
    temporary: {
      true: 'bg-rui-overlay',
      false: 'bg-rui-surface',
    },
    position: {
      left: 'left-0',
      right: 'right-0',
    },
    visible: {
      true: 'translate-x-0',
      false: '',
    },
    mini: {
      true: 'translate-x-0',
      false: '',
    },
    // a modal drawer covers the app bar; a docked one sits level with it
    withOverlay: {
      true: 'z-rui-drawer',
      false: 'z-rui-app-bar',
    },
  },
  compoundVariants: [
    { position: 'left', visible: false, mini: false, class: '-translate-x-full' },
    { position: 'right', visible: false, mini: false, class: 'translate-x-full' },
    { mini: true, visible: false, class: 'w-14!' },
    { temporary: false, position: 'left', class: 'border-r border-rui-divider' },
    { temporary: false, position: 'right', class: 'border-l border-rui-divider' },
  ],
  defaultVariants: { position: 'left', visible: false, mini: false, withOverlay: false, temporary: false, belowAppBar: false },
});
