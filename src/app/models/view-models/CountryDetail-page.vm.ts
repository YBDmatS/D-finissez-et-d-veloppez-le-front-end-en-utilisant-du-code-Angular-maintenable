import { CountryMedalsByYear } from './CountryMedalsByYear.vm';
import { Kpi } from './kpi.vm';

export interface CountryDetailPageVm {
  titlePage: string;
  kpis: Kpi[];
  countryMedalsByYears: CountryMedalsByYear[];
  loading: boolean;
  error: string | null;
}
