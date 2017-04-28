declare function require(module: string): any;

// workaround for @types/react-addons-test-utils
// see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/10162
declare module 'react-addons-test-utils' {
  const ReactTestUtils: any;
  export default ReactTestUtils;
}
