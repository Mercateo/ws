import { listenAsync } from '../lib/express';
import { project } from '../project';

export default async function serve(options: any) {
  if (options.production) {
    await listenAsync([], project.ws.distReleaseDir);
  } else {
    await listenAsync();
  }
}
