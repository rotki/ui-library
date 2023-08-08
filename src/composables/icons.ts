import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiAlertLine,
  RiArrowDownLine,
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
  RiDatabase2Line,
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiInformationLine,
  RiMoreFill,
  RiRadioButtonLine,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiAlertLine,
    RiArrowDownLine,
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
    RiDatabase2Line,
    RiErrorWarningFill,
    RiErrorWarningLine,
    RiEyeLine,
    RiEyeOffLine,
    RiInformationFill,
    RiInformationLine,
    RiRadioButtonLine,
    RiMoreFill,
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
