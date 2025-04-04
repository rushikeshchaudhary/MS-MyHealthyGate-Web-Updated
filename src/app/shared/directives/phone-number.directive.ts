import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appPhoneNumber]',
})
export class PhoneNumberDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: string | null) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: { target: { value: string | null; }; }) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event: string | null, backspace: boolean) {    
    let newVal='';
    if(event!=null)
      newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length != 0) {
      newVal= newVal.replace('962', '');
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 1) {
      newVal = newVal.replace(/^(\d{0,1})/, '$1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})/, '$1 $2');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})/, '$1 $2-$3');
    }
     else {
      newVal = newVal.substring(0, 9);
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})/, '$1 $2-$3');
    }
    this.ngControl.valueAccessor!.writeValue('(+962) '+newVal);
  }
}