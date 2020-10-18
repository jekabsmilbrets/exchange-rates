import { BaseRequestParams } from './baseRequestParams';

export interface HistoryRequestParams extends BaseRequestParams {
  start_at: string; // Start Date in YYYY-MM-DD format
  end_at: string; // End Date in YYYY-MM-DD format
}
