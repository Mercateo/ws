/**
 * This will be used for the custom markdown babel plugin.
 */
declare const markdown: any;

declare module '*.png' {
  const content: string;
  export default content;
}
