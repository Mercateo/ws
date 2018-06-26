import { CommanderStatic } from 'commander';
import { LogLevelDesc } from 'loglevel';

export interface Env {
  key: string;
  value: string;
}

export interface BaseOptions extends CommanderStatic {
  parent: {
    logLevel: LogLevelDesc;
    env: Env[];
    ignoreUpdate?: true;
  };
}
