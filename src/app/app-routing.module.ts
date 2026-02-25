import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/home/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailComponent } from "./pages/country-detail/country-detail.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path : 'country/:id',
    component : CountryDetailComponent
  },

  {
    path : 'not-found',
    component : NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
