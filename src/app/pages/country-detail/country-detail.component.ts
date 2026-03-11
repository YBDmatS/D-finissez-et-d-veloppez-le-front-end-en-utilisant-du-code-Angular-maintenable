import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CountryDetailPageVm } from 'src/app/models/view-models/pages/country-detail-page.vm';
import { OlympicService } from 'src/app/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent {
  private readonly olympicService = inject(OlympicService);
  private readonly route = inject(ActivatedRoute);
  private readonly id: number = Number(this.route.snapshot.paramMap.get('id'));
  public readonly color: string = (history.state as { color?: string }).color ?? '#0b868f';
  public vm$: Observable<CountryDetailPageVm> =
    Number.isNaN(this.id) || this.id <= 0
      ? of({
          titlePage: 'Error',
          kpis: [],
          countryMedalsByYears: [],
          error: 'Invalid country ID in URL.',
        })
      : this.olympicService.getCountryDetailPageVm(this.id);
}
