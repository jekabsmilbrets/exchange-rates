import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { CurrenciesEnum } from '../enums/currenciesEnum';

export class FormHelper {
  public static getDateFromControl(control: FormControl): string {
    let date;

    const formDate: Date = control.value ? new Date(control.value) : undefined;

    if (formDate) {
      const year = formDate.getFullYear();
      const month = formDate.getMonth() + 1;
      const day = formDate.getDate();

      date = `${year}-${month}-${day}`;
    }

    return date;
  }

  public static currencyValidator(control: AbstractControl): ValidationErrors {
    const valid: boolean = control.value && control.value in CurrenciesEnum;
    return valid ? null : {currencyInvalid: true};
  }
}
