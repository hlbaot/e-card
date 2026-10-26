import "server-only";
import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { publicCards } from "./runtime";

export const PUBLIC_CARDS_TAG = "public-cards";
const options = { revalidate: 60, tags: [PUBLIC_CARDS_TAG] };
export const cachedPublicCards = {
  list: unstable_cache(() => publicCards.list(), ["public-cards-v1"], options),
  // One live query checks visibility and reads content together. React cache
  // shares that result between metadata and page within the same request.
  bySlug: cache((slug: string) => publicCards.bySlug(slug)),
};
export const publicCardCache = {
  invalidate() { revalidateTag(PUBLIC_CARDS_TAG, { expire: 0 }); },
};
