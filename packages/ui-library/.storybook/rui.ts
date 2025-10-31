import type { GeneratedIcon } from '@/types/icons';
import { ref } from 'vue';
import * as Icons from '@/icons';
import { createRui } from '~/src';

function isGeneratedIcon(value: unknown): value is GeneratedIcon {
  return typeof value === 'object' && value !== null && 'name' in value && 'components' in value;
}

export const RuiPlugin = createRui({
  theme: {
    icons: Object.values(Icons).filter(isGeneratedIcon),
  },
  defaults: {
    table: {
      itemsPerPage: ref(10),
      globalItemsPerPage: false,
      limits: [5, 10, 15, 25, 50, 100, 200],
    },
  },
});
