declare function require(module: string): any;
declare const process: any;

declare module 'selenium-webdriver' {
  export const Builder: any;
  export const By: any;
  export const until: any;
}

declare const module: {
  hot?: { accept: (path: string, callback: () => void) => void };
};
