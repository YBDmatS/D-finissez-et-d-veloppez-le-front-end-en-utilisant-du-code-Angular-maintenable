const BASE_COLORS = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#b3cde3', '#94819d'] as const;

/** Replicates Chart.js darken(0.1): reduces HSL lightness by 10%. */
function darkenHex(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const l2 = l * 0.9; // darken(0.1)
  const q = l2 < 0.5 ? l2 * (1 + s) : l2 + s - l2 * s;
  const p = 2 * l2 - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(hue2rgb(h + 1 / 3))}${toHex(hue2rgb(h))}${toHex(hue2rgb(h - 1 / 3))}`;
}

/** Generates an array of `count` colors, cycling BASE_COLORS with decreasing opacity for extra cycles. */
export function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const hex = BASE_COLORS[i % BASE_COLORS.length];
    const cycle = Math.floor(i / BASE_COLORS.length);
    if (cycle === 0) return hex;
    const opacity = Math.round(Math.max(0.3, 1 - cycle * 0.25) * 255);
    return `${hex}${opacity.toString(16).padStart(2, '0')}`;
  });
}

/** Same as generateColors but with each color darkened by 10% (matches Chart.js hover darken). */
export function generateHoverColors(count: number): string[] {
  return generateColors(count).map((hex) => darkenHex(hex.slice(0, 7)));
}
