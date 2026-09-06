import { siteConfig } from "../config/site";
import type { Locale } from "../i18n/locales";
import { recipeCategoryLabel } from "../i18n/categories";
import {
  ingredientLabel,
  localizedLine,
  recipeDescription,
  recipeTitle,
  vlogDescription,
  vlogTitle,
  type RecipeEntry,
  type VlogEntry,
} from "./content";
import { toIsoDate } from "./dates";
import { toIsoDuration } from "./seo";
import { absoluteUrl, getCanonicalUrl, localePath } from "./urls";
import { getYouTubeEmbedUrl } from "./youtube";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getCanonicalUrl(localePath(locale, "/")),
    inLanguage: locale,
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
    },
  };
}

export function breadcrumbJsonLd(
  items: { href: string; name?: string; label?: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name ?? item.label ?? "",
      item: absoluteUrl(item.href),
    })),
  };
}

export function videoObjectJsonLd(input: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: Date;
  youtubeUrl?: string;
}): JsonLd | null {
  const embedUrl = getYouTubeEmbedUrl(input.youtubeUrl);
  if (!embedUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: [absoluteUrl(input.thumbnailUrl)],
    uploadDate: toIsoDate(input.uploadDate),
    embedUrl,
  };
}

export function recipeJsonLd(recipe: RecipeEntry, locale: Locale): JsonLd {
  const data = recipe.data;
  const name = recipeTitle(recipe, locale);
  const description = recipeDescription(recipe, locale);
  const video = videoObjectJsonLd({
    name,
    description,
    thumbnailUrl: data.thumbnail,
    uploadDate: data.publishedDate,
    youtubeUrl: data.youtubeUrl,
  });

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name,
    description,
    image: [absoluteUrl(data.thumbnail)],
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    datePublished: toIsoDate(data.publishedDate),
    recipeCategory: recipeCategoryLabel(data.category, locale),
    recipeCuisine: data.cuisine,
    keywords: data.tags.join(", "),
    inLanguage: locale,
  };

  if (data.updatedDate) {
    schema.dateModified = toIsoDate(data.updatedDate);
  }

  const prepTime = toIsoDuration(data.prepTime);
  const cookTime = toIsoDuration(data.cookTime);
  const totalTime = toIsoDuration(data.totalTime);

  if (prepTime) schema.prepTime = prepTime;
  if (cookTime) schema.cookTime = cookTime;
  if (totalTime) schema.totalTime = totalTime;
  if (data.servings) schema.recipeYield = String(data.servings);

  if (data.ingredients.length > 0) {
    schema.recipeIngredient = data.ingredients.map((ingredient) =>
      ingredientLabel(ingredient, locale),
    );
  }

  if (data.instructions.length > 0) {
    schema.recipeInstructions = data.instructions.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: localizedLine(step, locale),
    }));
  }

  if (video) {
    schema.video = video;
  }

  return schema;
}

export function vlogJsonLd(vlog: VlogEntry, pageUrl: string, locale: Locale): JsonLd {
  const name = vlogTitle(vlog, locale);
  const description = vlogDescription(vlog, locale);
  const video = videoObjectJsonLd({
    name,
    description,
    thumbnailUrl: vlog.data.thumbnail,
    uploadDate: vlog.data.publishedDate,
    youtubeUrl: vlog.data.youtubeUrl,
  });

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description,
    image: [absoluteUrl(vlog.data.thumbnail)],
    datePublished: toIsoDate(vlog.data.publishedDate),
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    mainEntityOfPage: absoluteUrl(pageUrl),
    ...(video ? { video } : {}),
  };
}
