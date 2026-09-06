type RelatedItem = {
  id: string;
  data: {
    category: string;
    tags: string[];
    publishedDate: Date;
  };
};

export function getRelatedItems<T extends RelatedItem>(
  current: T,
  items: T[],
  limit = 3,
): T[] {
  const currentTags = new Set(current.data.tags.map((tag) => tag.toLowerCase()));

  return items
    .filter((item) => item.id !== current.id)
    .map((item) => {
      const sameCategory = item.data.category === current.data.category ? 2 : 0;
      const overlappingTags = item.data.tags.reduce((count, tag) => {
        return currentTags.has(tag.toLowerCase()) ? count + 1 : count;
      }, 0);

      return {
        item,
        score: sameCategory + overlappingTags,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (
        right.item.data.publishedDate.getTime() -
        left.item.data.publishedDate.getTime()
      );
    })
    .slice(0, limit)
    .map(({ item }) => item);
}
