import type { Locale } from "./locales";

export type LocalizedString = string | { en: string; te?: string };

export function getLocalizedValue(
  value: LocalizedString | undefined,
  locale: Locale,
  fallbackTe?: string,
): string {
  if (value == null || value === "") {
    return locale === "te" ? fallbackTe ?? "" : "";
  }

  if (typeof value === "string") {
    return locale === "te" && fallbackTe ? fallbackTe : value;
  }

  if (locale === "te") {
    return value.te || fallbackTe || value.en;
  }

  return value.en;
}

export function localizedSearchBlob(value: LocalizedString | undefined): string {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return [value.en, value.te ?? ""].join(" ");
}
