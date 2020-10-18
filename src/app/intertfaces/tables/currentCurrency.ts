import { CurrenciesEnum } from '../../enums/currenciesEnum';

export interface CurrentCurrency {
  currency: CurrenciesEnum;
  rate: number;
}

export declare type CurrentCurrencies = CurrentCurrency[];
