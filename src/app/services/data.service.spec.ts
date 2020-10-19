import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CurrenciesEnum } from '../enums/currenciesEnum';
import { ApiService } from './api.service';

import { DataService } from './data.service';
import { StorageManagerService } from './storage-manager.service';

describe('DataService', () => {
  let service: DataService;
  let storageManagerService: StorageManagerService;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        DataService,
        StorageManagerService,
        ApiService,
      ],
    });
    service = TestBed.inject(DataService);
    storageManagerService = TestBed.inject(StorageManagerService);
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return instance of FormGroup from getter currentSearchForm', () => {
    expect(service.currentSearchForm).toBeInstanceOf(FormGroup);
  });

  it('should return instance of FormGroup from getter historicSearchForm', () => {
    expect(service.historicSearchForm).toBeInstanceOf(FormGroup);
  });

  it('should return instance of MatTableDataSource from getter currentDataSource', () => {
    expect(service.currentDataSource).toBeInstanceOf(MatTableDataSource);
  });

  it('should return instance of MatTableDataSource from getter historicDataSource', () => {
    expect(service.historicDataSource).toBeInstanceOf(MatTableDataSource);
  });

  it('should return instance of Array and contain all values from CurrenciesEnum from getter allCurrencies', fakeAsync(() => {
    expect(service.allCurrencies).toEqual(Object.values(CurrenciesEnum) as Array<string>);
  }));

  it('should return instance of CurrenciesEnum from getter baseCurrency', fakeAsync(() => {
    storageManagerService.removeItem('baseCurrency');

    const storageManagerServiceGetItemSpy = spyOn(storageManagerService, 'getItem');
    const storageManagerServiceSetItemSpy = spyOn(storageManagerService, 'setItem');

    tick(100);

    expect(service.baseCurrency in CurrenciesEnum).toBeTrue();
    expect(service.baseCurrency).toEqual(CurrenciesEnum.EUR);
    expect(storageManagerServiceGetItemSpy).toHaveBeenCalledWith('baseCurrency');
    expect(storageManagerServiceSetItemSpy).toHaveBeenCalledWith(
        'baseCurrency',
        CurrenciesEnum.EUR,
    );
  }));

  it('should return instance of CurrenciesEnum from getter chosenCurrency', fakeAsync(() => {
    storageManagerService.removeItem('chosenCurrency');

    const storageManagerServiceGetItemSpy = spyOn(storageManagerService, 'getItem');
    const storageManagerServiceSetItemSpy = spyOn(storageManagerService, 'setItem');

    tick(100);

    expect(service.chosenCurrency in CurrenciesEnum).toBeTrue();
    expect(service.chosenCurrency).toEqual(CurrenciesEnum.USD);
    expect(storageManagerServiceGetItemSpy).toHaveBeenCalledWith('chosenCurrency');
    expect(storageManagerServiceSetItemSpy).toHaveBeenCalledWith(
        'chosenCurrency',
        CurrenciesEnum.USD,
    );
  }));

  it('should return instance of Date from getter maxDate', () => {
    expect(service.maxDate).toBeInstanceOf(Date);
  });

  it('should return instance of Date from getter minDate', () => {
    expect(service.minDate).toBeInstanceOf(Date);
  });

  it('should update maxDate, minDate', fakeAsync(() => {
    const testDate = new Date();
    service.maxDate = testDate;
    service.minDate = testDate;

    tick(100);

    expect(service.maxDate).toEqual(testDate);
    expect(service.minDate).toEqual(testDate);
  }));

  it('should update baseCurrency, chosenCurrency', fakeAsync(() => {
    service.baseCurrency = CurrenciesEnum.EUR;
    service.chosenCurrency = CurrenciesEnum.USD;

    tick(100);

    expect(service.baseCurrency).toEqual(CurrenciesEnum.EUR);

    expect(service.chosenCurrency).toEqual(CurrenciesEnum.USD);
  }));

  it('method _filter should filter to 1 value with given filter "EUR"', () => {
    const testCurrency = CurrenciesEnum.EUR;

    expect(service._filter(testCurrency)).toContain(testCurrency);
  });

  it('method _filter should filter to all values with empty filter value', () => {
    expect(service._filter('').length).toEqual(service.allCurrencies.length);
  });
});
