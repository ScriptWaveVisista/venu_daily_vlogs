# Deployment

This site is a static Astro build. GitHub Actions compiles it and GitHub Pages hosts it. There is no VPS, database or Node server after deploy.

## Initial GitHub setup

```bash
git init
git add .
git commit -m "Initial Venu Daily Vlogs website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/venu-daily-vlogs.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

Then in the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

The workflow in `.github/workflows/deploy.yml` runs on every push to `main` and can also be started manually from the Actions tab.

```text
git push origin main
        ↓
GitHub Actions
        ↓
Astro build
        ↓
GitHub Pages deployment
        ↓
Website updated
```

You do not need to run `npm run build` on your computer before deploying.

## Daily update workflow

```bash
git pull
```

Make content changes. Preview with:

```bash
npm run dev
```

Then:

```bash
git add .
git commit -m "Add chicken fry recipe"
git push
```

## Custom domain in the project

Replace these two placeholders with your real domain, for example `example.com`:

1. `src/config/site.ts` → `domain: "https://example.com"`
2. `public/CNAME` → `example.com`

Do not add `base: "/repository-name"` in `astro.config.mjs` when the site should live at `https://YOUR_DOMAIN/`.

`public/CNAME` is included because Astro’s GitHub Pages guide recommends it. Official GitHub documentation also says that when a site is published with GitHub Actions, the custom domain must still be saved in repository settings. A CNAME file alone does not finish the setup.

## Custom domain in GitHub

1. Open the repository.
2. Go to **Settings → Pages**.
3. Under **Custom domain**, enter your domain and save.

Do this before or as you configure DNS. GitHub recommends adding the custom domain in the repository before pointing DNS at GitHub Pages.

## Official GitHub Pages DNS records

Values below are from GitHub’s current Pages custom-domain documentation. Confirm them at [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) if GitHub updates them later.

### Apex domain (`example.com`)

Create these `A` records:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Optional IPv6 `AAAA` records:

| Type | Name | Value |
| --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

Some DNS hosts support an `ALIAS` or `ANAME` record from `@` to `YOUR_GITHUB_USERNAME.github.io` instead of A records.

### `www` subdomain

| Type | Name | Value |
| --- | --- | --- |
| CNAME | www | YOUR_GITHUB_USERNAME.github.io |

The CNAME should point to `YOUR_GITHUB_USERNAME.github.io`, not to the repository name.

GitHub can then redirect between `example.com` and `www.example.com`. This project treats `https://YOUR_DOMAIN` from `src/config/site.ts` as the canonical address. If you enter `example.com` in GitHub Pages, `www.example.com` should redirect to it.

## Domain verification

GitHub recommends verifying the domain on your **user or organization profile**, not only in the repository. This helps prevent domain-takeover issues.

Current official path:

1. Open your GitHub **profile Settings** or **organization Settings**.
2. Open **Pages**.
3. Click **Add a domain**.
4. Enter the domain and add the TXT record GitHub shows.

Docs: [Verifying your custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

If GitHub changes the exact button labels, use that official page.

Do not create wildcard DNS records such as `*.example.com`. GitHub warns that wildcards increase takeover risk.

## HTTPS

After DNS works and GitHub issues a certificate:

1. Open **Repository → Settings → Pages**.
2. Enable **Enforce HTTPS**.

The option can take up to 24 hours to appear. Production URLs and canonical tags should stay on `https://`.

## After you provide your real values

When you have:

- domain
- GitHub username
- repository name

use this checklist:

1. `src/config/site.ts` → `domain: "https://your-domain.com"`
2. `public/CNAME` → `your-domain.com`
3. GitHub repository created as `venu-daily-vlogs` or your chosen name
4. Pages source set to GitHub Actions
5. Custom domain saved in repository Pages settings
6. Apex `A` records pointed at the four GitHub Pages IPs
7. `www` CNAME pointed at `YOUR_GITHUB_USERNAME.github.io`
8. Domain verified in profile or organization Pages settings
9. Enforce HTTPS enabled

## Search Console and Analytics

After the HTTPS site is live:

1. Add the Google Search Console meta tag value to `searchConsoleVerification`.
2. Add the GA4 ID to `googleAnalyticsId` only if you want Analytics.

Empty values load neither tag.
