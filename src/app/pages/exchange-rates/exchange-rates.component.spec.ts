import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Latest } from '../../intertfaces/responses/latest';
import { CurrentCurrencies } from '../../intertfaces/tables/currentCurrency';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

import { ExchangeRatesComponent } from './exchange-rates.component';

describe('ExchangeRatesComponent', () => {
  let component: ExchangeRatesComponent;
  let fixture: ComponentFixture<ExchangeRatesComponent>;
  let dataService: DataService;
  let apiService: ApiService;
  let matSnackBar: MatSnackBar;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports: [
                     HttpClientTestingModule,
                     BrowserAnimationsModule,
                     ReactiveFormsModule,
                     MatAutocompleteModule,
                     MatDatepickerModule,
                     MatFormFieldModule,
                     MatIconModule,
                     MatInputModule,
                     MatNativeDateModule,
                     MatSelectModule,
                     MatSnackBarModule,
                     MatTableModule,
                     MatToolbarModule,
                     MatTooltipModule,
                     MatPaginatorModule,
                     MatProgressBarModule,
                     MatSnackBarModule,
                   ],
                   declarations: [
                     ExchangeRatesComponent,
                     MatSort,
                     MatPaginator,
                   ],
                   providers: [
                     DataService,
                     ApiService,
                     MatSnackBar,
                     {
                       provide: MAT_DATE_LOCALE,
                       useValue: 'en-GB',
                     },
                   ],
                 })
                 .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRatesComponent);
    component = fixture.componentInstance;

    dataService = TestBed.inject(DataService);
    apiService = TestBed.inject(ApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return instance of FormGroup from getter searchForm', () => {
    expect(component.searchForm).toBeInstanceOf(FormGroup);
  });

  it('should return instance of MatTableDataSource from getter dataSource', () => {
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
  });

  it('should return instance of Date from getter maxDate', () => {
    expect(component.maxDate).toBeInstanceOf(Date);
  });

  it('should return instance of Date from getter minDate', () => {
    expect(component.minDate).toBeInstanceOf(Date);
  });

  it('should return instance of FormControl from getter dateControl', () => {
    expect(component.dateControl).toBeInstanceOf(FormControl);
  });

  it('should return instance of FormControl from getter baseCurrencyControl', () => {
    expect(component.baseCurrencyControl).toBeInstanceOf(FormControl);
  });

  it(
      'should read baseCurrencyControl value and change dataService.baseCurrency if not equal to it triggered by method "currencySelected"',
      fakeAsync(() => {
        component.baseCurrencyControl.setValue(CurrenciesEnum.EUR);
        component.currencySelected();

        tick(100);
        expect(dataService.baseCurrency).toBe(CurrenciesEnum.EUR);

        component.baseCurrencyControl.setValue(CurrenciesEnum.CAD);
        component.currencySelected();

        tick(100);

        expect(dataService.baseCurrency).toBe(CurrenciesEnum.CAD);
      }),
  );

  it('should have initialized and attached MatPaginator to DataSource', fakeAsync(() => {
    expect(component.paginator).toBeInstanceOf(MatPaginator);
    expect(component.dataSource.paginator).toBeInstanceOf(MatPaginator);
  }));

  it('should have initialized and attached MatSort to DataSource', fakeAsync(() => {
    expect(component.sort).toBeInstanceOf(MatSort);
    expect(component.dataSource.sort).toBeInstanceOf(MatSort);
  }));

  it('should have initialized BehaviorSubject isLoading', fakeAsync(() => {
    expect(component.isLoading).toBeInstanceOf(BehaviorSubject);
  }));

  it('should have initialized Observable filteredCurrencies', fakeAsync(() => {
    expect(component.filteredCurrencies).toBeInstanceOf(Observable);
  }));

  it('should reloadData when form ngSubmit is triggered', fakeAsync(() => {
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
    const currentCurrencies: CurrentCurrencies = [
      {
        rate: 1.5497,
        currency: CurrenciesEnum.CAD,
      },
      {
        rate: 9.0993,
        currency: CurrenciesEnum.HKD,
      },
      {
        rate: 163.2,
        currency: CurrenciesEnum.ISK,
      },
      {
        rate: 57.148,
        currency: CurrenciesEnum.PHP,
      },
    ];

    const isLoadingSpy = spyOn(component.isLoading, 'next');
    const baseCurrencyControlDisableSpy = spyOn(component.baseCurrencyControl, 'disable');
    const baseCurrencyControlEnableSpy = spyOn(component.baseCurrencyControl, 'enable');
    spyOn(apiService, 'latest').and.returnValue(of(latest));

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);

    tick(1000);

    expect(component.dataSource.data).toEqual(currentCurrencies);

    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlEnableSpy).toHaveBeenCalled();
  }));

  it('should show snackBar on error on reloadData', fakeAsync(() => {
    spyOn(apiService, 'latest')
        .and
        .returnValue(
            throwError({
              error: {
                error: 'There is no data for dates older then 1999-01-04.',
              },
              status: 400,
            }),
        );

    const isLoadingSpy = spyOn(component.isLoading, 'next');
    const openSnackBarSpy = spyOn(matSnackBar, 'open');
    const baseCurrencyControlDisableSpy = spyOn(component.baseCurrencyControl, 'disable');
    const baseCurrencyControlEnableSpy = spyOn(component.baseCurrencyControl, 'enable');

    component.reloadData();
    expect(baseCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(isLoadingSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);

    tick();

    expect(openSnackBarSpy).toHaveBeenCalled();
    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlEnableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);
  }));
});
