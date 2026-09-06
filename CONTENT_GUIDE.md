# Content Guide

This website updates from Markdown files. You do not need to edit homepage HTML when you add a recipe, vlog or Short.

## Add a new recipe

1. Add a thumbnail:

```text
public/images/recipes/my-recipe.jpg
```

WebP also works. Keep the file size reasonable.

2. Copy an existing recipe or the template:

```text
templates/recipe-template.md
```

3. Rename the copy:

```text
src/content/recipes/my-new-recipe.md
```

The file name becomes the URL. `simple-chicken-fry.md` becomes `/recipes/simple-chicken-fry/`.

4. Change these fields:

```yaml
title: "Simple Chicken Fry"
teluguTitle: "సింపుల్ చికెన్ ఫ్రై"
description: "An easy homemade chicken fry recipe."
publishedDate: 2026-09-05
thumbnail: "/images/recipes/my-recipe.jpg"
youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
category: "Chicken"
ingredients:
  - item: "Chicken"
    quantity: "500 g"
instructions:
  - "Clean and prepare the chicken."
```

5. Save the file.

6. Preview:

```bash
npm run dev
```

7. Open [http://localhost:4321/recipes/](http://localhost:4321/recipes/).

8. Commit.

9. Push to GitHub.

10. GitHub Actions rebuilds and deploys the website.

The homepage Latest Recipes section, category pages, search, related recipes, sitemap and RSS feed update from this file.

## Add a vlog

1. Add a thumbnail:

```text
public/images/vlogs/my-vlog.jpg
```

2. Copy:

```text
templates/vlog-template.md
```

3. Save it as:

```text
src/content/vlogs/a-day-with-our-family.md
```

4. Example:

```yaml
---
title: "A Day With Our Family"
description: "A simple family vlog from Venu Daily Vlogs."
publishedDate: 2026-09-01
category: "Family"
location: "Hyderabad"
thumbnail: "/images/vlogs/family-day.jpg"
youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
tags:
  - family
  - telugu vlog
  - lifestyle
featured: false
draft: false
---

Write the vlog story here.
```

`location` is optional. A vlog without a location still builds.

## Add a Short

1. Add a portrait thumbnail if you have one:

```text
public/images/shorts/my-short.jpg
```

2. Copy:

```text
templates/short-template.md
```

3. Save it as:

```text
src/content/shorts/my-short.md
```

4. Example:

```yaml
---
title: "Onion Tadka"
description: "A quick kitchen Short."
publishedDate: 2026-09-03
category: "Cooking"
tags:
  - shorts
thumbnail: "/images/shorts/onion-tadka.jpg"
youtubeUrl: "https://youtube.com/shorts/VIDEO_ID"
draft: false
---
```

Shorts pages are optional. The listing links directly to YouTube when `youtubeUrl` is set. This keeps the page fast because it does not load many YouTube players.

## Update website details

Edit one file:

```text
src/config/site.ts
```

That file controls:

- website name
- tagline
- email
- YouTube
- Instagram
- domain
- analytics
- Search Console
- metadata
- default social image

Do not scatter these values through other files.

## Drafts

```yaml
draft: true
```

- Local development: the draft can appear so you can preview it.
- Production build: the draft is hidden from the website, sitemap and RSS feed.

## Featured content

```yaml
featured: true
```

Featured recipes and vlogs are shown first in homepage sections. Do not hardcode recipe names in homepage files.

## Categories

Recipe categories such as Chicken, Mutton, Breakfast, Vegetarian, Snacks, Curries, Traditional, Quick Recipes and Desserts appear only when published recipes use them. Empty category pages are not created.

Vlog categories such as Family, Lifestyle, Travel, Food, Events and Daily Vlogs work the same way.

## Images

Use this folder structure:

```text
public/images/brand/
public/images/profile/venu.jpg
public/images/recipes/
public/images/vlogs/
public/images/shorts/
public/images/qr/youtube-subscribe.png
public/images/og/default-og.jpg
```

If a thumbnail file is missing, the site uses `/images/placeholder.jpg` instead of a broken image.

Optional extras:

- Profile photo: `public/images/profile/venu.jpg`
- YouTube subscribe QR: `public/images/qr/youtube-subscribe.png`

Both are hidden until the file exists.

## YouTube URLs

These formats work:

```text
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://youtube.com/shorts/VIDEO_ID
```

Leave `youtubeUrl: ""` if the video is not ready. The page still builds.

## Sample content

Files marked `demo: true` are examples. They are not real published videos. Replace or delete them when you add your own content.

## Edit on GitHub without Cursor

1. Open the GitHub repository.
2. Open the Markdown file.
3. Click Edit.
4. Change the content.
5. Commit to `main`.
6. GitHub Actions deploys automatically.
