import globby from 'globby';
import { debug } from 'loglevel';
import { parse } from 'properties';
import { join, dirname } from 'path';
import { camelCase } from 'lodash';
import { readFileAsync, readJsonAsync } from 'fs-extra-promise';
import parentDirs from 'parent-dirs';
import { concatLanguages, isMatchingLocaleOrLanguage } from './utils';
import { project, I18nConfig } from '../../project';

const parser = require('intl-messageformat-parser');

export interface TranslationMap {
  [key: string]: string;
}

export interface AstMap {
  [key: string]: any;
}

interface Translation {
  locale: string;
  data: TranslationMap;
}

interface GroupedTranslation {
  locale: string;
  translations: Translation[];
}

export interface ParsedTranslation {
  locale: string;
  data: TranslationMap;
  asts: AstMap;
}

function camelCaseKeys(data: any) {
  return Object.keys(data).reduce((acc: any, key: string) => {
    acc[camelCase(key)] = data[key];
    return acc;
  }, {});
}

async function readTranslation(
  cwd: string,
  dir: string,
  locale: string,
  feature: string
): Promise<Translation> {
  const readPath = join(cwd, dir, feature, `${locale}.properties`);

  debug(`Read from ${readPath}.`);

  const translation: Translation = await readFileAsync(readPath, 'utf8')
    .then(parse)
    .catch((err) => {
      if (err.code === 'ENOENT') {
        // translations can be "empty"
        return {};
      } else {
        throw err;
      }
    })
    .then(camelCaseKeys)
    .then((data) => ({ data, locale }));

  return translation;
}

export async function getTranslations() {
  // at this place we know i18n config is set, no need for null checks
  const i18n = project.ws.i18n as I18nConfig;

  const translatedModules: Array<{
    cwd: string;
    dir: string;
    features: Array<string>;
    localesAndLanguages: Array<string>;
  }> = [];

  translatedModules.push({
    cwd: process.cwd(),
    dir: i18n.dir,
    features: i18n.features || [''],
    localesAndLanguages: concatLanguages(i18n.locales)
  });

  // get translations from all deps (this is very dumb right now)
  // we also look into parent directories for workspace based projects
  const patterns = parentDirs().map((dir) =>
    join(dir, 'node_modules/**/package.json')
  );
  const deps = await globby(patterns);
  await Promise.all(
    deps.map((dep) =>
      readJsonAsync(dep).then((pkg) => {
        if (pkg.ws && pkg.ws.i18n) {
          translatedModules.push({
            cwd: dirname(dep),
            dir: pkg.ws.i18n.dir || 'i18n',
            features: pkg.ws.i18n.features || [''],
            localesAndLanguages: concatLanguages(pkg.ws.i18n.locales)
          });
        }
      })
    )
  );

  const readPromises: Array<Promise<Translation>> = [];
  translatedModules.forEach((translatedModule) =>
    translatedModule.features.forEach((feature) =>
      translatedModule.localesAndLanguages.forEach((localeOrLanguage) => {
        readPromises.push(
          readTranslation(
            translatedModule.cwd,
            translatedModule.dir,
            localeOrLanguage,
            feature
          )
        );
      })
    )
  );
  const translations: Array<Translation> = await Promise.all(readPromises);

  const groupedTranslations: Array<GroupedTranslation> = i18n.locales.map(
    (locale) => ({
      locale,
      translations: translations.filter((translation) =>
        isMatchingLocaleOrLanguage(translation.locale, locale)
      )
    })
  );

  const mergedTranslations: Array<Translation> = groupedTranslations.map(
    ({ locale, translations }) => ({
      locale,
      data: translations
        .reverse()
        .reduce(
          (acc, translation) => Object.assign(acc, translation.data),
          {} as TranslationMap
        )
    })
  );

  const parsedTranslations: Array<ParsedTranslation> = mergedTranslations.map(
    (translation) => {
      const asts: { [s: string]: any } = {};
      Object.keys(translation.data).forEach((key) => {
        const ast = parser.parse(translation.data[key]);
        asts[key] = ast;
      });
      return Object.assign({ asts }, translation);
    }
  );

  return parsedTranslations;
}
