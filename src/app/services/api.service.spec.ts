import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { CurrenciesEnum } from '../enums/currenciesEnum';
import { History } from '../intertfaces/responses/history';
import { Latest } from '../intertfaces/responses/latest';
import { BaseRequestParams } from '../intertfaces/utilities/baseRequestParams';
import { HistoryRequestParams } from '../intertfaces/utilities/historyRequestParams';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const testAPIUrl = 'https://api.exchangeratesapi.io';
  const testDate = '2020-10-16';
  const testSymbols = [
    CurrenciesEnum.CAD,
    CurrenciesEnum.GBP,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
      `should fetch Latest Exchange Rates as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {

                const latest: Latest = {
                  rates: {
                    CAD: 1.5497,
                    HKD: 9.0993,
                    ISK: 163.2,
                    PHP: 57.148,
                  },
                  base: CurrenciesEnum.EUR,
                  date: '2020-10-16',
                };


                service.latest()
                       .subscribe((value: Latest) => {
                         expect(value.base).toBe(CurrenciesEnum.EUR);
                         expect(value.rates.CAD).toBeTruthy();
                       });

                let req = httpMock.expectOne(testAPIUrl + '/latest');
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Latest Exchange Rates for Specific Date as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: Latest = {
                  rates: {
                    CAD: 1.5497,
                    HKD: 9.0993,
                    ISK: 163.2,
                    PHP: 57.148,
                  },
                  base: CurrenciesEnum.EUR,
                  date: testDate,
                };


                service.latest(undefined, testDate)
                       .subscribe(
                           (value: Latest) => {
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.rates.CAD).toBeTruthy();
                             expect(value.date).toBe(testDate);
                           },
                       );

                let req = httpMock.expectOne(testAPIUrl + '/' + testDate);
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Latest Exchange Rates for Specific Base Currency as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: Latest = {
                  rates: {
                    CAD: 1.5497,
                    HKD: 9.0993,
                    ISK: 163.2,
                    PHP: 57.148,
                  },
                  base: CurrenciesEnum.EUR,
                  date: testDate,
                };
                const params: BaseRequestParams = {
                  base: CurrenciesEnum.EUR,
                };

                service.latest(params)
                       .subscribe(
                           (value: Latest) => {
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.rates.CAD).toBeTruthy();
                             expect(value.date).toBe(testDate);
                           },
                       );

                let req = httpMock.expectOne(testAPIUrl + '/latest?base=' + CurrenciesEnum.EUR);
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Latest Exchange Rates for Specific Currency symbols as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: Latest = {
                  rates: {
                    CAD: 1.5497,
                    HKD: 9.0993,
                  },
                  base: CurrenciesEnum.EUR,
                  date: testDate,
                };
                const params: BaseRequestParams = {
                  symbols: testSymbols,
                };

                service.latest(params)
                       .subscribe(
                           (value: Latest) => {
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.rates.CAD).toBeTruthy();
                             expect(value.rates.HKD).toBeTruthy();
                             expect(value.date).toBe(testDate);
                           },
                       );

                let req = httpMock.expectOne(testAPIUrl + '/latest?symbols=' + testSymbols.join(','));
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Latest Exchange Rates for Specific Currency symbols, Specific Date and Specific Base Currency as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: Latest = {
                  rates: {
                    CAD: 1.5497,
                    HKD: 9.0993,
                  },
                  base: CurrenciesEnum.EUR,
                  date: testDate,
                };
                const params: BaseRequestParams = {
                  symbols: testSymbols,
                  base: CurrenciesEnum.EUR,
                };

                service.latest(params, testDate)
                       .subscribe(
                           (value: Latest) => {
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.rates.CAD).toBeTruthy();
                             expect(value.rates.HKD).toBeTruthy();
                             expect(value.date).toBe(testDate);
                           },
                       );

                let req = httpMock.expectOne(
                    'https://api.exchangeratesapi.io/' +
                    testDate +
                    '?symbols=' +
                    testSymbols.join(',') +
                    '&base=' +
                    CurrenciesEnum.EUR,
                );
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Historic Exchange Rates for Specified Date Range as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: History = {
                  rates: {
                    '2018-01-03': {
                      CAD: 1.5047,
                      GBP: 0.8864,
                    },
                    '2018-01-02': {
                      CAD: 1.5128,
                      GBP: 0.88953,
                    },
                    '2018-01-04': {
                      CAD: 1.5114,
                      GBP: 0.89103,
                    },
                  },
                  start_at: '2018-01-02',
                  base: CurrenciesEnum.EUR,
                  end_at: '2018-01-04',
                };

                const params: HistoryRequestParams = {
                  start_at: '2018-01-02',
                  end_at: '2018-01-04',
                };

                service.history(params)
                       .subscribe(
                           (value: History) => {
                             expect(value.rates['2018-01-04']).toBeTruthy();
                             expect(value.rates['2018-01-04'].CAD).toBeTruthy();
                             expect(value.rates['2018-01-04'].GBP).toBeTruthy();
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.start_at).toBe('2018-01-02');
                             expect(value.end_at).toBe('2018-01-04');
                           },
                       );

                let req = httpMock.expectOne(
                    testAPIUrl +
                    '/history?start_at=2018-01-02&end_at=2018-01-04',
                );
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Historic Exchange Rates for Specified Date Range, Specified Base Currency as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: History = {
                  rates: {
                    '2018-01-03': {
                      CAD: 1.5047,
                      GBP: 0.8864,
                    },
                    '2018-01-02': {
                      CAD: 1.5128,
                      GBP: 0.88953,
                    },
                    '2018-01-04': {
                      CAD: 1.5114,
                      GBP: 0.89103,
                    },
                  },
                  start_at: '2018-01-02',
                  base: CurrenciesEnum.EUR,
                  end_at: '2018-01-04',
                };

                const params: HistoryRequestParams = {
                  start_at: '2018-01-02',
                  end_at: '2018-01-04',
                  base: CurrenciesEnum.EUR,
                };


                service.history(params)
                       .subscribe(
                           (value: History) => {
                             expect(value.rates['2018-01-04']).toBeTruthy();
                             expect(value.rates['2018-01-04'].CAD).toBeTruthy();
                             expect(value.rates['2018-01-04'].GBP).toBeTruthy();
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.start_at).toBe('2018-01-02');
                             expect(value.end_at).toBe('2018-01-04');
                           },
                       );

                let req = httpMock.expectOne(
                    testAPIUrl +
                    '/history?base=' +
                    CurrenciesEnum.EUR +
                    '&start_at=2018-01-02&end_at=2018-01-04',
                );
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Historic Exchange Rates for Specified Date Range, Specified Currency symbols as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: History = {
                  rates: {
                    '2018-01-03': {
                      CAD: 1.5047,
                      GBP: 0.8864,
                    },
                    '2018-01-02': {
                      CAD: 1.5128,
                      GBP: 0.88953,
                    },
                    '2018-01-04': {
                      CAD: 1.5114,
                      GBP: 0.89103,
                    },
                  },
                  start_at: '2018-01-02',
                  base: CurrenciesEnum.EUR,
                  end_at: '2018-01-04',
                };

                const params: HistoryRequestParams = {
                  start_at: '2018-01-02',
                  end_at: '2018-01-04',
                  symbols: testSymbols,
                };


                service.history(params)
                       .subscribe(
                           (value: History) => {
                             expect(value.rates['2018-01-04']).toBeTruthy();
                             expect(value.rates['2018-01-04'].CAD).toBeTruthy();
                             expect(value.rates['2018-01-04'].GBP).toBeTruthy();
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.start_at).toBe('2018-01-02');
                             expect(value.end_at).toBe('2018-01-04');
                           },
                       );

                let req = httpMock.expectOne(
                    testAPIUrl +
                    '/history?symbols=' +
                    testSymbols.join(',') +
                    '&start_at=2018-01-02&end_at=2018-01-04',
                );
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );

  it(
      `should fetch Historic Exchange Rates for Specified Date Range, Specified Base Currency, Specified Currency symbols as an Observable`,
      waitForAsync(
          inject(
              [
                HttpTestingController,
                ApiService,
              ],
              (httpClient: HttpTestingController, service: ApiService) => {
                const latest: History = {
                  rates: {
                    '2018-01-03': {
                      CAD: 1.5047,
                      GBP: 0.8864,
                    },
                    '2018-01-02': {
                      CAD: 1.5128,
                      GBP: 0.88953,
                    },
                    '2018-01-04': {
                      CAD: 1.5114,
                      GBP: 0.89103,
                    },
                  },
                  start_at: '2018-01-02',
                  base: CurrenciesEnum.EUR,
                  end_at: '2018-01-04',
                };

                const params: HistoryRequestParams = {
                  start_at: '2018-01-02',
                  end_at: '2018-01-04',
                  symbols: testSymbols,
                  base: CurrenciesEnum.EUR,
                };

                service.history(params)
                       .subscribe(
                           (value: History) => {
                             expect(value.rates['2018-01-04']).toBeTruthy();
                             expect(value.rates['2018-01-04'].CAD).toBeTruthy();
                             expect(value.rates['2018-01-04'].GBP).toBeTruthy();
                             expect(value.base).toBe(CurrenciesEnum.EUR);
                             expect(value.start_at).toBe('2018-01-02');
                             expect(value.end_at).toBe('2018-01-04');
                           },
                       );

                let req = httpMock.expectOne(
                    testAPIUrl +
                    '/history?symbols=' +
                    testSymbols.join(',') +
                    '&base=' +
                    CurrenciesEnum.EUR +
                    '&start_at=2018-01-02&end_at=2018-01-04',
                );
                expect(req.request.method).toBe('GET');

                req.flush(latest);
                httpMock.verify();
              },
          ),
      ),
  );
});
