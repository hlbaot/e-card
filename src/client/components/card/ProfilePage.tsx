"use client";

import type { Employee } from "@/shared/types";
import { ProfileView } from "./ProfileView";

// Dữ liệu public đã được server kiểm tra; không ghi đè bằng localStorage.
export function ProfilePage({ employee }: { employee: Employee }) {
  return <ProfileView employee={employee} />;
}
