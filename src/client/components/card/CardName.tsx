import font from "@/shared/assets/card-name-glyphs.json";

const glyphs: Record<string, { advance: number; path: string }> = font.glyphs;

/** Outlines keep the name's square letterforms identical in preview and PNG. */
export function CardName({ name, color }: { name: string; color: string }) {
  const text = name.normalize("NFC").toUpperCase();
  const letters = Array.from(text);
  if (letters.some((letter) => !glyphs[letter])) {
    return <text x="73" y="288" fill={color} fontSize="48" fontWeight="600"
      textLength={letters.length > 16 ? 660 : undefined} lengthAdjust="spacingAndGlyphs">{text}</text>;
  }

  const tracking = font.unitsPerEm / 48;
  let advance = 0;
  const paths = letters.map((letter) => {
    const glyph = glyphs[letter];
    const result = { ...glyph, x: advance };
    advance += glyph.advance + tracking;
    return result;
  });
  const scale = 48 / font.unitsPerEm;
  const width = Math.max(0, advance - tracking) * scale;
  const horizontalScale = scale * Math.min(1, 660 / Math.max(width, 1));

  return <g role="img" aria-label={text} fill={color}>
    <title>{text}</title>
    <g transform={`translate(73 288) scale(${horizontalScale} ${-scale})`}>
      {paths.map(({ path, x }, index) => path && <path key={index} d={path} transform={`translate(${x} 0)`} />)}
    </g>
  </g>;
}
