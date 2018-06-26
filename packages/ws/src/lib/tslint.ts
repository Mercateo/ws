import { Linter, ILinterOptions, Configuration } from 'tslint';
import { join } from 'path';
import { uniq } from 'lodash';
import globToRegExp from 'glob-to-regexp';
import { sourceFilePatterns } from '../project';

// relative from dist/index.js
const configPath = join(__dirname, '..', 'tslint.json');

const lintOptions: ILinterOptions = {
  formatter: 'codeFrame',
  rulesDirectory: [],
  formattersDirectory: '',
  fix: true
};

// a matcher which checks, if a given absolute path matches your source files
const sourceFileMatcher = globToRegExp(
  join(process.cwd(), sourceFilePatterns),
  { extended: true, globstar: true }
);
const isSourceFile = (file: string) => file.match(sourceFileMatcher);

export async function tslintAsync() {
  const program = Linter.createProgram('tsconfig.json');
  const linter = new Linter(lintOptions, program);

  // note: normally dependencies aren't part of your source files, but if you
  // import a file from a dependency (e.g. `import "cool-package/foo"`) this
  // will be in your files array → that's why we need `.filter(isSourceFile)`
  const files = Linter.getFileNames(program).filter(isSourceFile);

  files.forEach((file) => {
    const fileContents = program.getSourceFile(file).getFullText();
    const conf = Configuration.findConfiguration(configPath, file).results;
    linter.lint(file, fileContents, conf);
  });

  const result = linter.getResult();
  const errors = result.output;
  const errorsCount = result.errorCount;
  const fixedFiles = uniq((result.fixes || []).map(({ fileName }) => fileName));

  return { errors, errorsCount, fixedFiles };
}
