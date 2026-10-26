"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

let initialized = false;

export function useAos(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    if (!initialized) {
      AOS.init({
        once: true,
        offset: 0,
        duration: 750,
        easing: "ease-out-cubic",
        disable: false,
      });
      initialized = true;
    } else {
      AOS.refresh();
    }
  }, [ready]);
}
