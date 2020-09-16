import { error, getLevel, info, levels, warn } from 'loglevel';
import webpack, { compiler } from 'webpack';
import { WebpackConfig } from './options';
import { chunk } from 'lodash';

export * from './options';

// interface SingleStats extends compiler.Stats {
//   compilation: any;
// }
// interface MultiStats {
//   stats: SingleStats;
// }
// // it looks like nested stats called "MultiStats" are used in "multi-compiler" mode (e.g. an array of configs)
// // interface MultiStats {
// //   stats: compiler.Stats;
// // }
// type Stats = SingleStats | MultiStats;

export const statsStringifierOptions: compiler.StatsToStringOptions = {
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

export const verboseStatsStringifierOptions: compiler.StatsToStringOptions = {
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

function optionallyProfile(options: WebpackConfig) {
  if (isVerbose()) {
    if (Array.isArray(options)) {
      options.map(option => option.profile = true);
    } else {
      options.profile = true;
    }
  }
}

function stringifyStats(stats: any): string {
  const stringifierOptions = isVerbose() ? verboseStatsStringifierOptions : statsStringifierOptions;
  return stats.toString(stringifierOptions);
}

function getModules(stats: any): Array<any> {
  // see https://github.com/webpack/webpack.js.org/issues/480
  const isMultiStats = !!stats.stats;
  if (isMultiStats) {
    let modules: Array<any> = [];
    stats.stats.forEach((stats: any) => modules = modules.concat(stats.compilation.modules));
    return modules;
  } else {
    return stats.compilation.modules;
  }
}

// error handling taken from https://webpack.github.io/docs/node.js-api.html#error-handling
function onBuild(resolve: any, reject: any, err: any, stats: compiler.Stats, watcher?: any) {
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
async function onChange(err: any, stats: compiler.Stats, livereloadServer: any, onChangeSuccess?: any) {
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
  const changedModules = modules.filter((module: any) => module.built && module.resource);
  const changedStyleModules = changedModules.filter((module: any) => module.resource.match(/\.(css|less|sass)$/));
  let hasOnlyStyleChanges = changedModules.length === changedStyleModules.length;
  if (hasOnlyStyleChanges) {
    livereloadServer.refresh('style.css');
  } else {
    livereloadServer.refresh('index.html');
  }
}

export async function compileAsync(options: any) {
  optionallyProfile(options);
  const languagePlugins: any = options.plugins.filter((plugin: any) => plugin.options && plugin.options.template === 'src/index.html');
  const otherPlugins: any = options.plugins.filter((plugin: any) => !(plugin.options && plugin.options.template === 'src/index.html'));
  for (const currentLanguageBatch of chunk(languagePlugins, 10)) {
    await new Promise((resolve, reject) => {
      info(`Building ${currentLanguageBatch.map((x: any) => x.options.locale).join(', ')} ...`);
      options.plugins = [...currentLanguageBatch, ...otherPlugins];
      const compiler = webpack(options);
      compiler.run((err, stats) => onBuild(resolve, reject, err, stats));
    });
  }
}

export function watchAsync(livereloadServer: any, options: WebpackConfig, onChangeSuccess?: (stats: compiler.Stats) => void) {
  optionallyProfile(options);
  const compiler = webpack(options);
  let isInitialBuild = true;
  let hash: any;
  return new Promise((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
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
  });
}
