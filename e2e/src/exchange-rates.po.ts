import { browser, by, element, ElementArrayFinder, ElementFinder, ElementHelper } from 'protractor';

export class ExchangeRates {
  navigateTo(): Promise<unknown> {
    return browser.get('/exchange-rates') as Promise<unknown>;
  }

  matToolbar(): Promise<boolean> {
    return element(by.css('main mat-toolbar')).isDisplayed() as Promise<boolean>;
  }

  matTable(): Promise<boolean> {
    return element(by.css('main mat-table')).isDisplayed() as Promise<boolean>;
  }

  matTableElements(): ElementArrayFinder {
    return element.all(by.css('main mat-table mat-row'));
  }

  baseCurrencyInput(): Promise<string> {
    return element(by.css('main mat-toolbar input[name=baseCurrency]')).getText() as Promise<string>;
  }

  baseCurrencyInputClearButton(): ElementFinder {
    return element(by.css('main mat-toolbar button[name=clearBaseCurrency]'));
  }

  submitButton(): ElementFinder {
    return element(by.css('main mat-toolbar form button[type=submit]'));
  }

  datePickerToggleButton(): ElementFinder {
    return element(by.css('main mat-toolbar mat-datepicker-toggle button'));
  }

  datePickerModalIsDisplayed(): Promise<boolean> {
    return element(by.css('mat-datepicker-content')).isDisplayed() as Promise<boolean>;
  }
}
