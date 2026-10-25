import "server-only";
import { cardsRepository } from "./repository";
import { createCardsService } from "./service";
export const publicCards = createCardsService(cardsRepository);
