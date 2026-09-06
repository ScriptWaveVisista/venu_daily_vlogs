import { getCollection, type CollectionEntry } from "astro:content";
import { toSlug } from "./slug";
import { withBase } from "./urls";

export type RecipeEntry = CollectionEntry<"recipes">;
export type VlogEntry = CollectionEntry<"vlogs">;
export type ShortEntry = CollectionEntry<"shorts">;

export type HighlightItem = {
  title: string;
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
  return [...new Set(recipes.map((recipe) => recipe.data.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getVlogCategories(vlogs: VlogEntry[]): string[] {
  return [...new Set(vlogs.map((vlog) => vlog.data.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function recipesInCategory(
  recipes: RecipeEntry[],
  categorySlug: string,
): RecipeEntry[] {
  return recipes.filter((recipe) => toSlug(recipe.data.category) === categorySlug);
}

export function vlogsInCategory(vlogs: VlogEntry[], categorySlug: string): VlogEntry[] {
  return vlogs.filter((vlog) => toSlug(vlog.data.category) === categorySlug);
}

export function recipeSearchText(recipe: RecipeEntry): string {
  const ingredients = recipe.data.ingredients
    .map((ingredient) => `${ingredient.item} ${ingredient.quantity ?? ""}`)
    .join(" ");

  return [
    recipe.data.title,
    recipe.data.teluguTitle ?? "",
    recipe.data.description,
    recipe.data.category,
    recipe.data.tags.join(" "),
    ingredients,
  ]
    .join(" ")
    .toLowerCase();
}

export async function getLatestHighlight(): Promise<HighlightItem | null> {
  const [recipes, vlogs, shorts] = await Promise.all([
    getPublishedRecipes(),
    getPublishedVlogs(),
    getPublishedShorts(),
  ]);

  const items: HighlightItem[] = [
    ...recipes.map((recipe) => ({
      title: recipe.data.title,
      description: recipe.data.description,
      publishedDate: recipe.data.publishedDate,
      category: recipe.data.category,
      thumbnail: recipe.data.thumbnail,
      href: withBase(`/recipes/${recipe.id}/`),
      youtubeUrl: recipe.data.youtubeUrl,
      kind: "recipe" as const,
      featured: recipe.data.featured,
      demo: recipe.data.demo,
    })),
    ...vlogs.map((vlog) => ({
      title: vlog.data.title,
      description: vlog.data.description,
      publishedDate: vlog.data.publishedDate,
      category: vlog.data.category,
      thumbnail: vlog.data.thumbnail,
      href: withBase(`/vlogs/${vlog.id}/`),
      youtubeUrl: vlog.data.youtubeUrl,
      kind: "vlog" as const,
      featured: vlog.data.featured,
      demo: vlog.data.demo,
    })),
    ...shorts.map((short) => ({
      title: short.data.title,
      description: short.data.description,
      publishedDate: short.data.publishedDate,
      category: short.data.category,
      thumbnail: short.data.thumbnail,
      href: short.data.youtubeUrl || withBase("/shorts/"),
      youtubeUrl: short.data.youtubeUrl,
      kind: "short" as const,
      featured: short.data.featured,
      demo: short.data.demo,
    })),
  ];

  if (items.length === 0) {
    return null;
  }

  const withVideo = items.filter((item) => item.youtubeUrl);
  const pool = withVideo.length > 0 ? withVideo : items;

  return pool.sort(
    (left, right) => right.publishedDate.getTime() - left.publishedDate.getTime(),
  )[0];
}
