import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { CurrenciesEnum } from '../enums/currenciesEnum';
import { Latest } from '../intertfaces/responses/latest';
import { CurrentCurrency } from '../intertfaces/tables/currentCurrency';
import { HistoryCurrency } from '../intertfaces/tables/historyCurrency';
import { FormHelper } from '../utilities/form-helper';
import { ApiService } from './api.service';
import { StorageManagerService } from './storage-manager.service';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnDestroy {
  private dataSources: {
    currentDataSource: MatTableDataSource<CurrentCurrency>,
    historicDataSource: MatTableDataSource<HistoryCurrency>,
  };
  private searchForms: {
    currentSearchForm: FormGroup,
    historicSearchForm: FormGroup,
  };

  constructor(
      private storageManagerService: StorageManagerService,
      private api: ApiService,
  ) {
    this.api.latest()
        .pipe(take(1))
        .subscribe(
            (value: Latest) => {
              this.maxDate = new Date(value.date);
            },
        );

    this.createDataSources();
    this.createSearchForms();
  }

  get currentSearchForm(): FormGroup {
    return this.searchForms.currentSearchForm;
  }

  get historicSearchForm(): FormGroup {
    return this.searchForms.historicSearchForm;
  }

  get currentDataSource(): MatTableDataSource<CurrentCurrency> {
    return this.dataSources.currentDataSource;
  }

  get historicDataSource(): MatTableDataSource<HistoryCurrency> {
    return this.dataSources.historicDataSource;
  }

  get allCurrencies(): Array<string> {
    return Object.values(CurrenciesEnum) as Array<string>;
  }

  get baseCurrency(): CurrenciesEnum {
    let baseCurrency: CurrenciesEnum = this.storageManagerService.getItem('baseCurrency') as CurrenciesEnum;

    if (!baseCurrency) {
      baseCurrency = CurrenciesEnum.EUR;

      this.storageManagerService.setItem(
          'baseCurrency',
          baseCurrency,
      );
    }

    return baseCurrency;
  }

  set baseCurrency(baseCurrency: CurrenciesEnum) {
    this.storageManagerService.setItem(
        'baseCurrency',
        baseCurrency,
    );
  }

  get chosenCurrency(): CurrenciesEnum {
    let chosenCurrency: CurrenciesEnum = this.storageManagerService.getItem('chosenCurrency') as CurrenciesEnum;

    if (!chosenCurrency) {
      chosenCurrency = CurrenciesEnum.USD;

      this.storageManagerService.setItem(
          'chosenCurrency',
          chosenCurrency,
      );
    }

    return chosenCurrency;
  }

  set chosenCurrency(chosenCurrency: CurrenciesEnum) {
    this.storageManagerService.setItem(
        'chosenCurrency',
        chosenCurrency,
    );
  }

  get maxDate(): Date {
    const storedDate: string = this.storageManagerService.getItem('maxDate', 'sessionStorage');
    let maxDate: Date = storedDate ? new Date(storedDate) : undefined;

    if (!storedDate) {
      maxDate = new Date();

      this.storageManagerService.setItem(
          'maxDate',
          maxDate.toJSON(),
          'sessionStorage',
      );
    }

    return maxDate;
  }

  set maxDate(maxDate: Date) {
    this.storageManagerService.setItem(
        'maxDate',
        maxDate.toJSON(),
        'sessionStorage',
    );
  }

  get minDate(): Date {
    const storedDate: string = this.storageManagerService.getItem('minDate');
    let minDate: Date = storedDate ? new Date(storedDate) : undefined;

    if (!storedDate) {
      minDate = new Date('1999-01-01');

      this.storageManagerService.setItem(
          'minDate',
          minDate.toJSON(),
      );
    }

    return minDate;
  }

  set minDate(minDate: Date) {
    this.storageManagerService.setItem(
        'minDate',
        minDate.toJSON(),
    );
  }

  public ngOnDestroy(): void {
    this.dataSources.currentDataSource.disconnect();
    this.dataSources.historicDataSource.disconnect();

    this.dataSources = undefined;
    this.searchForms = undefined;
    this.storageManagerService = undefined;
    this.api = undefined;
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies.filter(
        (option: string) => option.toLowerCase().indexOf(filterValue) === 0,
    );
  }

  private createSearchForms(): void {
    this.searchForms = {
      currentSearchForm: new FormGroup({
        date: new FormControl(undefined),
        baseCurrency: new FormControl(
            this.baseCurrency,
            [
              Validators.required,
              FormHelper.currencyValidator,
            ],
        ),
      }),

      historicSearchForm: new FormGroup({
        baseCurrency: new FormControl(
            this.baseCurrency,
            [
              Validators.required,
              FormHelper.currencyValidator,
            ],
        ),
        chosenCurrency: new FormControl(
            this.chosenCurrency,
            [
              Validators.required,
              FormHelper.currencyValidator,
            ],
        ),
        startDate: new FormControl(
            undefined,
            Validators.required,
        ),
        endDate: new FormControl(
            undefined,
            Validators.required,
        ),
      }),
    };
  }

  private createDataSources(): void {
    this.dataSources = {
      currentDataSource: new MatTableDataSource<CurrentCurrency>([]),
      historicDataSource: new MatTableDataSource<HistoryCurrency>([]),
    };
  }
}
