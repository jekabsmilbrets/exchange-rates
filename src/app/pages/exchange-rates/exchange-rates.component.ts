import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { CurrenciesEnum } from '../../enums/currenciesEnum';
import { Latest } from '../../intertfaces/responses/latest';
import { CurrentCurrencies, CurrentCurrency } from '../../intertfaces/Tables/currentCurrency';
import { BaseRequestParams } from '../../intertfaces/utils/baseRequestParams';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { FormHelper } from '../../utilities/form-helper';

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
  public dataSource: MatTableDataSource<CurrentCurrency>;

  @ViewChild(MatSort) sort: MatSort;

  private firstRun = true;

  constructor(
      private api: ApiService,
      private _snackBar: MatSnackBar,
      private dataService: DataService,
  ) {
    this.maxDate = this.dataService.maxDate;
    this.dateControl = new FormControl();

    this.baseCurrencyControl = new FormControl(this.dataService.baseCurrency);

    this.dataSource = new MatTableDataSource<CurrentCurrency>([]);
  }

  public ngOnInit() {
    this.filteredCurrencies = this.baseCurrencyControl.valueChanges
                                  .pipe(
                                      startWith(this.dataService.baseCurrency),
                                      distinctUntilChanged(),
                                      map(value => this.dataService._filter(value)),
                                  );

    this.reloadData();
  }

  public ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.dataSource.disconnect();

    this.maxDate = undefined;
    this.dateControl = undefined;
    this.baseCurrencyControl = undefined;
    this.filteredCurrencies = undefined;
    this.dataSource = undefined;
    this.sort = undefined;
    this.firstRun = undefined;
    this.api = undefined;
    this._snackBar = undefined;
    this.dataService = undefined;
  }

  public reloadData(): void {
    this.disableControls();
    this._snackBar.dismiss();
    this.dataSource.data = [];

    let params: BaseRequestParams = {
      base: this.dataService.baseCurrency,
    };
    let date = FormHelper.getDateFromControl(this.dateControl);

    this.api.latest(params, date)
        .pipe(take(1))
        .subscribe(
            (value: Latest) => {
              let currentCurrencies: CurrentCurrencies = [];

              for (const displayedColumnsKey of Object.keys(value.rates)) {
                currentCurrencies.push({
                  rate: value.rates[displayedColumnsKey],
                  currency: CurrenciesEnum[displayedColumnsKey],
                } as CurrentCurrency);
              }

              this.dataSource.data = currentCurrencies;
            },
            (error) => {
              console.log('Problems loading data ', error);

              this._snackBar.open(error.error.error);
              this.enableControls();
            },
            () => this.enableControls(),
        );
  }

  public currencySelected(): void {
    let value = this.baseCurrencyControl.value;

    if (value in CurrenciesEnum && value !== this.dataService.baseCurrency) {
      this.dataService.baseCurrency = CurrenciesEnum[value];

      this.reloadData();
    }
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
