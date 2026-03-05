import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/kpi.model';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  @Input() public kpi!: Kpi;
}
