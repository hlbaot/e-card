declare module "aos" {
  export interface AosOptions {
    offset?: number;
    delay?: number;
    easing?: string;
    duration?: number;
    disable?: boolean | "phone" | "tablet" | "mobile" | (() => boolean);
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    startEvent?: string;
    animatedClassName?: string;
    initClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
  }

  export interface Aos {
    init(options?: AosOptions): void;
    refresh(initialize?: boolean): void;
    refreshHard(): void;
  }

  const AOS: Aos;
  export default AOS;
}
