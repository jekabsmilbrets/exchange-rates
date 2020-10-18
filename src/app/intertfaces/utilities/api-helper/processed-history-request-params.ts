import { ProcessedBaseRequestParams } from './processed-base-request-params';

export interface ProcessedHistoryRequestParams extends ProcessedBaseRequestParams {
  start_at?: string;
  end_at?: string;
}
