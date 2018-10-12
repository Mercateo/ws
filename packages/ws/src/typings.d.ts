declare module 'fork-ts-checker-webpack-plugin';
declare module '@babel/code-frame';
declare module 'glob-to-regexp';
declare module 'eslint';
declare module 'plur';
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

declare module 'webpack-node-externals' {
  import webpack from 'webpack';
  export default function WebpackNodeExternals(
    ...params: any[]
  ): webpack.ExternalsFunctionElement;
}

declare module '@babel/core' {
  export function transformFile(
    filename: string,
    options: any,
    callback: (error: any, result: any) => void
  ): void;
}
