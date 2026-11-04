import type { InputHTMLAttributes } from 'vue';

/**
 * The attributes a component passes to its `<input>`. Vue types `autocomplete` as a template-literal
 * union of every autofill token; folded into a component's props, that union grows past what
 * TypeScript can represent (TS2590), so here it is a plain string, as the DOM itself takes it.
 */
export interface InputAttributes extends Omit<InputHTMLAttributes, 'autocomplete'> {
  autocomplete?: string;
}
