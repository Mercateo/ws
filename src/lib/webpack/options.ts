import { join } from 'path';
import webpack, { DefinePlugin, optimize } from 'webpack';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import WebpackNodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { resolve as resolveFile } from '../resolve';
import { project } from '../../project';

/**
 * We make some properties of `webpack.Configuration` mandatory. It is easier for future usage, so we don't
 * need to check, if they are available or not.
 */
export interface WebpackSingleConfig extends webpack.Configuration {
  entry: string | Array<string> | webpack.Entry;
  output: webpack.Output & {
    filename: string;
    path: string;
  };
  // new option (see https://medium.com/webpack/webpack-performance-budgets-13d4880fbf6d)
  performance?: {
    maxAssetSize?: number;
    maxEntrypointSize?: number;
    hints?: false | 'warning' | 'error';
  };
}

export type WebpackConfig = WebpackSingleConfig | Array<WebpackSingleConfig>;

export const nodeSourceMapEntry = 'source-map-support/register';

export const output = {
  filename: 'index.js',
  // removes tabs (better for multiline strings)
  sourcePrefix: ''
};

export const outputDev = {
  ...output,
  path: join(process.cwd(), project.ws.distDir)
};

export const outputRelease = {
  ...output,
  path: join(process.cwd(), project.ws.distReleaseDir)
};

export const outputTest = {
  ...output,
  path: join(process.cwd(), project.ws.distTestsDir)
};

export const babelNode = {
  presets: [
    [
      resolveFile('babel-preset-env'),
      {
        targets: { node: project.ws.targets.node },
        useBuiltIns: true
      }
    ],
    resolveFile('babel-preset-stage-0')
  ],
  plugins: [resolveFile('babel-plugin-transform-decorators-legacy')]
};

export const babelBrowser = {
  presets: [
    [
      resolveFile('babel-preset-env'),
      {
        targets: project.ws.type === 'electron'
          ? { electron: project.ws.targets.electron }
          : { browsers: project.ws.targets.browsers },
        modules: false,
        useBuiltIns: true
      }
    ],
    resolveFile('babel-preset-react'),
    resolveFile('babel-preset-stage-0')
  ],
  plugins: [resolveFile('babel-plugin-transform-decorators-legacy')],
  // this removes the "[BABEL] Note: The code generator has deoptimised the styling of..." warning
  // I don't think we need `compact`, because our code is minified for production separately
  compact: false
};

export type Command = 'build' | 'build -p' | 'unit' | 'e2e';

export const getJsLoaderConfig = (command: Command) => {
  const isNode = project.ws.type === 'node';
  const isE2e = command === 'e2e';

  const babelOptions = isNode || isE2e ? babelNode : babelBrowser;
  const exclude = /node_modules/;

  return {
    test: /\.js(x?)$/,
    exclude,
    loader: 'babel-loader',
    options: {
      ...babelOptions,
      cacheDirectory: true
    }
  };
};

