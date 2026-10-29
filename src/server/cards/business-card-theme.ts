import type { BusinessCardType } from "@/shared/types";

// Keep the choice in the existing JSON configuration so older databases need no migration.
const CYBER_CARD_KEY = "__businessCardAnNinhMang";

export function toStoredCardTheme<T extends { businessCardType?: BusinessCardType; shapes: Record<string, boolean> }>(theme: T) {
  const { businessCardType, shapes, ...rest } = theme;
  return {
    ...rest,
    shapes: { ...shapes, [CYBER_CARD_KEY]: businessCardType === "an-ninh-mang" },
  };
}

export function readBusinessCardChoice(storedShapes: Record<string, boolean>): {
  businessCardType: BusinessCardType;
  shapes: Record<string, boolean>;
} {
  const { [CYBER_CARD_KEY]: cyberCard, ...shapes } = storedShapes;
  return { businessCardType: cyberCard === true ? "an-ninh-mang" : "qtm", shapes };
}
