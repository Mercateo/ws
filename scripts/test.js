// Use this non-Lerna script for Travis
const join = require('path').join;
const existsSync = require('fs').existsSync;
const execSync = require('child_process').execSync;
const rimrafSync = require('rimraf').sync;

const examples = [
  'example-browser-js',
  'example-browser-css',
  'example-browser-ts',
  'example-browser-ts-react',
  'example-browser-ts-react-i18n',
  'example-node-ts',
  'example-node-ts-2',
  'example-spa-ts',
  'example-spa-ts-i18n',
  'example-spa-ts-import'
];

const stdio = 'inherit';

execSync('yarn', { stdio });

execSync('yarn build', { cwd: join(process.cwd(), 'packages', 'ws'), stdio });
execSync('yarn ws lint', { cwd: join(process.cwd(), 'packages', 'ws'), stdio });

examples.forEach((example) => {
  console.log(`Update "${example}":`);
  try {
    // fresh start
    const cwd = join(process.cwd(), 'packages', example);
    rimrafSync(join(cwd, 'dist'));
    rimrafSync(join(cwd, 'dist-tests'));
    rimrafSync(join(cwd, 'dist-release'));

    const pkg = require(join(cwd, 'package.json'));

    // test commands
    execSync('npm run -s ws -- build', { cwd, stdio });
    if (
      example.includes('spa') ||
      example.includes('browser') ||
      example.includes('electron') ||
      example === 'ws-intl'
    ) {
      execSync('npm run -s ws -- build --production', { cwd, stdio });
    }
    execSync('npm run -s ws -- lint', { cwd, stdio });
    if (pkg.scripts && pkg.scripts.unit) {
      execSync('npm run -s unit', { cwd, stdio });
    } else if (
      existsSync(join(cwd, 'tests', 'unit.ts')) ||
      existsSync(join(cwd, 'tests', 'unit.js')) ||
      existsSync(join(cwd, 'tests', 'unit.tsx'))
    ) {
      execSync('npm run -s ws -- unit', { cwd, stdio });
    }
  } catch (err) {
    throw `[ERROR] Couldn't update "${example}"!`;
  }
  console.log(`Finished updating "${example}".`);
});

console.log('Updated all examples ♥');
