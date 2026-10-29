import { tv } from '@/utils/tv';

// a popup like a menu: panel corners, a hairline edge for dark backgrounds, and never wider than the screen
export const notificationStyles = tv({ base: 'top-4 right-4 fixed z-rui-toast max-w-[calc(100vw-2rem)] overflow-hidden rounded-rui-panel border shadow-rui-menu' });
