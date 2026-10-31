"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AuthUser } from "@/shared/types";
import {
  hydrateAuthUser,
  restoreSession,
  shouldCheckSessionOnVisibility,
  useAuth,
} from "@/client/hooks/useAuth";
import { useAuthStore } from "@/client/store/auth.store";
import { Skeleton } from "@/client/components/ui/Skeleton";

export function AuthGuard({
  initialUser = null,
  children,
}: {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("auth.guard");
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      if (initialUser) {
        useAuthStore.setState({ user: initialUser, authenticated: true, ready: true });
      } else {
        useAuthStore.setState({ user: null, authenticated: false, ready: false });
      }
      return initialUser?.id ?? null;
    }
    if (initialUser) {
      hydrateAuthUser(initialUser);
      return initialUser.id;
    }
    return null;
  });

  if (initialUser && hydratedUserId !== initialUser.id) {
    setHydratedUserId(initialUser.id);
    hydrateAuthUser(initialUser);
  }

  const { ready, authenticated } = useAuth();
  const [sessionRestored, setSessionRestored] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    let active = true;
    if (initialUser) {
      try {
        localStorage.setItem("ecard_logged_in", "1");
      } catch {}
    } else {
      void restoreSession().then(() => {
        if (active) setSessionRestored(true);
      }).catch(() => {
        if (active) setSessionError(true);
      });
    }

    const checkSession = () => {
      if (document.visibilityState === "visible" && shouldCheckSessionOnVisibility()) {
        void restoreSession().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", checkSession);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, [initialUser]);

  useEffect(() => {
    if ((initialUser || sessionRestored) && ready && !authenticated) window.location.replace("/login");
  }, [initialUser, sessionRestored, ready, authenticated]);

  if (sessionError && !initialUser) return (
    <div role="alert" className="p-8 text-center">
      <p>{t("sessionError")}</p>
      <button type="button" className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
        {t("retry")}
      </button>
    </div>
  );
  if ((!initialUser && !sessionRestored) || !ready || !authenticated) return <Skeleton />;
  return <>{children}</>;
}
