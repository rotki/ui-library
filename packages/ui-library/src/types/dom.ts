import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue';

/**
 * An element, or a component instance whose root element stands in for it, as a template ref holds
 * one. Declared here rather than taken from VueUse, which the library bundles: a published type that
 * named a VueUse type would make consumers install VueUse just to type-check.
 */
export type MaybeElement = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null;

/** An element given as a ref, a getter or a value. */
export type MaybeElementRef = MaybeRefOrGetter<MaybeElement>;
