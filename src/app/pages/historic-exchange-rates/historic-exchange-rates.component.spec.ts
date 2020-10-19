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
import { History } from '../../intertfaces/responses/history';
import { HistoryCurrencies } from '../../intertfaces/tables/historyCurrency';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

import { HistoricExchangeRatesComponent } from './historic-exchange-rates.component';

describe('HistoricExchangeRatesComponent', () => {
  let component: HistoricExchangeRatesComponent;
  let fixture: ComponentFixture<HistoricExchangeRatesComponent>;
  let dataService: DataService;
  let apiService: ApiService;
  let matSnackBar: MatSnackBar;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports: [
                     BrowserAnimationsModule,
                     ReactiveFormsModule,
                     HttpClientTestingModule,
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
                     HistoricExchangeRatesComponent,
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
    fixture = TestBed.createComponent(HistoricExchangeRatesComponent);
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

  it('should return instance of FormControl from getter baseCurrencyControl', () => {
    expect(component.baseCurrencyControl).toBeInstanceOf(FormControl);
  });

  it('should return instance of FormControl from getter chosenCurrencyControl', () => {
    expect(component.chosenCurrencyControl).toBeInstanceOf(FormControl);
  });

  it('should return instance of FormControl from getter startDateControl', () => {
    expect(component.startDateControl).toBeInstanceOf(FormControl);
  });

  it('should return instance of FormControl from getter endDateControl', () => {
    expect(component.endDateControl).toBeInstanceOf(FormControl);
  });

  it(
      'should read baseCurrencyControl value and change ' +
      'dataService.baseCurrency if not equal to it triggered by method "currencySelected"',
      fakeAsync(() => {
        component.baseCurrencyControl.setValue(CurrenciesEnum.EUR);
        component.currencySelected();

        tick(100);

        expect(dataService.baseCurrency).toBe(CurrenciesEnum.EUR);

        component.baseCurrencyControl.setValue(CurrenciesEnum.CAD);
        component.currencySelected();

        tick(100);

        expect(dataService.baseCurrency).toBe(CurrenciesEnum.CAD);
      }));

  it('should read chosenCurrencyControl value and change dataService.chosenCurrency if not equal to it triggered by method "currencySelected"', fakeAsync(() => {
    component.chosenCurrencyControl.setValue(CurrenciesEnum.EUR);
    component.currencySelected();

    tick(100);

    expect(dataService.chosenCurrency).toBe(CurrenciesEnum.EUR);

    component.chosenCurrencyControl.setValue(CurrenciesEnum.CAD);
    component.currencySelected();

    tick(100);

    expect(dataService.chosenCurrency).toBe(CurrenciesEnum.CAD);
  }));

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

  it('should have initialized Observable filteredCurrenciesForBase', fakeAsync(() => {
    expect(component.filteredCurrenciesForBase).toBeInstanceOf(Observable);
  }));

  it('should have initialized Observable filteredCurrencies', fakeAsync(() => {
    expect(component.filteredCurrencies).toBeInstanceOf(Observable);
  }));


  it('should reloadData when form ngSubmit is triggered', fakeAsync(() => {
    const history: History = {
      rates: {
        '2020-10-16': {
          CAD: 1.5497,
        },
        '2020-10-17': {
          CAD: 1.5496,
        },
      },
      base: CurrenciesEnum.EUR,
      start_at: '2020-10-16',
      end_at: '2020-10-17',
    };
    const historyCurrencies: HistoryCurrencies = [
      {
        date: '2020-10-16',
        rate: 1.5497,
      },
      {
        date: '2020-10-17',
        rate: 1.5496,
      },
    ];

    component.startDateControl.setValue('2020-10-16');
    component.endDateControl.setValue('2020-10-17');
    component.chosenCurrencyControl.setValue(CurrenciesEnum.CAD);
    component.currencySelected();

    const isLoadingSpy = spyOn(component.isLoading, 'next');
    const baseCurrencyControlDisableSpy = spyOn(component.baseCurrencyControl, 'disable');
    const baseCurrencyControlEnableSpy = spyOn(component.baseCurrencyControl, 'enable');
    const chosenCurrencyControlDisableSpy = spyOn(component.chosenCurrencyControl, 'disable');
    const chosenCurrencyControlEnableSpy = spyOn(component.chosenCurrencyControl, 'enable');
    spyOn(apiService, 'history').and.returnValue(of(history));

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(chosenCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);

    tick(1000);

    expect(component.dataSource.data).toEqual(historyCurrencies);

    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlEnableSpy).toHaveBeenCalled();
    expect(chosenCurrencyControlEnableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(2);
  }));

  it('should show snackBar on error on reloadData', fakeAsync(() => {
    spyOn(apiService, 'history')
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
    const chosenCurrencyControlDisableSpy = spyOn(component.chosenCurrencyControl, 'disable');
    const baseCurrencyControlEnableSpy = spyOn(component.baseCurrencyControl, 'enable');
    const chosenCurrencyControlEnableSpy = spyOn(component.chosenCurrencyControl, 'enable');

    component.reloadData();
    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(chosenCurrencyControlDisableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);

    tick();
    expect(openSnackBarSpy).toHaveBeenCalled();
    expect(isLoadingSpy).toHaveBeenCalled();
    expect(baseCurrencyControlEnableSpy).toHaveBeenCalled();
    expect(chosenCurrencyControlEnableSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);
  }));
});
