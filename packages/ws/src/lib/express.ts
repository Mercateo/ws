import { info } from 'loglevel';
import chalk from 'chalk';
import express from 'express';
import fallback from 'express-history-api-fallback';
import { project } from '../project';
import { findAsync } from './openport';

const { cyan } = chalk;

export async function listenAsync(
  middlewares: Array<any> = [],
  root = project.ws.distDir
) {
  const app = express();

  middlewares.push([project.ws.publicPath, express.static(root)]);
  middlewares.push(fallback('index.html', { root }));

  for (const middleware of middlewares) {
    Array.isArray(middleware) ? app.use(...middleware) : app.use(middleware);
  }

  const port = await findAsync();
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.on('listening', () =>
      info(`Serving from ${cyan(`http://localhost:${port}`)}.`)
    );
    server.on('error', reject);
    server.on('close', resolve);
  });
}
