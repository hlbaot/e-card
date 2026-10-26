// Account scope prevents sharing private admin data between authenticated users.
export const queryKeys = {
  employees: {
    all: ["employees"] as const,
    list: (userId: string) => ["employees", userId, "list"] as const,
    detail: (userId: string, id: string) => ["employees", userId, "detail", id] as const,
  },
  stats: { all: ["stats"] as const, detail: (userId: string) => ["stats", userId] as const },
  cards: { all: ["cards"] as const, list: ["cards", "list"] as const,
    detail: (slug: string) => ["cards", "detail", slug] as const },
  writes: (userId: string) => ["employee-write", userId] as const,
};
