import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LineChartComponent} from 'src/app/components/charts/line-chart/line-chart.component';
import { Kpi } from 'src/app/models/kpi.model';
import { Olympic } from 'src/app/models/olympic.model';
import { Participation } from 'src/app/models/participation.model';


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public titlePage: string = '';
  public totalEntries: any = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;
  public kpis!: Kpi[];  

  @ViewChild(LineChartComponent)
  lineChartComponent!: LineChartComponent;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    let countryId: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryId = param.get('id'));
    this.http.get<Olympic[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: Olympic) => i.country === countryId);

          if (!selectedCountry) {
            this.router.navigate(['/']);
            return;
          }
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry?.participations.map((i: Participation) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map((i: Participation) => i.year) ?? [];
          const medals = selectedCountry?.participations.map((i: Participation) => i.medalsCount.toString()) ?? [];
          this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          const nbAthletes = selectedCountry?.participations.map((i: Participation) => i.athleteCount.toString()) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          this.kpis = [
            { label: 'Number of entries', value: this.totalEntries },
            { label: 'Total Number of medals', value: this.totalMedals },
            { label: 'Total Number of athletes', value: this.totalAthletes }
          ];
          this.lineChartComponent.buildChart(years, medals);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }

}
