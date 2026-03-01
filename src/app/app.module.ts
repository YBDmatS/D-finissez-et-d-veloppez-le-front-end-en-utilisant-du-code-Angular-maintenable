import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/home/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailComponent } from "./pages/country-detail/country-detail.component";
import { PieChartComponent } from "src/app/components/charts/pie-chart/pie-chart.component";
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardLayoutComponent } from './components/layouts/dashboard-layout/dashboard-layout.component';

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent, 
    NotFoundComponent, 
    CountryDetailComponent, 
    PieChartComponent, 
    LineChartComponent,
    KpiCardComponent,
    HeaderComponent,
    DashboardLayoutComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
