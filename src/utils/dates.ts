import { localeIntl, type Locale } from "../i18n/locales";

export function formatDate(date: Date, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(localeIntl[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function sortByNewest<T extends { publishedDate: Date }>(items: T[]): T[] {
  return [...items].sort(
    (left, right) => right.publishedDate.getTime() - left.publishedDate.getTime(),
  );
}
