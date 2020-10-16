import { FormControl } from '@angular/forms';

export class FormHelper {
  public static getDateFromControl(control: FormControl): string {
    let date;
    const formDate: Date = control.value;

    if (formDate !== null) {
      const year = formDate.getFullYear();
      const month = formDate.getMonth() + 1;
      const day = formDate.getDate();

      date = `${year}-${month}-${day}`;
    }

    return date;
  }
}
