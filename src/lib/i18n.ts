import de from './locales/de/ui.json';
export const defaultLocale='de' as const;
export const supportedLocales=['de'] as const;
export type Locale=typeof supportedLocales[number];
export const dictionaries:Record<Locale,Record<string,string>>={de};
export function t(key:keyof typeof de,locale:Locale=defaultLocale):string{return dictionaries[locale]?.[key]??de[key]??key;}
