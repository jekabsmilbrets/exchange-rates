import { browser, logging } from 'protractor';
import { HistoricExchangeRates } from './historic-exchange-rates.po';

describe('workspace-project HistoricExchangeRates Page', () => {
  let page: HistoricExchangeRates;

  beforeEach(() => {
    page = new HistoricExchangeRates();
  });

  it('should display mat-toolbar', () => {
    page.navigateTo();
    expect(page.matToolbar()).toBe(true);
  });

  it('should display mat-table', () => {
    page.navigateTo();
    expect(page.matTable()).toBe(true);
  });

  it('should display results in mat-table after clicking button "Search"', () => {
    page.navigateTo();

    page.datePickerToggleButton().click();
    page.datePickerMYChooseButton().click();
    page.datePickerCorrectYearButton().click();
    page.datePickerCorrectYearMonthButton().click();
    page.datePickerCorrectYearMonthStartDateButton().click();
    page.datePickerCorrectYearMonthEndDateButton().click();
    page.datePickerOverlayButton().click();

    page.submitButton().click();

    expect(page.matTableElements().count()).toBeGreaterThan(0);
  });

  it('should clear chosenCurrency Input when chosenCurrency Clear Button was clicked', () => {
    page.navigateTo();
    page.chosenCurrencyInputClearButton().click();
    expect(page.chosenCurrencyInput()).toBe('');
  });

  it('should clear baseCurrency Input when baseCurrency Clear Button was clicked', () => {
    page.navigateTo();
    page.baseCurrencyInputClearButton().click();
    expect(page.baseCurrencyInput()).toBe('');
  });

  it('should open date picker modal with date picker toggle button', () => {
    page.navigateTo();

    page.datePickerToggleButton().click();
    expect(page.datePickerModalIsDisplayed()).toBe(true);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
