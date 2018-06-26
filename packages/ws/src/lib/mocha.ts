import Mocha from 'mocha';

export function testAsync(files: string[]) {
  const mocha = new Mocha();
  files.forEach((file) => mocha.addFile(file));
  return new Promise<number>((resolve) => {
    mocha.run(resolve);
  });
}
