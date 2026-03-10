import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnChanges, OnDestroy {
  @Input() data: { year: number; medals: number }[] = [];
  @Input() color = '#0b868f';
  public lineChart!: Chart<'line', number[], number>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
  }

  private renderChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.lineChart?.destroy();

    const labels = this.data.map((d) => d.year);
    const values = this.data.map((d) => d.medals);

    const lineChart = new Chart('countryLineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'medals',
            data: values,
            backgroundColor: this.color,
            borderColor: this.color,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    this.lineChart = lineChart;
  }
}
