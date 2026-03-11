import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DashboardLayoutComponent } from './components/layouts/dashboard-layout/dashboard-layout.component';
import { BackButtonComponent } from './components/ui/back-button/back-button.component';
import { StateMessageComponent } from './components/ui/state-message/state-message.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotFoundComponent,
    CountryDetailComponent,
    PieChartComponent,
    LineChartComponent,
    KpiCardComponent,
    DashboardHeaderComponent,
    DashboardLayoutComponent,
    StateMessageComponent,
    BackButtonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
