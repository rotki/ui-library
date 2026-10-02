import base from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

function withPlugins(): typeof base {
  base.extend(utc);
  base.extend(timezone);
  base.extend(customParseFormat);
  return base;
}

/**
 * dayjs with the plugins the date-time picker needs registered. Library code
 * takes dayjs from here, never from `dayjs` itself.
 *
 * The plugins are registered in this export's initializer, not as top-level
 * statements, and the export is a new binding, not a re-export of `dayjs`.
 * The package declares no side effects, so a bundler keeps this module's code
 * only as far as a used export needs it: a re-export would be wired straight
 * to `dayjs`, and loose `extend` calls would be dropped.
 */
export const dayjs = withPlugins();
