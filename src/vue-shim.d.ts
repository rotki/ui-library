declare module '*.vue' {
  import { type defineComponent } from 'vue-demi';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
