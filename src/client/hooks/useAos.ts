"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

let initialized = false;

export function useAos(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    void import("aos").then(({ default: AOS }) => {
      if (cancelled) return;
      if (!initialized) {
        AOS.init({
          once: true,
          offset: 0,
          duration: 450,
          easing: "ease-out-cubic",
          disable: false,
        });
        initialized = true;
      } else {
        AOS.refresh();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ready]);
}
