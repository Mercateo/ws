import { Linter, ILinterOptions, Configuration } from 'tslint';
import fs from 'fs-extra-promise';
import globby from 'globby';
import { join } from 'path';
import { project } from '../project';

// relative from dist/index.js
const configPath = join(__dirname, '..', 'tslint.json');

const lintOptions: ILinterOptions = {
  formatter: 'codeFrame',
  rulesDirectory: [],
  formattersDirectory: '',
  fix: true
};

const defaultFilePatterns = [
  `${project.ws.srcDir}/**/*.tsx`,
  `${project.ws.srcDir}/**/*.ts`,
  `${project.ws.testsDir}/**/*.tsx`,
  `${project.ws.testsDir}/**/*.ts`
];

export async function lintAsync(filePatterns = defaultFilePatterns) {
  const filePaths = await globby(filePatterns);
  const contents = (await Promise.all(
    filePaths.map(filePath => fs.readFileAsync(filePath, 'utf8') as any)
  )) as string[];

  const results = filePaths.map((filePath, index) => {
    const content = contents[index];
    const configLoad = Configuration.findConfiguration(configPath, filePath);
    const linter = new Linter(lintOptions);
    linter.lint(filePath, content, configLoad.results);
    return linter.getResult();
  });

  const errors = results.filter(result => !!result.errorCount);
  const errorsCount = results.reduce(
    (count, result) => count + result.failures.length,
    0
  );
  const fixesCount = results.reduce(
    (count, result) => count + (result.fixes ? result.fixes.length : 0),
    0
  );

  return { errors, errorsCount, fixesCount };
}
