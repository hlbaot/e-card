import { z } from "zod";
import type { LoginInput, ChangePasswordInput } from "@/shared/types";

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(1024),
}) satisfies z.ZodType<LoginInput>;

export const changePasswordInput = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại.").max(1024),
  newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự.").max(1024),
}) satisfies z.ZodType<ChangePasswordInput>;
