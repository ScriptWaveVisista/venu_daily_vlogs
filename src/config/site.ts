/**
 * Central website settings for Venu Daily Vlogs.
 *
 * Change values in THIS file to update the site name, domain, social links,
 * email, analytics, Search Console verification, and default social image.
 *
 * Search the project for REPLACE THESE VALUES if you are setting the site up
 * for the first time.
 */
export const siteConfig = {
  name: "Venu Daily Vlogs",
  shortName: "Venu Daily Vlogs",
  tagline: "Food • Family • Lifestyle • Telugu Vlogs",
  description:
    "Cooking, food, family moments, lifestyle and Telugu vlogs from Venu Daily Vlogs.",
  domain: "https://scriptwavevisista.github.io",
  base: "/venu_daily_vlogs",
  author: "Venu",
  language: "en",
  locale: "en_IN",
  defaultLanguage: "en",
  supportedLanguages: ["en", "te"],
  youtube: "YOUR_YOUTUBE_CHANNEL_URL",
  instagram: "YOUR_INSTAGRAM_URL",
  facebook: "",
  whatsapp: "",
  email: "YOUR_CONTACT_EMAIL",
  searchConsoleVerification: "",
  googleAnalyticsId: "",
  defaultOgImage: "/images/og/default-og.jpg",
  profileImage: "/images/profile/venu.jpg",
  youtubeQrImage: "/images/qr/youtube-subscribe.png",
} as const;

export type SiteConfig = typeof siteConfig;

export const navLinks = [
  { href: "/", key: "home" },
  { href: "/recipes/", key: "recipes" },
  { href: "/vlogs/", key: "vlogs" },
  { href: "/shorts/", key: "shorts" },
  { href: "/about/", key: "about" },
  { href: "/contact/", key: "contact" },
] as const;
