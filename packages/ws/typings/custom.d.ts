// declare var require: {
//   <T>(path: string): T;
//   (paths: string[], callback: (...modules: any[]) => void): void;
//   ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
// };

/**
 * Nodes native `require` inside webpack-based Node projects.
 */
declare function __non_webpack_require__(path: string): any;

declare module 'fork-ts-checker-webpack-plugin';
declare module 'babel-code-frame';
declare module 'glob-to-regexp';
declare module 'express-history-api-fallback';
declare module 'eslint';
declare module 'plur';
declare module 'nodemon';
declare module 'babel-jest';
declare module 'koa-connect';

declare module 'parent-dirs' {
  function parentDirs(cwd?: string): string[];
  export = parentDirs;
}

declare module 'stringify-object' {
  export interface Options {
    indent?: string;
    singleQuotes?: boolean;
  }

  export default function stringifyObject(
    input: any,
    options?: Options
  ): string;
}

declare module 'browserslist' {
  function browserslist(browsers: string, options?: any): string[];

  namespace browserslist {
    export let data: any;
  }

  export = browserslist;
}

declare module 'sauce-connect-launcher' {
  export interface SauceConnectOptions {
    username: string;
    accessKey: string;
  }

  export interface SauceConnectProcess {
    close: () => void;
  }

  export default function sauceConnectLauncher(
    options: SauceConnectOptions,
    callback: (error: any, sauceConnectProcess: SauceConnectProcess) => void
  ): void;
}

declare module 'properties' {
  export interface ParseOptions {
    path?: boolean;
    comments?: string | string[];
    separators?: string | string[];
    strict?: boolean;
    sections?: boolean;
    namespaces?: boolean;
    variables?: boolean;
    vars?: boolean;
    include?: boolean;
  }

  export function parse(
    data: string,
    options: ParseOptions,
    callback: (error: any, res: any) => void
  ): void;
  export function parse(
    data: string,
    callback: (error: any, res: any) => void
  ): void;
  export function parse(
    options: ParseOptions,
    callback: (error: any, res: any) => void
  ): void;
  export function parse(data: string, options?: ParseOptions): any;
  export function parse(options: ParseOptions): any;
}

declare module 'openport' {
  export interface FindOptions {
    count?: number;
    startingPort?: number;
    endingPort?: number;
    ports?: number[];
    avoid?: number[];
  }

  export function find(
    options: FindOptions,
    callback: (error: any, port: number) => void
  ): void;
}

declare module 'webpack-node-externals' {
  import webpack from 'webpack';
  export default function WebpackNodeExternals(
    ...params: any[]
  ): webpack.ExternalsFunctionElement;
}

declare module 'selenium-webdriver' {
  export const Builder: any;
  export const By: any;
  export const until: any;
}

declare module 'selenium-webdriver/chrome';
declare module 'selenium-webdriver/firefox';

declare module 'selenium-standalone' {
  export function install(options: any, callback: (error: any) => void): void;
  export function start(
    callback: (error: any, childProcess: any) => void
  ): void;
}

declare module 'babel-core' {
  export function transformFile(
    filename: string,
    options: any,
    callback: (error: any, result: any) => void
  ): void;
}

declare module 'livereload' {
  // https://github.com/napcs/node-livereload/blob/master/lib/livereload.js#L27
  export interface Server {
    close: () => void;
    refresh: (filepath: string) => void;
  }
  export function createServer(options?: { port: number }): Server;
}

declare module 'connect-livereload' {
  export interface LivereloadMiddlewareOptions {
    port: number;
  }

  export default function livereloadMiddleware(
    options?: LivereloadMiddlewareOptions
  ): void;
}

declare module 'selenium-grid-status' {
  export interface SeleniumGridConfig {
    host: string;
    port: number;
  }

  export interface SeleniumBrowser {
    seleniumProtocol: string;
    browserName: string;
    maxInstances: string;
    version: string;
    platform: string;
  }

  export interface SeleniumNode {
    browser: SeleniumBrowser[];
  }

  export function available(
    config: SeleniumGridConfig,
    callback: (error: any, result: SeleniumNode[]) => void
  ): void;
}
