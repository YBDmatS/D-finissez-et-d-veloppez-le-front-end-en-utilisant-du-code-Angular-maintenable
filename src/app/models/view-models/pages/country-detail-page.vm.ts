import { CountryMedalsByYear } from '../components/country-medals-by-year.vm';
import { Kpi } from '../components/kpi.vm';

export interface CountryDetailPageVm {
  titlePage: string;
  kpis: Kpi[];
  countryMedalsByYears: CountryMedalsByYear[];
  loading: boolean;
  error: string | null;
}
