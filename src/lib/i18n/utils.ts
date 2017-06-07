import { uniq } from 'lodash';

export function parseLanguage(locale: string) {
  return locale.includes('_') ? locale.split('_')[0] : locale;
}

export function isMatchingLocaleOrLanguage(
  localeOrLanguage: string,
  locale: string
) {
  return localeOrLanguage === locale || locale.startsWith(localeOrLanguage);
}

export function getLanguages(locales: string[]) {
  return uniq(locales.map(parseLanguage));
}

export function concatLanguages(locales: string[]) {
  return locales.concat(getLanguages(locales));
}
