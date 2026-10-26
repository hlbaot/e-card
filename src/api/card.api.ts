import { apiClient } from "./client";
import type { Employee, CardResponse, CardsResponse } from "@/shared/types";

export const cardApi = {
  async getAll(): Promise<Employee[]> {
    const res = await apiClient.get<CardsResponse>("/api/cards");
    return res.data.cards;
  },

  async getBySlug(slug: string): Promise<Employee> {
    const res = await apiClient.get<CardResponse>(`/api/cards/${encodeURIComponent(slug)}`);
    return res.data.card;
  },
};
