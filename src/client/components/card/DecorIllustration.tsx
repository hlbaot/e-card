import type { DecorKey } from "@/shared/types/employee";

/** Shared vector drawings: the selector and the profile use the same artwork. */
export function DecorIllustration({ decor, variant = "halo" }: { decor: DecorKey; variant?: "halo" | "edge" }) {
  switch (decor) {
    case "blobs":
      return <g fill="currentColor">
        {variant === "edge" ? <path d="M92 3C66-1 54 13 56 29C58 43 39 42 28 47C7 57 17 84 37 87C53 89 53 96 77 96C104 97 118 80 118 53C118 27 113 5 92 3Z" opacity=".26" /> : <>
          <path d="M52 18C62 9 78 12 84 23C88 29 92 27 91 19C89 8 97 3 103 9C110 16 105 27 99 34C94 41 98 47 105 45C118 41 120 56 109 61C99 66 94 71 100 80C108 93 92 102 85 89C81 82 76 83 70 89C60 101 45 95 39 86C33 77 28 73 20 79C9 87 0 74 9 64C15 58 23 61 26 52C30 42 28 30 39 24C43 21 47 21 52 18Z" opacity=".26" />
          <ellipse cx="63" cy="55" rx="34" ry="35" opacity=".07" />
          <circle cx="9" cy="23" r="4" opacity=".23" />
          <circle cx="113" cy="84" r="3.5" opacity=".2" />
        </>}
      </g>;
    case "circles":
      return <g transform="translate(60 50) scale(1.18) translate(-60 -50)" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="52" cy="49" r="34" opacity=".5" />
        <circle cx="52" cy="49" r="26" opacity=".3" />
        <circle cx="52" cy="49" r="18" opacity=".2" />
        <circle cx="87" cy="65" r="22" opacity=".38" />
        <circle cx="87" cy="65" r="14" opacity=".2" />
        <circle cx="100" cy="20" r="8" fill="currentColor" stroke="none" opacity=".18" />
        <circle cx="12" cy="78" r="6" fill="currentColor" stroke="none" opacity=".3" />
      </g>;
    case "bokeh":
      return <g fill="currentColor">
        <path d="M56 14Q58 42 78 45Q58 48 56 76Q53 48 33 45Q53 42 56 14Z" opacity=".5" />
        <path d="M94 47Q95 62 108 64Q95 66 94 81Q92 66 80 64Q92 62 94 47Z" opacity=".32" />
        <path d="M23 13Q24 22 33 23Q24 24 23 34Q22 24 12 23Q22 22 23 13Z" opacity=".4" />
        {[[12,58,5],[35,80,3],[86,22,5],[110,40,3],[72,88,2],[39,17,2]].map(([cx,cy,r]) => <circle key={cx} cx={cx} cy={cy} r={r} opacity=".3" />)}
      </g>;
    case "leaves":
      return <g transform="translate(60 50) scale(1.18) translate(-60 -50)" fill="currentColor">
        <path d="M29 91Q60 63 77 13M55 66Q82 61 100 37" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
        <path d="M43 78Q14 63 21 44Q47 48 43 78ZM54 64Q33 42 43 27Q67 39 54 64ZM66 43Q54 20 68 8Q86 26 66 43ZM49 73Q78 75 86 55Q59 49 49 73ZM72 57Q101 60 109 39Q85 34 72 57Z" opacity=".28" />
        <circle cx="16" cy="23" r="3" opacity=".35" /><circle cx="99" cy="80" r="4" opacity=".2" />
      </g>;
    case "network":
      return <g stroke="currentColor" strokeWidth="1.3" fill="currentColor">
        <path d="M17 53L44 21L80 28L103 63L70 86L40 69ZM17 53L40 69L44 21L70 86L80 28M40 69L103 63" fill="none" opacity=".28" />
        {[[17,53],[44,21],[80,28],[103,63],[70,86],[40,69]].map(([cx,cy],i) => <g key={cx}><circle cx={cx} cy={cy} r={i%2 ? 8 : 6} opacity=".16" /><circle cx={cx} cy={cy} r="3" opacity=".65" /></g>)}
        <circle cx="105" cy="14" r="3" stroke="none" opacity=".25" />
      </g>;
    case "geometry":
      return <g stroke="currentColor" strokeWidth="1.3">
        <rect x="19" y="20" width="40" height="40" rx="10" fill="currentColor" fillOpacity=".2" transform="rotate(-12 39 40)" />
        <path d="M81 13L108 42L81 71L54 42Z" fill="none" opacity=".5" />
        <path d="M74 55L91 84H57Z" fill="currentColor" fillOpacity=".25" strokeOpacity=".35" />
        <circle cx="32" cy="79" r="11" fill="none" opacity=".35" />
        <circle cx="109" cy="83" r="4" fill="currentColor" opacity=".25" />
      </g>;
    default:
      return null;
  }
}

export function DecorSwatch({ decor }: { decor: DecorKey }) {
  return <svg viewBox="0 0 160 90" fill="none" aria-hidden="true">
    <g transform="translate(24 -3) scale(.96)"><DecorIllustration decor={decor} /></g>
  </svg>;
}
