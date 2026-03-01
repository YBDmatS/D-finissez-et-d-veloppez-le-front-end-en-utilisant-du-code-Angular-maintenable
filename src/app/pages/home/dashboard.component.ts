import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import { PieChartComponent } from 'src/app/components/charts/pie-chart/pie-chart.component';
import { Kpi } from 'src/app/models/kpi.model';
import { Olympic } from 'src/app/models/olympic.model';
import { Participation } from 'src/app/models/participation.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public totalCountries: number = 0
  public totalJOs: number = 0
  public error!:string
  public titlePage: string = "Medals per Country";
  public kpis!: Kpi[];  

  @ViewChild(PieChartComponent)
  pieChartComponent!: PieChartComponent;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get<Olympic[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: Olympic) => i.participations.map((f: Participation) => f.year)).flat())).length;
          const countries: string[] = data.map((i: Olympic) => i.country);
          this.totalCountries = countries.length;
          this.kpis = [
            { label: 'Number of countries', value: this.totalCountries },
            { label: 'Number of JOs', value: this.totalJOs }
          ]; 
          const medals = data.map((i: Olympic) => i.participations.map((i: Participation) => (i.medalsCount)));
          const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));
          this.pieChartComponent.buildChart(countries, sumOfAllMedalsYears);
        }
      },
      (error:HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message
      }
    )
  }
}

