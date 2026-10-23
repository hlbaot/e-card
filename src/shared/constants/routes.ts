export const routes = {
  home: "/",
  login: "/login",
  admin: "/admin",
  employees: "/admin/employees",
  newEmployee: "/admin/employees/new",
  cards: "/admin/cards",
  card: (slug: string) => `/card/${slug}`,
  employee: (id: string) => `/admin/employees/${id}`,
};
