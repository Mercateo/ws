import { debug } from 'loglevel';
import { join } from 'path';
import globby from 'globby';
import { existsAsync } from 'fs-extra-promise';
import { createProgram } from 'typescript';
import { Compiler } from 'webpack';
import chalk from 'chalk';
import codeFrame from '@babel/code-frame';
import { project } from '../project';
import { sourceFilePatterns } from '../project';

const { red } = chalk;

export async function generateTypings(
  declarationDir: string,
  filePatterns = sourceFilePatterns
) {
  if (project.typings) {
    debug('Generate typings.');
    const filePaths = await globby(filePatterns);
    const options = {
      declaration: true,
      declarationDir
    };

    const result = createProgram(filePaths, options).emit(
      undefined, // targetSourceFile
      undefined, // writeFile
      undefined, // cancellationToken
      true // emitOnlyDtsFiles
    );

    if (result.diagnostics.length) {
      const message = result.diagnostics
        .map(({ messageText, file, start }) => {
          if (file && start) {
            const pos = file.getLineAndCharacterOfPosition(start);
            const frame = codeFrame(
              file.getFullText(),
              pos.line + 1,
              pos.character + 1,
              {
                highlightCode: true
              }
            );
            return `${messageText}\n${frame}`;
          } else {
            return messageText;
          }
        })
        .join('\n');
      throw `\n${message}\n`;
    }

    // check if they exist at the same place where it is configured in your package.json
    const exist = await existsAsync(join(process.cwd(), project.typings));
    if (!exist) {
      throw `${red('typings')} do not exist in ${project.typings}`;
    }
  }
}

export class TypingsPlugin {
  constructor(private declarationDir: string) {}

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapPromise('TypingsPlugin', async () => {
      await generateTypings(this.declarationDir);
    });
  }
}
