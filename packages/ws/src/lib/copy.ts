import globby from 'globby';
import { join } from 'path';
import { copyAsync } from 'fs-extra-promise';

export async function copy(srcDir: string, destDir: string, pattern: string) {
  const files = await globby(pattern, { cwd: join(process.cwd(), srcDir) });
  await Promise.all(
    files.map((file) => copyAsync(join(srcDir, file), join(destDir, file)))
  );
}
