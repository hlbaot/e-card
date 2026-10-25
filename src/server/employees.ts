import "server-only";
import { publicCards } from "@/server/cards/runtime";

// Trang public, sitemap và API cùng đọc DB qua một service để thống nhất điều kiện hiển thị.
export const getActiveEmployees = () => publicCards.list();
export const getIndexableEmployees = () => publicCards.list();
export const getPublicEmployeeBySlug = (slug: string) => publicCards.bySlug(slug);
