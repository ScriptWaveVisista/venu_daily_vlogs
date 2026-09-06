import { siteConfig } from "../config/site";
import type { RecipeEntry, VlogEntry } from "./content";
import { toIsoDate } from "./dates";
import { toIsoDuration } from "./seo";
import { absoluteUrl, getSiteOrigin } from "./urls";
import { getYouTubeEmbedUrl } from "./youtube";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: `${getSiteOrigin()}/`,
    inLanguage: siteConfig.language,
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

export function recipeJsonLd(recipe: RecipeEntry): JsonLd {
  const data = recipe.data;
  const video = videoObjectJsonLd({
    name: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail,
    uploadDate: data.publishedDate,
    youtubeUrl: data.youtubeUrl,
  });

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: data.title,
    description: data.description,
    image: [absoluteUrl(data.thumbnail)],
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    datePublished: toIsoDate(data.publishedDate),
    recipeCategory: data.category,
    recipeCuisine: data.cuisine,
    keywords: data.tags.join(", "),
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
      [ingredient.quantity, ingredient.item].filter(Boolean).join(" "),
    );
  }

  if (data.instructions.length > 0) {
    schema.recipeInstructions = data.instructions.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    }));
  }

  if (video) {
    schema.video = video;
  }

  return schema;
}

export function vlogJsonLd(vlog: VlogEntry, pageUrl: string): JsonLd {
  const video = videoObjectJsonLd({
    name: vlog.data.title,
    description: vlog.data.description,
    thumbnailUrl: vlog.data.thumbnail,
    uploadDate: vlog.data.publishedDate,
    youtubeUrl: vlog.data.youtubeUrl,
  });

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: vlog.data.title,
    description: vlog.data.description,
    image: [absoluteUrl(vlog.data.thumbnail)],
    datePublished: toIsoDate(vlog.data.publishedDate),
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    mainEntityOfPage: absoluteUrl(pageUrl),
    ...(video ? { video } : {}),
  };
}
