import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Latest } from '../../intertfaces/responses/latest';
import { CurrentCurrencies, CurrentCurrency } from '../../intertfaces/tables/currentCurrency';
import { BaseRequestParams } from '../../intertfaces/utilities/baseRequestParams';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { FormHelper } from '../../utilities/form-helper';

@Component({
  selector: 'page-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit, OnDestroy, AfterViewInit {
  public filteredCurrencies: Observable<string[]>;

  public readonly displayedColumns = [
    'currency',
    'rate',
  ];

  public isLoading: BehaviorSubject<boolean>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      private snackBar: MatSnackBar,
      private api: ApiService,
      private dataService: DataService,
  ) {
    this.isLoading = new BehaviorSubject<boolean>(false);
  }

  public get searchForm(): FormGroup {
    return this.dataService.currentSearchForm;
  }

  public get dataSource(): MatTableDataSource<CurrentCurrency> {
    return this.dataService.currentDataSource;
  }

  public get maxDate(): Date {
    return this.dataService.maxDate;
  }

  public get minDate(): Date {
    return this.dataService.minDate;
  }

  public get dateControl(): FormControl {
    return this.searchForm?.controls?.date as FormControl;
  }

  public get baseCurrencyControl(): FormControl {
    return this.searchForm?.controls?.baseCurrency as FormControl;
  }

  public ngOnInit(): void {
    this.filteredCurrencies = this.baseCurrencyControl.valueChanges
                                  .pipe(
                                      startWith(this.dataService.baseCurrency),
                                      distinctUntilChanged(),
                                      map(value => this.dataService._filter(value)),
                                  );
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public ngOnDestroy(): void {
    this.filteredCurrencies = undefined;
    this.isLoading = undefined;
    this.sort = undefined;
    this.paginator = undefined;
    this.api = undefined;
    this.snackBar = undefined;
    this.dataService = undefined;
  }

  public reloadData(): void {
    this.isLoading.next(true);

    this.baseCurrencyControl.disable();
    this.snackBar.dismiss();
    this.dataSource.data = [];

    const postSearch = (error?: string): void => {
      this.isLoading.next(false);

      this.baseCurrencyControl.enable();

      if (error) {
        this.snackBar.open(error);
      }
    };

    const params: BaseRequestParams = {
      base: this.dataService.baseCurrency,
    };

    const date = FormHelper.getDateFromControl(this.dateControl);

    this.api.latest(params, date)
        .pipe(
            take(1),
            delay(250), // Adding little delay to minimize element flashing
        )
        .subscribe(
            (value: Latest) => {
              const currentCurrencies: CurrentCurrencies = [];

              for (const displayedColumnsKey of Object.keys(value.rates)) {
                currentCurrencies.push({
                  rate: value.rates[displayedColumnsKey],
                  currency: CurrenciesEnum[displayedColumnsKey],
                } as CurrentCurrency);
              }

              this.dataSource.data = currentCurrencies;
            },
            (error) => postSearch(error.error.error),
            () => postSearch(),
        );
  }

  public currencySelected(): void {
    const value: CurrenciesEnum = this.baseCurrencyControl.value;

    if (value !== this.dataService.baseCurrency) {
      this.dataService.baseCurrency = CurrenciesEnum[value];
    }
  }
}
