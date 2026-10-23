"use client";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/client/store/employee.store";
import { useAuthStore } from "@/client/store/auth.store";
let hydration: Promise<void> | undefined;
export function useHydration() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    hydration ??= Promise.all([
      useEmployeeStore.persist.rehydrate(),
      useAuthStore.persist.rehydrate(),
    ]).then(() => {});
    void hydration.then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  return ready;
}
