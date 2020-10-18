import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { DateRates } from '../utilities/dateRates';

export interface History {
  start_at: string; // Start Date in YYYY-MM-DD format
  end_at: string; // End Date in YYYY-MM-DD format
  base: CurrenciesEnum;
  rates: DateRates;
}
