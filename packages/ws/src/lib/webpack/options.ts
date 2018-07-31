import { join } from 'path';
import { warn } from 'loglevel';
import globby from 'globby';
import { pull } from 'lodash';
import webpack, {
  DefinePlugin,
  Configuration,
  Rule,
  Plugin,
  PerformanceOptions,
  Output,
  Entry
} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackNodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { readJsonSync } from 'fs-extra-promise';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { resolve as resolveModule } from '../resolve';
import { project } from '../../project';
import { EnvOptions } from '../../options';
import { TypingsPlugin } from '../typescript';

const HappyPack: any = require('happypack');

/**
 * We make some properties of `webpack.Configuration` mandatory. It is easier for future usage, so we don't
 * need to check, if they are available or not.
 */
export type StrictOutput = Output & {
  filename: string;
  path: string;
};

export interface WebpackConfig extends Configuration {
  entry: Entry;
  output: StrictOutput;
}

export const nodeSourceMapEntry = 'source-map-support/register';

export const performance: PerformanceOptions = {
  hints: false
};

export const babelNode = {
  presets: [
    [
      resolveModule('babel-preset-env'),
      {
        targets: { node: project.ws.targets.node },
        useBuiltIns: true
      }
    ],
    resolveModule('babel-preset-stage-0')
  ],
  plugins: [resolveModule('babel-plugin-transform-decorators-legacy')],
  // this removes the "[BABEL] Note: The code generator has deoptimised the styling of..." warning
  // I don't think we need `compact`, because our code is minified for production separately
  compact: false
};

export const babelBrowser = {
  presets: [
    [
      resolveModule('babel-preset-env'),
      {
        targets: { browsers: project.ws.targets.browsers },
        modules: false,
        useBuiltIns: true
      }
    ],
    resolveModule('babel-preset-react'),
    resolveModule('babel-preset-stage-0')
  ],
  plugins: [
    resolveModule('babel-plugin-transform-decorators-legacy'),
    resolveModule('react-hot-loader/babel')
  ],
  // this removes the "[BABEL] Note: The code generator has deoptimised the styling of..." warning
  // I don't think we need `compact`, because our code is minified for production separately
  compact: false
};

export type Command = 'build' | 'build -p' | 'unit' | 'e2e';

const getBabelOptions = (target: Target) => {
  const babelOptions = target === 'node' ? babelNode : babelBrowser;
  return babelOptions;
};

export const getHappyPackPluginJs = (target: Target, command: Command) =>
  new HappyPack({
    id: `js-${target}-${command}`,
    compilerId: `js-${target}-${command}`,
    threads: 2,
    verbose: false,
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          ...getBabelOptions(target)
        }
      }
    ]
  });

export const getHappyPackPluginTs = (target: Target, command: Command) =>
  new HappyPack({
    id: `ts-${target}-${command}`,
    compilerId: `ts-${target}-${command}`,
    threads: 2,
    verbose: false,
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          ...getBabelOptions(target)
        }
      },
      {
        loader: 'ts-loader',
        options: {
          // this automatically sets `transpileOnly` to `true`
          happyPackMode: true,
          logLevel: 'warn',
          configFile: project.ws.tsconfigPath,
          compilerOptions: {
            sourceMap: true
          }
        }
      }
    ]
  });

const getJsRule = (target: Target, command: Command): Rule => ({
  test: /\.js(x?)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: join(process.cwd(), 'node_modules', '.cache-loader')
      }
    },
    {
      loader: `happypack/loader?id=js-${target}-${command}&compilerId=js-${target}-${command}`
    }
  ]
});

const getTsRule = (target: Target, command: Command): Rule => ({
  test: /\.ts(x?)$/,
  use: [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: join(process.cwd(), 'node_modules', '.cache-loader')
      }
    },
    {
      loader: `happypack/loader?id=ts-${target}-${command}&compilerId=ts-${target}-${command}`
    }
  ]
});

const getCssRule = (command: Command): Rule => ({
  test: /\.css$/,
  use: [
    command === 'build -p'
      ? MiniCssExtractPlugin.loader
      : { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: () => [
          autoprefixer({
            browsers: project.ws.targets.browsers
          })
        ]
      }
    }
  ]
});

export const imageRule: Rule = {
  test: /\.(png|jpg|gif|svg)$/,
  loader: 'url-loader?limit=1000&name=[name]-[hash].[ext]'
};

