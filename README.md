# Venu Daily Vlogs

A static website for cooking videos, recipes, family vlogs, Shorts and Telugu lifestyle content.

The site is built so you can add a new recipe or vlog by creating one Markdown file and an image. The homepage, listings, categories, related content, sitemap and RSS feed update automatically.

## Overview

- Mobile-first creator website
- Markdown content collections for recipes, vlogs and Shorts
- SEO metadata, Open Graph tags, Recipe structured data, sitemap and robots.txt
- Free hosting on GitHub Pages
- Custom domain support
- No database, no backend server, no paid CMS

## Technology

- [Astro](https://astro.build) static site generation
- TypeScript
- Tailwind CSS
- Astro Content Collections
- GitHub Actions + GitHub Pages

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

## Project Structure

```text
src/
  components/     Reusable UI pieces
  config/site.ts  Website name, domain, social links, analytics
  content/        Recipes, vlogs and Shorts Markdown files
  layouts/        Page wrappers
  pages/          Routes
  styles/         Global CSS
  utils/          Dates, slugs, YouTube, SEO helpers
public/images/    Thumbnails, profile photo, social preview
templates/        Copy-paste content templates
```

## Adding Recipes

1. Add a thumbnail to `public/images/recipes/`.
2. Copy `templates/recipe-template.md` to `src/content/recipes/your-recipe-name.md`.
3. Change the title, date, ingredients and YouTube URL.
4. Preview with `npm run dev`.
5. Commit and push.

See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the full beginner walkthrough.

## Adding Vlogs

Add a Markdown file to `src/content/vlogs/` and a thumbnail to `public/images/vlogs/`.

## Adding Shorts

Add a Markdown file to `src/content/shorts/` and a portrait thumbnail to `public/images/shorts/`. Shorts listing cards link to YouTube when a video URL is present.

## Updating Site Information

Edit `src/config/site.ts` to change:

- website name and tagline
- domain
- YouTube, Instagram, email
- Google Search Console verification
- Google Analytics ID
- default social preview image

## Build

```bash
npm run check
npm run build
npm run preview
```

`npm run check` validates TypeScript and Astro files. `npm run build` creates static files in `dist/`.

## Deployment

GitHub Actions builds and deploys the site when you push to `main`. You do not need to run `npm run build` before deploying.

Full steps: [DEPLOYMENT.md](DEPLOYMENT.md).

## GitHub Pages

In the GitHub repository:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.

## Custom Domain

1. Replace `YOUR_DOMAIN` in `src/config/site.ts` and `public/CNAME`.
2. Add the domain in **Repository → Settings → Pages → Custom domain**.
3. Add the DNS records from [DEPLOYMENT.md](DEPLOYMENT.md).
4. Enable **Enforce HTTPS** after the certificate appears.

Do not set an Astro `base` path when the site is served from a custom domain root.

## SEO

Every page has a unique title, description, canonical URL and Open Graph tags. Recipe pages also include Schema.org `Recipe` JSON-LD when the fields exist. Draft content is omitted from the production build, sitemap and RSS feed.

## Google Search Console

Add your verification code to `searchConsoleVerification` in `src/config/site.ts`. The site outputs the verification meta tag only when that value is not empty.

## Google Analytics

Add a GA4 measurement ID to `googleAnalyticsId` in `src/config/site.ts`. Leave it empty to keep Analytics unloaded.

## Drafts

Set `draft: true` on a content file to hide it from the production website. Drafts can still appear while you run `npm run dev`.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| `npm run check` fails after adding a recipe | Read the schema error. A required field such as `title`, `description`, `publishedDate`, `category` or `thumbnail` is usually missing. |
| Image looks broken | Confirm the file exists under `public/images/...` and the Markdown `thumbnail` path matches. |
| YouTube embed missing | Use a full `https://www.youtube.com/watch?v=...`, `https://youtu.be/...` or Shorts URL. Leave it empty if you do not have a video yet. |
| GitHub Pages 404 | Confirm Pages source is GitHub Actions and the latest workflow succeeded. |
| Custom domain not working | Confirm `src/config/site.ts`, GitHub Pages custom domain, DNS records and HTTPS. |

## Daily update

```bash
git pull
npm run dev
```

Edit a Markdown file or image, then:

```bash
git add .
git commit -m "Add chicken fry recipe"
git push
```

GitHub Actions rebuilds and publishes the website.
