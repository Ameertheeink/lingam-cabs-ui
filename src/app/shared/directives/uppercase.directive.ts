import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value = event.target.value;

    if (value) {
      this.control.control?.setValue(
        value.toUpperCase(),
        { emitEvent: false }
      );
    }
  }
}
