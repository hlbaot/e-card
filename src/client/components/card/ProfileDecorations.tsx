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
  if (theme.showDecor === false || !theme.decor?.length) return null;

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
export function ProfileDecorations({ theme }: { theme: CardTheme }) {
  const decor = theme.decor || [];
  const activeDecor: DecorKey | "none" = decor.length > 0 ? decor[0] : "none";

  if (activeDecor === "none") {
    return null;
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
      </defs>

      {/* 1. BLOB MỀM (Soft Organic Watercolor Splash & Ripples - As seen in Image 3) */}
      {activeDecor === "blobs" && (
        <g fill="currentColor">
          {/* Mảng 1: Phía sau avatar (soft organic halo) */}
          <circle cx="195" cy="138" r="95" fill="url(#avatar-soft-glow)" />

          {/* Primary organic fluid splash blooming from behind avatar */}
          <path
            d="M195 50C246 44 296 74 314 116C332 154 310 196 272 218C230 242 174 236 136 206C100 174 92 126 122 86C145 56 172 52 195 50Z"
            opacity="0.55"
          />
          {/* Secondary organic fluid wave lobe */}
          <path
            d="M185 64C226 58 268 82 286 122C300 152 284 186 254 206C220 228 174 220 142 192C116 168 120 130 140 98C156 74 168 66 185 64Z"
            opacity="0.40"
          />

          {/* Fluid splash flicks */}
          <path
            d="M265 82C294 68 326 78 338 102C348 122 332 140 310 134C288 128 274 102 265 82Z"
            opacity="0.50"
          />
          <path
            d="M125 178C102 194 80 184 72 164C66 144 88 134 108 144C128 154 134 170 125 178Z"
            opacity="0.45"
          />

          {/* Concentric wave ripple rings */}
          <ellipse
            cx="195"
            cy="138"
            rx="98"
            ry="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeDasharray="10 14"
            opacity="0.48"
          />
          <ellipse
            cx="195"
            cy="138"
            rx="122"
            ry="116"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 18"
            opacity="0.36"
          />

          {/* Floating water droplets around the avatar (Image 3) */}
          <circle cx="328" cy="92" r="6" opacity="0.65" />
          <circle cx="348" cy="118" r="4.5" opacity="0.60" />
          <circle cx="325" cy="154" r="7" opacity="0.62" />
          <circle cx="308" cy="65" r="3.5" opacity="0.70" />
          <circle cx="275" cy="50" r="5" opacity="0.55" />
          <circle cx="68" cy="118" r="5.5" opacity="0.65" />
          <circle cx="54" cy="148" r="3.5" opacity="0.55" />
          <circle cx="64" cy="180" r="6.5" opacity="0.68" />
          <circle cx="82" cy="224" r="4.5" opacity="0.60" />
          <circle cx="108" cy="242" r="3.5" opacity="0.55" />
          <circle cx="242" cy="248" r="4.5" opacity="0.58" />
          <circle cx="278" cy="235" r="5.5" opacity="0.52" />

          {/* Mảng 2: Góc trên phải (peeking soft blob) */}
          <path
            d="M305 0C326 36 358 58 390 62V0H305Z"
            opacity="0.45"
          />
          <path
            d="M336 12C352 38 376 46 390 48V12H336Z"
            opacity="0.30"
          />

          {/* Mảng 3: Rìa trái giữa thẻ (edge curve, outside text area) */}
          <path
            d="M0 240C28 246 48 268 46 296C44 324 20 342 0 354V240Z"
            opacity="0.40"
          />

          {/* Floating bubbles down the margins (filling empty space) */}
          <circle cx="366" cy="265" r="5.5" opacity="0.50" />
          <circle cx="372" cy="355" r="4.5" opacity="0.45" />
          <circle cx="364" cy="455" r="6" opacity="0.48" />
          <circle cx="24" cy="330" r="4.5" opacity="0.45" />
          <circle cx="28" cy="425" r="5" opacity="0.42" />
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

      {/* 3. VÒNG TRÒN MẢNH (Delicate Minimal Orbital Rings) */}
      {activeDecor === "circles" && (
        <g stroke="currentColor" fill="none">
          {/* Mảng 1: Phía sau avatar */}
          <circle cx="195" cy="138" r="92" strokeWidth="1.6" opacity="0.55" />
          <circle cx="195" cy="138" r="114" strokeWidth="1.2" strokeDasharray="8 10" opacity="0.42" />
          <circle cx="195" cy="138" r="134" strokeWidth="1.0" opacity="0.32" />

          {/* Satellite node dots */}
          <circle cx="287" cy="138" r="4.5" fill="currentColor" stroke="none" opacity="0.65" />
          <circle cx="103" cy="138" r="4.5" fill="currentColor" stroke="none" opacity="0.65" />
          <circle cx="195" cy="46" r="3.5" fill="currentColor" stroke="none" opacity="0.60" />
          <circle cx="275" cy="88" r="4" fill="currentColor" stroke="none" opacity="0.62" />
          <circle cx="115" cy="188" r="4" fill="currentColor" stroke="none" opacity="0.62" />

          {/* Mảng 2: Góc trên phải */}
          <circle cx="362" cy="55" r="42" strokeWidth="1.5" opacity="0.45" />
          <circle cx="362" cy="55" r="24" strokeWidth="1.0" strokeDasharray="4 6" opacity="0.35" />

          {/* Mảng 3: Rìa trái & rìa phải */}
          <circle cx="15" cy="285" r="38" strokeWidth="1.4" opacity="0.40" />
          <circle cx="15" cy="285" r="20" strokeWidth="0.9" opacity="0.30" />
          <circle cx="370" cy="365" r="28" strokeWidth="1.2" opacity="0.35" />

          {/* Chấm tròn mảnh ở rìa */}
          <circle cx="335" cy="118" r="4" fill="currentColor" stroke="none" opacity="0.55" />
          <circle cx="34" cy="365" r="3.5" fill="currentColor" stroke="none" opacity="0.48" />
          <circle cx="368" cy="460" r="4" fill="currentColor" stroke="none" opacity="0.50" />
        </g>
      )}

      {/* 4. CÀNH LÁ (Botanical Leaves & Foliage) */}
      {activeDecor === "leaves" && (
        <g fill="currentColor">
          {/* Mảng 1: Phía sau avatar (gentle foliage wash) */}
          <circle cx="195" cy="138" r="95" fill="url(#avatar-soft-glow)" />

          {/* Flowing botanical branch arching around avatar */}
          <path
            d="M130 205Q105 160 115 110Q125 70 160 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.55"
          />
          <path
            d="M110 145Q95 135 100 120Q118 126 110 145ZM118 105Q102 92 110 78Q128 86 118 105ZM142 72Q132 55 145 46Q155 64 142 72Z"
            opacity="0.50"
          />
          <path
            d="M260 70Q285 110 278 165Q270 205 235 220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.55"
          />
          <path
            d="M280 125Q296 112 290 98Q272 105 280 125ZM274 165Q290 152 284 138Q266 145 274 165ZM250 198Q262 215 248 224Q238 206 250 198Z"
            opacity="0.50"
          />

          {/* Mảng 2: Góc trên phải (delicate branch) */}
          <path
            d="M336 80Q358 54 384 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.50"
          />
          <path
            d="M360 60Q345 50 350 40Q366 44 360 60ZM374 50Q360 36 367 26Q382 32 374 50Z"
            opacity="0.45"
          />

          {/* Mảng 3: Rìa trái */}
          <path
            d="M12 270Q32 274 38 292"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.48"
          />
          <path
            d="M24 272Q13 259 20 250Q32 257 24 272ZM36 283Q24 273 28 263Q40 270 36 283Z"
            opacity="0.45"
          />

          {/* Floating leaf dots & dew droplets */}
          <circle cx="345" cy="112" r="4.5" opacity="0.55" />
          <circle cx="26" cy="340" r="4" opacity="0.50" />
          <circle cx="366" cy="450" r="4.5" opacity="0.48" />
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
