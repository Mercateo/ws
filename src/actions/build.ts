import { join } from 'path';
import { red } from 'chalk';
import { info } from 'loglevel';
import { existsAsync, removeAsync } from 'fs-extra-promise';
import { project, TYPE } from '../project';
import {
  compileAsync,
  getBrowserBuildOptions,
  getBrowserReleaseOptions,
  getSpaDevOptions,
  nodeBuildOptions,
  spaReleaseOptions,
  spaRootI18nBuildOptions,
  spaRootI18nReleaseOptions,
} from '../lib/webpack';
import { compile as compileI18n } from '../lib/i18n';
import { copy } from '../lib/copy';
import {
  electronRootI18nBuildOptions,
  electronRootI18nReleaseOptions,
  getElectronBuildOptions,
  getElectronReleaseOptions,
} from '../lib/webpack/options';

export interface BuildOptions {
  locales: Array<string>;
  production?: true;
}

const copyAssets = async (distDir: string) => {
  if (project.ws.i18n) {
    // this is a quich fix to get relatexistsasync fs promiseive path for assets in localized spa's working
    await Promise.all(project.ws.i18n.locales.map(locale =>
      copy(distDir, join(distDir, locale), '*.{zip,pdf,png,jpg,gif,svg,eot,woff,woff2,ttf,json,js}')));
    await Promise.all(project.ws.i18n.locales.map(locale =>
      copy(join(distDir, 'config'), join(distDir, locale, 'config'), '*.js')));
  }
};

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

      if (options.production) {
        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
          const hasI18nEntry = await existsAsync(project.ws.srcI18nEntry);
          if (hasI18nEntry) {
            await compileAsync(electronRootI18nReleaseOptions);
          }
        }

        await compileAsync(getElectronReleaseOptions(options.locales));
        await copyAssets(project.ws.distDir);
      } else {
        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
          const hasI18nEntry = await existsAsync(project.ws.srcI18nEntry);
          if (hasI18nEntry) {
            await compileAsync(electronRootI18nBuildOptions);
          }
        }

        await compileAsync(getElectronBuildOptions(options.locales));
        await copyAssets(project.ws.distDir);
      }

      break;
    case TYPE.SPA:
      if (options.production) {
        await removeAsync(project.ws.distReleaseDir);
        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
          const hasI18nEntry = await existsAsync(project.ws.srcI18nEntry);
          if (hasI18nEntry) {
            await compileAsync(spaRootI18nReleaseOptions);
          }
        }
        await compileAsync(spaReleaseOptions);
        await copyAssets(project.ws.distReleaseDir);
      } else {
        await removeAsync(project.ws.distDir);

        // await verifyDll(options.locales);

        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
          const hasI18nEntry = await existsAsync(project.ws.srcI18nEntry);
          if (hasI18nEntry) {
            await compileAsync(spaRootI18nBuildOptions);
          }
        }
        await compileAsync(getSpaDevOptions(options.locales));
        await copyAssets(project.ws.distDir);
      }
      break;
    case TYPE.BROWSER:
      if (options.production) {
        await removeAsync(project.ws.distReleaseDir);
        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
        }
        await compileAsync(getBrowserReleaseOptions());
        await checkTypingsExist();
      } else {
        await removeAsync(project.ws.distDir);
        if (project.ws.i18n) {
          await compileI18n();
          info('...build translations');
        }
        await compileAsync(getBrowserBuildOptions(options.locales));
      }
      break;
  }
};
