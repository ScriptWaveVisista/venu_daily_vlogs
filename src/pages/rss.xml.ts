import rss from "@astrojs/rss";
import { siteConfig } from "../config/site";
import { getPublishedRecipes, getPublishedVlogs } from "../utils/content";
import { withBase } from "../utils/urls";

export async function GET() {
  const [recipes, vlogs] = await Promise.all([
    getPublishedRecipes(),
    getPublishedVlogs(),
  ]);

  const items = [
    ...recipes.map((recipe) => ({
      title: recipe.data.title,
      description: recipe.data.description,
      pubDate: recipe.data.publishedDate,
      link: withBase(`/recipes/${recipe.id}/`),
    })),
    ...vlogs.map((vlog) => ({
      title: vlog.data.title,
      description: vlog.data.description,
      pubDate: vlog.data.publishedDate,
      link: withBase(`/vlogs/${vlog.id}/`),
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
