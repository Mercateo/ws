import { spawn } from 'child_process';
import { warn, error, debug } from 'loglevel';
import { join } from 'path';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import chalk from 'chalk';
import { project, SeleniumGridConfig } from '../project';
import { testAsync } from '../lib/mocha';
import {
  runSeleniumServer,
  Browser,
  parseBrowser,
  getBrowsers,
  isSauceLabsHost,
  launchSauceConnect
} from '../lib/selenium';
import { compile as compileI18n } from '../lib/i18n';
import { getSpaE2eConfig } from '../lib/webpack/spa';
import { compileAsync } from '../lib/webpack/compiler';
import { BaseOptions } from '../options';

const { cyan, yellow, magenta } = chalk;

function spawnE2e(options: any, { browserName, version, id }: Browser) {
  debug(`Spawn E2E test for ${id}.`);

  return new Promise((resolve, reject) => {
    const [node, ws] = process.argv;
    const env: any = {
      ...process.env,
      WS_E2E_IS_SPAWNED: true,
      WS_E2E_SELENIUM_URL: options.seleniumUrl,
      WS_E2E_BROWSER_NAME: browserName,
      WS_E2E_BROWSER_VERSION: version,
      FORCE_COLOR: 'true'
    };
    if (options.headless) {
      env.WS_E2E_PREFER_HEADLESS = true;
    }

    const childPrefix = `[${magenta(id)}] `;
    const childProcess = spawn(
      node,
      [ws, 'e2e', '--log-level', options.parent.logLevel],
      { env }
    );

    childProcess.stdout.on('data', (data) =>
      process.stdout.write(`${childPrefix}${data}`)
    );
    childProcess.stderr.on('data', (data) =>
      process.stderr.write(`${childPrefix}${data}`)
    );

    childProcess.on('error', (err: any) => {
      error(`${childPrefix}${err}`);
      reject(1);
    });

    childProcess.on(
      'close',
      (code: any) => (code ? reject(code) : resolve(code))
    );
  });
}

async function init(options: BaseOptions) {
  debug(`Init E2E tests.`);

  // build
  const e2eEntry = `./${project.ws.testsDir}/e2e.${project.ws.entryExtension}`;
  const hasE2eTests = await existsAsync(e2eEntry);
  if (!hasE2eTests) {
    warn(
      `${yellow('warn!')} You tried to run e2e tests, but ${yellow(
        e2eEntry
      )} doesn't exist.`
    );
    return;
  }

  await removeAsync(project.ws.distTestsDir);
  await compileAsync(await getSpaE2eConfig(options), 'e2e');
  debug(`Build E2E tests.`);

  // prepare selenium
  let seleniumProcess: any;
  let sauceConnectProcess: any;
  let browsers: Array<any>;
  if (options.grid) {
    // at this place we know selenium config is set, no need for null checks
    const selenium = project.ws.selenium as SeleniumGridConfig;
    const { host, port, user, password } = selenium;
    options.seleniumUrl = `http://${
      user ? `${user}:${password}@` : ''
    }${host}:${port}/wd/hub`;
    browsers = options.browsers
      ? options.browsers.split(',').map(parseBrowser)
      : await getBrowsers();

    if (isSauceLabsHost(host)) {
      sauceConnectProcess = await launchSauceConnect(selenium);
    }
  } else {
    options.seleniumUrl = `http://localhost:4444/wd/hub`;
    seleniumProcess = await runSeleniumServer();
    const defaultBrowsers = 'ff'; // 'chrome,ff'
    browsers = (options.browsers || defaultBrowsers)
      .split(',')
      .map(parseBrowser);
  }
  debug(`Configured selenium.`);

  // spawn tests
  // TODO: For now run everything in parallel. We could check `options.sequentially` to run it  sequentially in the future.
  await Promise.all(browsers.map((browser) => spawnE2e(options, browser)));

  // ran locally?
  if (seleniumProcess) {
    debug(`Tries to kill Selenium Process.`);
    seleniumProcess.kill();
  }

  // ran with sauce connect?
  if (sauceConnectProcess) {
    debug(`Tries to close Sauce Connect.`);
    sauceConnectProcess.close(() => debug(`Closed Sauce Connect.`));
  }
}

async function run(options: BaseOptions) {
  const { output } = await getSpaE2eConfig(options);
  const files = [join(output.path, 'index.js')];
  const exitCode = await testAsync(files);
  if (exitCode !== 0) {
    throw `${cyan('e2e')} failed.`;
  }
}

export default async function e2e(options: BaseOptions) {
  // translations could be needed
  if (project.ws.i18n) {
    await compileI18n();
  }

  const isSpawned = process.env.WS_E2E_IS_SPAWNED;

  if (isSpawned) {
    await run(options);
  } else {
    await init(options);
  }
}
