import { install, start } from 'selenium-standalone';

const options = {
  requestOpts: {
    timeout: 10000
  }
};

const installAsync = () =>
  new Promise((resolve, reject) => {
    install(options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const startAsync = () =>
  new Promise<any>((resolve, reject) => {
    start((err, childProcess) => {
      if (err) {
        reject(err);
      } else {
        // kill selenium server on abrupt 'exit'
        process.on('exit', () => childProcess.kill());
        resolve(childProcess);
      }
    });
  });

/**
 * Run a local selenium server.
 */
export async function runSeleniumServer() {
  await installAsync();
  return startAsync();
}
