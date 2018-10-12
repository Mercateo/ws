import { readJsonSync, writeFileAsync, readFileAsync } from 'fs-extra-promise';
import { join, relative } from 'path';
import chalk from 'chalk';
import { CLIEngine } from 'eslint';
import codeFrame from '@babel/code-frame';
import { sourceFilePatterns } from '../project';

const { dim, red } = chalk;

// relative from dist/index.js
const configPath = join(__dirname, '..', '.eslintrc.json');
const config = readJsonSync(configPath);
// learn about the caveats of `config.fix = true` here: https://github.com/eslint/eslint/issues/9147
config.fix = true;
const engine = new CLIEngine(config);

interface Message {
  ruleId: string;
  severity: 0 | 1 | 2;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  source: string;
  endLine: number;
  endColumn: number;
}

interface Result {
  filePath: string;
  messages: Array<Message>;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  output: string;
}

interface Stats {
  results: Array<Result>;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
}

const formatter = async (result: Result) => {
  if (!result.messages || !result.messages.length) return '';

  const fileContent = await readFileAsync(result.filePath, 'utf8');

  const messagesOutput = result.messages.map((message) => {
    const ruleId = dim(`(${message.ruleId})`);
    const msg = red(message.message);

    return [
      `${msg} ${ruleId}`,
      `${codeFrame(fileContent, message.line, message.column, {
        highlightCode: true
      })}`
    ].join('\n');
  });

  const filename = relative('.', result.filePath);

  return `${filename}\n${messagesOutput.join('\n\n')}`;
};

export async function eslintAsync(filePatterns = sourceFilePatterns) {
  const stats: Stats = engine.executeOnFiles([filePatterns]);

  const fixedFiles: string[] = [];
  await Promise.all(
    stats.results.map(async (result) => {
      const wasFixed = result.output !== undefined;
      if (wasFixed) {
        fixedFiles.push(result.filePath);
        await writeFileAsync(result.filePath, result.output);
      }
    })
  );

  const errorsCount = stats.errorCount;
  const errorsOrEmpty = await Promise.all(stats.results.map(formatter));
  const errors = errorsOrEmpty.filter(Boolean);
  return { errors, errorsCount, fixedFiles };
}
