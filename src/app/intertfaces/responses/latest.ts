import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Rates } from '../utils/rates';

export interface Latest {
  rates: Rates;
  base: CurrenciesEnum;
  date: string; // Date in YYYY-MM-DD format
}
