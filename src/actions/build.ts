import { join } from 'path';
import { red } from 'chalk';
import { info } from 'loglevel';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import { project, TYPE } from '../project';
import { compile as compileI18n } from '../lib/i18n';
import { compileAsync } from '../lib/webpack/common';
import { nodeBuildOptions } from '../lib/webpack/node';
import { getElectronReleaseOptions, getElectronDevOptions } from '../lib/webpack/electron';
import { getSpaReleaseOptions, getSpaDevOptions } from '../lib/webpack/spa';
import { getBrowserReleaseOptions, getBrowserDevOptions } from '../lib/webpack/browser';

export interface BuildOptions {
  locales: Array<string>;
  production?: true;
}

const checkTypingsExist = async () => {
  if (project.typings) {
    const exist = await existsAsync(join(process.cwd(), project.typings));
    if (!exist) {
      throw `${red('typings')} do not exist in ${project.typings}`;
    }
  }
};

export default async function build(options: BuildOptions) {
  switch (project.ws.type) {
    case TYPE.NODE:
      await removeAsync(project.ws.distDir);
      await compileAsync(nodeBuildOptions);
      await checkTypingsExist();

      break;
    case TYPE.ELECTRON:
      await removeAsync(project.ws.distDir);

      if (project.ws.i18n) {
        await compileI18n();
        info('...build translations');
      }

      await compileAsync(options.production ? getElectronReleaseOptions() : getElectronDevOptions());

      break;
    case TYPE.SPA:
      if (project.ws.i18n) {
        await compileI18n();
        info('...build translations');
      }

      if (options.production) {
        await removeAsync(project.ws.distReleaseDir);
        await compileAsync(getSpaReleaseOptions());
      } else {
        await removeAsync(project.ws.distDir);
        await compileAsync(getSpaDevOptions());
      }

      break;
    case TYPE.BROWSER:
      if (project.ws.i18n) {
        await compileI18n();
        info('...build translations');
      }

      if (options.production) {
        await removeAsync(project.ws.distReleaseDir);
        await compileAsync(getBrowserReleaseOptions());
        await checkTypingsExist();
      } else {
        await removeAsync(project.ws.distDir);
        await compileAsync(getBrowserDevOptions());
      }

      break;
  }
}
