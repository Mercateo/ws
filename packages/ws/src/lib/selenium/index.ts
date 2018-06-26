import { Browser } from './get-browsers';
export {
  queryBrowsers,
  getFilteredAvailableBrowsers,
  isSauceLabsHost,
  Browser,
  getBrowsers
} from './get-browsers';
export { runSeleniumServer } from './selenium-standalone';
export { launchSauceConnect } from './sauce-connect';

// converts
//  `'ie-9' to `{ browserName: 'internet explorer', version: '9', id: 'internet explorer-9' }`
//  `'ff-36' to `{ browserName: 'firefox', version: '36', id: 'firefox-36' }`
//  `'chrome' to `{ browserName: 'chrome', version: undefined, id: 'chrome' }`
export function parseBrowser(browserString: string): Browser {
  let [browserName, version] = browserString.split('-');

  switch (browserName) {
    case 'ie':
      browserName = 'internet explorer';
      break;
    case 'ff':
      browserName = 'firefox';
      break;
  }

  return {
    browserName,
    version,
    id: version ? `${browserName}-${version}` : browserName
  };
}
