import { warn, error, info, getLevel, levels } from 'loglevel';
import webpack, { compiler } from 'webpack';
import { existsSync } from 'fs-extra-promise';
import { join } from 'path';
import { Server } from 'livereload';
import { WebpackConfig, Command } from './options';

const statsStringifierOptions: compiler.StatsToStringOptions = {
  // ignore warning, because we use transpileOnly
  // https://github.com/TypeStrong/ts-loader/commit/eb8bbf8e11779487d3af527f8b70644316075ee8
  warningsFilter: /export .* was not found in/,
  // minimal logging
  assets: false,
  colors: true,
  version: false,
  hash: false,
  timings: false,
  chunks: false,
  chunkModules: false,
  // `children` must be `true` to get error logging, when `options` is an array
  children: true
};

const verboseStatsStringifierOptions: compiler.StatsToStringOptions = {
  // maximal logging
  assets: true,
  colors: true,
  version: true,
  hash: true,
  timings: true,
  chunks: true,
  chunkModules: true,
  // `children` must be `true` to get error logging, when `options` is an array
  children: true
};

function isVerbose(): boolean {
  return getLevel() <= levels['DEBUG'];
}

function optionallyProfile(options: WebpackConfig | WebpackConfig[]) {
  if (isVerbose()) {
    if (Array.isArray(options)) {
      options.map((option) => (option.profile = true));
    } else {
      options.profile = true;
    }
  }
}

export function getStatsOptions() {
  return isVerbose() ? verboseStatsStringifierOptions : statsStringifierOptions;
}

function stringifyStats(stats: any): string {
  const stringifierOptions = isVerbose()
    ? verboseStatsStringifierOptions
    : statsStringifierOptions;
  return stats.toString(stringifierOptions);
}

function getModules(stats: any): Array<any> {
  // see https://github.com/webpack/webpack.js.org/issues/480
  const isMultiStats = !!stats.stats;
  if (isMultiStats) {
    let modules: Array<any> = [];
    stats.stats.forEach(
      (stats: any) => (modules = modules.concat(stats.compilation.modules))
    );
    return modules;
  } else {
    return stats.compilation.modules;
  }
}

// error handling taken from https://webpack.github.io/docs/node.js-api.html#error-handling
function onBuild(
  resolve: any,
  reject: any,
  err: any,
  stats: compiler.Stats,
  watcher?: any
) {
  if (err) {
    // "hard" error
    return reject(err);
  }

  if (stats.hasErrors()) {
    // "soft" error
    return reject(stringifyStats(stats));
  }

  if (stats.hasWarnings()) {
    warn(stringifyStats(stats));
  }

  if (isVerbose()) {
    info(stringifyStats(stats));
  }

  // note: watcher is optional
  resolve(watcher);
}

// error handling taken from https://webpack.github.io/docs/node.js-api.html#error-handling
async function onChange(
  err: any,
  stats: compiler.Stats,
  livereloadServer: Server,
  onChangeSuccess?: any
) {
  if (err) {
    // "hard" error
    return error(err);
  }

  if (stats.hasErrors()) {
    // "soft" error
    return error(stringifyStats(stats));
  }

  if (stats.hasWarnings()) {
    warn(stringifyStats(stats));
  }

  if (isVerbose()) {
    info(stringifyStats(stats));
  }

  if (onChangeSuccess) {
    await onChangeSuccess(stats);
  }

  // filter changes for live reloading
  const modules = getModules(stats);
  const changedModules = modules.filter(
    (module) => module.built && module.resource
  );
  const changedStyleModules = changedModules.filter((module) =>
    module.resource.match(/\.(css|less|sass)$/)
  );
  const hasOnlyStyleChanges =
    changedModules.length === changedStyleModules.length;
  if (hasOnlyStyleChanges) {
    livereloadServer.refresh('style.css');
  } else {
    livereloadServer.refresh('index.html');
  }
}

function optionallyModifyWebpackConfig(
  options: WebpackConfig | WebpackConfig[],
  command: Command
) {
  const path = join(process.cwd(), 'ws.config.js');
  const exists = existsSync(path);
  if (exists) {
    const modifyWebpackConfig = __non_webpack_require__(path);
    modifyWebpackConfig(command, options);
  }
}

export function getCompiler(
  options: WebpackConfig | WebpackConfig[],
  command: Command
) {
  optionallyProfile(options);
  optionallyModifyWebpackConfig(options, command);
  // https://github.com/Microsoft/TypeScript/issues/16816
  const compiler = webpack(options as any);
  return compiler;
}

export function compileAsync(
  options: WebpackConfig | WebpackConfig[],
  command: Command
) {
  const compiler = getCompiler(options, command);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => onBuild(resolve, reject, err, stats));
  });
}

export function watchAsync(
  livereloadServer: Server,
  options: WebpackConfig | WebpackConfig[],
  command: Command,
  onChangeSuccess?: (stats: compiler.Stats) => void
) {
  const compiler = getCompiler(options, command);

  let isInitialBuild = true;
  let hash: any;
  return new Promise((resolve, reject) => {
    const watching = compiler.watch({}, (err, stats) => {
      if (isInitialBuild) {
        isInitialBuild = false;
        onBuild(resolve, reject, err, stats);
      } else {
        // don't call callback, if hash hasn't change
        if (hash === (stats as any).hash) {
          return;
        } else {
          hash = (stats as any).hash;
        }
        onChange(err, stats, livereloadServer, onChangeSuccess);
      }
    });

    process.once('SIGINT', () => watching.close(() => process.exit()));
  });
}
