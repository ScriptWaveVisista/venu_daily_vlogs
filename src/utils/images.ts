import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { withBase } from "./urls";

export const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

export function publicAssetExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\//, "");
  return existsSync(resolve(process.cwd(), "public", relative));
}

export function withImageFallback(src: string | undefined): string {
  if (!src) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return withBase(publicAssetExists(src) ? src : PLACEHOLDER_IMAGE);
}
