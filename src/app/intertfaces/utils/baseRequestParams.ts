import { CurrenciesEnum } from '../../enums/currenciesEnum';

export interface BaseRequestParams {
  symbols?: Array<CurrenciesEnum>;
  base?: CurrenciesEnum;
}
