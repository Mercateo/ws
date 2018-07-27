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

  // specific setup
  switch (project.ws.type) {
    case TYPE.SPA:
      commander.description('We build your SPA!');

      commander
        .command('serve')
        .alias('s')
        .description('serve the project')
        .option('-p, --production', 'serve production build')
        .action(handleAction(() => import('./actions/serve')));

      const e2eCommand = commander
        .command('e2e')
        .alias('e')
        .description('run e2e tests')
        .option(
          '--browsers <browsers>',
          `browsers to use (comma separated list, e.g. 'ie-9,ff-36,chrome-41')`
        )
        .option('--headless', `prefer headless mode`)
        .action((...args: any[]) => {
          if (args.length === 2) {
            const [browsers, options] = args;
            options.browsers = browsers;
            handleAction(() => import('./actions/e2e'))(options);
          } else {
            const [options] = args;
            handleAction(() => import('./actions/e2e'))(options);
          }
        });

      if (project.ws.selenium) {
        e2eCommand.option('-g, --grid', 'run on selenium grid');
      }
      break;
    case TYPE.NODE:
      commander.description('We build your Node module!');
      break;
    case TYPE.BROWSER:
      commander.description('We build your Browser module!');
      break;
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
      const buildCommand = commander
        .command('build')
        .alias('b')
        .description('build the project')
        .action(handleAction(() => import('./actions/build')));

      if (project.ws.type === TYPE.SPA || project.ws.type === TYPE.BROWSER) {
        buildCommand.option('-p, --production', 'create production build');
      }

      const watchCommand = commander
        .command('watch')
        .alias('w')
        .description('continuously build and serve the project')
        .action(handleAction(() => import('./actions/watch')));

      if (project.ws.type === TYPE.SPA) {
        watchCommand.option(
          '-H, --hot',
          'enables hot reloading (experimental)'
        );
      }

      commander
        .command('lint')
        .alias('l')
        .description('run linter')
        .action(handleAction(() => import('./actions/lint')));

      const unitCommand = commander
        .command('unit')
        .alias('u')
        .description('run unit tests')
        // .option('-c, --coverage', 'generates code coverage')
        .action(handleAction(() => import('./actions/unit')));

      if (project.ws.selenium) {
        unitCommand.option('-g, --grid', 'run on selenium grid');
      }
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
