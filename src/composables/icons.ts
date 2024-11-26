import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuCheck,
  LuCheckboxBlank,
  LuCheckboxBlankCircle,
  LuCheckboxBlankCircleFill,
  LuCheckboxFill,
  LuCheckboxIndeterminateFill,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuChevronsLeft,
  LuChevronsRight,
  LuChevronsUpDown,
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuEllipsis,
  LuEye,
  LuEyeOff,
  LuInfo,
  LuRadioButtonFill,
  LuTriangleAlert,
  LuX,
} from '@/icons';
import type { GeneratedIcon } from '@/types/icons';
import type { InjectionKey } from 'vue';

const requiredIcons: GeneratedIcon[] = [
  LuChevronsUpDown,
  LuEllipsis,
  LuTriangleAlert,
  LuX,
  LuInfo,
  LuArrowUp,
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuChevronUp,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuCircleAlert,
  LuEye,
  LuEyeOff,
  LuCheck,
  LuCircleX,
  LuCircleCheck,
  LuCheckboxBlank,
  LuCheckboxFill,
  LuCheckboxIndeterminateFill,
  LuCheckboxBlankCircle,
  LuCheckboxBlankCircleFill,
  LuRadioButtonFill,
];

export interface IconsOptions {
  registeredIcons: GeneratedIcon[];
}

export interface UseIconsReturn {
  registeredIcons: Readonly<Record<string, [string, Record<string, string>][]>>;
}

export const IconsSymbol: InjectionKey<UseIconsReturn> = Symbol.for('rui:icons');

export function createIconDefaults(options?: Partial<IconsOptions>): UseIconsReturn {
  const iconsToAdd = options?.registeredIcons || [];
  return {
    registeredIcons: {
      ...Object.fromEntries(
        [
          ...requiredIcons,
          ...iconsToAdd,
        ].map(({ components, name }) => [name, components]),
      ),
    },
  };
}

export function useIcons(): UseIconsReturn {
  const icons = inject(IconsSymbol);
  assert(icons, 'Could not find icons injection');
  return icons;
}
