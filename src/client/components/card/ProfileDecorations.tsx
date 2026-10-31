import { CyberMagazineArtwork } from "./CyberMagazineArtwork";
import type { CardTheme, DecorKey } from "@/shared/types";

function AmbientCluster({ position }: { position: string }) {
  return (
    <svg className={`qtm-ambient-cluster qtm-ambient-cluster--${position}`} viewBox="0 0 180 240" fill="none" focusable="false">
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.3">
        <circle cx="38" cy="46" r="39" />
        <circle cx="38" cy="46" r="51" strokeDasharray="2 7" />
        <path d="M-15 72C42 38 105 105 67 155S54 214 166 247" />
        <path d="M-15 82C42 48 115 115 77 165S64 224 176 257" />
        <path d="M20 126L62 110L105 143L84 186L135 206" strokeDasharray="3 5" />
      </g>
      <g fill="currentColor">
        <path d="M108 48Q108 63 123 63Q108 63 108 78Q108 63 93 63Q108 63 108 48Z" opacity="0.5" />
        <path d="M37 157Q37 167 47 167Q37 167 37 177Q37 167 27 167Q37 167 37 157Z" opacity="0.45" />
        <path d="M135 183Q135 190 142 190Q135 190 135 197Q135 190 128 190Q135 190 135 183Z" opacity="0.4" />
        <circle cx="74" cy="23" r="3" opacity="0.5" />
        <circle cx="143" cy="103" r="9" opacity="0.18" />
        <circle cx="91" cy="107" r="4" opacity="0.4" />
        <circle cx="20" cy="126" r="3" opacity="0.45" />
        <circle cx="62" cy="110" r="3.5" opacity="0.4" />
        <circle cx="105" cy="143" r="3" opacity="0.5" />
        <circle cx="84" cy="186" r="3.5" opacity="0.4" />
        <circle cx="135" cy="206" r="3" opacity="0.45" />
        <circle cx="24" cy="211" r="7" opacity="0.2" />
        <circle cx="61" cy="223" r="2" opacity="0.5" />
      </g>
    </svg>
  );
}

