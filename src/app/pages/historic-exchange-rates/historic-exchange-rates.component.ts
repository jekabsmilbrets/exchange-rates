import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { History } from '../../intertfaces/responses/history';
import { HistoryCurrencies, HistoryCurrency } from '../../intertfaces/tables/historyCurrency';
import { HistoryRequestParams } from '../../intertfaces/utilities/historyRequestParams';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { FormHelper } from '../../utilities/form-helper';

@Component({
  selector: 'page-historic-exchange-rates',
  templateUrl: './historic-exchange-rates.component.html',
  styleUrls: ['./historic-exchange-rates.component.scss'],
})
export class HistoricExchangeRatesComponent implements OnInit, OnDestroy, AfterViewInit {
  public filteredCurrenciesForBase: Observable<string[]>;
  public filteredCurrencies: Observable<string[]>;

  public readonly displayedColumns = [
    'date',
    'rate',
  ];

  public isLoading: BehaviorSubject<boolean>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      private api: ApiService,
      private snackBar: MatSnackBar,
      private dataService: DataService,
  ) {
    this.isLoading = new BehaviorSubject<boolean>(false);
  }

  public get searchForm(): FormGroup {
    return this.dataService.historicSearchForm;
  }

  public get dataSource(): MatTableDataSource<HistoryCurrency> {
    return this.dataService.historicDataSource;
  }

  public get maxDate(): Date {
    return this.dataService.maxDate;
  }

  public get minDate(): Date {
    return this.dataService.minDate;
  }

  public get baseCurrencyControl(): FormControl {
    return this.searchForm?.controls?.baseCurrency as FormControl;
  }

  public get chosenCurrencyControl(): FormControl {
    return this.searchForm?.controls?.chosenCurrency as FormControl;
  }

  public get startDateControl(): FormControl {
    return this.searchForm?.controls?.startDate as FormControl;
  }

  public get endDateControl(): FormControl {
    return this.searchForm?.controls?.endDate as FormControl;
  }

  public ngOnDestroy(): void {
    this.filteredCurrenciesForBase = undefined;
    this.filteredCurrencies = undefined;
    this.isLoading = undefined;
    this.sort = undefined;
    this.paginator = undefined;
    this.api = undefined;
    this.snackBar = undefined;
    this.dataService = undefined;
  }

  public ngOnInit(): void {
    this.filteredCurrenciesForBase = this.baseCurrencyControl.valueChanges
                                         .pipe(
                                             startWith(this.dataService.baseCurrency),
                                             distinctUntilChanged(),
                                             map(value => this.dataService._filter(value)),
                                         );
    this.filteredCurrencies = this.chosenCurrencyControl.valueChanges
                                  .pipe(
                                      startWith(this.dataService.chosenCurrency),
                                      distinctUntilChanged(),
                                      map(value => this.dataService._filter(value)),
                                  );
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date':
          return new Date(item.date);

        default:
          return item[property];
      }
    };
  }

  public currencySelected(): void {
    const checks: Array<{
      value: CurrenciesEnum,
      dataServiceKey: string
    }> = [
      {
        value: this.chosenCurrencyControl.value,
        dataServiceKey: 'chosenCurrency',
      },
      {
        value: this.baseCurrencyControl.value,
        dataServiceKey: 'baseCurrency',
      },
    ];

    checks.forEach(
        (check) => {
          if (check.value !== this.dataService[check.dataServiceKey]) {
            this.dataService[check.dataServiceKey] = CurrenciesEnum[check.value];
          }
        },
    );
  }

  public reloadData(): void {
    this.isLoading.next(true);

    this.baseCurrencyControl.disable();
    this.chosenCurrencyControl.disable();

    this.snackBar.dismiss();
    this.dataSource.data = [];

    const postSearch = (error?: string): void => {
      this.isLoading.next(false);

      this.baseCurrencyControl.enable();
      this.chosenCurrencyControl.enable();

      if (error) {
        this.snackBar.open(error);
      }
    };

    const params: HistoryRequestParams = {
      base: this.dataService.baseCurrency,
      symbols: [this.dataService.chosenCurrency],
      start_at: FormHelper.getDateFromControl(this.startDateControl),
      end_at: FormHelper.getDateFromControl(this.endDateControl),
    };

    if (!params.start_at || !params.end_at || params.start_at === params.end_at) {
      const error = params.start_at === params.end_at ? 'Date Range must be more than 1 day!' : undefined;

      postSearch(error);

      return;
    }

    this.api.history(params)
        .pipe(
            take(1),
            delay(250), // Adding little delay to minimize element flashing
        )
        .subscribe(
            (value: History) => {
              const historyCurrencies: HistoryCurrencies = [];

              for (const date of Object.keys(value.rates)) {
                historyCurrencies.push({
                  date,
                  rate: value.rates[date][this.dataService.chosenCurrency],
                } as HistoryCurrency);
              }

              this.dataSource.data = historyCurrencies;
            },
            (error) => postSearch(error.error.error),
            () => postSearch(),
        );
  }
}