export const eotRule: Rule = {
  test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'file-loader'
};

export const woffRule: Rule = {
  test: /\.(woff|woff2)$/,
  loader: 'url-loader?prefix=font/&limit=5000'
};

export const ttfRule: Rule = {
  test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
};

export const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css'
});

export const miniCssExtractPluginHashed = new MiniCssExtractPlugin({
  filename: '[name].[hash].css',
  chunkFilename: '[id].[hash].css'
});

export const defineProductionPlugin = new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

export const indexHtmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html'
});

export const resolveLoader = {
  // if you symlink the ws tool (e.g. while development), you want to resolve loaders
  // relative to the ws tool first (just like a normale `require()` would work)
  modules: [
    // relative to `dist/index.js`
    join(__dirname, '..', 'node_modules'),
    // support pnpm
    // see https://github.com/webpack/webpack/issues/5087
    join(__dirname, '..', '..', '..'),
    join(process.cwd(), 'node_modules'),
    'node_modules'
  ],
  alias: {
    // see https://www.npmjs.com/package/copy-loader
    ['copy-loader']: `file-loader?name=[path][name].[ext]&context=./${
      project.ws.srcDir
    }`
  }
};

// defaults
// see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L75
const defaultExtensions = ['.js'];

const tsExtensions = ['.ts', '.tsx', ...defaultExtensions];

const mainFieldsNode = [
  'webpack',
  // defaults
  // see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L86
  'module',
  'main'
];

const mainFieldsBrowser = [
  'webpack',
  // defaults
  // see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L84
  'browser',
  'module',
  'main'
];

export const extensions =
  project.ws.entryExtension === 'js' ? defaultExtensions : tsExtensions;

export const resolve = {
  extensions,
  mainFields: project.ws.type === 'node' ? mainFieldsNode : mainFieldsBrowser
};

// TODO: Can this be removed? https://webpack.js.org/plugins/loader-options-plugin/
export const defaultLoaderOptions = {
  resolve: {
    extensions
  }
};

export const loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
  options: defaultLoaderOptions
});

export const productionOptionsPlugin = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: defaultLoaderOptions
});

export const forkTsCheckerPlugin = new ForkTsCheckerWebpackPlugin({
  tsconfig: project.ws.tsconfigPath,
  silent: true,
  async: false,
  checkSyntacticErrors: true
  // `watch` is optional, but docs say it improves performance (less stat calls)
  // watch: [project.ws.srcDir, project.ws.testsDir]
});

export const devtool = 'inline-source-map';

export const devtoolProduction = 'source-map';

export const externalsSpa = project.ws.externals ? [project.ws.externals] : [];

// dirty fix until https://github.com/liady/webpack-node-externals/issues/39 is solved
let isWorkspace = false;
try {
  const pkg = readJsonSync(join(process.cwd(), '..', '..', 'package.json'));
  isWorkspace = !!pkg.workspaces;
} catch (err) {
  // no workspace
}

export const externalsNode = [
  // require json files with nodes built-in require logic
  function(_context: any, request: any, callback: any) {
    if (/\.json$/.test(request)) {
      callback(null, 'commonjs ' + request);
    } else {
      callback();
    }
  },
  // in order to ignore all modules in node_modules folder
  WebpackNodeExternals({
    modulesDir: isWorkspace ? join(process.cwd(), '..', '..') : undefined
  })
];

export const externalsBrowser = [
  (_context: any, request: any, callback: any) => {
    // if it starts with a letter (and *not* a path like './', '../' or '/') we treat this module as external
    // except 'mercateo/i18n'
    if (/^[a-zA-Z]/.test(request) && !request.includes('mercateo/i18n')) {
      callback(null, request);
    } else {
      callback();
    }
  },
  ...externalsSpa
];

function isOldEnzyme() {
  const { devDependencies = {} } = project;
  const { enzyme = '' } = devDependencies;
  if (
    enzyme.startsWith('2.') ||
    enzyme.startsWith('~2.') ||
    enzyme.startsWith('^2.')
  ) {
    warn('You use an old Enzyme version. Please upgrade.');
    return true;
  } else {
    return false;
  }
}

export const enzymeExternals = isOldEnzyme()
  ? [
      'react/lib/ExecutionEnvironment',
      'react/lib/ReactContext',
      'react/addons',
      'react-addons-test-utils'
    ]
  : [];

