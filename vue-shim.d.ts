declare module '*.vue' {
  import { Component } from 'vue';
  interface Props {
    [key: string]: any;
  }
  export { Props };
  export default Component;
}
