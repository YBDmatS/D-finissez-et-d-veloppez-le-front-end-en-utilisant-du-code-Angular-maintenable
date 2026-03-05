import { Chart, Element, Plugin } from 'chart.js/auto';

interface LabelEntry {
  index: number;
  x: number;
  y: number;
  xLine: number;
  yLine: number;
  isRight: boolean;
  color: string;
}

function resolveOverlaps(side: LabelEntry[], lineHeight: number): void {
  side.sort((a, b) => a.yLine - b.yLine);
  // Multiple passes to propagate adjustments in a cascade
  side.forEach(() => {
    for (let i = 1; i < side.length; i++) {
      const prev = side[i - 1];
      const curr = side[i];
      const overlap = prev.yLine + lineHeight - curr.yLine;
      if (overlap > 0) {
        prev.yLine -= overlap / 2;
        curr.yLine += overlap / 2;
      }
    }
  });
}

/** Chart.js plugin that draws connector lines and country name labels outside the pie slices. */
export const pieLabelsLine: Plugin<'pie'> = {
  id: 'pieLabelsLine',
  afterDraw: (chart: Chart<'pie'>) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const cx = meta.data[0].x;
    const cy = meta.data[0].y;
    const bgColors = chart.data.datasets[0].backgroundColor as string[];
    const chartLabels = chart.data.labels as string[];

    // Scale font size with chart width so labels remain readable at any size
    const FONT_SIZE = Math.max(9, Math.min(13, chart.width * 0.025));
    const LINE_HEIGHT = FONT_SIZE + 5;

    // 1. Compute the natural position of each label
    const entries: LabelEntry[] = meta.data.map((datapoint: Element, index: number) => {
      const { x: a, y: b } = datapoint.tooltipPosition(false);
      const x = 2 * a - cx;
      const y = 2 * b - cy;
      const isRight = x >= cx;
      const isBottom = y >= cy;
      return {
        index,
        x,
        y,
        xLine: isRight ? x + 20 : x - 20,
        yLine: isBottom ? y + 20 : y - 20,
        isRight,
        color: bgColors[index] ?? '#aaa',
      };
    });

    // 2. Resolve overlaps on each side independently
    resolveOverlaps(
      entries.filter((e) => e.isRight),
      LINE_HEIGHT,
    );
    resolveOverlaps(
      entries.filter((e) => !e.isRight),
      LINE_HEIGHT,
    );

    // Clamp yLine to canvas bounds so labels are never clipped
    const margin = FONT_SIZE / 2;
    entries.forEach((e) => {
      e.yLine = Math.max(margin, Math.min(chart.height - margin, e.yLine));
    });

    // 3. Draw lines and labels with the adjusted positions
    ctx.font = `${FONT_SIZE}px Arial`;
    entries.forEach(({ x, y, xLine, yLine, isRight, color, index }) => {
      const extraLine = isRight ? 10 : -10;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xLine, yLine);
      ctx.lineTo(xLine + extraLine, yLine);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = isRight ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#444';
      ctx.fillText(chartLabels[index] ?? '', xLine + extraLine + (isRight ? 5 : -5), yLine);
    });
  },
};
