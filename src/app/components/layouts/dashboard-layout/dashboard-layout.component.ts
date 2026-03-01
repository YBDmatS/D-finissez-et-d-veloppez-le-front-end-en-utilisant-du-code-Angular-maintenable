import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/kpi.model';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  @Input() titlePage!: string;
  @Input() kpis!:  Kpi[];
}
