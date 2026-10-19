import { get, set } from '@vueuse/shared';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { type FormDetails, useFormDetails } from '@/utils/form-text-detail';

describe('utils/form-text-detail', () => {
  describe('useFormDetails', () => {
    it('should default to reserve', () => {
      const mode = useFormDetails(() => undefined, () => false);
      expect(get(mode)).toBe('reserve');
    });

    it('should use the details prop', () => {
      const mode = useFormDetails(() => 'auto', () => false);
      expect(get(mode)).toBe('auto');
    });

    it('should let the deprecated hideDetails win over details', () => {
      const mode = useFormDetails(() => 'auto', () => true);
      expect(get(mode)).toBe('hidden');
    });

    it('should follow changes to either input', () => {
      const details = ref<FormDetails | undefined>(undefined);
      const hideDetails = ref<boolean>(false);
      const mode = useFormDetails(details, hideDetails);

      set(details, 'auto');
      expect(get(mode)).toBe('auto');

      set(hideDetails, true);
      expect(get(mode)).toBe('hidden');
    });
  });
});
