import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Olympic } from '../models/domain/olympic.model';
import { Participation } from '../models/domain/participation.model';
import { CountryDetailPageVm } from '../models/view-models/CountryDetail-page.vm';
import { CountryMedalTotal } from '../models/view-models/CountryMedalTotal.vm';
import { CountryMedalsByYear } from '../models/view-models/CountryMedalsByYear.vm';
import { DashboardPageVm } from '../models/view-models/dashboard-page.vm';
import { Kpi } from '../models/view-models/kpi.vm';
import { ErrorMapperService } from './error-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';
  private readonly http = inject(HttpClient);
  private readonly errorMapper = inject(ErrorMapperService);
  private readonly olympics$: Observable<Olympic[]> = this.http
    .get<Olympic[]>(this.olympicUrl)
    .pipe(shareReplay(1));

  public getDashboardPageVm(): Observable<DashboardPageVm> {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        if (!olympics) {
          return {
            titlePage: 'Error',
            kpis: [],
            medalTotals: [],
            loading: false,
            error: 'No data available.',
          };
        }

        return {
          titlePage: 'Medals per Country',
          kpis: this.buildDashboardKpis(olympics ?? []),
          medalTotals: this.buildCountryMedalTotals(olympics ?? []),
          loading: false,
          error: null,
        };
      }),
      catchError((error: unknown) =>
        of({
          titlePage: 'Error',
          kpis: [],
          medalTotals: [],
          loading: false,
          error: this.errorMapper.toMessage(error),
        }),
      ),
    );
  }

  public getCountryDetailPageVm(countryId: number): Observable<CountryDetailPageVm> {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        const o: Olympic | undefined = (olympics ?? []).find((o: Olympic) => o.id === countryId);

        if (!o) {
          return {
            titlePage: 'Error',
            kpis: [],
            countryMedalsByYears: [],
            loading: false,
            error: 'No country found with this ID.',
          };
        }

        return {
          titlePage: this.buildCountryTitlePage(o),
          kpis: this.buildCountryKpis(o),
          countryMedalsByYears: this.buildCountryMedalsByYear(o),
          loading: false,
          error: null,
        };
      }),
      catchError((error: unknown) =>
        of({
          titlePage: 'Error',
          kpis: [],
          countryMedalsByYears: [],
          loading: false,
          error: this.errorMapper.toMessage(error),
        }),
      ),
    );
  }

  private buildDashboardKpis(olympics: Olympic[]): Kpi[] {
    const totalCountries = olympics.length;

    const years = new Set(
      olympics.flatMap((o: Olympic) => o.participations.map((p: Participation) => p.year)),
    );

    return [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: years.size },
    ];
  }

  private buildCountryMedalTotals(olympics: Olympic[]): CountryMedalTotal[] {
    return olympics
      .map((o: Olympic) => ({
        id: o.id,
        country: o.country,
        total: o.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0),
      }))
      .sort((a: CountryMedalTotal, b: CountryMedalTotal) => {
        if (b.total !== a.total) {
          return b.total - a.total;
        }

        return a.country.localeCompare(b.country);
      });
  }

  private buildCountryKpis(olympic: Olympic | undefined): Kpi[] {
    const totalEntries = olympic ? olympic.participations.length : 0;
    const totalMedals = olympic
      ? olympic.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0)
      : 0;
    const totalAthletes = olympic
      ? olympic.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0)
      : 0;

    return [
      { label: 'Total Number of medals', value: totalMedals },
      { label: 'Total Number of athletes', value: totalAthletes },
      { label: 'Number of entries', value: totalEntries },
    ];
  }

  private buildCountryMedalsByYear(olympic: Olympic | undefined): CountryMedalsByYear[] {
    return olympic
      ? olympic.participations
          .map((p: Participation) => ({
            year: p.year,
            medals: p.medalsCount,
          }))
          .sort((a: CountryMedalsByYear, b: CountryMedalsByYear) => a.year - b.year)
      : [];
  }

  private buildCountryTitlePage(o: Olympic | undefined): string {
    if (o?.country) {
      return o.country;
    } else if (o && !o.country) {
      return 'Country without name';
    } else {
      return 'No country selected';
    }
  }
}
