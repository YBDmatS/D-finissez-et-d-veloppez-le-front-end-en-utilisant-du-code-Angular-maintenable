import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartComponent } from 'src/app/components/charts/line-chart/line-chart.component';
import { CountryMedalsByYear } from 'src/app/models/CountryMedalsByYear';
import { Kpi } from 'src/app/models/kpi.model';
import { OlympicService } from 'src/app/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  public titlePage = 'Aucun pays sélectionné';
  public kpis!: Kpi[];
  public countryMedalsByYears!: CountryMedalsByYear[];
  public error!: string;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  @ViewChild(LineChartComponent)
  lineChartComponent!: LineChartComponent;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || '');

    this.olympicService.getCountryDetailById(id).subscribe({
      next: (country) => {
        if (!country) {
          this.router.navigate(['/']);
          return;
        }
        this.titlePage = country.country;
      },
    });

    this.olympicService.getCountryKpis(id).subscribe({
      next: (kpis) => (this.kpis = kpis),
      error: (error: HttpErrorResponse) => (this.error = error.message),
    });

    this.olympicService.getCountryMedalsByYear(id).subscribe({
      next: (data) => {
        this.countryMedalsByYears = data;
      },
    });
  }
}