const getTsLoaderConfig = (command: Command) => {
  const isNode = project.ws.type === 'node';
  const isE2e = command === 'e2e';
  const isNodeBuild = isNode && command === 'build';
  const isBrowserRelease =
    project.ws.type === 'browser' && command === 'build -p';

  // only needed when declarations are generated
  let outDir: string | undefined = undefined;
  if (isBrowserRelease) {
    outDir = project.ws.distReleaseDir;
  } else if (isNodeBuild) {
    outDir = project.ws.distDir;
  }

  const babelOptions = isNode || isE2e ? babelNode : babelBrowser;
  return {
    test: /\.ts(x?)$/,
    use: [
      {
        loader: 'string-replace-loader',
        options: {
          search: /_import\(/g,
          replace: 'import('
        }
      },
      {
        loader: 'babel-loader',
        options: {
          ...babelOptions,
          cacheDirectory: true
        }
      },
      {
        loader: 'ts-loader',
        options: {
          logLevel: 'warn',
          compilerOptions: {
            sourceMap: true,
            declaration: isBrowserRelease || isNodeBuild
            // outDir
          }
        }
      }
      // {
      //   loader: 'awesome-typescript-loader',
      //   options: {
      //     silent: true,
      //     // note 1: creating declarations only works with an *empty* cache
      //     // note 2: it looks like using the cache and babel in this way isn't really faster currently
      //     //         that's why we don't use it for now and just use `babel-loader`
      //     // useCache: true,
      //     // cacheDirectory: 'node_modules/.awesome-typescript-loader-cache',
      //     // useBabel: true,
      //     // babelOptions,
      //     // babelCore: resolveFile('babel-core'),
      //     declaration: isBrowserRelease || isNodeBuild,
      //     outDir
      //   }
      // }
    ]
  };
};

export const jsonLoader = {
  test: /\.json$/,
  loader: 'json-loader'
};

export const cssLoader = {
  test: /\.css$/,
  loader: ExtractTextWebpackPlugin.extract({
    fallback: [
      // OLD: `style-loader?context=${process.cwd()}`
      {
        loader: 'style-loader'
      }
    ],
    use: [
      // OLD: `css-loader?sourceMap&context=${process.cwd()}!postcss-loader?sourceMap`
      // context = root?
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
  })
};

export const lessLoader = {
  test: /\.less/,
  loader: ExtractTextWebpackPlugin.extract({
    fallback: [
      // OLD: `style-loader?context=${process.cwd()}`
      {
        loader: 'style-loader'
      }
    ],
    use: [
      // OLD: `css-loader?sourceMap&context=${process.cwd()}!postcss-loader?sourceMap!less-loader?sourceMap`
      // context = root?
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
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  })
};

export const imageLoader = {
  test: /\.(png|jpg|gif|svg)$/,
  loader: 'url-loader?limit=1000&name=[name]-[hash].[ext]'
};

export const eotLoader = {
  test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'file-loader'
};

export const woffLoader = {
  test: /\.(woff|woff2)$/,
  loader: 'url-loader?prefix=font/&limit=5000'
};

export const ttfLoader = {
  test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
};

export const extractCssPlugin = new ExtractTextWebpackPlugin('style.css');

// export const extractCssMinPlugin = new ExtractTextWebpackPlugin('style.min.css');

export const extractCssHashPlugin = new ExtractTextWebpackPlugin(
  'style-[chunkhash].css'
);

export const defineProductionPlugin = new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

export const minifyJsPlugin = new optimize.UglifyJsPlugin();

export const indexHtmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html'
});

export const resolveLoader = {
  // if you symlink the ws tool (e.g. while development), you want to resolve loaders
  // relative to the ws tool first (just like a normale `require()` would work)
  modules: [
    // relative to `dist/index.js`
    join(__dirname, '..', 'node_modules'),
    join(process.cwd(), 'node_modules'),
    'node_modules'
  ],
  alias: {
    // see https://www.npmjs.com/package/copy-loader
    ['copy-loader']: `file-loader?name=[path][name].[ext]&context=./${project.ws
      .srcDir}`
  }
};

// defaults
// see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L75
const defaultExtensions = ['.js'];

const tsExtensions = ['.ts', '.tsx'].concat(defaultExtensions);

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

export const extensions = project.ws.entryExtension === 'js'
  ? defaultExtensions
  : tsExtensions;

export const resolve = {
  extensions,
  mainFields: project.ws.type === 'node' ? mainFieldsNode : mainFieldsBrowser
};

// TODO: Can this be removed? https://webpack.js.org/plugins/loader-options-plugin/
export const defaultLoaderOptions = {
  resolve: {
    extensions
  }
  // postcss: () => [
  //   autoprefixer({
  //     browsers: project.ws.targets.browsers
  //   })
  // ]
};

export const loaderOptionsPlugin = new (webpack as any).LoaderOptionsPlugin({
  options: defaultLoaderOptions
});

export const productionOptionsPlugin = new (webpack as any)
  .LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: defaultLoaderOptions
});

export const devtool = 'inline-source-map';

export const devtoolProduction = 'source-map';

// export const devtoolTest = 'inline-source-map';

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
  WebpackNodeExternals()
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
  }
].concat(project.ws.externals ? [project.ws.externals] : []);

export const enzymeExternals = [
  'react/lib/ExecutionEnvironment',
  'react/lib/ReactContext',
  'react/addons',
  'react-addons-test-utils'
];

export const getModuleConfig = (command: Command) => {
  const commonRules = [getJsLoaderConfig(command), getTsLoaderConfig(command)];

  const specificRules = project.ws.type === 'node'
    ? []
    : [
        jsonLoader,
        cssLoader,
        lessLoader,
        imageLoader,
        eotLoader,
        woffLoader,
        ttfLoader
      ];

  return {
    rules: [...commonRules, ...specificRules]
  };
};
