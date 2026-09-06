import { siteConfig } from "../config/site";

function normalizedBase(): string {
  const raw = siteConfig.base ?? "/";
  if (!raw || raw === "/") {
    return "";
  }

  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

export function getSiteOrigin(): string {
  return `${siteConfig.domain.replace(/\/+$/, "")}${normalizedBase()}`;
}

export function withBase(path: string): string {
  if (!path || path.startsWith("#") || isExternalHref(path)) {
    return path;
  }

  const base = normalizedBase();
  const suffix = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return suffix;
  }

  if (suffix === "/") {
    return `${base}/`;
  }

  return `${base}${suffix}`;
}

export function stripBase(pathname: string): string {
  const base = normalizedBase();
  if (!pathname) {
    return "/";
  }

  if (!base) {
    return pathname;
  }

  if (pathname === base || pathname === `${base}/`) {
    return "/";
  }

  if (pathname.startsWith(`${base}/`)) {
    return pathname.slice(base.length) || "/";
  }

  return pathname;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const origin = getSiteOrigin();
  const logical = stripBase(pathOrUrl);
  const path = logical.startsWith("/") ? logical : `/${logical}`;
  return `${origin}${path}`;
}

export function getCanonicalUrl(pathname: string): string {
  const logical = stripBase(pathname);

  if (logical === "/") {
    return `${getSiteOrigin()}/`;
  }

  const withLeadingSlash = logical.startsWith("/") ? logical : `/${logical}`;
  const withTrailingSlash = withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;

  return `${getSiteOrigin()}${withTrailingSlash}`;
}

export function isConfiguredUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  return !value.includes("YOUR_") && /^https?:\/\//i.test(value);
}

export function isConfiguredEmail(value: string): boolean {
  if (!value) {
    return false;
  }

  return !value.includes("YOUR_") && value.includes("@");
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}
