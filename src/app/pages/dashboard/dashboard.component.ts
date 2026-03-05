import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CountryMedalTotal } from 'src/app/models/view-models/CountryMedalTotal.model';
import { Kpi } from 'src/app/models/view-models/kpi.model';
import { OlympicService } from 'src/app/services/olympic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public titlePage = 'Medals per Country';
  public kpis!: Kpi[];
  public medalTotals: CountryMedalTotal[] = [];
  public error!: string;

  private readonly olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympicService.getDashboardKpis().subscribe({
      next: (kpis) => (this.kpis = kpis),
      error: (error: HttpErrorResponse) => (this.error = error.message),
    });

    this.olympicService.getMedalTotalsByCountry().subscribe({
      next: (data: CountryMedalTotal[]) => {
        this.medalTotals = data;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }
}
