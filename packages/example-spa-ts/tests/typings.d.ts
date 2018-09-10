declare interface process {
  env: {
    NODE_ENV?: string;
  };
}

declare module '*.json' {
  export const hello: string;
}
