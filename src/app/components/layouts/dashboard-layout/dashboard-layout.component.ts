import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  @Input() titlePage!: string;
  @Input() kpis:  { label: string, value: number }[] = [];
}
