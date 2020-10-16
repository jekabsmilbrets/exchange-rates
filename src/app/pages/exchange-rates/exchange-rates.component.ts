import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Latest } from '../../intertfaces/responses/latest';
import { Rate, Rates } from '../../intertfaces/Tables/rate';
import { BaseRequestParams } from '../../intertfaces/utils/baseRequestParams';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit, OnDestroy, AfterViewInit {
  public maxDate: Date;
  public dateControl: FormControl;
  public baseCurrencyControl: FormControl;

  public filteredCurrencies: Observable<string[]>;

  public readonly displayedColumns = [
    'currency',
    'rate',
  ];
  public dataSource: MatTableDataSource<Rate>;

  @ViewChild(MatSort) sort: MatSort;

  private baseCurrency: CurrenciesEnum;
  private readonly allCurrencies: Array<string>;

  private firstRun = true;
  private subscriptions: Subscription[] = [];

  constructor(
      private api: ApiService,
      private _snackBar: MatSnackBar,
  ) {
    this.maxDate = new Date();
    this.dateControl = new FormControl(new Date());

    this.baseCurrency = CurrenciesEnum.EUR;
    this.baseCurrencyControl = new FormControl(CurrenciesEnum.EUR);

    this.dataSource = new MatTableDataSource<Rate>([]);
    this.allCurrencies = Object.keys(CurrenciesEnum)
                               .filter(key => isNaN(+key));
  }

  public ngOnInit() {
    this.filteredCurrencies = this.baseCurrencyControl.valueChanges
                                  .pipe(
                                      startWith(''),
                                      distinctUntilChanged(),
                                      map(value => this._filter(value)),
                                  );

    this.subscriptions.push(
        this.baseCurrencyControl.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(
                (value: string) => {
                  if (value in CurrenciesEnum) {
                    this.baseCurrency = CurrenciesEnum[value];

                    this.reloadData();
                  }
                },
            ),
    );

    this.reloadData();
  }

  public ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(
        (subscription: Subscription) => subscription.unsubscribe(),
    );

    this.dataSource.disconnect();

    this.maxDate = undefined;
    this.dateControl = undefined;
    this.baseCurrencyControl = undefined;
    this.filteredCurrencies = undefined;
    this.dataSource = undefined;
    this.sort = undefined;
    this.baseCurrency = undefined;
    this.firstRun = undefined;
    this.subscriptions = undefined;
    this.api = undefined;
    this._snackBar = undefined;
  }

  public reloadData(): void {
    this.disableControls();
    this._snackBar.dismiss();
    this.dataSource.data = [];

    let params: BaseRequestParams = {};
    let date;

    if (this.dateControl.value) {
      let formDate: Date = this.dateControl.value;
      let currentDate = new Date();

      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);

      if (
          formDate.getTime() < currentDate.getTime()
      ) {
        const year = formDate.getFullYear();
        const month = formDate.getMonth() + 1;
        const day = formDate.getDate();

        date = `${year}-${month}-${day}`;
      }
    }

    params.base = this.baseCurrency;

    this.api.latest(params, date)
        .pipe(take(1))
        .subscribe(
            (value: Latest) => {
              let rates: Rates = [];

              for (const displayedColumnsKey of Object.keys(value.rates)) {
                rates.push({
                  rate: value.rates[displayedColumnsKey],
                  currency: CurrenciesEnum[displayedColumnsKey],
                } as Rate);
              }

              this.dataSource.data = rates;

              if (this.firstRun) {
                this.maxDate = new Date(value.date);
                this.dateControl.setValue(this.maxDate);
                this.firstRun = false;
              }
            },
            (error) => {
              console.log('Problems loading data ', error);

              this._snackBar.open(error.error.error);
              this.enableControls();
            },
            () => this.enableControls(),
        );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies.filter(
        (option: string) => option.toLowerCase().indexOf(filterValue) === 0,
    );
  }

  private disableControls(): void {
    this.dateControl.disable();
    this.baseCurrencyControl.disable();
  }

  private enableControls(): void {
    this.dateControl.enable();
    this.baseCurrencyControl.enable();
  }
}
