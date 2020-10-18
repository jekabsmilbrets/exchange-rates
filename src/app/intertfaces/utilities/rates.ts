import { CurrenciesEnum } from '../../enums/currenciesEnum';

export type Rates = { [key in CurrenciesEnum]?: number; };
