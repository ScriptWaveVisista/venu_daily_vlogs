import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => value === "" || URL.canParse(value), {
    message: "must be a valid URL or left empty",
  });

const optionalDate = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
}, z.coerce.date().optional());

const localizedString = z.union([
  z.string().min(1),
  z.object({
    en: z.string().min(1),
    te: z.string().optional(),
  }),
]);

const localizedLine = z.union([
  z.string().min(1),
  z.object({
    en: z.string().min(1),
    te: z.string().optional(),
  }),
]);

const ingredient = z
  .object({
    quantity: z.string().optional(),
    item: z.string().optional(),
    en: z.string().optional(),
    te: z.string().optional(),
  })
  .refine((value) => Boolean(value.item || value.en), {
    message: "ingredient needs item or en",
  });

const recipes = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/recipes",
  }),
  schema: z.object({
    title: localizedString,
    teluguTitle: z.string().optional(),
    description: localizedString,
    publishedDate: z.coerce.date({
      error: "Invalid recipe: invalid publication date",
    }),
    updatedDate: optionalDate,
    category: z.string().min(1, "Invalid recipe: missing required field: category"),
    tags: z.array(z.string()).default([]),
    thumbnail: z
      .string()
      .min(1, "Invalid recipe: missing required field: thumbnail"),
    youtubeUrl: optionalUrl,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    totalTime: z.string().optional(),
    servings: z.number().int().positive("Invalid recipe: servings must be a positive number").optional(),
    difficulty: z.string().optional(),
    cuisine: z.string().optional(),
    ingredients: z.array(ingredient).default([]),
    instructions: z.array(localizedLine).default([]),
    tips: z.array(localizedLine).default([]),
    notes: z.array(localizedLine).default([]),
  }),
});

const vlogs = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/vlogs",
  }),
  schema: z.object({
    title: localizedString,
    teluguTitle: z.string().optional(),
    description: localizedString,
    publishedDate: z.coerce.date({
      error: "Invalid vlog: invalid publication date",
    }),
    updatedDate: optionalDate,
    category: z.string().min(1, "Invalid vlog: missing required field: category"),
    location: localizedString.optional(),
    tags: z.array(z.string()).default([]),
    thumbnail: z
      .string()
      .min(1, "Invalid vlog: missing required field: thumbnail"),
    youtubeUrl: optionalUrl,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
  }),
});

const shorts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/shorts",
  }),
  schema: z.object({
    title: localizedString,
    teluguTitle: z.string().optional(),
    description: localizedString.optional().default(""),
    publishedDate: z.coerce.date({
      error: "Invalid short: invalid publication date",
    }),
    category: z.string().optional().default("Shorts"),
    tags: z.array(z.string()).default([]),
    thumbnail: z
      .string()
      .min(1, "Invalid short: missing required field: thumbnail"),
    youtubeUrl: optionalUrl,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
  }),
});

export const collections = {
  recipes,
  vlogs,
  shorts,
};
