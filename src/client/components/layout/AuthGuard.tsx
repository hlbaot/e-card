"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/client/hooks/useAuth";
import { Skeleton } from "@/client/components/ui/Skeleton";
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) router.replace("/login");
  }, [ready, authenticated, router]);
  return ready && authenticated ? <>{children}</> : <Skeleton />;
}
