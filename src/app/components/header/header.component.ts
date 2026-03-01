import { Component, Input } from '@angular/core';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() public titlePage!: string;
  @Input() public kpiCards!: { label: string, value: number }[];
}
