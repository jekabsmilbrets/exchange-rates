import { Injectable } from '@angular/core';
import { CurrenciesEnum } from '../enums/currenciesEnum';
import { StorageManagerService } from './storage-manager.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(
      private storageManagerService: StorageManagerService,
  ) {
  }

  get allCurrencies(): Array<string> {
    let allCurrencies = JSON.parse(
        this.storageManagerService.getItem('allCurrencies'),
    );

    if (allCurrencies === null) {
      allCurrencies = Object.keys(CurrenciesEnum)
                            .filter(key => isNaN(+key));

      this.storageManagerService.setItem(
          'allCurrencies',
          JSON.stringify(allCurrencies),
      );
    }

    return allCurrencies;
  }

  get baseCurrency(): CurrenciesEnum {
    let baseCurrency: CurrenciesEnum = this.storageManagerService.getItem('baseCurrency') as CurrenciesEnum;

    if (baseCurrency === null) {
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

    if (chosenCurrency === null) {
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
    let storedDate: string = this.storageManagerService.getItem('maxDate', 'sessionStorage');
    let maxDate: Date = storedDate ? new Date(storedDate) : undefined;

    if (storedDate === null || storedDate === undefined) {
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

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies.filter(
        (option: string) => option.toLowerCase().indexOf(filterValue) === 0,
    );
  }
}
