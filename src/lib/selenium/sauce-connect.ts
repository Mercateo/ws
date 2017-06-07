import { debug } from 'loglevel';
import sauceConnectLauncher, { SauceConnectProcess } from 'sauce-connect-launcher';
import { SeleniumGridConfig } from '../../project';

/**
 * Connect to Sauce Labs.
 */
export function launchSauceConnect(
  selenium: SeleniumGridConfig
): Promise<SauceConnectProcess> {
  if (!selenium.user || !selenium.password) {
    throw 'To use Sauce Labs you need to set a user and password in our ws.selenium config.';
  }

  const options = {
    username: selenium.user,
    accessKey: selenium.password
  };

  debug('Tries to launch Sauce Connect.');
  return new Promise<SauceConnectProcess>((resolve, reject) => {
    sauceConnectLauncher(options, (err, sauceConnectProcess) => {
      if (err) {
        reject(err);
      } else {
        debug('Launched Sauce Connect.');
        resolve(sauceConnectProcess);
      }
    });
  });
}
