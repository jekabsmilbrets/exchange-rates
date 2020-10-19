import { CurrenciesEnum } from '../enums/currenciesEnum';
import { ProcessedBaseRequestParams } from '../intertfaces/utilities/api-helper/processed-base-request-params';
import { ProcessedHistoryRequestParams } from '../intertfaces/utilities/api-helper/processed-history-request-params';
import { BaseRequestParams } from '../intertfaces/utilities/baseRequestParams';
import { HistoryRequestParams } from '../intertfaces/utilities/historyRequestParams';
import { ApiHelper } from './api-helper';

describe('ApiHelper', () => {
  it('should create an instance', () => {
    expect(new ApiHelper()).toBeTruthy();
  });

  it('should return ProcessedBaseRequestParams ', () => {
    const params: BaseRequestParams = {
      symbols: [
        CurrenciesEnum.BRL,
        CurrenciesEnum.AUD,
      ],
      base: CurrenciesEnum.CAD,
    };

    const processedParams: ProcessedBaseRequestParams = {
      symbols: [
        CurrenciesEnum.BRL,
        CurrenciesEnum.AUD,
      ].join(','),
      base: CurrenciesEnum.CAD,
    };

    expect(ApiHelper.processBaseRequestParams(params)).toEqual(processedParams);
  });

  it('should return ProcessedHistoryRequestParams ', () => {
    const params: HistoryRequestParams = {
      symbols: [
        CurrenciesEnum.BRL,
        CurrenciesEnum.AUD,
      ],
      base: CurrenciesEnum.CAD,
      start_at: '2020-01-01',
      end_at: '2020-01-03',
    };

    const processedParams: ProcessedHistoryRequestParams = {
      symbols: [
        CurrenciesEnum.BRL,
        CurrenciesEnum.AUD,
      ].join(','),
      base: CurrenciesEnum.CAD,
      start_at: '2020-01-01',
      end_at: '2020-01-03',
    };

    expect(ApiHelper.processHistoryRequestParams(params)).toEqual(processedParams);
  });

});
