import { CurrenciesEnum } from '../../enums/currenciesEnum';

export interface Rate {
  currency: CurrenciesEnum;
  rate: number;
}

export declare type Rates = Rate[];
