export const locales = ["en", "te"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  te: "te",
};

export const localeOg: Record<Locale, string> = {
  en: "en_IN",
  te: "te_IN",
};

export const localeIntl: Record<Locale, string> = {
  en: "en-IN",
  te: "te-IN",
};

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "te";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "te" : "en";
}

export function localeStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
