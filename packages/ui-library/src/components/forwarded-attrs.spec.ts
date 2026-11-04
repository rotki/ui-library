import { describe, expect, it } from 'vitest';
import * as components from '@/components';

/*
 * Components type the HTML attributes they forward with `/* @vue-ignore *\/`, which keeps them out of
 * the runtime props. Were one declared as a prop, Vue would take it out of `$attrs` and the element
 * the component forwards to would never get it.
 */
// none of these is a prop of any component; `role`, `title`, `ariaLabel`, `target` and `accept` are, on a few
const htmlAttributes = new Set<string>(['id', 'tabindex', 'hidden', 'onClick', 'onKeydown', 'onFocus', 'href', 'autocomplete', 'maxlength', 'inputmode']);

// HTMLAttributes alone has well over a hundred members; no component declares that many props
const maxProps = 80;

function getRuntimeProps(component: unknown): string[] {
  if (typeof component !== 'object' || component === null || !('props' in component))
    return [];
  const props = component.props;
  if (Array.isArray(props))
    return props.map(String);
  return typeof props === 'object' && props !== null ? Object.keys(props) : [];
}

describe('forwarded attributes', () => {
  const entries = Object.entries(components).filter(([name]) => name.startsWith('Rui'));

  it('finds the components', () => {
    expect(entries.length).toBeGreaterThan(40);
  });

  it.each(entries)('%s keeps HTML attributes out of its runtime props', (_name, component) => {
    const props = getRuntimeProps(component);
    expect(props.filter(prop => htmlAttributes.has(prop))).toEqual([]);
    expect(props.length).toBeLessThan(maxProps);
  });
});
