import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardPageVm } from 'src/app/models/view-models/dashboard-page.vm';
import { OlympicService } from 'src/app/services/olympic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly olympicService = inject(OlympicService);
  public readonly vm$: Observable<DashboardPageVm> = this.olympicService.getDashboardPageVm();
}
