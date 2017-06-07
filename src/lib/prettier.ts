import { format } from 'prettier';
import { readFileAsync, writeFileAsync } from 'fs-extra-promise';
import globby from 'globby';
import { error } from 'loglevel';
import { red } from 'chalk';
import { project } from '../project';

const options = {
  singleQuote: true,
  parser: 'typescript'
};

const defaultFilePatterns = [
  `${project.ws.srcDir}/**/*.tsx`,
  `${project.ws.srcDir}/**/*.ts`,
  `${project.ws.testsDir}/**/*.tsx`,
  `${project.ws.testsDir}/**/*.ts`
];

export async function formatAsync(filePatterns = defaultFilePatterns) {
  const filePaths = await globby(filePatterns);
  const contents = (await Promise.all(
    filePaths.map(filePath => readFileAsync(filePath, 'utf8') as any)
  )) as string[];

  let fixesCount = 0;
  await Promise.all(
    filePaths.map((filePath, index) => {
      const content = contents[index];
      let formattedContent;

      try {
        formattedContent = format(content, options);
      } catch (err) {
        error(`Couldn't format ${red(filePath)}.`);
        throw err;
      }

      if (content !== formattedContent) {
        fixesCount += 1;
        writeFileAsync(filePath, formattedContent);
      }
    })
  );

  return fixesCount;
}
