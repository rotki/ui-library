/* eslint-disable import/no-default-export -- a virtual module's shape is fixed by the plugin that serves it */
declare module 'virtual:rotki-icons' {
  /**
   * Auto-detected icons from your source files.
   * Use this array with `createRui({ theme: { icons } })`.
   */
  interface GeneratedIcon {
    name: string;
    components: [string, Record<string, string>][];
  }

  const icons: GeneratedIcon[];

  export default icons;
}
