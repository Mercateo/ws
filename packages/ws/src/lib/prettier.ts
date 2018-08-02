import { format, resolveConfig } from 'prettier';
import { readFileAsync, writeFileAsync } from 'fs-extra-promise';
import globby from 'globby';
import { error } from 'loglevel';
import chalk from 'chalk';
import { sourceFilePatterns } from '../project';

const { red } = chalk;

const defaultConfig = require('../../prettier.config');

export async function formatAsync(filePatterns = sourceFilePatterns) {
  const resolvedConfig = await resolveConfig(process.cwd());
  const config = { ...defaultConfig, ...(resolvedConfig || {}) };

  const filePaths = await globby(filePatterns, { absolute: true });
  const contents = await Promise.all(
    filePaths.map((filePath) => readFileAsync(filePath, 'utf8'))
  );

  const fixedFiles: string[] = [];
  await Promise.all(
    filePaths.map(async (filepath, index) => {
      const content = contents[index];
      let formattedContent;

      try {
        formattedContent = format(content, { ...config, filepath });
      } catch (err) {
        error(`Couldn't format ${red(filepath)}.`);
        throw err;
      }

      if (content !== formattedContent) {
        fixedFiles.push(filepath);
        await writeFileAsync(filepath, formattedContent);
      }
    })
  );

  return fixedFiles;
}
