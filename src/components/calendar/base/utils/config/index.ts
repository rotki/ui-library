import type { App as Application } from 'vue';

const config = {};

export { config as default };

// eslint-disable-next-line import/no-mutable-exports
export let VueInstance: Application;

export function setVueInstance(instance: Application) {
  VueInstance = instance;
}
