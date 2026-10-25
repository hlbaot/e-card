import { apiClient } from "./client";
import type { Employee } from "@/shared/types/employee";

export const cardApi = {
  async getAll(): Promise<Employee[]> {
    const res = await apiClient.get<{ cards: Employee[] }>("/api/cards");
    return res.data.cards;
  },

  async getBySlug(slug: string): Promise<Employee> {
    const res = await apiClient.get<{ card: Employee }>(`/api/cards/${encodeURIComponent(slug)}`);
    return res.data.card;
  },
};
