import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from '../intertfaces/responses/history';
import { Latest } from '../intertfaces/responses/latest';
import { RequestOptions } from '../intertfaces/utilities/api-helper/request-options';
import { BaseRequestParams } from '../intertfaces/utilities/baseRequestParams';
import { HistoryRequestParams } from '../intertfaces/utilities/historyRequestParams';
import { ApiHelper } from '../utilities/api-helper';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.exchangeratesapi.io';

  constructor(
      private http: HttpClient,
  ) {
  }

  public latest(params?: BaseRequestParams, date?: string): Observable<Latest> {
    const url = `${this.baseUrl}/${(date ?? 'latest')}`;
    const options: RequestOptions = {};

    if (params) {
      options.params = ApiHelper.processBaseRequestParams(params);
    }

    return this.http.get(url, options) as Observable<Latest>;
  }

  public history(params: HistoryRequestParams): Observable<History> {
    const url = this.baseUrl + '/history';
    const options: RequestOptions = {};

    if (params) {
      options.params = ApiHelper.processHistoryRequestParams(params);
    }

    return this.http.get(url, options) as Observable<History>;
  }
}
