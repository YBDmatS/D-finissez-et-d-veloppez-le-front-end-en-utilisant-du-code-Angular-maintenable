import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { CountryMedalTotal } from '../models/CountryMedalTotal';
import { CountryMedalsByYear } from '../models/CountryMedalsByYear';
import { Kpi } from '../models/kpi.model';
import { Olympic } from '../models/olympic.model';
import { Participation } from '../models/participation.model';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';
  private readonly http = inject(HttpClient);
  private readonly olympics$: Observable<Olympic[]> = this.http
    .get<Olympic[]>(this.olympicUrl)
    .pipe(shareReplay(1));

  public getOlympics(): Observable<Olympic[]> {
    return this.olympics$;
  }

  public getDashboardKpis(): Observable<Kpi[]> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const totalCountries = olympics.length;

        const years = new Set(
          olympics.flatMap((o: Olympic) => o.participations.map((p: Participation) => p.year)),
        );

        return [
          { label: 'Number of countries', value: totalCountries },
          { label: 'Number of JOs', value: years.size },
        ];
      }),
    );
  }

  public getMedalTotalsByCountry(): Observable<CountryMedalTotal[]> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) =>
        olympics.map((o: Olympic) => ({
          id: o.id,
          country: o.country,
          total: o.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0),
        })),
      ),
    );
  }

  public getCountryKpis(id: number): Observable<Kpi[]> {
    return this.getCountryDetailById(id).pipe(
      map((country) => {
        const totalEntries = country ? country.participations.length : 0;

        const totalMedals = country
          ? country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0)
          : 0;

        const totalAthletes = country
          ? country.participations.reduce(
              (sum: number, p: Participation) => sum + p.athleteCount,
              0,
            )
          : 0;

        return [
          { label: 'Number of entries', value: totalEntries },
          { label: 'Total Number of medals', value: totalMedals },
          { label: 'Total Number of athletes', value: totalAthletes },
        ];
      }),
    );
  }

  public getCountryMedalsByYear(id: number): Observable<CountryMedalsByYear[]> {
    return this.getCountryDetailById(id).pipe(
      map((country) =>
        country
          ? country.participations.map((p: Participation) => ({
              year: p.year,
              medals: p.medalsCount,
            }))
          : [],
      ),
    );
  }

  public getCountryDetailById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.find((o: Olympic) => o.id === id)),
    );
  }

  public getCountryDetailByName(name: string): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) =>
        olympics.find((o: Olympic) => o.country.toLowerCase() === name.toLowerCase()),
      ),
    );
  }
}
