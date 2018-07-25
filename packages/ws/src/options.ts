import { CommanderStatic } from 'commander';
import { LogLevelDesc } from 'loglevel';

export interface Env {
  key: string;
  value: string;
}

export interface EnvOptions {
  parent: {
    env: Env[];
  };
}

export interface BaseOptions extends CommanderStatic, EnvOptions {
  parent: {
    logLevel: LogLevelDesc;
    env: Env[];
    ignoreUpdate?: true;
  };
}
