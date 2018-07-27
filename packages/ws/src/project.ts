import { join, basename } from 'path';
import chalk from 'chalk';
import { existsSync, readJsonSync } from 'fs-extra-promise';
import {
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
  CompilerOptions
} from 'typescript';

const { yellow } = chalk;

const unvalidatedProject = readJsonSync(join(process.cwd(), 'package.json'));

export const TYPE = {
  SPA: 'spa' as 'spa',
  NODE: 'node' as 'node',
  BROWSER: 'browser' as 'browser'
};

const TYPES = [TYPE.SPA, TYPE.NODE, TYPE.BROWSER];

/**
 * Our selenium grid settings. Only needed if you run tests with a custom selenium grid.
 */
export interface SeleniumGridConfig {
  /**
   * The host of selenium.
   */
  host: string;
  /**
   * The port of selenium.
   */
  port: number;
  /**
   * User name which should be used to access selenium (e.g. needed for Sauce Labs).
   *
   * You can also set `envUser` in in your `package.json` and we get the user from `process.env`.
   * E.g. when `"envUser": "SAUCE_USERNAME"` is set we use `process.env['SAUCE_USERNAME']` as `user`.
   */
  user?: string;
  /**
   * Password which should be used to access selenium (e.g. needed for Sauce Labs).
   *
   * You can also set `envPassword` in in your `package.json` and we get the password from
   * `process.env`. E.g. when `"envPassword": "SAUCE_ACCESS_KEY"` is set we use
   * `process.env['SAUCE_ACCESS_KEY']` as `password`.
   */
  password?: string;
  /**
   * Tries to use the `browsers` query only against available browsers on the selenium grid.
   * E.g. `"last 2 Chrome versions"` would return the last 2 chrome versions available on the
   * grid, not the last 2 released chrome versions. Defaults to `false`.
   *
   * This is experimental!
   */
  filterForAvailability: boolean;
}

/**
 * Our i18n settings. Only needed for translated projects.
 */
export interface I18nConfig {
  /**
   * The locales your project supports. A locale consists of a language code (expressed
   * by two lower case characters), a `_` and a country code (expressed by two upper case
   * characters). E.g. valid locales are `'en_GB'`, `'de_AT'`, `'it_IT'` and so on.
   *
   * Note that you can save shared translations of a language in a `.properties` file without
   * a country code (e.g. if `'de_DE'` and `'de_AT'` share translations, they can be stored
   * in a `de.properties` file). That way you don't have to save duplicates.
   */
  locales: string[];
  /**
   * If you want to have the benefits of i18n like using the message format, but you _really_
   * just want to support _one_ locale, you can generate your projects as if you would not
   * support any locale at all (e.g. generated SPAs aren't nested in a directory for every
   * locale).
   */
  isSingleLocale?: boolean;
  /**
   * The directory where your `.properties` with translations are located. Defaults to `i18n`.
   */
  dir: string;
  /**
   * The directory where your generated translation are placed. Defaults to `dist-i18n`.
   */
  distDir: string;
  /**
   * You can group translations in so called _features_ (e.g. `common`, `errors`, `forms`).
   *
   * Note that the translation keys must be unique, because every feature is merged into
   * _one_ translation file at the end. We do that on purpose, so we can reuse a translated
   * feature like `common-errors` across several projects, but override certain keys with a
   * translated feature like `specific-errors`, if we need to.
   *
   * Features are _optional_.
   */
  features?: string[];
  /**
   * If you translations aren't maintained in your repository, you can optionally provide
   * a _templated URL_ and we try to download the translations. You can set `{locale}` and
   * `{feature}` in your URL as params (e.g. `https://foo.com/i18n?language={locale}&project={feature}`).
   */
  importUrl?: string;
}

/**
 * This is the `ws` configuration used in the projects `package.json`.
 */
