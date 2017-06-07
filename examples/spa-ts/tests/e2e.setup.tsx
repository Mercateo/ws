import { Builder } from 'selenium-webdriver';

const SESSION_TIMEOUT = 10000;

const setTimeoutAsync = delay =>
  new Promise(resolve => setTimeout(resolve, delay));

const waitForSession = driver =>
  Promise.race([
    driver.getSession(),
    setTimeoutAsync(SESSION_TIMEOUT).then(() => {
      throw `Timeout while waiting for session.`;
    })
  ]);

if (!process.env.WS_E2E_BROWSER_VERSION) {
  throw `process.env.WS_E2E_BROWSER_VERSION isn't set. It is automatically set, if you run "$ ws e2e" correctly.`;
}

if (!process.env.WS_E2E_SELENIUM_URL) {
  throw `process.env.WS_E2E_SELENIUM_URL isn't set. It is automatically set, if you run "$ ws e2e -g" correctly.`;
}

export const driver = new Builder()
  .forBrowser(
    process.env.WS_E2E_BROWSER_NAME,
    process.env.WS_E2E_BROWSER_VERSION
  )
  .usingServer(process.env.WS_E2E_SELENIUM_URL)
  .build();

before(async function() {
  this.timeout(20000);
  await waitForSession(driver);
});

after(async () => {
  await driver.quit();
});
