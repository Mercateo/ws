// check all examples
const join = require('path').join;
const existsSync = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;
const rimrafSync = require('rimraf').sync;
const snapshotSync = require('snapshot-dir').snapshotSync;
const snapshotCompareSync = require('snapshot-dir').snapshotCompareSync;

const examples = [
  'ws-intl'
  // 'browser-less',
  // 'browser-ts',
  // 'browser-ts-react',
  // 'browser-ts-react-i18n',
  // 'spa-ts',
  // 'spa-ts-i18n',
  // 'spa-ts-lazy-import',
  // 'node-ts',
  // 'node-ts-2',
  // 'electron-ts',
  // 'electron-ts-i18n'
];

const stdio = 'inherit';
const diff = [];

examples.forEach(example => {
  console.log(`Update "${example}":`);
  try {
    // fresh start
    const cwd = join(process.cwd(), 'examples', example);
    const snapshotFile = join(cwd, 'snapshot.json');
    let snapshotDir = join(cwd, 'dist-release');
    rimrafSync(join(cwd, 'node_modules'));
    rimrafSync(join(cwd, 'dist'));
    rimrafSync(join(cwd, 'dist-tests'));
    rimrafSync(join(cwd, 'dist-release'));
    // switched back to npm because yarn caches local dependencies
    execSync('npm install', { cwd, stdio });

    // test commands
    execSync('npm run -s ws -- build', { cwd, stdio });
    if (
      example.includes('spa') ||
      example.includes('browser') ||
      example.includes('electron') ||
      example === 'ws-intl'
    ) {
      execSync('npm run -s ws -- build --production', { cwd, stdio });
    } else {
      snapshotDir = join(cwd, 'dist');
    }

    // snapshotting
    if (!existsSync(snapshotFile)) {
      writeFileSync(snapshotFile, JSON.stringify(snapshotSync(snapshotDir)));
    }

    const dirDiff = snapshotCompareSync(
      snapshotDir,
      JSON.parse(readFileSync(snapshotFile))
    );
    if (dirDiff) {
      diff.push({ name: example, diff: dirDiff });
    }

    execSync('npm run -s ws -- lint', { cwd, stdio });
    if (
      existsSync(join(cwd, 'tests', 'unit.ts')) ||
      existsSync(join(cwd, 'tests', 'unit.js')) ||
      existsSync(join(cwd, 'tests', 'unit.tsx'))
    ) {
      execSync('npm run -s ws -- unit', { cwd, stdio });
    }
    // test grid
    // if (example === 'spa-ts') {
    //   const server = spawn('npm', [ 'run', '-s', 'ws', '--', 'serve'], { cwd, stdio });
    //   execSync('npm run -s ws -- e2e --browsers ff', { cwd, stdio });
    //   // execSync('npm run -s ws -- e2e -g', { cwd, stdio });
    //   // execSync('npm run -s ws -- unit -g', { cwd, stdio });
    //   server.kill();
    // }
  } catch (err) {
    throw `[ERROR] Couldn't update "${example}"!`;
  }
  console.log(`Finished updating "${example}".`);
});

if (diff.length !== 0) {
  console.log(`Content of dist diffs from snapshot for: `);
  diff.map(example => {
    console.log(`- ${example.name}`, example.diff);
  });
  console.log('If this is expected please delete snapshot.json');
  process.exit(1);
} else {
  console.log('Updated all examples ♥');
}
