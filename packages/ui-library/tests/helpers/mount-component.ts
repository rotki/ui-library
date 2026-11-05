import { type ComponentMountingOptions, type GlobalMountOptions, mount, type Stubs } from '@vue/test-utils';

/**
 * The wrapper `mount` returns for a component. Unlike
 * `VueWrapper<InstanceType<typeof C>>` it also works for generic SFCs, which
 * have no constructor type: `MountedWrapper<typeof RuiDataTable<User>>`.
 */
export type MountedWrapper<C> = ReturnType<typeof mount<C, C>>;

type MountProps<C> = Exclude<ComponentMountingOptions<C>['props'], null | undefined>;

/**
 * Options a spec mounts with by default. Props may be partial, since a test
 * fills in the rest.
 */
export type MountDefaults<C> = Pick<ComponentMountingOptions<C>, 'attachTo' | 'attrs' | 'global' | 'shallow' | 'slots'> & {
  props?: Partial<MountProps<C>>;
};

export type Mounter<C> = (options?: ComponentMountingOptions<C>) => MountedWrapper<C>;

type AnyMountOptions = ComponentMountingOptions<any>;

function normalizeStubs(stubs: Stubs | undefined): Exclude<Stubs, string[]> {
  if (!stubs)
    return {};
  if (Array.isArray(stubs))
    return Object.fromEntries(stubs.map(name => [name, true]));
  return stubs;
}

/**
 * Combines two sets of global mount options the way `@vue/test-utils`
 * combines `config.global` with a mount's `global`: stubs, components,
 * directives, mocks and provide are merged per key, plugins and mixins are
 * concatenated, and `overrides` wins on every key both define.
 */
export function mergeGlobalOptions(
  defaults: GlobalMountOptions = {},
  overrides: GlobalMountOptions = {},
): GlobalMountOptions {
  return {
    ...defaults,
    ...overrides,
    components: { ...defaults.components, ...overrides.components },
    config: { ...defaults.config, ...overrides.config },
    directives: { ...defaults.directives, ...overrides.directives },
    mixins: [...(defaults.mixins ?? []), ...(overrides.mixins ?? [])],
    mocks: { ...defaults.mocks, ...overrides.mocks },
    plugins: [...(defaults.plugins ?? []), ...(overrides.plugins ?? [])],
    provide: { ...defaults.provide, ...overrides.provide },
    stubs: { ...normalizeStubs(defaults.stubs), ...normalizeStubs(overrides.stubs) },
  };
}

/**
 * Merges a test's mount options over a spec's defaults. `global` is merged
 * as {@link mergeGlobalOptions} describes, `props`, `attrs` and `slots` are
 * merged per key, and every other option in `options` replaces the default.
 */
export function mergeMountingOptions(
  defaults: AnyMountOptions,
  options: AnyMountOptions = {},
): AnyMountOptions {
  return {
    ...defaults,
    ...options,
    attrs: { ...defaults.attrs, ...options.attrs },
    global: mergeGlobalOptions(defaults.global, options.global),
    props: { ...defaults.props, ...options.props },
    slots: { ...defaults.slots, ...options.slots },
  };
}

/**
 * Returns a function that mounts `component` with `defaults` merged under
 * the options a test passes (see {@link mergeMountingOptions}). The mount
 * options and the wrapper are typed for `component`, generic SFCs included:
 * pass `RuiDataTable<User>` to fix a generic component's type parameters.
 */
export function createMounter<C>(component: C, defaults?: MountDefaults<C>): Mounter<C>;

export function createMounter(component: any, defaults: AnyMountOptions = {}): Mounter<any> {
  return options => mount(component, mergeMountingOptions(defaults, options));
}
