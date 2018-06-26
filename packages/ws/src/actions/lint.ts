import chalk from 'chalk';
import { error, info, debug } from 'loglevel';
import { existsAsync } from 'fs-extra-promise';
import { join } from 'path';
import plur from 'plur';
import { uniq } from 'lodash';
import { tslintAsync } from '../lib/tslint';
import { eslintAsync } from '../lib/eslint';
import { formatAsync } from '../lib/prettier';
import { project } from '../project';

const { yellow, cyan, red } = chalk;

const smile = cyan('(~‾▿‾)~');
const files = (count: number) => plur('file', count);
const errors = (count: number) => plur('error', count);

export default async function lint() {
  // tslint
  const tsintResult = await tslintAsync();
  if (tsintResult.errorsCount) {
    error('');
    error(tsintResult.errors);
    error('');
  }

  // eslint
  const eslintResult = await eslintAsync();
  if (eslintResult.errorsCount) {
    error('');
    error(eslintResult.errors.join('\n'));
    error('');
  }

  // prettier
  const formattedFiles = await formatAsync();

  // documentation
  const docsErrors: Array<string> = [];
  if (!project.private) {
    if (!await existsAsync(join(process.cwd(), 'README.md'))) {
      docsErrors.push(`You have ${yellow('no README.md')}.`);
    }
    if (!project.keywords || !project.keywords.length) {
      docsErrors.push(
        `You have ${yellow('no keywords')} set in your ${yellow(
          'package.json'
        )}.`
      );
    }
    if (!project.description) {
      docsErrors.push(
        `You have ${yellow('no description')} set in your ${yellow(
          'package.json'
        )}.`
      );
    }
  }
  if (docsErrors.length) {
    error('');
    error(
      `You're project ${yellow(
        `isn't private`
      )}, but it has the following ${errors(docsErrors.length)}.`
    );
    docsErrors.forEach((msg) => error(`  ${msg}`));
    error('');
  }

  // result
  // all file paths here are absolute
  const fixedFiles = uniq([
    ...tsintResult.fixedFiles,
    ...eslintResult.fixedFiles,
    ...formattedFiles
  ]);

  if (fixedFiles.length) {
    const count = cyan(fixedFiles.length.toString());
    info(`automatically fixed ${count} ${files(fixedFiles.length)} ${smile}`);
    debug(`list of fixed files: ${fixedFiles.join(', ')}`);
  }

  const totalErrors =
    tsintResult.errorsCount + docsErrors.length + eslintResult.errorsCount;
  if (totalErrors) {
    const count = red(totalErrors.toString());
    error(`found ${count} ${errors(totalErrors)}`);
    error('');
    throw `${cyan('lint')} failed.`;
  }
}
