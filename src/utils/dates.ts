const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export function formatDate(date: Date): string {
  return DATE_FORMATTER.format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function sortByNewest<T extends { publishedDate: Date }>(items: T[]): T[] {
  return [...items].sort(
    (left, right) => right.publishedDate.getTime() - left.publishedDate.getTime(),
  );
}
