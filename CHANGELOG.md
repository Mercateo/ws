The changelog is currently handwritten.

# 3.0.0-4 (2018-08-01)

- `getWebpackConfig` expects an optional options object now.
- You can pass build time env vars via `getWebpackConfig({ env: { foo: 'bar' }})` now.

# 3.0.0-3 (2018-07-31)

- Added Cypress example.

# 3.0.0-2 (2018-07-27)

- Fixed watch config and added support for history fallback, so reloading on any URL works correctly.

# 3.0.0-1 (2018-07-27)

- Loading JSON files works again.

# 3.0.0-0 (2018-07-26)

This is a release with **BREAKING CHANGES**.

- Removed support for Less. (You need to use plain CSS or a CSS-in-JS solution.)
- Removed support for `_import`. (Use `import()` instead.)
- Removed support for Enzyme v2. (Use Enzyme v3 instead.)
- Removed support for automatically started Selenium tests. (Use something like Cypress instead.)
- Removed support for Unit tests run in the browser with Karma and Mocha. (Use Jest instead.)
- Removed support for custom webpack loaders in Unit tests. (It was never really needed so far. Maybe it comes back later.)
- Removed support for Electron. (We haven't used it in a long time. Maybe it comes back later.)

This is **new and shiny**:

- We use Webpack v4.
- We encourage to use multiple `tsconfig.json`'s.
- We encourage to use the Jest/Webpack CLIs directly and just use the configs prepared by `@mercateo/ws`.
- We encourage to manually prebuild translations now via `$ yarn ws-build-translations`.

# 2.11.2 (2018-07-06)
# 2.11.1 (2018-07-06)

- Try [`workspace-release`](https://github.com/donaldpipowitch/workspace-release).

# 2.11.0 (2018-06-25)

- Add initial config for Jest and expose Babel config via `import { getJestConfig, getBabelConfig } from '@mercateo/ws'`.
- Made Node 8.9 the new minimum Node version for ws itself as well as the default value for Node projects build with the ws tool.

# 2.10.0 (2018-04-24)

- Allow setting `testsPattern?: string | string[];` in your `ws` config as an alternative way to specify unit tests.

# 2.9.3 (2018-01-16)

- Try to prevent another hanging running webpack process.

# 2.9.2 (2018-01-10)

- Close webpack correctly in `watch --hot` mode.

# 2.9.1 (2018-01-09)

- Updated some deps and correctly set prettier range to use new `arrowParens` in all cases.

# 2.9.0 (2017-12-18)

- Pass any environment variables to your build step by using the `-e`/`--env` params (e.g. `$ ws build -e FOO=bar`).

# 2.8.0 (2017-12-18)

- You can now use `module.exports = require('@mercateo/ws/prettier.config');` as a `prettier.config.js` in your project root for a shared prettier config. I also added `arrowParens: 'always'` in this step.

# 2.7.4 (2017-12-05)

- Fixed bug with open webpack watchers which aren't closed correctly.

# 2.7.3 (2017-12-01)

- Compile translations for `$ ws watch` in Node projects, too.

# 2.7.2 (2017-11-27)

- Compile translations for unit tests in Node projects, too.

# 2.7.1 (2017-11-27)

- Added `.prettierignore` which can be used by our projects.

# 2.7.0 (2017-11-23)

- Allow importing images and other assets in Node projects (e.g. for SSR).

# 2.6.0 (2017-11-20)

- Translations can now be found in parent directories. (Sometimes needed for workspace based projects.)
- Integrated `nodemon` to `$ watch` in Node projects. (This probably needs some polish for more complex scenarios.)

# 2.5.2 (2017-11-20)

- Remove pointless logging for `$ watch` in Node projects.

# 2.5.1 (2017-10-27)

- Better support for headless chrome in unit tests, if you use Linux.

# 2.5.0 (2017-10-24)

- Experimental support to pass headless flag to E2E tests.

# 2.4.0 (2017-10-21)

- Experimental support for hot module reloading ♥ Check `examples/spa-ts` and run `$ ws watch --hot` (or `$ ws w -H`) to test it.

# 2.3.0 (2017-10-10)

- Remove PhantomJS for unit tests and use headless Chrome instead.
- Fixed stack trace formatting in unit tests.

# 2.2.1 (2017-10-09)

- Quick fix to exit programm correctly on error in all cases.
- Live Reload should work again in watch mode.

# 2.2.0 (2017-10-02)

- Removed the linter check for the `examples/` directory based on feedback and because examples could be placed quite differently in workspace based projects.
- Added a _highly_ experimental feature to modify our webpack config. See [here](examples/browser-ts-react/ws.config.js).

# 2.1.1 (2017-09-26)

- If generated declarations contain errors, they are now logged correctly.

# 2.1.0 (2017-09-25)

- Small fix: If you use an unknown command the help is shown again.
- Small fix: `watch` should not show too many initial builds anymore.
- Small fix: Exit gracefully, so logs aren't cut off in edge cases.
- Update notifier now runs in parallel and is aborted, if it's too slow.
- You can set `"ws": { "ignoreUpdates": true }` in your `package.json` to disable the update notifier.
- You can also ignore updates via command line: `-u` or `--ingore-updates`.

# 2.0.4 (2017-09-18)

- Fixed issue where some source files were _not_ linted by TSLint.

# 2.0.3 (2017-09-14)

- Fixed edge case where non-source files were linted by TSLint.

# 2.0.2 (2017-09-12)

- Fix: TypeScript errors are now logged again in watch mode.

# 2.0.1 (2017-09-06)

- Use new major version of `typescript-eslint-parser` so it's compatible with newest TypeScript version.
- Added better debug logging for running E2E tests.
- Added timeout for installing Selenium.
- Oh snap! Declaration files weren't emitted for Node projects. Now they are.

# 2.0.0 (2017-09-05)

- Fixed incorrect TSLint logging.

# 2.0.0-17 (2017-09-04)

- Fixed error in TSLint usage (see [this issue](https://github.com/palantir/tslint/issues/3188)).

# 2.0.0-16 (2017-08-31)

- Run prettier after TSLint and ESLint.
- If a file was changed by TSLint, ESLint _and_ prettier it will only be logged as _one_ file change.

# 2.0.0-15 (2017-08-29)

- Enable `no-unused-variable` rule in TSLint.

# 2.0.0-14 (2017-08-28)

- Don't log empty lines in the case of eslint errors.

# 2.0.0-13 (2017-08-28)

- Allow eslint to parse JSX \o/

# 2.0.0-12 (2017-08-28)

- Extend `ban` lint rule to disallow `describe.only`.
- Added eslint support \o/

# 2.0.0-11 (2017-08-23)

- [@floric](https://github.com/floric) fixed a bug, so we can now use a nested message format for translations.

# 2.0.0-10 (2017-08-11)

- Respect `publicPath` in development builds.

# 2.0.0-9 (2017-07-09)

- Fix E2E command.

# 2.0.0-8 (2017-07-03)

- Unit tests for browsers were incorrectly compiled as releases (e.g. minified).

# 2.0.0-7 (2017-06-29)

- Fixed update notifier (same fix as in `1.0.2`).
- Better performance by using [`happypack`](https://github.com/amireh/happypack) and [`fork-ts-checker-webpack-plugin`](https://github.com/Realytics/fork-ts-checker-webpack-plugin). This is a big change, but it _should not_ break anything.

# 2.0.0-6 (2017-06-21)

- Make [`publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) configurable.

# 2.0.0-5 (2017-06-19)

- Support pnpm.

# 2.0.0-4 (2017-06-08)

- Electrons main process file can now be written in TypeScript, too. It is processed by `ws` correctly.

# 2.0.0-3 (2017-06-07)

- Added [`prettier`] as a real dependency, not a dev dependency.

# 2.0.0-2 (2017-06-06)

- Added [`prettier`](https://github.com/prettier/prettier) support \o/ Uses the same default settings, but with `singleQuote: true`.

# 2.0.0-1 (2017-06-02)

- First prerelease of next major version.
- **Biggest change**: We removed the multi-locale output feature in favor of loading the translations asynchronous (see [#23](https://github.com/Mercateo/ws/pull/23)).
- Support for the newest Enzyme version. `react-addons-test-utils` can't be loaded anymore, but it is deprecated anyway.

# 1.0.2 (2017-05-03)

- Fixed update notifier.

# 1.0.1 (2017-05-03)

- Stop using prereleases. After 64 versions we should be pretty _stable_. But maybe... version 2 is around the corner, too.
- Partly use `awesome-typescript-loader` again, because `ts-loader` is too slow on large projects :(

# 1.0.1-64 (2017-04-27)

- Updated several deps (like TSLint from v4 to v5).
- Changed linter rule [`indent`](https://palantir.github.io/tslint/rules/indent/) to [`ter-indent`](https://github.com/buzinas/tslint-eslint-rules/blob/master/src/docs/rules/terIndentRule.md).
- Added linter rule [`object-curly-spacing`](https://github.com/buzinas/tslint-eslint-rules/blob/master/src/docs/rules/objectCurlySpacingRule.md).
- We try to automatically fix linter errors now _whenever_ you call `$ ws lint`.
- Switched from `awesome-typescript-loader` to `ts-loader` (again), because of [this bug](https://github.com/s-panferov/awesome-typescript-loader/issues/411).

# 1.0.1-63 (2017-03-20)

- Fixed live reloading bug.

# 1.0.1-62 (2017-03-16)

- Updated dependencies.
  - `console.log` is now printed to the terminal in unit tests again. This [broke with `karma@1.5.0`](https://github.com/karma-runner/karma/issues/2602).
  - Update to new version of `awesome-typescript-loader`. Now you **don't need** to set `declaration: true` in your `tsconfig.json` for browser components. We do this automatically.
- We throw an error if typings cannot be found after build.
- Faster startup time thanks to code splitting and lazy loading ♥

# 1.0.1-61 (2017-02-23)

- Updated dependencies. Removed `@types/lodash` for now. Update selenium to new major version.

# 1.0.1-60 (2017-02-07)

- Fixed bug so multiple `_import`'s work.

# 1.0.1-59 (2017-02-06)

- A wild [@otbe](https://github.com/otbe) appears! He adds Electron support. It is very effective!

# 1.0.1-58 (2017-02-01)

- Postinstall script wasn't called correctly. I hope this works now!

# 1.0.1-57 (2017-02-01)

- Added better way to postinstall phantomjs.

# 1.0.1-56 (2017-02-01)

- Added some new linter rules. I hope we can get [this feature request](https://github.com/palantir/tslint/issues/2163) in tslint to integrate custom rules, too.

# 1.0.1-55 (2017-01-30)

- Use [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) (again), because it is faster than [ts-loader](https://github.com/TypeStrong/ts-loader) currently. (But fallback to ts-loader to generate declaration files. This is currently not supperted in awesome-typescript-loader.)
- You can now lazily load modules with `import()`! Note that there are problems when you load images inside CSS. This happens when we use Source Maps. This is a known problem in style-loader. It looks like there are at least two PRs which could fix this (see [here](https://github.com/webpack-contrib/style-loader/pull/96) and [here](https://github.com/webpack-contrib/style-loader/pull/124)), but they aren't merged yet :(

# 1.0.1-54 (2017-01-12)

- Build translations before e2e tests.

# 1.0.1-53 (2017-01-09)

- Support `targets` from [`babel-preset-env`](https://github.com/babel/babel-preset-env). Thanks [@otbe](https://github.com/otbe)! Use it inside you `package.json` as `ws.targets.node` and `ws.targets.browsers`. This **removes** the support of `ws.browsers`, too!

# 1.0.1-52 (2017-01-06)

- Remove `copy` alias, so only `copy-loader` is allowed. This matches native loaders which need a `-loader` suffix.

# 1.0.1-51 (2017-01-06)

- You can now use a `copy-loader` which is an alias to `file-loader`. Idea from [here](https://www.npmjs.com/package/copy-loader)! Cool.

# 1.0.1-50 (2017-01-06)

- Don't reject, if update notifier doesn't work.

# 1.0.1-49 (2017-01-02)

- Only show [webpack performance warnings](https://medium.com/webpack/webpack-performance-budgets-13d4880fbf6d) for production builds.

# 1.0.1-48 (2017-01-02)

- Updated dependencies (e.g. `webpack@2.2.0-rc.3`).

# 1.0.1-47 (2017-01-02)

- Just a small bug fix which copies json files in localized apps to the correct directory.

# 1.0.1-46 (2016-12-13)

- Modified translation exports so they work in more edge cases.

# 1.0.1-45 (2016-12-12)

- Changed translations templates to have better compability with older browsers. (It seems they aren't transpiled correctly for now?)

# 1.0.1-44 (2016-12-09)

- Remove buggy postinstall.

# 1.0.1-43 (2016-12-09)
# 1.0.1-42 (2016-12-09)

- Allow production build for browser components. You need to run `ws build --production` to do that. Note that you probably **must** update your `"main"` and `"typings"` to point to `dist-release/` and `dist-release/` should **not** be included in your `.npmignore`.
- Localized dev builds default to a single locale to speed up development. E.g. `ws build` only builds the first locale mentioned in your `package.json`. Run `ws build --locales de_DE` to manually build the `'de_DE'` locale in this example.
- Update notification for new versions.
- Module imports like `glamor/react` are now treated as external and aren't included in UMD builds of browser components.
- Switched from `awesome-typescript-loader` to `ts-loader` to get support for TypeScript 2.1.4.
- Updated dependencies (e.g. `tslint` to `4.0.0`).

# 1.0.1-41 (2016-11-28)

- Fixed CLI for some linux systems.

# 1.0.1-40 (2016-11-25)

- Max heap is increased by default.
- You can now use Enzyme in unit tests.

Thanks @otbe!

# 1.0.1-39 (2016-11-24)

- `.zip` and `.pdf` files be copied for localized apps.

# 1.0.1-38 (2016-11-18)

- Fixed some flaky paths.

# 1.0.1-37 (2016-11-18)

- Minor performance improvements.

# 1.0.1-36 (2016-11-15)

- ws is now compatible with `webpack@2.1.0-beta.27`.
- You can now set `--browsers` when running E2E tests on a grid. (Thanks @wuan!)

# 1.0.1-35 (2016-11-15)

- Changed the way how translations are merged, so dependencies are less important.
