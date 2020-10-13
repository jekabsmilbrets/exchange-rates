import { BaseRequestParams } from './baseRequestParams';

export interface HistoricRequestParams extends BaseRequestParams{
  start_at: string; // Start Date in YYYY-MM-DD format
  end_at: string; // End Date in YYYY-MM-DD format
}
