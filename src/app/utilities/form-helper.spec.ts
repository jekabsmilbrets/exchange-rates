import { FormControl } from '@angular/forms';
import { CurrenciesEnum } from '../enums/currenciesEnum';
import { FormHelper } from './form-helper';

describe('FormHelper', () => {
  it('should create an instance', () => {
    expect(new FormHelper()).toBeTruthy();
  });

  it('should return formatted date from getDateFromControl with valid date value', () => {
    const testDate = '12/13/2020';
    const control: FormControl = new FormControl(testDate);

    expect(FormHelper.getDateFromControl(control)).toEqual('2020-12-13');
  });

  it('should return undefined from getDateFromControl with invalid date value', () => {
    const testDate = '13/13/2020';
    const control: FormControl = new FormControl(testDate);

    expect(FormHelper.getDateFromControl(control)).toBeUndefined();
  });

  it('should return null on valid control value', () => {
    const testValue = CurrenciesEnum.EUR;
    const control: FormControl = new FormControl(testValue);

    expect(FormHelper.currencyValidator(control)).toBeNull();
  });

  it('should return error obj on invalid control value', () => {
    const testValue = 'test';
    const control: FormControl = new FormControl(testValue);

    expect(FormHelper.currencyValidator(control)).toEqual({currencyInvalid: true});
  });
});
