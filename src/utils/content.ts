import { getCollection, type CollectionEntry } from "astro:content";
import { categorySlug, recipeCategoryLabel, vlogCategoryLabel } from "../i18n/categories";
import { getLocalizedValue, localizedSearchBlob } from "../i18n/localize";
import type { Locale } from "../i18n/locales";
import { localePath } from "./urls";

export type RecipeEntry = CollectionEntry<"recipes">;
export type VlogEntry = CollectionEntry<"vlogs">;
export type ShortEntry = CollectionEntry<"shorts">;

export type HighlightItem = {
  title: string;
  teluguTitle?: string;
  description: string;
  publishedDate: Date;
  category: string;
  thumbnail: string;
  href: string;
  youtubeUrl?: string;
  kind: "recipe" | "vlog" | "short";
  featured: boolean;
  demo?: boolean;
};

function isVisible(draft: boolean | undefined): boolean {
  if (!draft) {
    return true;
  }

  return import.meta.env.DEV;
}

function byNewestDate<T extends { data: { publishedDate: Date } }>(
  left: T,
  right: T,
): number {
  return right.data.publishedDate.getTime() - left.data.publishedDate.getTime();
}

function byFeaturedThenNewest<T extends { data: { featured?: boolean; publishedDate: Date } }>(
  left: T,
  right: T,
): number {
  const featuredDelta =
    Number(Boolean(right.data.featured)) - Number(Boolean(left.data.featured));

  if (featuredDelta !== 0) {
    return featuredDelta;
  }

  return byNewestDate(left, right);
}

export async function getPublishedRecipes(): Promise<RecipeEntry[]> {
  const recipes = await getCollection("recipes", ({ data }) => isVisible(data.draft));
  return recipes.sort(byNewestDate);
}

export async function getPublishedVlogs(): Promise<VlogEntry[]> {
  const vlogs = await getCollection("vlogs", ({ data }) => isVisible(data.draft));
  return vlogs.sort(byNewestDate);
}

export async function getPublishedShorts(): Promise<ShortEntry[]> {
  const shorts = await getCollection("shorts", ({ data }) => isVisible(data.draft));
  return shorts.sort(byNewestDate);
}

export function prioritizeFeatured<T extends { data: { featured?: boolean; publishedDate: Date } }>(
  items: T[],
): T[] {
  return [...items].sort(byFeaturedThenNewest);
}

export function getRecipeCategories(recipes: RecipeEntry[]): string[] {
  return [...new Set(recipes.map((recipe) => categorySlug(recipe.data.category)))];
}

export function getVlogCategories(vlogs: VlogEntry[]): string[] {
  return [...new Set(vlogs.map((vlog) => categorySlug(vlog.data.category)))];
}

export function recipesInCategory(
  recipes: RecipeEntry[],
  category: string,
): RecipeEntry[] {
  return recipes.filter((recipe) => categorySlug(recipe.data.category) === category);
}

export function vlogsInCategory(vlogs: VlogEntry[], category: string): VlogEntry[] {
  return vlogs.filter((vlog) => categorySlug(vlog.data.category) === category);
}

export function recipeTitle(recipe: RecipeEntry, locale: Locale): string {
  return getLocalizedValue(recipe.data.title, locale, recipe.data.teluguTitle);
}

export function recipeAltTitle(recipe: RecipeEntry, locale: Locale): string {
  const primary = recipeTitle(recipe, locale);
  const other = getLocalizedValue(recipe.data.title, locale === "en" ? "te" : "en", recipe.data.teluguTitle);
  return other && other !== primary ? other : "";
}

export function recipeDescription(recipe: RecipeEntry, locale: Locale): string {
  return getLocalizedValue(recipe.data.description, locale);
}

export function vlogTitle(vlog: VlogEntry, locale: Locale): string {
  return getLocalizedValue(vlog.data.title, locale, vlog.data.teluguTitle);
}

