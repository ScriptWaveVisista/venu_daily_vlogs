export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0c00-\u0c7f]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function displayNameFromSlug(
  slug: string,
  knownNames: readonly string[],
): string {
  const match = knownNames.find((name) => toSlug(name) === slug);
  return match ?? slug.replace(/-/g, " ");
}
