import { CountryMedalTotal } from './CountryMedalTotal.vm';
import { Kpi } from './kpi.vm';

export interface DashboardPageVm {
  titlePage: string;
  kpis: Kpi[];
  medalTotals: CountryMedalTotal[];
  loading: boolean;
  error: string | null;
}
