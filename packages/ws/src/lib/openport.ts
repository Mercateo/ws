import { FindOptions, find } from 'openport';

const DEFAULT_FIND_OPTIONS = {
  startingPort: 8080
};

export function findAsync(options: FindOptions = DEFAULT_FIND_OPTIONS) {
  return new Promise<number>((resolve, reject) => {
    find(options, (err, port) => {
      if (err) {
        reject(err);
      } else {
        resolve(port);
      }
    });
  });
}
