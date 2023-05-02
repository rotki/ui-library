import Vue from 'vue';
import { createPinia } from 'pinia';
import RuiTheme from '../src';

Vue.use(RuiTheme, {});

const pinia = createPinia();
export const vueInstance = new Vue({ template: '<div />', pinia }).$mount();
