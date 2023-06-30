// setup.js file
import * as Icons from '../../src/all-icons';
import { useIcons } from '../../src/composables/icons';

const { registerIcons } = useIcons();
registerIcons(Object.values(Icons));
