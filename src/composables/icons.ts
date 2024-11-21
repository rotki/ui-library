import {
  RiAlertFill,
  RiAlertLine,
  RiArrowDownLine,
  RiArrowDropDownFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiCloseCircleLine,
  RiCloseFill,
  RiCloseLine,
  RiDatabase2Line,
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiExpandUpDownLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiInformationLine,
  RiMoreFill,
  RiRadioButtonLine,
} from '@/icons';
import type { GeneratedIcon } from '@/types/icons';
import type { InjectionKey } from 'vue';

const requiredIcons: GeneratedIcon[] = [
  RiAlertFill,
  RiAlertLine,
  RiArrowDownLine,
  RiArrowDropDownFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiCloseCircleLine,
  RiCloseFill,
  RiCloseLine,
  RiDatabase2Line,
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiInformationLine,
  RiRadioButtonLine,
  RiMoreFill,
  RiExpandUpDownLine,
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
