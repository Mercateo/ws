import { debug } from 'loglevel';
import { join } from 'path';
import { get } from 'https';
import { outputFileAsync, removeAsync } from 'fs-extra-promise';
import urlTemplate from 'url-template';
import { project, I18nConfig } from '../project';
import { concatLanguages } from '../lib/i18n';

const IGNORED_CONTENTS = [
  '404: Not Found\n' // e.g. used by raw.githubusercontent.com
];

function importTranslation(locale: string, feature: string, i18n: I18nConfig) {
  // at this place we know i18n.importUrl config is set, no need for null checks
  const url = urlTemplate.parse(i18n.importUrl!).expand({ locale, feature });
  const outputPath = join(
    process.cwd(),
    i18n.dir,
    feature,
    `${locale}.properties`
  );

  debug(`Import from ${url}.`);

  return new Promise<void>((resolve, reject) => {
    get(url, (res) => {
      let body = '';
      res.on('data', (data) => (body = body + data));
      res.on('error', (err) => console.log(err));
      res.on('end', () => {
        if (IGNORED_CONTENTS.some((content) => body === content)) {
          resolve();
        } else {
          outputFileAsync(outputPath, body)
            .then(() => resolve())
            .catch(reject);
        }
      });
    }).on('error', reject);
  });
}

export default async function i18nImport() {
  // at this place we know i18n config is set, no need for null checks
  const i18n = project.ws.i18n as I18nConfig;

  const features = i18n.features || [''];
  const locales = i18n.locales;
  const localesAndLanguages = concatLanguages(locales);

  await removeAsync(i18n.dir);
  const importPromises: Array<Promise<void>> = [];
  features.forEach((feature) =>
    localesAndLanguages.forEach((localeOrLanguage) => {
      importPromises.push(importTranslation(localeOrLanguage, feature, i18n));
    })
  );

  await Promise.all(importPromises);
}
