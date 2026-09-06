import { toSlug } from "../utils/slug";
import type { Locale } from "./locales";

export type CategoryDef = {
  slug: string;
  en: string;
  te: string;
};

export const recipeCategoryDefs: CategoryDef[] = [
  { slug: "chicken", en: "Chicken", te: "చికెన్" },
  { slug: "mutton", en: "Mutton", te: "మటన్" },
  { slug: "breakfast", en: "Breakfast", te: "అల్పాహారం" },
  { slug: "snacks", en: "Snacks", te: "స్నాక్స్" },
  { slug: "vegetarian", en: "Vegetarian", te: "శాకాహారం" },
  { slug: "desserts", en: "Desserts", te: "స్వీట్స్" },
];

export const vlogCategoryDefs: CategoryDef[] = [
  { slug: "family", en: "Family", te: "కుటుంబం" },
  { slug: "food", en: "Food", te: "ఆహారం" },
  { slug: "travel", en: "Travel", te: "ప్రయాణం" },
  { slug: "lifestyle", en: "Lifestyle", te: "జీవనశైలి" },
];

function lookup(defs: CategoryDef[], raw: string, locale: Locale): string {
  const slug = toSlug(raw);
  const match = defs.find((item) => item.slug === slug || toSlug(item.en) === slug);
  if (!match) {
    return raw;
  }

  return locale === "te" ? match.te : match.en;
}

export function recipeCategoryLabel(raw: string, locale: Locale): string {
  return lookup(recipeCategoryDefs, raw, locale);
}

export function vlogCategoryLabel(raw: string, locale: Locale): string {
  return lookup(vlogCategoryDefs, raw, locale);
}

export function categorySlug(raw: string): string {
  const slug = toSlug(raw);
  const match = [...recipeCategoryDefs, ...vlogCategoryDefs].find(
    (item) => item.slug === slug || toSlug(item.en) === slug,
  );
  return match?.slug ?? slug;
}
