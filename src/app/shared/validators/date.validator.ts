import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (control.value < currentDate) {
      return { invalidDate: true};
    }
    return null;
  }
}