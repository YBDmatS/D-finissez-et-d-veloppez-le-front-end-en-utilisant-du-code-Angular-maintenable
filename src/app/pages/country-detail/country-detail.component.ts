import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CountryDetailPageVm } from 'src/app/models/view-models/CountryDetail-page.vm';
import { OlympicService } from 'src/app/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent {
  private readonly olympicService = inject(OlympicService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly id: number = Number(this.route.snapshot.paramMap.get('id'));
  public vm$: Observable<CountryDetailPageVm> = this.olympicService.getCountryDetailPageVm(this.id);

  public goBack(): void {
    this.location.back();
  }
}
