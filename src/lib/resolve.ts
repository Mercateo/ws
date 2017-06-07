import path from 'path';
import resolveFrom from 'resolve-from';

// we resolve babel presets and plugins relative to our ws tool instead of the project
// this prevents bugs when you symlink ws
export const resolve = resolveFrom.bind(null, path.join(__dirname, '..')); // relative to `dist/index.js`
