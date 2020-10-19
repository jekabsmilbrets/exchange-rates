import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class HistoricExchangeRates {
  navigateTo(): Promise<unknown> {
    return browser.get('/historic-exchange-rates') as Promise<unknown>;
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

  chosenCurrencyInput(): Promise<string> {
    return element(by.css('main mat-toolbar input[name=chosenCurrency]')).getText() as Promise<string>;
  }

  chosenCurrencyInputClearButton(): ElementFinder {
    return element(by.css('main mat-toolbar button[name=clearChosenCurrency]'));
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

  datePickerOverlayButton(): ElementFinder {
    return element(by.css('.cdk-overlay-backdrop'));
  }

  datePickerMYChooseButton(): ElementFinder {
    return element(by.css('.mat-calendar-period-button'));
  }

  datePickerCorrectYearButton(): ElementFinder {
    return element(by.css('td[aria-label="2020"]'));
  }

  datePickerCorrectYearMonthButton(): ElementFinder {
    return element(by.css('td[aria-label="October 2020"]'));
  }

  datePickerCorrectYearMonthStartDateButton(): ElementFinder {
    return element(by.css('td[aria-label="1 October 2020"]'));
  }

  datePickerCorrectYearMonthEndDateButton(): ElementFinder {
    return element(by.css('td[aria-label="10 October 2020"]'));
  }
}
