import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { CountryMedalTotal } from 'src/app/models/view-models/CountryMedalTotal.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnChanges, OnDestroy {
  @Input() data: CountryMedalTotal[] = [];
  public pieChart!: Chart<'pie', number[], string>;
  private readonly router = inject(Router);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.pieChart?.destroy();
  }

  private renderChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.pieChart?.destroy();

    const labels = this.data.map((d) => d.country);
    const values = this.data.map((d) => d.total);

    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Medals',
            data: values,
            backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const firstPoint = points[0];
              const index = firstPoint.index;
              const countryId = this.data[index]?.id; // <-- change only this part
              if (countryId !== undefined && countryId !== null) {
                this.router.navigate(['country', countryId]);
              }
            }
          }
        },
      },
    });
    this.pieChart = pieChart;
  }
}
