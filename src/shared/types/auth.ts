export interface AuthUser { id: string; email: string; createdAt?: string }
export interface LoginInput {
  email: string;
  password: string;
}
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
