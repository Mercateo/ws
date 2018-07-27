import { debug } from 'loglevel';
import { join } from 'path';
import { ConfigOptions, Server } from 'karma';
import { platform } from 'os';
import getIpAddress from './ip-address';
import { getBrowsers, isSauceLabsHost, launchSauceConnect } from './selenium';
import { project, SeleniumGridConfig } from '../project';

// uses puppeteers chrome version for headless chrome
process.env.CHROME_BIN = require('puppeteer').executablePath();

function toCustomLaunchersObject(customLaunchers: any, browser: any) {
  // at this place we know selenium config is set, no need for null checks
  const selenium = project.ws.selenium as SeleniumGridConfig;

  const id = `grid-${browser.browserName}-${browser.version}`;
  customLaunchers[id] = {
    ...browser,
    base: 'WebDriver',
    // allways inject <meta> to use edge mode for IE
    'x-ua-compatible': 'IE=edge',
    config: {
      hostname: selenium.host,
      port: selenium.port,
      user: selenium.user,
      pwd: selenium.password
    }
  };
  return customLaunchers;
}

interface EnhancedConfigOptions extends ConfigOptions {
  // with mocha
  mochaReporter: {
    showDiff: boolean;
  };
  // with new formatError added in 1.3
  formatError?(msg: string): string;
  // new in karma 1.5.0
  browserConsoleLogOptions: {
    level?: string;
    format?: string;
    path?: string;
    terminal?: boolean;
  };
  customLaunchers: any;
}

const headlessChromeConfig = {
  browsers: ['CustomChromeHeadless'],
  customLaunchers: {
    CustomChromeHeadless: {
      base: 'ChromeHeadless',
      flags:
        // see https://github.com/Googlechrome/puppeteer/issues/290#issuecomment-322852784
        platform() === 'linux'
          ? ['--no-sandbox', '--disable-setuid-sandbox']
          : []
    }
  }
};

const defaultConfig: EnhancedConfigOptions = {
  // explicitly set plugins here, so they aren't just loaded from karmas sibling directories
  // (this is less error prone)
  plugins: [
    'karma-mocha',
    'karma-chrome-launcher',
    'karma-webdriver-launcher',
    'karma-sourcemap-loader',
    'karma-mocha-reporter'
  ],
  frameworks: ['mocha'],
  reporters: ['mocha'],
  mochaReporter: {
    showDiff: true
  },
  ...headlessChromeConfig,
  logLevel: 'WARN',
  browserConsoleLogOptions: {
    level: 'log',
    terminal: true
  },
  singleRun: true,
  client: {
    useIframe: false
  },
  // see https://github.com/karma-runner/karma/issues/2119#issuecomment-239615791
  formatError(msg) {
    // filter out empty lines and node_modules
    if (!msg.trim() || /~/.test(msg) || /node_modules/.test(msg)) return '';

    // change: "at Context.<anonymous> (webpack:///tests/unit.ts:6:26 <- dist-tests/index.js:1104:127)"
    //     to: "at Context.<anonymous> (tests/unit.ts:6:26)"
    const line = msg.includes('webpack:///')
      ? msg.split(' <- ')[0].replace('webpack:///', '') + ')'
      : msg;

    return `  ${line}\n`;
  }
};

export async function testAsync(options: { grid?: boolean } = {}) {
  debug(`Configure Karma...`);
  const karmaConfig = {
    ...defaultConfig,
    basePath: process.cwd(),
    files: [join(project.ws.distTestsDir, 'index.js')],
    preprocessors: {
      [join(project.ws.distTestsDir, 'index.js')]: ['sourcemap']
    }
  };

  let sauceConnectProcess: any;
  if (options.grid) {
    // at this place we know selenium config is set, no need for null checks
    const selenium = project.ws.selenium as SeleniumGridConfig;
    const { host } = selenium;
    const browsers = await getBrowsers();

    const customLaunchers = browsers.reduce(toCustomLaunchersObject, {});
    Object.assign(karmaConfig, {
      hostname: getIpAddress(),
      customLaunchers,
      browsers: Object.keys(customLaunchers)
    });

    if (isSauceLabsHost(host)) {
      sauceConnectProcess = await launchSauceConnect(selenium);
    }
  }

  return new Promise<number>((resolve) => {
    const server = new Server(karmaConfig, (exitCode) => {
      debug(`Karma finished.`);
      if (sauceConnectProcess) {
        debug(`Tries to close Sauce Connect.`);
        sauceConnectProcess.close(() => {
          debug(`Closed Sauce Connect.`);
          resolve(exitCode);
        });
      } else {
        resolve(exitCode);
      }
    });

    debug(`Start Karma.`);
    server.start();
  });
}
