import Vue from 'vue';
import { RuiPlugin } from '../src';

Vue.use(RuiPlugin, {});

export const vueInstance = new Vue({ template: '<div />' }).$mount();
