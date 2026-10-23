const rgb = (hex: string) => {
  const safe = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#0F4C75";
  return [1, 3, 5].map((i) => parseInt(safe.slice(i, i + 2), 16));
};
const luminance = (hex: string) =>
  rgb(hex)
    .map((v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
export function contrastRatio(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function contrastText(background: string) {
  return contrastRatio(background, "#FFFFFF") >=
    contrastRatio(background, "#000000")
    ? "#FFFFFF"
    : "#000000";
}
export function readableAccent(color: string, dark: boolean) {
  const surface = dark ? "#172334" : "#F5F5F4";
  if (contrastRatio(color, surface) >= 4.5) return color;
  const channels = rgb(color);
  const target = dark ? 255 : 0;
  for (let step = 1; step <= 20; step++) {
    const mix = step / 20;
    const candidate =
      "#" +
      channels
        .map((c) =>
          Math.round(c + (target - c) * mix)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
    if (contrastRatio(candidate, surface) >= 4.5) return candidate;
  }
  return dark ? "#FFFFFF" : "#102430";
}
