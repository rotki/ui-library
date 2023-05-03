import Vue from 'vue';
import RuiTheme from '../src';

Vue.use(RuiTheme, {});

export const vueInstance = new Vue({ template: '<div />' }).$mount();
