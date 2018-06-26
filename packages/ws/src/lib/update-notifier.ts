import { exec } from 'child_process';
import { gt } from 'semver';
import { debug, warn, info } from 'loglevel';
import chalk from 'chalk';

const { cyan, magenta } = chalk;

interface DistTags {
  next: string;
  latest: string;
}

const CHANGELOG_URL = 'https://github.com/Mercateo/ws/blob/master/CHANGELOG.md';
const LOVE_EMOJI = ['(☞ﾟヮﾟ)☞', '( ˘ ³˘)♥', '(ᵔᴥᵔ)'];

const getRandom = (arr: Array<any>): any =>
  arr[Math.floor(Math.random() * arr.length)];

type NotifierState = 'pending' | 'warn' | 'outdated' | 'up-to-date';

export function initializeUpdateNotifier(currentVersion: string) {
  let message: any;
  let state: NotifierState = 'pending';
  const cmd = 'npm show @mercateo/ws dist-tags --json';

  const child = exec(cmd, (error, stdout, stderr) => {
    if (child.killed) return;

    if (error) {
      state = 'warn';
      message =
        `Couldn't check, if a new version of @mercateo/ws is available.\n` +
        error;
    } else {
      const distTags = JSON.parse(stdout) as DistTags;
      const currentVersionIsPrerelease = currentVersion.includes('-');

      const latestVersionIsGreater = gt(distTags.latest, currentVersion);
      const nextVersionIsGreater = gt(distTags.next, currentVersion);
      const hasRelevantUpdate = currentVersionIsPrerelease
        ? latestVersionIsGreater || nextVersionIsGreater
        : latestVersionIsGreater;
      const relevantVersion = latestVersionIsGreater
        ? distTags.latest
        : distTags.next;

      if (hasRelevantUpdate) {
        const emoji = magenta(getRandom(LOVE_EMOJI));
        const version = magenta(relevantVersion);
        const url = cyan(CHANGELOG_URL);
        state = 'outdated';
        message = `
  ${emoji} Update available. The newest version of @mercateo/ws is ${version}.
  See ${url} for details.
`;
      } else {
        state = 'up-to-date';
        message = 'Your version of @mercateo/ws is up to date.';
      }
    }
  });

  return function handleNotifier() {
    switch (state) {
      case 'pending':
        child.kill();
        break;
      case 'outdated':
        info(message);
        break;
      case 'up-to-date':
        debug(message);
        break;
      case 'warn':
        warn(message);
        break;
    }
  };
}
