import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiAlertLine,
  RiArrowDropDownFill,
  RiArrowLeftLine,
  RiArrowLeftSLine,
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
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiInformationLine,
  RiRadioButtonLine,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiAlertLine,
    RiArrowDropDownFill,
    RiArrowLeftLine,
    RiArrowLeftSLine,
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
    RiErrorWarningFill,
    RiErrorWarningLine,
    RiEyeLine,
    RiEyeOffLine,
    RiInformationFill,
    RiInformationLine,
    RiRadioButtonLine,
  ];

  const registeredIcons: Ref<Record<string, string>> = ref({});
  const registerIcons = (iconsToAdd: GeneratedIcon[]) => {
    set(registeredIcons, {
      ...get(registeredIcons),
      ...Object.fromEntries(
        [...requiredIcons, ...iconsToAdd].map(({ name, path }) => [name, path]),
      ),
    });
  };

  return { registeredIcons, registerIcons };
});
