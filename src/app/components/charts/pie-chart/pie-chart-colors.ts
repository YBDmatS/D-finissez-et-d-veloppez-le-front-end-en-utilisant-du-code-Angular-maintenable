const BASE_COLORS = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#b3cde3', '#94819d'] as const;

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
