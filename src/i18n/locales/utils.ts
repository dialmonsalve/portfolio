import { ui, defaultLang, routes } from './ui';

export function getPathname(url: URL) {
  const pathname = url.pathname
    .replace(/(\/index)?\.html$/, '')
    .replace(/\/+$/, '');
  return pathname || '/';
}

export function getLangFromUrl(url: URL):"es" | "en" {
  const [, lang] = getPathname(url).split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLangStaticPaths() {
  return Object.keys(ui).map((lang) => ({ params: { lang } }));
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    if (path === '/' || path === '') {
      return `/${l}`;
    }

    const pathKey = path.replace(/^\/|\/$/g, '');

    const hasTranslation =
      routes[l] !== undefined && routes[l][pathKey] !== undefined;

    const translatedSlug = hasTranslation ? routes[l][pathKey] : pathKey;

    return `/${l}/${translatedSlug}`.replace(/\/+$/, '');
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = getPathname(new URL(url));
  const parts = pathname?.split('/').filter(Boolean);

  if (parts.length < 2) return '/';

  const path = parts.slice(1).join('/');

  const currentLang = getLangFromUrl(url);

  const getKeyByValue = (
    obj: Record<string, string>,
    value: string
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  return reversedKey !== undefined ? reversedKey : path;
}