import { handleError } from './error';
import { join } from 'path';
import commander, { CommanderStatic } from 'commander';
import { info, setLevel } from 'loglevel';
import chalk from 'chalk';
import { readJsonSync } from 'fs-extra-promise';
import { project, TYPE } from './project';
import { initializeUpdateNotifier } from './lib/update-notifier';
import { BaseOptions, Env } from './options';

const { yellow, cyan } = chalk;

export function runCli() {
  // common setup
  const pkg = readJsonSync(join(__dirname, '../package.json'));
  commander.version(pkg.version);
  commander.usage('<command> [options]');

  // global options
  const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];
  commander.option(
    '-l, --log-level <level>',
    'set log level',
    (value: string) => {
      if (LOG_LEVELS.includes(value)) {
        return value;
      } else {
        const level = yellow(value);
        const levels = yellow(LOG_LEVELS.join(', '));
        throw `Your log level ${level} doesn't match any of the valid values: ${levels}.`;
      }
    },
    'info'
  );
  commander.option('-u, --ignore-updates', 'ignore updates');
  commander.option(
    '-e, --env [value]',
    'environment variables which are passed to the build step',
    (keyValuePair: string, list: Env[]) => {
      const [key, value = ''] = keyValuePair.split('=');
      list.push({ key, value });
      return list;
    },
    []
  );

  function handleAction(
    importAction: () => Promise<{ default: (options?: any) => Promise<any> }>
  ) {
    return async (options: BaseOptions & CommanderStatic) => {
      // handle global options
      setLevel(options.parent.logLevel);
      // handle specific action
      try {
        // update notifier runs parallel to action (if it's not ignored)
        const ignoreUpdates =
          options.parent.ignoreUpdate || project.ws.ignoreUpdates;
        const handleUpdateNotifier = ignoreUpdates
          ? undefined
          : initializeUpdateNotifier(pkg.version);

        info(`run ${cyan(options.name())}...`);
        const actionModule = await importAction();
        await actionModule.default(options);
        info(`finished ${cyan(options.name())} ♥`);

        if (handleUpdateNotifier) {
          handleUpdateNotifier();
        }
      } catch (err) {
        handleError(err);
      }
    };
  }

  if (project.ws.i18n && project.ws.i18n.importUrl) {
    commander
      .command('i18n:import')
      .alias('i18n:i')
      .description('import translations')
      .action(handleAction(() => import('./actions/i18n-import')));
  }

  // shared setup
  switch (project.ws.type) {
    case TYPE.SPA:
    case TYPE.NODE:
    case TYPE.BROWSER:
      commander
        .command('lint')
        .alias('l')
        .description('run linter')
        .action(handleAction(() => import('./actions/lint')));
      break;
  }

  // handle unknown commands
  commander.on('command:*', (unknownCommand: string) => {
    commander.outputHelp();
    const unknown = yellow(unknownCommand);
    throw `${unknown} is not a known command. You can see all supported commands above.`;
  });

  // invoke commands
  commander.parse(process.argv);

  // hande default command
  if (!commander.args.length) {
    commander.help();
  }
}
