// we can find nodes in a selenium grid or browser available on sauce labs
import { debug } from 'loglevel';
import { flatten, uniqBy } from 'lodash';
import { yellow } from 'chalk';
import { rcompare } from 'semver';
import { get } from 'https';
import browserslist from 'browserslist';
import grid from 'selenium-grid-status';
import { project } from '../../project';

export interface Browser {
  browserName: string;
  version: string;
  id: string;
}

const SAUCE_LABS_HOST = 'ondemand.saucelabs.com';
const SAUCE_LABS_PLATFORMS =
  'https://saucelabs.com/rest/v1.1/info/platforms/all';

// these are all browsers which could be returned by browserslist (key: explanation)
// -  ie: IE
// -  edge: Edge
// -  firefox: Firefox
// -  chrome: Chrome
// -  safari: Safari
// -  opera: Opera
// -  ios_saf: iOS Safari
// -  op_mini: Opera Mini
// -  android: Android Browser
// -  bb: Blackberry Browser
// -  op_mob: Opera Mobile
// -  and_chr: Chrome for Android
// -  and_ff: Firefox for Android
// -  ie_mob: IE Mobile
// -  and_uc: UC Browser for Android

// these are all browsers which could be used by selenium (key: explanation)
// - internet explorer: IE
// - MicrosoftEdge: Edge
// - firefox: Firefox
// - chrome: Chrome
// - safari: Safari
// - opera: Opera
// - iPad: iOS Safari
// - iPhone: iOS Safari
// - android: Android Browser
// - phantomjs: PhantomJS
// - htmlunit: HtmlUnit

// intersection between browserslist and selenium
const supportedBrowsers = [
  {
    browserslist: 'ie',
    selenium: 'internet explorer'
  },
  {
    browserslist: 'edge',
    selenium: 'microsoftedge'
  },
  {
    browserslist: 'firefox',
    selenium: 'firefox'
  },
  {
    browserslist: 'chrome',
    selenium: 'chrome'
  },
  {
    browserslist: 'safari',
    selenium: 'safari'
  },
  {
    browserslist: 'opera',
    selenium: 'opera'
  },
  {
    browserslist: 'ios_saf',
    selenium: 'ipad' // 'iphone' is treated like 'ipad' (same browser)
  },
  {
    browserslist: 'android',
    selenium: 'android'
  }
];

const originalData = Object.assign({}, browserslist.data);

// a browserslists like
//   `'last 2 Chrome versions, last 2 ff versions, last 1 Safari versions, ie >= 9'`
// or
//   `'last 2 Chrome versions, last 2 Firefox versions, last 1 Safari versions, Explorer >= 9'`
// results in an array like
//   [ 'chrome 51',
//     'chrome 50',
//     'firefox 47',
//     'firefox 46',
//     'ie 11',
//     'ie 10',
//     'ie 9',
//     'safari 9.1' ]
// which we'll need to convert to an array with valid capabilities like
//   [ { browserName: 'Chrome', version: '51',}
//     { browserName: 'Chrome', version: '50',}
//     { browserName: 'Firefox', version: '47',}
//     { browserName: 'Firefox', version: '46',}
//     { browserName: 'Internet Explorer', version: '11',}
//     { browserName: 'Internet Explorer', version: '10',}
//     { browserName: 'Internet Explorer', version: '9',}
//     { browserName: 'Safari', version: '9.1'} ]
/**
 * Converts results of a `browserslist` query to an Selenium Browser Capabilities array.
 */
export function queryBrowsers(
  query: string = project.ws.targets.browsers
): Browser[] {
  debug(`Parse browsers from query: ${query}.`);
  const browsers = browserslist(query)
    .map(browser => {
      let [name, version] = browser.split(' ');
      const hasVersionRange = version.includes('-');
      if (hasVersionRange) {
        version = version.split('-')[1];
      }
      return { name, version };
    })
    .filter(({ name }) =>
      supportedBrowsers.some(({ browserslist }) => browserslist === name)
    )
    .map(({ name, version }) => {
      const browserName = supportedBrowsers.find(
        ({ browserslist }) => browserslist === name
      )!.selenium;
      return {
        browserName,
        version,
        id: `${browserName}-${version}`
      };
    });

  debug(`Parsed browsers: ${browsers.map(({ id }) => id)}.`);
  return browsers;
}

/**
 * Returns all nodes inside a selenium grid.
 */
function getNodes(): Promise<grid.SeleniumNode[]> {
  const { host, port } = project.ws.selenium!;
  debug(`Get nodes from ${host}:${port}.`);
  return new Promise<grid.SeleniumNode[]>((resolve, reject) => {
    grid.available({ host, port }, (err, nodes) => {
      if (err) {
        reject(err);
      } else {
        debug(`Found ${nodes.length} nodes.`);
        resolve(nodes);
      }
    });
  });
}

