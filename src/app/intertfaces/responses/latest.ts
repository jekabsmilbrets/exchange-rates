import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Rates } from '../utilities/rates';

export interface Latest {
  rates: Rates;
  base: CurrenciesEnum;
  date: string; // Date in YYYY-MM-DD format
}
