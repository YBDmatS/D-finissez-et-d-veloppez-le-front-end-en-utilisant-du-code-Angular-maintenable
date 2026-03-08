import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { CountryMedalTotal } from 'src/app/models/view-models/CountryMedalTotal.vm';
import { LegendItem } from '../../../models/view-models/LegendItem.vm';
import { generateColors } from './pie-chart-colors';
import { ScreenSize, buildPieChartConfig } from './pie-chart-config.factory';
import { pieLabelsLine } from './pie-labels-line.plugin';

const ALL_SCREEN_QUERIES = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnChanges, OnInit, OnDestroy {
  @Input() data: CountryMedalTotal[] = [];

  public legendItems: LegendItem[] = [];
  private pieChart!: Chart<'pie', number[], string>;

  private readonly router = inject(Router);

  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription!: Subscription;
  private screenSize: ScreenSize = this.getScreenSize();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.renderChart();
    }
  }

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver
      .observe(ALL_SCREEN_QUERIES)
      .subscribe(() => {
        const next = this.getScreenSize();
        if (this.screenSize !== next) {
          this.screenSize = next;
          this.renderChart();
        }
      });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
    this.pieChart?.destroy();
  }

  private renderChart(): void {
    if (!this.data?.length) return;
    this.pieChart?.destroy();

    const colors = generateColors(this.data.length);
    const useHtmlLegend = this.screenSize === 'xsmall' || this.screenSize === 'small';
    this.legendItems = useHtmlLegend
      ? this.data.map((d, i) => ({ label: d.country, color: colors[i] }))
      : [];

    this.pieChart = new Chart(
      'DashboardPieChart',
      buildPieChartConfig({
        labels: this.data.map((d) => d.country),
        values: this.data.map((d) => d.total),
        colors,
        screenSize: this.screenSize,
        plugin: pieLabelsLine,
        onClickIndex: (index) => this.navigateToIndex(index),
      }),
    );
  }

  public navigateToIndex(index: number): void {
    const countryId = this.data[index]?.id;
    if (countryId != null) this.router.navigate(['country', countryId]);
  }

  private getScreenSize(): ScreenSize {
    if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) return 'xsmall';
    if (this.breakpointObserver.isMatched(Breakpoints.Small)) return 'small';
    if (this.breakpointObserver.isMatched(Breakpoints.Medium)) return 'medium';
    return 'large';
  }
}
