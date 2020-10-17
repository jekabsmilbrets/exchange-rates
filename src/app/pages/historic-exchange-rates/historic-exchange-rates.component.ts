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
import { HistoryCurrencies, HistoryCurrency } from '../../intertfaces/Tables/historyCurrency';
import { HistoryRequestParams } from '../../intertfaces/utils/historyRequestParams';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { FormHelper } from '../../utilities/form-helper';

@Component({
  selector: 'page-historic-exchange-rates',
  templateUrl: './historic-exchange-rates.component.html',
  styleUrls: ['./historic-exchange-rates.component.scss'],
})
export class HistoricExchangeRatesComponent implements OnInit, OnDestroy, AfterViewInit {
  public maxDate: Date;
  public minDate: Date;

  public searchForm: FormGroup;

  public filteredCurrenciesForBase: Observable<string[]>;
  public filteredCurrencies: Observable<string[]>;

  public readonly displayedColumns = [
    'date',
    'rate',
  ];
  public dataSource: MatTableDataSource<HistoryCurrency>;

  public isLoading: BehaviorSubject<boolean>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      private api: ApiService,
      private snackBar: MatSnackBar,
      private dataService: DataService,
  ) {
    this.isLoading = new BehaviorSubject<boolean>(false);

    this.maxDate = this.dataService.maxDate;
    this.minDate = this.dataService.minDate;

    this.searchForm = this.dataService.historicSearchForm;
    this.dataSource = this.dataService.historicDataSource;
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
    this.maxDate = undefined;
    this.minDate = undefined;
    this.searchForm = undefined;
    this.filteredCurrenciesForBase = undefined;
    this.filteredCurrencies = undefined;
    this.dataSource = undefined;
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
    this.preSearch();

    const params: HistoryRequestParams = {
      base: this.dataService.baseCurrency,
      symbols: [this.dataService.chosenCurrency],
      start_at: FormHelper.getDateFromControl(this.startDateControl),
      end_at: FormHelper.getDateFromControl(this.endDateControl),
    };

    if (!params.start_at || !params.end_at || params.start_at === params.end_at) {
      if (params.start_at === params.end_at) {
        this.snackBar.open(
            'Date Range must be more than 1 day!',
            undefined,
            {
              duration: 1000,
            },
        );
      }

      this.isLoading.next(false);
      this.enableControls();
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
            (error) => this.postSearch(error.error.error),
            () => this.postSearch(),
        );
  }

  private disableControls(): void {
    this.baseCurrencyControl.disable();
    this.chosenCurrencyControl.disable();
  }

  private enableControls(): void {
    this.baseCurrencyControl.enable();
    this.chosenCurrencyControl.enable();
  }

  private preSearch(): void {
    this.isLoading.next(true);

    this.disableControls();

    this.snackBar.dismiss();
    this.dataSource.data = [];
  }

  private postSearch(error?: string): void {
    this.isLoading.next(false);

    this.baseCurrencyControl.enable();
    this.chosenCurrencyControl.enable();

    if (error) {
      this.snackBar.open(error);
    }
  }
}
