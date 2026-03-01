import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LineChartComponent} from 'src/app/components/charts/line-chart/line-chart.component';


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
  public kpis: { label: string, value: number }[] = [];  

  @ViewChild(LineChartComponent)
  lineChartComponent!: LineChartComponent;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    let countryId: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryId = param.get('id'));
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: any) => i.country === countryId);
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry?.participations.map((i: any) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map((i: any) => i.year) ?? [];
          const medals = selectedCountry?.participations.map((i: any) => i.medalsCount.toString()) ?? [];
          this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          const nbAthletes = selectedCountry?.participations.map((i: any) => i.athleteCount.toString()) ?? []
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
