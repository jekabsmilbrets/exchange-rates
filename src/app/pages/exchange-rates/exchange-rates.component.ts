import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { componentDestroyed, OnDestroyMixin } from '@w11k/ngx-componentdestroyed';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
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
export class ExchangeRatesComponent extends OnDestroyMixin implements OnInit, OnDestroy, AfterViewInit {
  public maxDate: Date = new Date();
  public dateControl: FormControl = new FormControl('');

  public baseCurrency: CurrenciesEnum = CurrenciesEnum.EUR;
  public baseCurrencyControl: FormControl = new FormControl(CurrenciesEnum.EUR);

  public filteredCurrencies: Observable<string[]>;

  public displayedColumns = [
    'currency',
    'rate',
  ];
  public dataSource: MatTableDataSource<Rate> = new MatTableDataSource<Rate>([]);

  @ViewChild(MatSort) sort: MatSort;

  private allCurrencies: Array<string> = Object.keys(CurrenciesEnum).filter(key => isNaN(+key));

  private firstRun = true;

  constructor(
      public api: ApiService,
      private _snackBar: MatSnackBar,
  ) {
    super();
  }

  public ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public ngOnInit() {
    this.filteredCurrencies = this.baseCurrencyControl.valueChanges
                                  .pipe(
                                      takeUntil(componentDestroyed(this)),
                                      startWith(''),
                                      distinctUntilChanged(),
                                      map(value => this._filter(value)),
                                  );

    this.baseCurrencyControl.valueChanges
        .pipe(
            takeUntil(componentDestroyed(this)),
            distinctUntilChanged(),
        )
        .subscribe(
            (value: string) => {
              if (value in CurrenciesEnum) {
                this.baseCurrency = CurrenciesEnum[value];

                this.reloadData();
              }
            },
        );

    this.reloadData();
  }

  public ngOnDestroy(): void {
    this.maxDate = undefined;
    this.dateControl = undefined;
    this.baseCurrency = undefined;
    this.baseCurrencyControl = undefined;
    this.filteredCurrencies = undefined;
    this.displayedColumns = undefined;
    this.dataSource = undefined;
    this.sort = undefined;
    this.allCurrencies = undefined;
    this.firstRun = undefined;
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
      let formDate: Date = new Date(this.dateControl.value);
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
        .pipe(takeUntil(componentDestroyed(this)))
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
            () => {
              this.enableControls();
            },
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
