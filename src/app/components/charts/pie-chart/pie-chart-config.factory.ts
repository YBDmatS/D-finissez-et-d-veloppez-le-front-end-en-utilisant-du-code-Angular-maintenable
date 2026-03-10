import { ActiveElement, ChartConfiguration, ChartEvent, Plugin } from 'chart.js/auto';

export type ScreenSize = 'xsmall' | 'small' | 'medium' | 'large';

export interface PieChartConfigOptions {
  labels: string[];
  values: number[];
  colors: string[];
  hoverColors: string[];
  screenSize: ScreenSize;
  plugin: Plugin<'pie'>;
  onClickIndex: (index: number) => void;
}

const ASPECT_RATIO: Record<ScreenSize, number> = {
  xsmall: 0.7,
  small: 1.1,
  medium: 1.3,
  large: 1.4,
};

// Flat padding for breakpoints that use the HTML legend
const SMALL_SCREEN_PADDING: Record<'xsmall' | 'small', number> = { xsmall: 10, small: 15 };

/** Builds the Chart.js configuration for the pie chart. */
export function buildPieChartConfig({
  labels,
  values,
  colors,
  hoverColors,
  screenSize,
  plugin,
  onClickIndex,
}: PieChartConfigOptions): ChartConfiguration<'pie', number[], string> {
  const useCustomLabels = screenSize === 'large' || screenSize === 'medium';

  const padding = useCustomLabels
    ? {
        top: Math.max(15, Math.ceil(values.length / 2) * 10),
        bottom: Math.max(15, Math.ceil(values.length / 2) * 10),
        left: 80,
        right: 80,
      }
    : SMALL_SCREEN_PADDING[screenSize];
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: 'Medals',
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: hoverColors,
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: ASPECT_RATIO[screenSize],
      layout: { padding },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          ticks: { display: false },
          grid: { display: false },
        },
        x: { display: false, ticks: { display: false }, grid: { display: false } },
      },
      plugins: {
        // Legend is always hidden — small screens use the HTML legend in the template
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: (ctx) => {
            const index = ctx.tooltipItems[0]?.dataIndex ?? 0;
            return (ctx.chart.data.datasets[0].backgroundColor as string[])[index] ?? '#333';
          },
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          callbacks: { label: (ctx) => `🏅 ${ctx.parsed}` },
        },
      },
      // Chart.js passes the pre-filtered active elements matching the interaction config
      onClick: (_e: ChartEvent, elements: ActiveElement[]) => {
        if (elements.length) {
          onClickIndex(elements[0].index);
        }
      },
      interaction: { mode: 'nearest', intersect: true },
    },
    plugins: useCustomLabels ? [plugin] : [],
  };
}
