import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
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
  public baseCurrencyControl: FormControl;
  public chosenCurrencyControl: FormControl;

  public maxDate: Date;
  public startDateControl: FormControl;
  public endDateControl: FormControl;

  public filteredCurrenciesForBase: Observable<string[]>;
  public filteredCurrencies: Observable<string[]>;

  public readonly displayedColumns = [
    'date',
    'rate',
  ];
  public dataSource: MatTableDataSource<HistoryCurrency>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];

  constructor(
      private api: ApiService,
      private _snackBar: MatSnackBar,
      private dataService: DataService,
  ) {
    this.baseCurrencyControl = new FormControl(this.dataService.baseCurrency);

    this.chosenCurrencyControl = new FormControl(this.dataService.chosenCurrency);

    this.maxDate = this.dataService.maxDate;
    this.startDateControl = new FormControl(new Date());
    this.endDateControl = new FormControl(new Date());

    this.dataSource = new MatTableDataSource<HistoryCurrency>([]);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(
        (subscription: Subscription) => subscription.unsubscribe(),
    );
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

    this.subscriptions.push(
        this.endDateControl.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(() => this.reloadData()),
    );
  }

  public ngAfterViewInit() {
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
    let chosenCurrency = this.chosenCurrencyControl.value;

    if (
        chosenCurrency in CurrenciesEnum &&
        chosenCurrency !== this.dataService.chosenCurrency
    ) {
      this.dataService.chosenCurrency = CurrenciesEnum[chosenCurrency];

      this.reloadData();

      return;
    }

    let baseCurrency = this.baseCurrencyControl.value;

    if (
        baseCurrency in CurrenciesEnum &&
        baseCurrency !== this.dataService.baseCurrency
    ) {
      this.dataService.baseCurrency = CurrenciesEnum[baseCurrency];

      this.reloadData();
    }
  }

  public reloadData(): void {
    this.disableControls();
    this._snackBar.dismiss();
    this.dataSource.data = [];

    let params: HistoryRequestParams = {
      base: this.dataService.baseCurrency,
      symbols: [this.dataService.chosenCurrency],
      start_at: FormHelper.getDateFromControl(this.startDateControl),
      end_at: FormHelper.getDateFromControl(this.endDateControl),
    };

    if (!params.start_at || !params.end_at || params.start_at === params.end_at) {
      if (params.start_at === params.end_at) {
        this._snackBar.open(
            'Date Range must be more than 1 day!',
            undefined,
            {
              duration: 1000,
            },
        );
      }

      this.enableControls();
      return;
    }

    this.api.history(params)
        .pipe(take(1))
        .subscribe(
            (value: History) => {
              let historyCurrencies: HistoryCurrencies = [];

              for (const date of Object.keys(value.rates)) {
                historyCurrencies.push({
                  date: date,
                  rate: value.rates[date][this.dataService.chosenCurrency],
                } as HistoryCurrency);
              }

              this.dataSource.data = historyCurrencies;
            },
            (error) => {
              console.log('Problems loading data ', error);

              this._snackBar.open(error.error.error);
              this.enableControls();
            },
            () => this.enableControls(),
        );
  }

  private disableControls(): void {
    this.baseCurrencyControl.disable();
    this.chosenCurrencyControl.disable();
    this.startDateControl.disable();
    this.endDateControl.disable();
  }

  private enableControls(): void {
    this.baseCurrencyControl.enable();
    this.chosenCurrencyControl.enable();
    this.startDateControl.enable();
    this.endDateControl.enable();
  }

}
