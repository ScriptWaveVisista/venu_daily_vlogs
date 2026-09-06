import { siteConfig } from "../config/site";
import type { Locale } from "../i18n/locales";
import { t } from "../i18n/translations";
import { absoluteUrl } from "./urls";

export function homeTitle(locale: Locale = "en"): string {
  return locale === "te"
    ? `${siteConfig.name} | వంటలు, రెసిపీలు & తెలుగు జీవనశైలి వీడియోలు`
    : `${siteConfig.name} | Food, Recipes & Telugu Lifestyle Videos`;
}

export function recipeDocumentTitle(title: string): string {
  return `${title} Recipe | ${siteConfig.name}`;
}

export function pageTitle(title: string): string {
  return `${title} | ${siteConfig.name}`;
}

export function resolveOgImage(image?: string): string {
  return absoluteUrl(image || siteConfig.defaultOgImage);
}

export function toIsoDuration(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const hoursMatch = /(\d+)\s*(hours?|hrs?)/i.exec(value);
  const minutesMatch = /(\d+)\s*(minutes?|mins?)/i.exec(value);

  if (!hoursMatch && !minutesMatch) {
    return undefined;
  }

  const hours = hoursMatch ? `${hoursMatch[1]}H` : "";
  const minutes = minutesMatch ? `${minutesMatch[1]}M` : "";
  return `PT${hours}${minutes}`;
}

export function localizedHomeDescription(locale: Locale): string {
  return t(locale).hero.description;
}
