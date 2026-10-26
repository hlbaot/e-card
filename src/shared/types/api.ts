import type { AuthUser } from "./auth";
import type { Employee } from "./employee";

export interface AuthResponse {
  user?: AuthUser;
  error?: string;
  success?: boolean;
}
export interface ApiStatusResponse {
  success?: boolean;
  error?: string;
}
export interface EmployeesResponse { employees: Employee[] }
export interface EmployeeResponse { employee: Employee }
export interface CardsResponse { cards: Employee[] }
export interface CardResponse { card: Employee }
export interface AvatarUploadResponse { url: string }
