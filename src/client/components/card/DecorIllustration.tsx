import type { DecorKey } from "@/shared/types";

/** Shared vector drawings: the selector and the profile use the same artwork. */
export function DecorIllustration({ decor, variant = "halo" }: { decor: DecorKey; variant?: "halo" | "edge" }) {
  switch (decor) {
    case "blobs":
      return (
        <g fill="currentColor">
          {variant === "edge" ? (
            <path
              d="M96 6C70 2 54 18 58 35C62 50 40 52 30 58C8 70 18 92 40 94C58 95 62 100 84 98C108 96 118 78 118 52C118 26 114 8 96 6Z"
              opacity=".25"
            />
          ) : (
            <>
              {/* Soft organic primary blob */}
              <path
                d="M60 18C82 15 104 30 108 52C112 74 95 90 74 93C52 96 30 84 22 66C14 46 36 21 60 18Z"
                opacity=".35"
              />
              {/* Soft inner curve contour */}
              <path
                d="M58 28C74 26 92 38 95 54C98 70 85 82 70 84C54 86 38 78 32 64C26 48 42 30 58 28Z"
                opacity=".20"
              />
              {/* Accent dots */}
              <circle cx="106" cy="32" r="3.5" opacity=".45" />
              <circle cx="20" cy="74" r="3" opacity=".40" />
              <circle cx="88" cy="84" r="2.5" opacity=".35" />
            </>
          )}
        </g>
      );
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
