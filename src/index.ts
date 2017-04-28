import { handleError } from './error';
import commander from 'commander';
import { info, setLevel, levels } from 'loglevel';
import { yellow, cyan } from 'chalk';
import { project, TYPE } from './project';

// common setup
const pkg = require('../package.json');
commander.version(pkg.version);
commander.usage('<command> [options]');

// global options
const allowedLogLevels = Object.keys(levels).map(level => level.toLocaleLowerCase());
commander.option('-l, --log-level <level>', 'set log level', (value) => {
  if (allowedLogLevels.some(allowedValue => value === allowedValue)) {
    return value;
  } else {
    throw `Your log level  ${yellow(value)} doesn't match any of the valid values: ${yellow(allowedLogLevels.join(', '))}.`;
  }
}, 'info');

function handleAction(lazyAction: () => Promise<{ default: (options?: any) => Promise<any> }>) {
  return (options: any) => {
    // handle global options
    setLevel(levels[options.parent.logLevel.toUpperCase()]);
    // handle specific action
    return _import<any>('./lib/update-notifier')
      .then(module => module.updateNotifier(pkg.version))
      .then(() => info(`run ${cyan(options.name())}...`))
      .then(() => lazyAction())
      .then(module => module.default(options))
      .then(() => info(`finished ${cyan(options.name())} ♥`))
      .catch(handleError);
  };
}

// specific setup
switch (project.ws.type) {
  case TYPE.SPA:
  case TYPE.ELECTRON:
    commander.description('We build your SPA!');

    commander
      .command('serve')
      .alias('s')
      .description('serve the project')
      .option('-p, --production', 'serve production build')
      .action(handleAction(() => _import('./actions/serve')));

    const e2eCommand = commander
      .command('e2e')
      .alias('e')
      .description('run e2e tests')
      .option('--browsers <browsers>', `browsers to used (comma separated list, e.g. 'ie-9,ff-36,chrome-41')`)
      .action((...args) => {
        if (args.length === 2) {
          const [browsers, options] = args;
          options.browsers = browsers;
          handleAction(() => _import('./actions/e2e'))(options);
        } else {
          const [options] = args;
          handleAction(() => _import('./actions/e2e'))(options);
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
    .action(handleAction(() => _import('./actions/i18n-import')));
}

// shared setup
switch (project.ws.type) {
  case TYPE.SPA:
  case TYPE.NODE:
  case TYPE.BROWSER:
  case TYPE.ELECTRON:
    const buildCommand = commander
      .command('build')
      .alias('b')
      .description('build the project')
      .action(handleAction(() => _import('./actions/build')));

    if (project.ws.type === TYPE.SPA || project.ws.type === TYPE.BROWSER || project.ws.type === TYPE.ELECTRON) {
      buildCommand.option('-p, --production', 'create production build');
    }

    commander
      .command('watch')
      .alias('w')
      .description('continuously build and serve the project')
      // .option('-H, --hot', 'enables hot reloading (experimental)')
      .action(handleAction(() => _import('./actions/watch')));

    commander
      .command('lint')
      .alias('l')
      .description('run linter')
      .action(handleAction(() => _import('./actions/lint')));

    const unitCommand = commander
      .command('unit')
      .alias('u')
      .description('run unit tests')
      // .option('-c, --coverage', 'generates code coverage')
      .action(handleAction(() => _import('./actions/unit')));

    if (project.ws.selenium) {
      unitCommand.option('-g, --grid', 'run on selenium grid');
    }
    break;
}

// handle unknown commands
commander.on('*', (unknownCommand: string) => {
  commander.outputHelp();
  throw `${yellow(unknownCommand)} is not a known command. You can see all supported commands above.`;
});

// invoke commands
commander.parse(process.argv);

// hande default command
if (!commander.args.length) {
  commander.help();
}
