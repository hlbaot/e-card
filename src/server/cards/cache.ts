import "server-only";
import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { publicCards } from "./runtime";
import { cardsRepository } from "./repository";

export const PUBLIC_CARDS_TAG = "public-cards";
const options = { revalidate: 60, tags: [PUBLIC_CARDS_TAG] };
const bySlug = unstable_cache((slug: string) => publicCards.bySlug(slug), ["public-card-v1"], options);
export const cachedPublicCards = {
  list: unstable_cache(() => publicCards.list(), ["public-cards-v1"], options),
  // Memoize metadata + page within one request. Visibility is checked outside
  // persistent cache so a hidden/deleted profile never comes from an old entry.
  bySlug: cache(async (slug: string) => {
    if (!slug || slug.length > 120 || !await cardsRepository.isVisible(slug)) return null;
    return bySlug(slug);
  }),
};
export const publicCardCache = {
  invalidate() { revalidateTag(PUBLIC_CARDS_TAG, { expire: 0 }); },
};