// appends missing `.0` to get valid semver version
function convertToValidSemver(version: string) {
  const matches = version.match(/\./g);
  if (matches) {
    if (matches.length === 1) {
      return `${version}.0`;
    } else if (matches.length === 2) {
      return version;
    } else {
      // more than two dots found
      throw `${version} can't be converted to valid semver (more than two dots).`;
    }
  } else {
    if (isNaN(version as any)) {
      // can't be parsed as a numder
      throw `${version} can't be converted to valid semver (not a number).`;
    } else {
      return `${version}.0.0`;
    }
  }
}

/**
 * Is this the Sauce Labs host?
 */
export function isSauceLabsHost(host: string): boolean {
  return host === SAUCE_LABS_HOST;
}

function sortByVersion(browserA: Browser, browserB: Browser): number {
  return rcompare(
    convertToValidSemver(browserA.version),
    convertToValidSemver(browserB.version)
  );
}

async function getAllAvailableBrowsers(): Promise<Browser[]> {
  let browsersWithoutId: { version: string; browserName: string }[];
  if (isSauceLabsHost(project.ws.selenium!.host)) {
    debug(`Get available browsers on Sauce Labs.`);
    const platforms: any = await new Promise((resolve, reject) => {
      get(SAUCE_LABS_PLATFORMS, res => {
        let body = '';
        res.on('data', data => (body = body + data));
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });
    browsersWithoutId = platforms
      .map(({ api_name, short_version }: any) => ({
        // treat 'iphone' like 'ipad' (same browser)
        browserName: api_name === 'iphone' ? 'ipad' : api_name,
        version: short_version
      }))
      // sauce labs supports beta/dev versions, but we can't map them back to browserslist
      .filter(({ version }: any) => version !== 'dev' && version !== 'beta');
  } else {
    debug(`Get available browsers on Selenium Grid.`);
    // convert status like https://github.com/davglass/selenium-grid-status#usage
    // to a list of unique browsers containing just the `browserName`, `version` and `id`
    const nodes = await getNodes();
    browsersWithoutId = flatten(
      nodes.map(node => node.browser)
    ).map(({ browserName, version }) => ({
      // treat 'iphone' like 'ipad' (same browser)
      browserName: browserName === 'iphone' ? 'ipad' : browserName,
      version
    }));
  }
  const browsersWithId: Browser[] = browsersWithoutId.map(
    ({ version, browserName }) => ({
      browserName,
      version,
      id: `${browserName}-${version}`
    })
  );
  const browsers = uniqBy(browsersWithId, 'id').sort(sortByVersion);

  debug(`Available browsers: ${browsers.map(({ id }) => id)}.`);
  return browsers;
}

/**
 * Converts a `browserslist` string to Selenium Browser Capabilities array filtered by the
 * browsers which are really available on the Selenium Grid.
 */
export async function getFilteredAvailableBrowsers(
  browsers: string = project.ws.targets.browsers
): Promise<Browser[]> {
  const availableBrowsers = await getAllAvailableBrowsers();
  const availableBrowsersData = availableBrowsers
    .filter(({ browserName }) =>
      supportedBrowsers.some(({ selenium }) => selenium === browserName)
    )
    .reduce((data: any, browser: any) => {
      const name = supportedBrowsers.find(
        ({ selenium }) => selenium === browser.browserName
      )!.browserslist;
      if (data[name]) {
        data[name].released.unshift(browser.version);
        data[name].versions.unshift(browser.version);
      } else {
        data[name] = {
          name,
          released: [browser.version],
          versions: [browser.version]
        };
      }
      return data;
    }, {});

  // override `browserslist.data`
  browserslist.data = availableBrowsersData;
  const browsersFilteredByAvailability = queryBrowsers(browsers);
  // restore`browserslist.data`
  browserslist.data = originalData;

  debug(
    `Filtered available browsers: ${browsersFilteredByAvailability.map(
      ({ id }) => id
    )}.`
  );
  return browsersFilteredByAvailability;
}

export async function getBrowsers(): Promise<Browser[]> {
  const { host, port, filterForAvailability } = project.ws.selenium!;
  const browsersQuery = project.ws.targets.browsers;
  const browsers = filterForAvailability
    ? await getFilteredAvailableBrowsers()
    : queryBrowsers();

  if (browsers.length === 0) {
    throw `No browsers are available on ${yellow(
      `${host}:${port}`
    )} given ${yellow(browsersQuery)}.`;
  }

  return browsers;
}
