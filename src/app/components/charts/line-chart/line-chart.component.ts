import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {

  public lineChart!: Chart<"line", string[], number>;

  buildChart(years: number[], medals: string[]) {
  const lineChart = new Chart("countryLineChart", {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: "medals",
          data: medals,
          backgroundColor: '#0b868f'
        },
      ]
    },
    options: {
      aspectRatio: 2.5
    }
  });
  this.lineChart = lineChart;
} 
}
