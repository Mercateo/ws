import { warn } from 'loglevel';
import path from 'path';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import chalk from 'chalk';
import { project, TYPE } from '../project';
import { testAsync as karmaTestAsync } from '../lib/karma';
import { testAsync as mochaTestAsync } from '../lib/mocha';
import { compile as compileI18n } from '../lib/i18n';
import { compileAsync } from '../lib/webpack/compiler';
import { getNodeUnitConfig } from '../lib/webpack/node';
import { getElectronUnitConfig } from '../lib/webpack/electron';
import { getSpaUnitConfig } from '../lib/webpack/spa';
import { getBrowserUnitConfig } from '../lib/webpack/browser';
import { BaseOptions } from '../options';

const { cyan, yellow } = chalk;

export interface UnitOptions extends BaseOptions {
  grid?: boolean;
}

export default async function unit(options: UnitOptions) {
  const hasUnitTests = await existsAsync(project.ws.unitEntry);
  if (!hasUnitTests) {
    warn(
      `${yellow('warn!')} You tried to run unit tests, but ${yellow(
        project.ws.unitEntry
      )} doesn't exist.`
    );
    return;
  }

  await removeAsync(project.ws.distTestsDir);

  if (project.ws.i18n) {
    await compileI18n();
  }

  let exitCode = 0;
  switch (project.ws.type) {
    case TYPE.NODE:
      const config = await getNodeUnitConfig(options);
      await compileAsync(config, 'unit');
      const files = [path.join(config.output.path, 'index.js')];
      exitCode = await mochaTestAsync(files);
      break;
    case TYPE.ELECTRON:
      await compileAsync(await getElectronUnitConfig(options), 'unit');
      exitCode = await karmaTestAsync(options);
      break;
    case TYPE.SPA:
      const conf = await getSpaUnitConfig(options);
      await compileAsync(conf, 'unit');
      exitCode = await karmaTestAsync(options);
      break;
    case TYPE.BROWSER:
      await compileAsync(await getBrowserUnitConfig(options), 'unit');
      exitCode = await karmaTestAsync(options);
      break;
  }

  if (exitCode !== 0) {
    throw `${cyan('unit')} failed.`;
  }
}
