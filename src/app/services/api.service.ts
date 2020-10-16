import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from '../intertfaces/responses/history';
import { Latest } from '../intertfaces/responses/latest';
import { BaseRequestParams } from '../intertfaces/utils/baseRequestParams';
import { HistoryRequestParams } from '../intertfaces/utils/historyRequestParams';

export interface RequestOptions {
  headers?: any;
  params?: any;
  responseType?: any;
  observe?: any;
  reportProgress?: any;
  body?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.exchangeratesapi.io';

  constructor(
      private http: HttpClient,
  ) {
  }

  private static processBaseRequestParams(params: BaseRequestParams) {
    let outputParams: {
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

  private static processHistoryRequestParams(params: HistoryRequestParams) {
    let outputParams: {
      start_at?: string;
      end_at?: string;
    } = {};

    if (Object.keys(params).includes('start_at')) {
      outputParams.start_at = params.start_at;
    }

    if (Object.keys(params).includes('end_at')) {
      outputParams.end_at = params.end_at;
    }

    outputParams = {...outputParams, ...ApiService.processBaseRequestParams(params)};

    return Object.keys(outputParams).length > 0 ? outputParams : undefined;
  }

  public latest(params?: BaseRequestParams, date?: string): Observable<Latest> {
    let url = `${this.baseUrl}/${(date ?? 'latest')}`;

    let options: RequestOptions = {};

    if (params) {
      options.params = ApiService.processBaseRequestParams(params);
    }

    return this.http.get(url, options) as Observable<Latest>;
  }

  public history(params: HistoryRequestParams): Observable<History> {
    let url = this.baseUrl + '/history';

    let options: RequestOptions = {};

    if (params) {
      options.params = ApiService.processHistoryRequestParams(params);
    }

    return this.http.get(url, options) as Observable<History>;
  }
}