export function vlogDescription(vlog: VlogEntry, locale: Locale): string {
  return getLocalizedValue(vlog.data.description, locale);
}

export function shortTitle(short: ShortEntry, locale: Locale): string {
  return getLocalizedValue(short.data.title, locale, short.data.teluguTitle);
}

export function shortDescription(short: ShortEntry, locale: Locale): string {
  return getLocalizedValue(short.data.description, locale);
}

export function ingredientLabel(
  ingredient: RecipeEntry["data"]["ingredients"][number],
  locale: Locale,
): string {
  const name = getLocalizedValue(
    { en: ingredient.en || ingredient.item || "", te: ingredient.te },
    locale,
  );
  return [ingredient.quantity, name].filter(Boolean).join(" ");
}

export function localizedLine(
  value: string | { en: string; te?: string },
  locale: Locale,
): string {
  return getLocalizedValue(value, locale);
}

export function recipeSearchText(recipe: RecipeEntry): string {
  const ingredients = recipe.data.ingredients
    .map((ingredient) =>
      [ingredient.quantity, ingredient.item, ingredient.en, ingredient.te].filter(Boolean).join(" "),
    )
    .join(" ");

  return [
    localizedSearchBlob(recipe.data.title),
    recipe.data.teluguTitle ?? "",
    localizedSearchBlob(recipe.data.description),
    recipe.data.category,
    recipeCategoryLabel(recipe.data.category, "en"),
    recipeCategoryLabel(recipe.data.category, "te"),
    recipe.data.tags.join(" "),
    ingredients,
    recipe.data.instructions.map((step) => localizedSearchBlob(step)).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export async function getLatestHighlight(locale: Locale): Promise<HighlightItem | null> {
  const [recipes, vlogs] = await Promise.all([
    getPublishedRecipes(),
    getPublishedVlogs(),
  ]);

  const items: HighlightItem[] = [
    ...recipes.map((recipe) => ({
      title: recipeTitle(recipe, locale),
      teluguTitle: recipeAltTitle(recipe, locale),
      description: recipeDescription(recipe, locale),
      publishedDate: recipe.data.publishedDate,
      category: recipeCategoryLabel(recipe.data.category, locale),
      thumbnail: recipe.data.thumbnail,
      href: localePath(locale, `/recipes/${recipe.id}/`),
      youtubeUrl: recipe.data.youtubeUrl,
      kind: "recipe" as const,
      featured: recipe.data.featured,
      demo: recipe.data.demo,
    })),
    ...vlogs.map((vlog) => ({
      title: vlogTitle(vlog, locale),
      description: vlogDescription(vlog, locale),
      publishedDate: vlog.data.publishedDate,
      category: vlogCategoryLabel(vlog.data.category, locale),
      thumbnail: vlog.data.thumbnail,
      href: localePath(locale, `/vlogs/${vlog.id}/`),
      youtubeUrl: vlog.data.youtubeUrl,
      kind: "vlog" as const,
      featured: vlog.data.featured,
      demo: vlog.data.demo,
    })),
  ];

  if (items.length === 0) {
    return null;
  }

  return items.sort(
    (left, right) =>
      Number(right.featured) - Number(left.featured) ||
      right.publishedDate.getTime() - left.publishedDate.getTime(),
  )[0];
}

export async function getFeaturedVlog(locale: Locale): Promise<HighlightItem | null> {
  const vlogs = prioritizeFeatured(await getPublishedVlogs());
  const vlog = vlogs[0];
  if (!vlog) {
    return null;
  }

  return {
    title: vlogTitle(vlog, locale),
    description: vlogDescription(vlog, locale),
    publishedDate: vlog.data.publishedDate,
    category: vlogCategoryLabel(vlog.data.category, locale),
    thumbnail: vlog.data.thumbnail,
    href: localePath(locale, `/vlogs/${vlog.id}/`),
    youtubeUrl: vlog.data.youtubeUrl,
    kind: "vlog",
    featured: vlog.data.featured,
    demo: vlog.data.demo,
  };
}
