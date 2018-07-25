// Use this non-Lerna script for Travis
const join = require('path').join;
const execSync = require('child_process').execSync;
const rimrafSync = require('rimraf').sync;

const packages = [
  'ws',
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

const commands = ['build', 'unit', 'lint'];

const stdio = 'inherit';

packages.forEach((package) => {
  console.log(`Update "${package}":`);
  try {
    // fresh start
    const cwd = join(process.cwd(), 'packages', package);
    rimrafSync(join(cwd, 'dist'));
    rimrafSync(join(cwd, 'dist-tests'));
    rimrafSync(join(cwd, 'dist-release'));

    // run commands
    const pkg = require(join(cwd, 'package.json'));
    commands.forEach((command) => {
      if (pkg.scripts[command]) {
        execSync(`npm run -s -- ${command}`, { cwd, stdio });
      }
    });
  } catch (err) {
    throw `[ERROR] Couldn't update "${package}"!`;
  }
  console.log(`Finished updating "${package}".`);
});

console.log('Updated all packages ♥');
