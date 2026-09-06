import rss from "@astrojs/rss";
import { siteConfig } from "../../config/site";
import { isLocale, localeStaticPaths } from "../../i18n";
import { getPublishedRecipes, getPublishedVlogs, recipeDescription, recipeTitle, vlogDescription, vlogTitle } from "../../utils/content";
import { localePath } from "../../utils/urls";

export function getStaticPaths() {
  return localeStaticPaths();
}

export async function GET({ params }: { params: { lang?: string } }) {
  const lang = params.lang;
  if (!isLocale(lang)) {
    return new Response("Not found", { status: 404 });
  }

  const [recipes, vlogs] = await Promise.all([
    getPublishedRecipes(),
    getPublishedVlogs(),
  ]);

  const items = [
    ...recipes.map((recipe) => ({
      title: recipeTitle(recipe, lang),
      description: recipeDescription(recipe, lang),
      pubDate: recipe.data.publishedDate,
      link: localePath(lang, `/recipes/${recipe.id}/`),
    })),
    ...vlogs.map((vlog) => ({
      title: vlogTitle(vlog, lang),
      description: vlogDescription(vlog, lang),
      pubDate: vlog.data.publishedDate,
      link: localePath(lang, `/vlogs/${vlog.id}/`),
    })),
  ]
    .sort((left, right) => right.pubDate.getTime() - left.pubDate.getTime())
    .slice(0, 30);

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.domain,
    items,
  });
}
