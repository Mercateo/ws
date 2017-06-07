import globby from 'globby';
import { join, basename, dirname } from 'path';
import { resolve } from './resolve';

interface LocaleMap {
  [s: string]: boolean;
}

let cachedLocales: LocaleMap;

export async function getIntlLocales(): Promise<LocaleMap> {
  if (!cachedLocales) {
    const intlPath = await resolve('intl');
    const cwd = join(dirname(intlPath), 'locale-data/jsonp');
    const localeFiles = await globby('*.js', { cwd });
    const locales = localeFiles.map(file => basename(file, '.js'));
    cachedLocales = {};
    locales.forEach(key => (cachedLocales[key] = true));
  }
  return cachedLocales;
}

export async function toIntlLocale(locale: string): Promise<string> {
  const localeMap = await getIntlLocales();
  const longIntlLocale = locale.replace('_', '-');
  if (localeMap[longIntlLocale]) {
    return longIntlLocale;
  }

  const shortIntlLocale = longIntlLocale.split('-')[0];
  if (localeMap[shortIntlLocale]) {
    return shortIntlLocale;
  }

  throw `The locale ${locale} can't be converted to a locale which "intl" understands.`;
}
