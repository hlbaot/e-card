"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function useAos(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const elements = document.querySelectorAll("[data-aos]");
    elements.forEach((el) => {
      el.classList.remove("aos-animate");
    });

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        AOS.init({
          once: true,
          offset: 0,
          duration: 750,
          easing: "ease-out-cubic",
          disable: false,
        });
        AOS.refreshHard();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [ready]);
}