/** A flexible illustration occupies only the space left below the contact buttons. */
export function ProfileConnectionArtwork({ theme }: { theme: CardTheme }) {
  if (theme.showDecor === false || !theme.decor?.length || theme.decor[0] === "cyber-magazine") return null;

  return (
    <div className="qtm-connection-art" aria-hidden="true">
      <svg viewBox="0 0 360 150" fill="none" focusable="false">
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.3">
          <path d="M-24 112C45 34 98 142 180 78S307 16 384 74" />
          <path d="M-24 125C45 47 98 155 180 91S307 29 384 87" />
          <path d="M-24 138C45 60 98 168 180 104S307 42 384 100" />
          <ellipse cx="180" cy="75" rx="87" ry="43" transform="rotate(-18 180 75)" />
          <ellipse cx="180" cy="75" rx="104" ry="56" transform="rotate(-18 180 75)" strokeDasharray="2 7" opacity="0.6" />
        </g>
        {/* A connected-node signature echoes the QTM brand mark. */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          <path d="M151 78L172 57M161 97L182 76L203 55M192 95L213 74" />
          <g fill="currentColor" stroke="none">
            {[[151, 78], [172, 57], [161, 97], [182, 76], [203, 55], [192, 95], [213, 74]].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
            ))}
          </g>
        </g>
        <g fill="currentColor">
          <circle cx="88" cy="52" r="5" opacity="0.14" />
          <circle cx="281" cy="103" r="8" opacity="0.1" />
          <circle cx="49" cy="100" r="2.5" opacity="0.38" />
          <circle cx="300" cy="43" r="3" opacity="0.35" />
          <circle cx="235" cy="30" r="2" opacity="0.3" />
          <path d="M112 94Q112 104 122 104Q112 104 112 114Q112 104 102 104Q112 104 112 94Z" opacity="0.45" />
          <path d="M257 43Q257 55 269 55Q257 55 257 67Q257 55 245 55Q257 55 257 43Z" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Rich, delicate background decorations based on the user's sample (Image 3):
 * - Fluid organic water splash, ripples, and floating bubbles surrounding the avatar.
 * - Gentle edge accents along the margins filling empty space without covering text.
 * - Clearly visible when selected (scaled by user's decorOpacity slider).
 */
function CrystalClusterContent() {
  return (
    <g stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round">
      {/* Deep background facets */}
      <polygon points="240,0 120,0 170,110" fill="currentColor" fillOpacity="0.18" strokeOpacity="0.25" />
      <polygon points="240,0 240,140 150,80" fill="currentColor" fillOpacity="0.22" strokeOpacity="0.25" />
      <polygon points="120,0 60,0 110,95" fill="currentColor" fillOpacity="0.12" strokeOpacity="0.2" />
      <polygon points="240,140 240,200 170,150" fill="currentColor" fillOpacity="0.15" strokeOpacity="0.2" />

      {/* Mid layer faceted crystal shards */}
      <polygon points="240,0 180,0 205,55" fill="currentColor" fillOpacity="0.65" strokeOpacity="0.45" />
      <polygon points="180,0 130,25 175,70" fill="currentColor" fillOpacity="0.45" strokeOpacity="0.35" />
      <polygon points="240,0 205,55 240,75" fill="currentColor" fillOpacity="0.80" strokeOpacity="0.5" />
      <polygon points="205,55 175,70 215,115" fill="currentColor" fillOpacity="0.70" strokeOpacity="0.45" />
      <polygon points="240,75 205,55 240,130" fill="currentColor" fillOpacity="0.55" strokeOpacity="0.4" />
      <polygon points="240,75 215,115 240,130" fill="currentColor" fillOpacity="0.60" strokeOpacity="0.42" />

      <polygon points="180,0 120,0 145,50" fill="currentColor" fillOpacity="0.35" strokeOpacity="0.3" />
      <polygon points="145,50 175,70 115,100" fill="currentColor" fillOpacity="0.50" strokeOpacity="0.38" />
      <polygon points="175,70 215,115 160,145" fill="currentColor" fillOpacity="0.72" strokeOpacity="0.45" />
      <polygon points="215,115 240,130 195,175" fill="currentColor" fillOpacity="0.65" strokeOpacity="0.42" />
      <polygon points="240,130 240,190 195,175" fill="currentColor" fillOpacity="0.55" strokeOpacity="0.38" />

      <polygon points="120,0 70,0 100,60" fill="currentColor" fillOpacity="0.22" strokeOpacity="0.25" />
      <polygon points="100,60 145,50 85,110" fill="currentColor" fillOpacity="0.40" strokeOpacity="0.32" />
      <polygon points="115,100 160,145 95,160" fill="currentColor" fillOpacity="0.55" strokeOpacity="0.4" />
      <polygon points="160,145 195,175 140,210" fill="currentColor" fillOpacity="0.62" strokeOpacity="0.42" />
      <polygon points="195,175 240,190 210,230" fill="currentColor" fillOpacity="0.68" strokeOpacity="0.45" />
      <polygon points="240,190 240,240 210,230" fill="currentColor" fillOpacity="0.75" strokeOpacity="0.5" />

      {/* Foreground sharp crystal shards bursting inward */}
      <polygon points="145,50 115,100 70,85" fill="currentColor" fillOpacity="0.42" strokeOpacity="0.35" />
      <polygon points="115,100 95,160 50,130" fill="currentColor" fillOpacity="0.48" strokeOpacity="0.38" />
      <polygon points="160,145 140,210 95,185" fill="currentColor" fillOpacity="0.52" strokeOpacity="0.4" />
      <polygon points="85,110 50,130 30,165" fill="currentColor" fillOpacity="0.30" strokeOpacity="0.28" />
      <polygon points="95,160 95,185 45,210" fill="currentColor" fillOpacity="0.35" strokeOpacity="0.3" />
      <polygon points="140,210 110,240 75,225" fill="currentColor" fillOpacity="0.40" strokeOpacity="0.32" />

      {/* Floating crystal slivers */}
      <polygon points="50,45 25,80 65,70" fill="currentColor" fillOpacity="0.32" strokeOpacity="0.28" />
      <polygon points="35,115 10,145 45,140" fill="currentColor" fillOpacity="0.25" strokeOpacity="0.22" />
      <polygon points="80,180 55,220 95,205" fill="currentColor" fillOpacity="0.34" strokeOpacity="0.28" />
      <polygon points="125,215 105,240 140,235" fill="currentColor" fillOpacity="0.38" strokeOpacity="0.3" />

      {/* Sleek architectural framing lines (as seen in user sample) */}
      <line x1="240" y1="18" x2="60" y2="18" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="222" y1="0" x2="222" y2="180" strokeWidth="1" strokeOpacity="0.4" />
    </g>
  );
}

export function ProfileDecorations({ theme }: { theme: CardTheme }) {
  const decor = theme.decor || [];
  const activeDecor: DecorKey | "none" = decor.length > 0 ? decor[0] : "none";

  if (activeDecor === "none") {
    return null;
  }

  if (activeDecor === "cyber-magazine") {
    return <CyberMagazineArtwork className="qtm-safe-decor" primaryColor={theme.primaryColor} decorOpacity={theme.showDecor === false ? 0 : theme.decorOpacity ?? 35} />;
  }

  /* 7. KHUNG TINH THỂ ĐA GIÁC (Crystal / Faceted Polygonal Geometric Frame - Works on Mobile & Desktop) */
  if (activeDecor === "crystals") {
    return (
      <div className="qtm-safe-decor qtm-decor-crystals" aria-hidden="true">
        <svg className="qtm-crystal-cluster qtm-crystal-tr" viewBox="0 0 240 240"><CrystalClusterContent /></svg>
        <svg className="qtm-crystal-cluster qtm-crystal-bl" viewBox="0 0 240 240"><g transform="rotate(180 120 120)"><CrystalClusterContent /></g></svg>
        <svg className="qtm-crystal-cluster qtm-crystal-tl" viewBox="0 0 240 240"><g transform="scale(-1 1) translate(-240 0)"><CrystalClusterContent /></g></svg>
        <svg className="qtm-crystal-cluster qtm-crystal-br" viewBox="0 0 240 240"><g transform="scale(1 -1) translate(0 -240)"><CrystalClusterContent /></g></svg>
      </div>
    );
  }

  return (
    <>
    <svg
      className="qtm-safe-decor"
      viewBox="0 0 390 694"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="avatar-soft-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="65%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="blob-splash-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--card-accent, #0F4C75) 24%, #38bdf8)" stopOpacity="0.85" />
          <stop offset="55%" stopColor="color-mix(in srgb, var(--card-accent, #0F4C75) 18%, #60a5fa)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--card-accent, #0F4C75) 14%, #93c5fd)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="blob-splash-soft" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--card-accent, #0F4C75) 20%, #38bdf8)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--card-accent, #0F4C75) 10%, #bae6fd)" stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {/* 1. BLOB MỀM (Organic Fluid Splash & Detached Droplets - As seen in Image 2) */}
      {activeDecor === "blobs" && (
        <g>
          {/* Primary organic fluid splash blooming behind avatar (Image 2) */}
          <path
            d="M192 68 C216 64, 238 52, 256 36 C268 26, 282 38, 278 58 C274 78, 254 94, 258 112 C262 128, 304 128, 314 148 C320 166, 300 184, 276 186 C258 188, 260 210, 244 218 C226 226, 172 226, 152 212 C134 198, 128 176, 116 166 C100 152, 96 128, 112 116 C124 106, 138 108, 148 92 C158 76, 174 70, 192 68 Z"
            fill="url(#blob-splash-cyan)"
          />

          {/* Secondary softer fluid wave contour */}
          <path
            d="M188 76 C208 72, 226 60, 242 46 C252 38, 266 48, 262 64 C258 80, 242 92, 246 108 C252 120, 288 122, 296 140 C302 156, 284 170, 262 172 C246 174, 248 194, 234 202 C218 210, 176 212, 158 200 C142 188, 136 168, 126 160 C112 148, 108 128, 122 118 C132 110, 144 112, 152 98 C160 84, 172 78, 188 76 Z"
            fill="url(#blob-splash-soft)"
          />

          {/* Floating detached droplets separated around avatar (Image 2) */}
          <circle cx="292" cy="88" r="7.5" fill="url(#blob-splash-cyan)" />
          <circle cx="324" cy="72" r="4.5" fill="url(#blob-splash-cyan)" opacity="0.85" />
          <circle cx="326" cy="172" r="8" fill="url(#blob-splash-cyan)" />
          <circle cx="362" cy="222" r="10" fill="url(#blob-splash-cyan)" opacity="0.9" />
          <circle cx="348" cy="275" r="6.5" fill="url(#blob-splash-cyan)" opacity="0.8" />
          <circle cx="370" cy="350" r="6" fill="url(#blob-splash-cyan)" opacity="0.75" />
          <circle cx="88" cy="182" r="7" fill="url(#blob-splash-cyan)" opacity="0.85" />
          <circle cx="106" cy="92" r="5" fill="url(#blob-splash-cyan)" opacity="0.8" />
          <circle cx="278" cy="38" r="3.5" fill="url(#blob-splash-cyan)" opacity="0.7" />
          <circle cx="248" cy="236" r="4.5" fill="url(#blob-splash-cyan)" opacity="0.75" />

          {/* Top-right corner fluid patch (under brand culture text - Image 2) */}
          <path
            d="M312 0 C328 32, 355 52, 390 56 V0 H312 Z"
            fill="url(#blob-splash-cyan)"
            opacity="0.65"
          />

          {/* Mid-right edge fluid patch (peeking from card margin - Image 2) */}
          <path
            d="M390 240 C364 246, 352 272, 368 296 C376 308, 384 314, 390 318 V240 Z"
            fill="url(#blob-splash-cyan)"
            opacity="0.55"
          />

          {/* Left-edge fluid patch */}
          <path
            d="M0 135 C18 140, 28 156, 26 174 C24 190, 12 202, 0 208 V135 Z"
            fill="url(#blob-splash-cyan)"
            opacity="0.50"
          />

          {/* Floating bubbles down the lower margins (Image 2) */}
          <circle cx="24" cy="330" r="4.5" fill="url(#blob-splash-cyan)" opacity="0.45" />
          <circle cx="28" cy="425" r="5" fill="url(#blob-splash-cyan)" opacity="0.42" />
          <circle cx="364" cy="455" r="6" fill="url(#blob-splash-cyan)" opacity="0.48" />
        </g>
      )}

      {/* 2. CHẤM SÁNG NHẸ (Bokeh & Soft Sparkles) */}
      {activeDecor === "bokeh" && (
        <g fill="currentColor">
          {/* Mảng 1: Phía sau avatar */}
          <circle cx="195" cy="138" r="95" fill="url(#avatar-soft-glow)" />

          {/* Sparkling 4-point starlets around avatar */}
          <path
            d="M320 85Q321 97 332 98Q321 99 320 111Q319 99 308 98Q319 97 320 85Z"
            opacity="0.65"
          />
          <path
            d="M75 125Q76 137 87 138Q76 139 75 151Q74 139 63 138Q74 137 75 125Z"
            opacity="0.60"
          />
          <path
            d="M275 205Q276 215 285 216Q276 217 275 227Q274 217 265 216Q274 215 275 205Z"
            opacity="0.55"
          />
          <path
            d="M115 65Q116 75 125 76Q116 77 115 87Q114 77 105 76Q114 75 115 65Z"
            opacity="0.58"
          />

          {/* Floating bokeh circles around avatar */}
          <circle cx="340" cy="135" r="8" opacity="0.40" />
          <circle cx="315" cy="60" r="6" opacity="0.45" />
          <circle cx="82" cy="90" r="7.5" opacity="0.42" />
          <circle cx="60" cy="165" r="6" opacity="0.45" />
          <circle cx="295" cy="175" r="5" opacity="0.50" />
          <circle cx="95" cy="215" r="4.5" opacity="0.52" />

          {/* Mảng 2: Góc trên phải */}
          <path
            d="M358 35Q359 49 370 50Q359 51 358 65Q357 51 346 50Q357 49 358 35Z"
            opacity="0.60"
          />
          <circle cx="372" cy="78" r="6" opacity="0.38" />

          {/* Mảng 3: Rìa trái & rìa phải (filling empty space) */}
          <path
            d="M26 280Q27 291 36 292Q27 293 26 304Q25 293 16 292Q25 291 26 280Z"
            opacity="0.55"
          />
          <circle cx="365" cy="275" r="7" opacity="0.40" />
          <circle cx="22" cy="385" r="5.5" opacity="0.38" />
          <circle cx="370" cy="445" r="6" opacity="0.42" />
        </g>
      )}

      {/* 4. CÀNH LÁ (Lush Botanical Leaves, Vines & Berries) */}
      {activeDecor === "leaves" && (
        <g fill="currentColor">
          {/* Mảng 1: Vòng nguyệt quế / cành lá nở rộ quanh avatar */}
          <circle cx="195" cy="138" r="95" fill="url(#avatar-soft-glow)" />

          {/* Nhánh vòm trên-phải avatar */}
          <path
            d="M175 60 C205 38 245 42 275 65 C295 82 312 110 315 140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.65"
          />
          <path
            d="M245 42 C275 30 310 40 330 65"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.55"
          />
          {/* Lá trên-phải */}
          <path d="M205 45 Q218 25 235 28 Q222 48 205 45 Z" opacity="0.65" />
          <path d="M230 40 Q250 18 268 25 Q248 45 230 40 Z" opacity="0.75" />
          <path d="M255 48 Q282 32 298 44 Q278 62 255 48 Z" opacity="0.65" />
          <path d="M280 40 Q305 25 325 36 Q305 55 280 40 Z" opacity="0.70" />
          <path d="M310 48 Q335 40 348 55 Q328 68 310 48 Z" opacity="0.60" />
          <path d="M272 65 Q302 60 318 78 Q295 90 272 65 Z" opacity="0.75" />
          <path d="M290 85 Q322 88 332 108 Q305 115 290 85 Z" opacity="0.65" />
          <path d="M305 112 Q335 120 338 142 Q315 142 305 112 Z" opacity="0.75" />
          <path d="M312 138 Q342 152 338 175 Q318 168 312 138 Z" opacity="0.65" />

          {/* Nhánh vòm trên-trái avatar */}
          <path
            d="M175 60 C145 38 105 44 78 72 C62 92 58 120 62 150"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.65"
          />
          <path
            d="M105 44 C80 32 45 42 30 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.55"
          />
          {/* Lá trên-trái */}
          <path d="M155 48 Q140 28 125 32 Q138 52 155 48 Z" opacity="0.65" />
          <path d="M130 42 Q108 20 90 28 Q110 48 130 42 Z" opacity="0.75" />
          <path d="M105 46 Q78 30 62 44 Q84 62 105 46 Z" opacity="0.65" />
          <path d="M78 36 Q52 22 35 35 Q55 52 78 36 Z" opacity="0.70" />
          <path d="M48 45 Q22 40 10 58 Q32 68 48 45 Z" opacity="0.60" />
          <path d="M82 68 Q52 64 38 84 Q62 94 82 68 Z" opacity="0.75" />
          <path d="M68 90 Q38 95 30 116 Q58 120 68 90 Z" opacity="0.65" />
          <path d="M60 120 Q32 130 30 152 Q55 150 60 120 Z" opacity="0.75" />
          <path d="M62 148 Q35 165 42 188 Q62 178 62 148 Z" opacity="0.65" />

          {/* Cành xòe dưới-phải avatar */}
          <path
            d="M265 210 C285 225 305 240 315 265"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.60"
          />
          <path d="M272 215 Q298 210 312 225 Q290 238 272 215 Z" opacity="0.65" />
          <path d="M292 232 Q320 235 328 255 Q302 262 292 232 Z" opacity="0.70" />
          <path d="M308 252 Q332 265 330 285 Q310 280 308 252 Z" opacity="0.60" />

          {/* Cành xòe dưới-trái avatar */}
          <path
            d="M125 210 C105 225 85 240 75 265"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.60"
          />
          <path d="M118 215 Q92 210 78 225 Q100 238 118 215 Z" opacity="0.65" />
          <path d="M98 232 Q70 235 62 255 Q88 262 98 232 Z" opacity="0.70" />
          <path d="M82 252 Q58 265 60 285 Q80 280 82 252 Z" opacity="0.60" />

          {/* Mảng 2: Góc trên phải buông rủ (Top-Right Cascading Foliage) */}
          <path
            d="M390 12 C355 18 335 42 328 75 C322 105 330 135 342 165"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.60"
          />
          <path d="M375 16 Q350 5 332 18 Q355 30 375 16 Z" opacity="0.65" />
          <path d="M352 26 Q325 20 312 36 Q336 46 352 26 Z" opacity="0.75" />
          <path d="M336 45 Q308 42 298 60 Q322 68 336 45 Z" opacity="0.65" />
          <path d="M328 72 Q300 78 295 98 Q320 100 328 72 Z" opacity="0.70" />
          <path d="M326 102 Q302 115 305 135 Q326 130 326 102 Z" opacity="0.65" />
          <path d="M334 132 Q315 150 322 170 Q340 160 334 132 Z" opacity="0.60" />

          {/* Mảng 3: Góc trên trái (Top-Left Foliage) */}
          <path
            d="M0 25 C30 20 55 35 68 60 C75 80 72 105 60 125"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.60"
          />
          <path d="M15 22 Q40 12 55 24 Q35 36 15 22 Z" opacity="0.65" />
          <path d="M38 28 Q62 25 74 42 Q52 50 38 28 Z" opacity="0.70" />
          <path d="M56 46 Q80 48 88 68 Q66 72 56 46 Z" opacity="0.65" />
          <path d="M66 72 Q88 82 88 104 Q68 100 66 72 Z" opacity="0.60" />

          {/* Mảng 4: Dải dây leo viền trái (Left Margin Foliage) */}
          <path
            d="M0 450 C32 410 25 350 35 310 C42 280 28 250 10 230"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <path d="M12 245 Q36 235 48 250 Q28 264 12 245 Z" opacity="0.65" />
          <path d="M26 270 Q52 265 62 284 Q38 294 26 270 Z" opacity="0.70" />
          <path d="M32 300 Q60 302 68 322 Q42 328 32 300 Z" opacity="0.65" />
          <path d="M30 332 Q58 340 60 362 Q36 358 30 332 Z" opacity="0.70" />
          <path d="M24 365 Q50 378 48 400 Q26 392 24 365 Z" opacity="0.65" />
          <path d="M16 398 Q38 415 32 435 Q14 422 16 398 Z" opacity="0.60" />

          {/* Mảng 5: Dải dây leo viền phải (Right Margin Foliage) */}
          <path
            d="M390 470 C360 430 368 370 358 330 C350 300 362 270 380 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <path d="M378 265 Q354 255 342 270 Q362 284 378 265 Z" opacity="0.65" />
          <path d="M364 290 Q338 285 328 304 Q352 314 364 290 Z" opacity="0.70" />
          <path d="M358 320 Q330 322 322 342 Q348 348 358 320 Z" opacity="0.65" />
          <path d="M360 352 Q332 360 330 382 Q354 378 360 352 Z" opacity="0.70" />
          <path d="M366 385 Q340 398 342 420 Q364 412 366 385 Z" opacity="0.65" />
          <path d="M374 418 Q352 435 358 455 Q376 442 374 418 Z" opacity="0.60" />

          {/* Mảng 6: Cành lá chân trang dưới-trái (Bottom-Left Sprig) */}
          <path
            d="M0 580 C35 560 70 575 95 605"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.55"
          />
          <path d="M30 565 Q54 550 68 565 Q48 580 30 565 Z" opacity="0.65" />
          <path d="M58 572 Q82 565 92 584 Q70 594 58 572 Z" opacity="0.70" />
          <path d="M80 592 Q105 595 110 615 Q88 620 80 592 Z" opacity="0.60" />

          {/* Mảng 7: Cành lá chân trang dưới-phải (Bottom-Right Sprig) */}
          <path
            d="M390 530 C360 520 335 540 325 570 C320 595 335 620 355 640"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.55"
          />
          <path d="M365 522 Q340 515 330 532 Q352 542 365 522 Z" opacity="0.65" />
          <path d="M342 536 Q318 535 312 555 Q334 562 342 536 Z" opacity="0.70" />
          <path d="M330 562 Q308 572 312 594 Q332 588 330 562 Z" opacity="0.65" />
          <path d="M332 590 Q315 608 324 628 Q340 618 332 590 Z" opacity="0.60" />

          {/* Chùm quả mọng & giọt sương mai điểm xuyết (Berries & Dew Drops) */}
          <circle cx="220" cy="26" r="3.5" opacity="0.65" />
          <circle cx="252" cy="20" r="4.0" opacity="0.70" />
          <circle cx="288" cy="35" r="3.0" opacity="0.60" />
          <circle cx="328" cy="50" r="4.5" opacity="0.65" />
          <circle cx="345" cy="88" r="3.5" opacity="0.55" />
          <circle cx="352" cy="122" r="4.0" opacity="0.60" />
          <circle cx="142" cy="26" r="3.5" opacity="0.65" />
          <circle cx="112" cy="20" r="4.0" opacity="0.70" />
          <circle cx="75" cy="35" r="3.0" opacity="0.60" />
          <circle cx="38" cy="50" r="4.5" opacity="0.65" />
          <circle cx="24" cy="88" r="3.5" opacity="0.55" />
          <circle cx="25" cy="130" r="4.0" opacity="0.60" />

          <circle cx="328" cy="245" r="3.5" opacity="0.55" />
          <circle cx="348" cy="275" r="4.0" opacity="0.60" />
          <circle cx="318" cy="345" r="3.5" opacity="0.55" />
          <circle cx="335" cy="405" r="4.0" opacity="0.60" />
          <circle cx="62" cy="245" r="3.5" opacity="0.55" />
          <circle cx="42" cy="275" r="4.0" opacity="0.60" />
          <circle cx="72" cy="345" r="3.5" opacity="0.55" />
          <circle cx="55" cy="405" r="4.0" opacity="0.60" />

          <circle cx="115" cy="575" r="3.5" opacity="0.50" />
          <circle cx="125" cy="600" r="4.0" opacity="0.55" />
          <circle cx="318" cy="545" r="3.5" opacity="0.50" />
          <circle cx="310" cy="580" r="4.0" opacity="0.55" />
        </g>
      )}

      {/* 5. HÌNH HỌC NHẸ (Modern Clean Geometry) */}
      {activeDecor === "geometry" && (
        <g stroke="currentColor" fill="none">
          {/* Mảng 1: Phía sau avatar */}
          <rect
            x="118"
            y="61"
            width="154"
            height="154"
            rx="42"
            transform="rotate(15 195 138)"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.10"
            strokeOpacity="0.45"
          />
          <rect
            x="126"
            y="69"
            width="138"
            height="138"
            rx="36"
            transform="rotate(-10 195 138)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            strokeOpacity="0.38"
          />

          {/* Satellite diamond accents */}
          <polygon
            points="195,35 200,43 195,51 190,43"
            fill="currentColor"
            stroke="none"
            opacity="0.60"
          />
          <polygon
            points="295,138 303,143 295,148 287,143"
            fill="currentColor"
            stroke="none"
            opacity="0.60"
          />
          <polygon
            points="95,138 103,143 95,148 87,143"
            fill="currentColor"
            stroke="none"
            opacity="0.60"
          />

          {/* Mảng 2: Góc trên phải */}
          <rect
            x="328"
            y="22"
            width="46"
            height="46"
            rx="14"
            transform="rotate(12 351 45)"
            fill="currentColor"
            fillOpacity="0.15"
            strokeWidth="1.4"
            strokeOpacity="0.45"
          />

          {/* Mảng 3: Rìa trái */}
          <rect
            x="10"
            y="268"
            width="38"
            height="38"
            rx="10"
            transform="rotate(45 29 287)"
            fill="currentColor"
            fillOpacity="0.12"
            strokeWidth="1.3"
            strokeOpacity="0.40"
          />

          {/* Chấm hình học ở rìa */}
          <circle cx="356" cy="112" r="4" fill="currentColor" stroke="none" opacity="0.55" />
          <circle cx="24" cy="345" r="4" fill="currentColor" stroke="none" opacity="0.50" />
          <circle cx="368" cy="470" r="4.5" fill="currentColor" stroke="none" opacity="0.48" />
        </g>
      )}

      {/* 6. KẾT NỐI SỐ NHẸ (Constellation Tech Network) */}
      {activeDecor === "network" && (
        <g stroke="currentColor" fill="currentColor">
          {/* Mảng 1: Phía sau avatar */}
          <circle
            cx="195"
            cy="138"
            r="96"
            fill="none"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            opacity="0.40"
          />
          {/* Network constellation links around avatar */}
          <line x1="120" y1="80" x2="160" y2="55" strokeWidth="1.4" opacity="0.45" />
          <line x1="160" y1="55" x2="230" y2="55" strokeWidth="1.4" opacity="0.45" />
          <line x1="230" y1="55" x2="275" y2="85" strokeWidth="1.4" opacity="0.45" />
          <line x1="275" y1="85" x2="305" y2="138" strokeWidth="1.4" opacity="0.45" />
          <line x1="305" y1="138" x2="280" y2="195" strokeWidth="1.4" opacity="0.45" />
          <line x1="120" y1="80" x2="85" y2="138" strokeWidth="1.4" opacity="0.45" />
          <line x1="85" y1="138" x2="110" y2="195" strokeWidth="1.4" opacity="0.45" />

          {/* Nodes */}
          <circle cx="120" cy="80" r="4.5" opacity="0.65" />
          <circle cx="160" cy="55" r="4" opacity="0.60" />
          <circle cx="230" cy="55" r="4" opacity="0.60" />
          <circle cx="275" cy="85" r="4.5" opacity="0.65" />
          <circle cx="305" cy="138" r="5" opacity="0.70" />
          <circle cx="280" cy="195" r="4.5" opacity="0.65" />
          <circle cx="85" cy="138" r="5" opacity="0.70" />
          <circle cx="110" cy="195" r="4.5" opacity="0.65" />

          {/* Mảng 2: Góc trên phải */}
          <path
            d="M336 44L364 24L384 56L360 76"
            fill="none"
            strokeWidth="1.4"
            opacity="0.45"
          />
          <circle cx="336" cy="44" r="3.5" opacity="0.65" />
          <circle cx="364" cy="24" r="4" opacity="0.70" />
          <circle cx="384" cy="56" r="3.5" opacity="0.60" />
          <circle cx="360" cy="76" r="3.5" opacity="0.60" />

          {/* Mảng 3: Rìa trái */}
          <path
            d="M12 265L32 290L16 322"
            fill="none"
            strokeWidth="1.4"
            opacity="0.45"
          />
          <circle cx="12" cy="265" r="3.5" opacity="0.65" />
          <circle cx="32" cy="290" r="4" opacity="0.70" />
          <circle cx="16" cy="322" r="3.5" opacity="0.60" />

          {/* Margin data points */}
          <circle cx="355" cy="280" r="3" opacity="0.55" />
          <circle cx="368" cy="365" r="3.5" opacity="0.50" />
          <circle cx="362" cy="460" r="4" opacity="0.52" />
          <circle cx="28" cy="370" r="3.5" opacity="0.50" />
        </g>
      )}
    </svg>
    <div className="qtm-ambient-decor" aria-hidden="true">
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((position) => (
        <AmbientCluster key={position} position={position} />
      ))}
      <svg className="qtm-ambient-waves" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none" focusable="false">
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.24">
          <path d="M-40 85C160-40 310 160 520 65S820-10 1040 80" />
          <path d="M-40 97C160-28 310 172 520 77S820 2 1040 92" />
          <path d="M-40 109C160-16 310 184 520 89S820 14 1040 104" />
        </g>
      </svg>
    </div>
    </>
  );
}

/**
 * Permanent Skyline Artwork:
 * Rendered at the bottom-right corner inside the footer row,
 * shifted UP so it never collides with or touches the motto text.
 */
export function ProfileFooterDecorations({ theme }: { theme?: CardTheme }) {
  void theme; // Skyline is permanently displayed regardless of theme.decor
  return (
    <svg
      className="qtm-footer-decor"
      viewBox="0 0 400 100"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g data-decor="skyline" fill="currentColor" opacity="0.38">
        <path d="M0 100V94H24V61H39V94H54V42H72V94H89V58H102V94H116V26H131V12H136V26H148V94H244V47H260V94H275V24L284 8L293 24V94H310V55H329V94H346V69H363V94H400V100Z" />
        <path
          fillRule="evenodd"
          d="M172 96V69H228V96ZM192 96H208V82A8 8 0 0 0 192 82Z M165 69L200 49L235 69Z M178 56V43H222V56Z M171 43L200 28L229 43Z"
        />
      </g>
    </svg>
  );
}
