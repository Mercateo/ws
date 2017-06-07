import { red } from 'chalk';
import { error } from 'loglevel';

const IGNORED_TRACE_LINES = [
  // our bin
  'bin/ws.js:2:1)',
  // native
  'at [object Generator].next (native)',
  'at next (native)',
  // polyfills
  'at fulfilled (',
  'core-js/modules/_microtask.js',
  'core-js/modules/es6.promise.js',
  // webpack
  '(./webpack/bootstrap',
  'at ./webpack/bootstrap',
  'at __webpack_require__',
  // node internals
  '(util.js',
  '(net.js',
  '(node.js',
  '(events.js',
  'at node.js',
  '(module.js',
  '(internal/module.js'
];

export function handleError(err: Error) {
  if (err.stack) {
    err.stack
      .split('\n')
      .filter(
        line =>
          !IGNORED_TRACE_LINES.some(ignoredLine => line.includes(ignoredLine))
      )
      .filter((_, index) => index < 6) // roughly error message + 5 code lines
      .map(line => line.replace('webpack:///', './'))
      .map(line => line.replace(`${__dirname}/webpack:/`, './'))
      .forEach(line => error(line));
  } else {
    error(err);
  }

  error(`${red('error!')} ( ╯°□°)╯ ┻━━┻`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
