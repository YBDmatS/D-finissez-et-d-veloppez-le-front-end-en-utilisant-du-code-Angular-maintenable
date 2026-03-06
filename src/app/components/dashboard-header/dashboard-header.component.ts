import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/view-models/kpi.model';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  @Input() public titlePage!: string;
  @Input() public kpis!: Kpi[];
}
