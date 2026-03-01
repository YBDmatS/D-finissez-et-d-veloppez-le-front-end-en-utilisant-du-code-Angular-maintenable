import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import { PieChartComponent } from 'src/app/components/charts/pie-chart/pie-chart.component';


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
  public kpis: { label: string, value: number }[] = [];  

  @ViewChild(PieChartComponent)
  pieChartComponent!: PieChartComponent;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
          const countries: string[] = data.map((i: any) => i.country);
          this.totalCountries = countries.length;
          this.kpis = [
            { label: 'Number of countries', value: this.totalCountries },
            { label: 'Number of JOs', value: this.totalJOs }
          ];  
          const medals = data.map((i: any) => i.participations.map((i: any) => (i.medalsCount)));
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

