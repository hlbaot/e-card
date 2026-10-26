import type { CardTheme } from "@/shared/types";
import { CardDecorations } from "./CardDecorations";

export function CardBackground({ theme }: { theme: CardTheme }) {
  return <CardDecorations theme={theme} variant="profile" />;
}
