import nodemon from 'nodemon';
import { project } from '../project';

const script = `${project.ws.distDir}/index.js`;
const watch = project.ws.distDir;
const defaultOptions = { script, watch };

export function nodemonAsync(options = defaultOptions) {
  nodemon(options);

  // exit correctly on ^C
  process.once('SIGINT', () => process.exit(0));

  return new Promise((resolve) => nodemon.on('quit', resolve));
}