export interface WsConfig {
  /**
   * We currently support four types of projects: `'spa'`, `'node'` and `'browser'`.
   */
  type: 'spa' | 'node' | 'browser';
  /**
   * The file extension of your entry file. Either `js`, `ts` or `tsx`.
   * This value is set automatically.
   */
  entryExtension: 'js' | 'ts' | 'tsx';
  /**
   * If this is a TypeScript project, we will save the `tsconfig.json` here.
   */
  tsconfig?: CompilerOptions;
  /**
   * If this is a TypeScript project, we will save the path to `tsconfig.json` here.
   */
  tsconfigPath?: string;
  /**
   * Probably only needed for 'browser' projects currently.
   * See https://webpack.github.io/docs/configuration.html#externals.
   */
  externals?: any;
  /**
   * The directory where your source code is located. Defaults to `'src'`.
   */
  srcDir: string;
  /**
   * The entry file for your source code. This value is set automatically.
   * It could look this: `./src/index.ts`.
   */
  srcEntry: string;
  /**
   * The _optional_ entry file for source code at the root level of a localized spa.
   * This value is set automatically.
   * It could look this: `./src/index.i18n.ts`.
   */
  srcI18nEntry: string;
  /**
   * The directory where your tests are located. Defaults to `'tests'`.
   */
  testsDir: string;
  /**
   * The pattern that is used to find tests
   */
  testsPattern?: string | string[];
  /**
   * The entry file for your unit tests. This value is set automatically.
   * It could look this: `./tests/unit.ts`.
   */
  unitEntry: string;
  /**
   * The entry file for your e2e tests. This value is set automatically.
   * It could look this: `./tests/e2e.ts`.
   */
  e2eEntry: string;
  /**
   * The directory where your development build is generated. Defaults to `'dist'`.
   */
  distDir: string;
  /**
   * The directory where your tests build is generated. Defaults to `'dist-tests'`.
   */
  distTestsDir: string;
  /**
   * The directory where your production build is generated (only SPAs). Defaults to `'dist-release'`.
   */
  distReleaseDir: string;
  /**
   * SPA only.
   * Public path of your app. Defaults to `""`
   * See https://webpack.js.org/configuration/output/#output-publicpath for an explanation.
   */
  publicPath: string;
  /**
   * `targets` taken from [`babel-preset-env`](https://github.com/babel/babel-preset-env).
   * We only use `browsers` and `node` properties for now.
   */
  targets: {
    /**
     * A [browserslist](https://github.com/ai/browserslist) compatible string to specify which
     * browsers should be used for selenium testing (if it is enabled) and for
     * [autoprefixer](https://github.com/postcss/autoprefixer).
     * Defaults to `'> 1%, last 2 versions, Firefox ESR'`.
     */
    browsers: string;
    /**
     * If you want to compile against the current node version, you can specify "node": "current", which would be the same as "node": parseFloat(process.versions.node).
     */
    node: string | number;
  };
  /**
   * Our selenium grid settings. Only needed if you run tests with a custom selenium grid.
   */
  selenium?: SeleniumGridConfig;
  /**
   * Our i18n settings. Only needed for translated projects.
   */
  i18n?: I18nConfig;
  /**
   * Set this to `true` to ignore update notifications.
   */
  ignoreUpdates?: boolean;
}

export interface PackageConfig {
  /**
   * The name of your project taken from `package.json`.
   */
  name: string;
  /**
   * The dependencies of your project.
   */
  dependencies?: { [dependency: string]: string };
  /**
   * The devDependencies of your project.
   */
  devDependencies?: { [dependency: string]: string };
  /**
   * Flags if this package is private.
   */
  private?: boolean;
  /**
   * A description of your project.
   */
  description?: string;
  /**
   * Keywords which describe your project.
   */
  keywords?: string[];
  /**
   * Path to the generated typescript declarations.
   */
  typings?: string;
  /**
   * This is the `ws` configuration used in the projects `package.json`.
   */
  ws: WsConfig;
}

const sampleConfig = `

  {
    ${yellow('"ws"')}: {
      "type": "${TYPES.join('" | "')}"
    }
  }
`;

