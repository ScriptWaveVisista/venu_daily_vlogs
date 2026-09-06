import { siteConfig } from "../config/site";
import { absoluteUrl } from "./urls";

export function homeTitle(): string {
  return `${siteConfig.name} | Food, Recipes & Telugu Lifestyle Videos`;
}

export function recipeTitle(title: string, teluguTitle?: string): string {
  if (teluguTitle) {
    return `${title} Recipe | ${teluguTitle} | ${siteConfig.name}`;
  }

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
