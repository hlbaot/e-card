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
              {/* Organic fluid splash blooming outward (Image 2 & 3) */}
              <path
                d="M58 24C66 22 75 16 82 10C86 6 92 11 90 18C88 26 80 32 82 39C84 45 98 45 102 52C104 59 96 65 87 66C80 67 81 75 75 78C68 81 48 81 41 76C35 71 32 62 28 59C22 54 20 45 26 40C31 36 36 37 40 31C44 25 50 24 58 24Z"
                opacity=".45"
              />
              <path
                d="M56 28C63 26 70 21 76 16C80 12 84 16 83 22C81 28 75 33 76 39C78 44 90 44 93 50C95 56 88 61 81 62C75 63 75 69 70 72C64 75 50 75 44 70C39 66 37 59 33 56C28 52 27 45 32 41C36 38 40 39 44 34C47 29 52 28 56 28Z"
                opacity=".25"
              />
              {/* Separated splash droplets */}
              <circle cx="94" cy="28" r="3" opacity=".60" />
              <circle cx="104" cy="56" r="3.5" opacity=".55" />
              <circle cx="20" cy="62" r="3" opacity=".55" />
              <circle cx="26" cy="26" r="2.5" opacity=".50" />
              <circle cx="86" cy="10" r="2" opacity=".45" />
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
      return (
        <g fill="currentColor">
          {/* Main sweeping branch */}
          <path d="M25 90Q58 60 78 12M55 64Q82 58 102 34" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
          {/* Secondary counter branch */}
          <path d="M95 90Q70 65 52 38" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".55" />
          {/* Leaves on primary branch */}
          <path d="M38 78Q10 63 18 42Q44 48 38 78ZM50 62Q28 40 38 24Q62 36 50 62ZM64 42Q52 18 66 6Q84 24 64 42ZM46 72Q75 74 84 54Q57 48 46 72ZM70 56Q99 58 107 38Q83 32 70 56Z" opacity=".45" />
          {/* Leaves on secondary branch */}
          <path d="M88 78Q110 65 102 46Q80 50 88 78ZM78 58Q96 42 90 28Q72 38 78 58ZM62 38Q78 22 72 10Q56 22 62 38Z" opacity=".35" />
          {/* Berries / dew buds */}
          <circle cx="15" cy="22" r="3" opacity=".4" />
          <circle cx="102" cy="78" r="3.5" opacity=".35" />
          <circle cx="48" cy="14" r="2.5" opacity=".45" />
          <circle cx="82" cy="18" r="2.5" opacity=".4" />
        </g>
      );
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
    case "crystals":
      return (
        <g stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round">
          {/* Top-Right Crystal Cluster */}
          <polygon points="120,0 85,0 100,28" fill="currentColor" fillOpacity=".7" strokeOpacity=".4" />
          <polygon points="85,0 55,0 80,32" fill="currentColor" fillOpacity=".35" strokeOpacity=".3" />
          <polygon points="120,0 100,28 120,38" fill="currentColor" fillOpacity=".8" strokeOpacity=".4" />
          <polygon points="100,28 120,38 108,62" fill="currentColor" fillOpacity=".6" strokeOpacity=".4" />
          <polygon points="85,0 100,28 75,45" fill="currentColor" fillOpacity=".5" strokeOpacity=".35" />
          <polygon points="100,28 108,62 82,72" fill="currentColor" fillOpacity=".65" strokeOpacity=".4" />
          <polygon points="75,45 100,28 82,72" fill="currentColor" fillOpacity=".4" strokeOpacity=".35" />
          <polygon points="55,0 80,32 50,48" fill="currentColor" fillOpacity=".25" strokeOpacity=".3" />
          <polygon points="75,45 82,72 52,80" fill="currentColor" fillOpacity=".45" strokeOpacity=".35" />
          <polygon points="50,48 75,45 35,68" fill="currentColor" fillOpacity=".3" strokeOpacity=".25" />
          <line x1="120" y1="8" x2="35" y2="8" strokeOpacity=".3" />
          <line x1="112" y1="0" x2="112" y2="80" strokeOpacity=".3" />

          {/* Bottom-Left Crystal Cluster */}
          <g transform="rotate(180 60 50)">
            <polygon points="120,0 85,0 100,28" fill="currentColor" fillOpacity=".7" strokeOpacity=".4" />
            <polygon points="85,0 55,0 80,32" fill="currentColor" fillOpacity=".35" strokeOpacity=".3" />
            <polygon points="120,0 100,28 120,38" fill="currentColor" fillOpacity=".8" strokeOpacity=".4" />
            <polygon points="100,28 120,38 108,62" fill="currentColor" fillOpacity=".6" strokeOpacity=".4" />
            <polygon points="85,0 100,28 75,45" fill="currentColor" fillOpacity=".5" strokeOpacity=".35" />
            <polygon points="100,28 108,62 82,72" fill="currentColor" fillOpacity=".65" strokeOpacity=".4" />
            <polygon points="75,45 100,28 82,72" fill="currentColor" fillOpacity=".4" strokeOpacity=".35" />
            <polygon points="55,0 80,32 50,48" fill="currentColor" fillOpacity=".25" strokeOpacity=".3" />
            <polygon points="75,45 82,72 52,80" fill="currentColor" fillOpacity=".45" strokeOpacity=".35" />
            <line x1="120" y1="8" x2="35" y2="8" strokeOpacity=".3" />
            <line x1="112" y1="0" x2="112" y2="80" strokeOpacity=".3" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function DecorSwatch({ decor }: { decor: DecorKey }) {
  return <svg viewBox="0 0 160 90" fill="none" aria-hidden="true">
    <g transform="translate(24 -3) scale(.96)"><DecorIllustration decor={decor} /></g>
  </svg>;
}
