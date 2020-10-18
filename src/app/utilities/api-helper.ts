import { ProcessedBaseRequestParams } from '../intertfaces/utilities/api-helper/processed-base-request-params';
import { ProcessedHistoryRequestParams } from '../intertfaces/utilities/api-helper/processed-history-request-params';
import { BaseRequestParams } from '../intertfaces/utilities/baseRequestParams';
import { HistoryRequestParams } from '../intertfaces/utilities/historyRequestParams';

export class ApiHelper {
  public static processBaseRequestParams(params: BaseRequestParams): ProcessedBaseRequestParams {
    const outputParams: {
      symbols?: string;
      base?: string;
    } = {};

    if (Object.keys(params).includes('symbols')) {
      outputParams.symbols = params.symbols.join(',');
    }

    if (Object.keys(params).includes('base')) {
      outputParams.base = params.base;
    }

    return Object.keys(outputParams).length > 0 ? outputParams : undefined;
  }

  public static processHistoryRequestParams(params: HistoryRequestParams): ProcessedHistoryRequestParams {
    let outputParams: ProcessedHistoryRequestParams = {};

    if (Object.keys(params).includes('start_at')) {
      outputParams.start_at = params.start_at;
    }

    if (Object.keys(params).includes('end_at')) {
      outputParams.end_at = params.end_at;
    }

    outputParams = {...ApiHelper.processBaseRequestParams(params), ...outputParams};

    return Object.keys(outputParams).length > 0 ? outputParams : undefined;
  }
}
