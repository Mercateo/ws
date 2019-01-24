export interface Env {
  key: string;
  value: string;
}

export interface EnvOptions {
  parent: {
    env: Env[];
  };
}
