import { spawn } from 'child_process';
import { warn, error, debug } from 'loglevel';
import { join } from 'path';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import { cyan, yellow, magenta } from 'chalk';
import { project, SeleniumGridConfig } from '../project';
import { testAsync } from '../lib/mocha';
import { startSeleniumServer, Browser, parseBrowser, getBrowsers, isSauceLabsHost, launchSauceConnect } from '../lib/selenium';
import { compile as compileI18n } from '../lib/i18n';
import { spaE2eOptions } from '../lib/webpack/spa';
import { compileAsync } from '../lib/webpack/common';

function spawnE2e(options: any, browser: Browser) {
  return new Promise((resolve, reject) => {
    const [ node, ws ] = process.argv;
    const env = Object.assign({}, process.env, {
      WS_E2E_IS_SPAWNED: true,
      WS_E2E_SELENIUM_URL: options.seleniumUrl,
      WS_E2E_BROWSER_NAME: browser.browserName,
      WS_E2E_BROWSER_VERSION: browser.version,
      FORCE_COLOR: 'true'
    });

    const childPrefix = `[${magenta(browser.browserName + (browser.version ? `-${browser.version}` : ''))}] `;
    const childProcess = spawn(node, [ ws, 'e2e', '--log-level', options.parent.logLevel ], { env });

    childProcess.stdout.on('data', (data) => process.stdout.write(`${childPrefix}${data}`));
    childProcess.stderr.on('data', (data) => process.stderr.write(`${childPrefix}${data}`));

    childProcess.on('error', (err: any) => {
      error(`${childPrefix}${err}`);
      reject(1);
    });

    childProcess.on('close', (code: any) => code ? reject(code) : resolve(code));
  });
}

async function init(options: any) {
  // build
  const e2eEntry = `./${project.ws.testsDir}/e2e.${project.ws.entryExtension}`;
  const hasE2eTests = await existsAsync(e2eEntry);
  if (!hasE2eTests) {
    warn(`${yellow('warn!')} You tried to run e2e tests, but ${yellow(e2eEntry)} doesn't exist.`);
    return;
  }

  await removeAsync(project.ws.distTestsDir);
  await compileAsync(spaE2eOptions);

  // prepare selenium
  let seleniumProcess: any;
  let sauceConnectProcess: any;
  let browsers: Array<any>;
  if (options.grid) {
    // at this place we know selenium config is set, no need for null checks
    const selenium = project.ws.selenium as SeleniumGridConfig;
    const { host, port, user, password } = selenium;
    options.seleniumUrl = `http://${user ? `${user}:${password}@` : ''}${host}:${port}/wd/hub`;
    browsers = options.browsers
      ? options.browsers.split(',').map(parseBrowser)
      : await getBrowsers();

    if (isSauceLabsHost(host)) {
      sauceConnectProcess = await launchSauceConnect(selenium);
    }
  } else {
    options.seleniumUrl = `http://localhost:4444/wd/hub`;
    seleniumProcess = await startSeleniumServer();
    const defaultBrowsers = 'ff'; // 'chrome,ff'
    browsers = (options.browsers || defaultBrowsers).split(',').map(parseBrowser);
  }

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

async function run() {
  const files = [
    join(spaE2eOptions.output.path, spaE2eOptions.output.filename)
  ];
  const exitCode = await testAsync(files);
  if (exitCode !== 0) {
    throw `${cyan('e2e')} failed.`;
  }
}

export default async function e2e(options: any) {
  // translations could be needed
  if (project.ws.i18n) {
    await compileI18n();
  }

  const isSpawned = process.env.WS_E2E_IS_SPAWNED;

  if (isSpawned) {
    await run();
  } else {
    await init(options);
  }
}