export const node = {
  __dirname: false,
  __filename: false
};

export const baseConfig: Configuration = {
  performance,
  resolveLoader,
  resolve,
  devtool,
  mode: 'development'
};

export const releaseConfig: Configuration = {
  devtool: devtoolProduction,
  performance: {
    hints: 'warning'
  }
};

export const nodeConfig: Configuration = {
  target: 'node',
  node,
  externals: externalsNode
};

export type Target = 'spa' | 'node' | 'browser';

export const getEntryAndOutput = (target: Target, command: Command) => {
  const entry: Entry = {
    index: project.ws.srcEntry
  };

  const output: StrictOutput = {
    publicPath: project.ws.publicPath,
    path: join(process.cwd(), project.ws.distDir),
    filename: '[name].js',
    // removes tabs (better for multiline strings)
    sourcePrefix: ''
  };

  // command specific config
  if (command === 'build -p') {
    output.path = join(process.cwd(), project.ws.distReleaseDir);
  } else if (command === 'unit') {
    let pattern: string[] = [];
    if (project.ws.testsPattern) {
      pattern = Array.isArray(project.ws.testsPattern)
        ? project.ws.testsPattern
        : [project.ws.testsPattern];
    }
    entry.index = globby.sync([project.ws.unitEntry, ...pattern]);
    output.path = join(process.cwd(), project.ws.distTestsDir);
  } else if (command === 'e2e') {
    entry.index = project.ws.e2eEntry;
    output.path = join(process.cwd(), project.ws.distTestsDir);
  }

  // target specific config
  if (target === 'browser') {
    output.libraryTarget = 'umd';
    output.library = project.name;
  } else if (target === 'spa') {
    output.libraryTarget = 'umd'; // is this needed?
  } else if (target === 'node') {
    const currentEntry = Array.isArray(entry.index)
      ? entry.index
      : [entry.index as string];
    entry.index = [nodeSourceMapEntry, ...currentEntry];
    output.libraryTarget = 'commonjs2';
  }

  // special cases
  if (target === 'spa' && command === 'build -p') {
    output.filename = '[name].[chunkhash].js';
    output.chunkFilename = '[name].[chunkhash].lazy.js';
  }

  return { entry, output };
};

export const getModuleAndPlugins = (
  target: Target,
  command: Command,
  options: EnvOptions
) => {
  const rules: Rule[] = [
    getJsRule(target, command),
    getCssRule(command),
    imageRule,
    eotRule,
    woffRule,
    ttfRule
  ];
  const plugins: Plugin[] = [
    getHappyPackPluginJs(target, command),
    miniCssExtractPlugin,
    loaderOptionsPlugin
  ];

  if (options.parent.env.length) {
    const definitions = options.parent.env.reduce(
      (definitions, { key, value }) => {
        definitions[`process.env.${key}`] = JSON.stringify(value);
        return definitions;
      },
      {} as { [key: string]: string }
    );
    const definePlugin = new DefinePlugin(definitions);
    plugins.push(definePlugin);
  }

  if (project.ws.tsconfig) {
    rules.push(getTsRule(target, command));
    plugins.push(getHappyPackPluginTs(target, command));
    plugins.push(forkTsCheckerPlugin);
  }

  if (target === 'spa') {
    plugins.push(indexHtmlPlugin);
  }

  // does node need a production build?
  if (command === 'build -p') {
    plugins.push(defineProductionPlugin);
    plugins.push(
      new CleanWebpackPlugin([project.ws.distReleaseDir], {
        verbose: false,
        root: process.cwd()
      })
    );
    if (project.ws.tsconfig) {
      plugins.push(new TypingsPlugin(project.ws.distReleaseDir));
    }
  } else if (command === 'build') {
    plugins.push(
      new CleanWebpackPlugin([project.ws.distDir], {
        verbose: false,
        root: process.cwd()
      })
    );
    if (project.ws.tsconfig && target === 'node') {
      plugins.push(new TypingsPlugin(project.ws.distDir));
    }
  }

  if (target === 'spa' && command === 'build -p') {
    // should this be used in non-spa's, too?
    // should we remove loaderOptionsPlugin then?
    plugins.push(productionOptionsPlugin);

    // switch css plugin
    pull(plugins, miniCssExtractPlugin);
    plugins.push(miniCssExtractPluginHashed);
  }

  return { module: { rules }, plugins };
};
