import { CountryMedalTotal } from '../components/country-medal-total.vm';
import { Kpi } from '../components/kpi.vm';

export interface DashboardPageVm {
  titlePage: string;
  kpis: Kpi[];
  medalTotals: CountryMedalTotal[];
  loading: boolean;
  error: string | null;
}
