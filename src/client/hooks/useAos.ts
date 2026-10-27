"use client";

import { useLayoutEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

let initialized = false;

export function useAos(ready: boolean, contentKey?: string) {
  useLayoutEffect(() => {
    if (!ready) return;
    let cancelled = false;
    let frame = 0;
    let elements: HTMLElement[] = [];

    const reveal = () => {
      elements.forEach((element) => element.classList.remove("aos-preparing", "aos-init", "aos-animate"));
    };
    const failOpen = () => {
      reveal();
      elements.forEach((element) => element.classList.add("aos-animate"));
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (cancelled) return;
      if (document.visibilityState !== "visible") {
        reveal();
        return;
      }

      elements = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => element.classList.add("aos-animate"));
        document.removeEventListener("visibilitychange", start);
        return;
      }
      try {
        if (!initialized) {
          AOS.init({
            once: true,
            offset: 0,
            duration: 350,
            easing: "ease-out-cubic",
            // Start explicitly after preparing a painted initial state.
            startEvent: "ecard:animations-ready",
            disableMutationObserver: true,
          });
          initialized = true;
        }
        elements.forEach((element) => {
          // Commit the entrance starting state without a reverse transition,
          // including other routes that keep their SSR fallback visible.
          element.classList.add("aos-preparing");
          element.classList.remove("aos-animate");
          element.classList.add("aos-init");
        });
        // AOS normally adds init + animate together. Commit the starting
        // styles first so transitions actually run, including in a new tab.
        void document.body.offsetHeight;
        frame = requestAnimationFrame(() => {
          if (cancelled || document.visibilityState !== "visible") {
            reveal();
            return;
          }
          try {
            elements.forEach((element) => element.classList.remove("aos-preparing"));
            if (typeof document !== "undefined" && typeof document.dispatchEvent === "function") {
              try {
                document.dispatchEvent(new CustomEvent("ecard:animations-ready"));
              } catch {}
            }
            AOS.refreshHard();
            AOS.refresh(true);
          } catch (error) {
            failOpen();
            console.error("Unable to start card animations", error);
          }
          document.removeEventListener("visibilitychange", start);
        });
      } catch (error) {
        failOpen();
        console.error("Unable to prepare card animations", error);
      }
    };

    document.addEventListener("visibilitychange", start);
    start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      reveal();
    };
  }, [ready, contentKey]);
}
