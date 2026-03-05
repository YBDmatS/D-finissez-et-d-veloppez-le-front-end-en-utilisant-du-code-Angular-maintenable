import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/view-models/kpi.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() public titlePage!: string;
  @Input() public kpis!: Kpi[];
}
