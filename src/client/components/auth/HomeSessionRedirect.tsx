"use client";

import { useEffect, useState } from "react";
import { restoreSession, useAuth } from "@/client/hooks/useAuth";

/** Verify HttpOnly cookies, including refresh, before leaving the public home page. */
export function HomeSessionRedirect() {
  const { authenticated } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let active = true;
    void restoreSession().then(() => {
      if (active) setVerified(true);
    }).catch(() => {
      // Leave the public page available when the session cannot be checked.
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (verified && authenticated) window.location.replace("/admin");
  }, [verified, authenticated]);

  return null;
}