export function validate(pkg: any): PackageConfig {
  if (!pkg.ws) {
    throw `Your ${yellow('package.json')} needs a ${yellow(
      'ws'
    )} config. It could look like this:${sampleConfig}`;
  }

  if (!pkg.ws.type) {
    throw `You need to specify a ${yellow(
      'type'
    )}. This can be any of the following values: ${yellow(TYPES.join(', '))}.`;
  }

  if (!TYPES.some((type) => type === pkg.ws.type)) {
    throw `Your type ${yellow(
      pkg.ws.type
    )} doesn't match any of the valid values: ${yellow(TYPES.join(', '))}.`;
  }

  if (!pkg.name) {
    throw `You need to specify a ${yellow('name')} in your package.json.`;
  }

  if (!pkg.ws.srcDir) {
    pkg.ws.srcDir = 'src';
  }

  if (!pkg.ws.testsDir) {
    pkg.ws.testsDir = 'tests';
  }

  if (!pkg.ws.distDir) {
    pkg.ws.distDir = 'dist';
  }

  if (!pkg.ws.distTestsDir) {
    pkg.ws.distTestsDir = 'dist-tests';
  }

  if (!pkg.ws.distReleaseDir) {
    pkg.ws.distReleaseDir = 'dist-release';
  }

  if (pkg.ws.i18n && !pkg.ws.i18n.dir) {
    pkg.ws.i18n.dir = 'i18n';
  }

  if (pkg.ws.i18n && !pkg.ws.i18n.distDir) {
    pkg.ws.i18n.distDir = 'dist-i18n';
  }

  // check if this project is using typescript (and tsx)
  const tsconfigRoot = join(process.cwd(), 'tsconfig.json');
  const tsconfigSrc = join(process.cwd(), pkg.ws.srcDir, 'tsconfig.json');
  if (existsSync(tsconfigSrc)) {
    pkg.ws.tsconfigPath = tsconfigSrc;
  } else if (existsSync(tsconfigRoot)) {
    pkg.ws.tsconfigPath = tsconfigRoot;
  }
  if (pkg.ws.tsconfigPath) {
    const { config } = readConfigFile(pkg.ws.tsconfigPath, sys.readFile);
    const host = {
      useCaseSensitiveFileNames: false,
      readDirectory: sys.readDirectory,
      fileExists: sys.fileExists,
      readFile: sys.readFile
    };
    const { options } = parseJsonConfigFileContent(
      config,
      host,
      basename(pkg.ws.tsconfigPath)
    );
    if (options) {
      pkg.ws.tsconfig = options;
      if (options.jsx) {
        pkg.ws.entryExtension = 'tsx';
      } else {
        pkg.ws.entryExtension = 'ts';
      }
    }
  } else {
    pkg.ws.entryExtension = 'js';
  }

  // entry files
  pkg.ws.srcEntry = `./${pkg.ws.srcDir}/index.${pkg.ws.entryExtension}`;
  pkg.ws.srcI18nEntry = `./${pkg.ws.srcDir}/index.i18n.${
    pkg.ws.entryExtension
  }`;
  pkg.ws.unitEntry = `./${pkg.ws.testsDir}/unit.${pkg.ws.entryExtension}`;
  pkg.ws.e2eEntry = `./${pkg.ws.testsDir}/e2e.${pkg.ws.entryExtension}`;

  if (!pkg.ws.publicPath) {
    pkg.ws.publicPath = '';
  }

  // defaults for browsers
  if (!pkg.ws.targets) {
    pkg.ws.targets = {};
  }

  if (!pkg.ws.targets.node) {
    pkg.ws.targets.node = '8.9';
  }

  if (!pkg.ws.targets.browsers) {
    pkg.ws.targets.browsers = '> 1%, last 2 versions, Firefox ESR';
  }

  // defaults for selenium
  if (pkg.ws.selenium) {
    if (!pkg.ws.selenium.filterForAvailability) {
      pkg.ws.selenium.filterForAvailability = false;
    }
    if (pkg.ws.selenium.envUser) {
      pkg.ws.selenium.user = process.env[pkg.ws.selenium.envUser];
    }
    if (pkg.ws.selenium.envPassword) {
      pkg.ws.selenium.password = process.env[pkg.ws.selenium.envPassword];
    }
  }

  return pkg;
}

export const project = validate(unvalidatedProject);

const { srcDir, testsDir } = project.ws;
export const sourceFilePatterns = `{${srcDir},${testsDir}}/**/*.{tsx,ts,jsx,js}`;
