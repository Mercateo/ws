import { info } from 'loglevel';
import { cyan } from 'chalk';
import moment from 'moment';
import livereload from 'livereload';
import livereloadMiddleware from 'connect-livereload';
import { removeAsync } from 'fs-extra-promise';
import { project, TYPE } from '../project';
import { findAsync } from '../lib/openport';
import { listenAsync } from '../lib/express';
import { compile as compileI18n } from '../lib/i18n';
import { watchAsync } from '../lib/webpack/common';
import { nodeBuildOptions } from '../lib/webpack/node';
import { getElectronDevOptions } from '../lib/webpack/electron';
import { getSpaDevOptions } from '../lib/webpack/spa';
import { getBrowserDevOptions } from '../lib/webpack/browser';

export interface WatchOptions {
  locales: Array<string>;
}

export default async function watch() {
  await removeAsync(project.ws.distDir);

  const port = await findAsync({
    startingPort: 35729
  });

  const livereloadServer = livereload.createServer({ port });
  const onChangeSuccess = (stats: any) => info(`Finished build at ${cyan(moment(stats.endTime).format('HH:mm:ss'))}.`);
  switch (project.ws.type) {
    case TYPE.NODE:
      await watchAsync(livereloadServer, nodeBuildOptions, onChangeSuccess);
      break;
    case TYPE.ELECTRON:
      if (project.ws.i18n) {
        await compileI18n();
      }

      await watchAsync(livereloadServer, getElectronDevOptions(), async (stats: any) => {
        onChangeSuccess(stats);
      });

      break;
    case TYPE.SPA:
      if (project.ws.i18n) {
        await compileI18n();
      }

      await watchAsync(livereloadServer, getSpaDevOptions(), async (stats: any) => {
        onChangeSuccess(stats);
      });

      break;
    case TYPE.BROWSER:
      if (project.ws.i18n) {
        await compileI18n();
      }

      await watchAsync(livereloadServer, getBrowserDevOptions(), onChangeSuccess);
      break;
  }

  info('Finished initial build.');

  const middlewares: Array<any> = [
    livereloadMiddleware({ port })
  ];
  await listenAsync(middlewares);
}
