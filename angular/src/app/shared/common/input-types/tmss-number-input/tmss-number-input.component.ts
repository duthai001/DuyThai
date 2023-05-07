import { Component, ElementRef, EventEmitter, Input, forwardRef, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { DataFormatService } from '../../services/data-format.service';

@Component({
  selector: 'tmss-number-input',
  templateUrl: './tmss-number-input.component.html',
  styleUrls: ['./tmss-number-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TmssNumberInputComponent),
    multi: true
  }]
})
export class TmssNumberInputComponent implements ControlValueAccessor {
  @Input() value;
  @Input() className: string = '';
  @Input() addOnMinWidth: string = '';
  @Input() text: string = '';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() disable: boolean = false;
  @Input() rows: any;
  @Input() isReadonly: boolean = false;
  @Input() type: string = 'number';
  @Input() maxLength: number = 12;
  @Input() min: number;
  @Input() max: number;
  @Input() classNameInput: string;

  @Output() onChoose = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onClickInput = new EventEmitter();
  @Output() keyup = new EventEmitter();
  @Output() focusOut = new EventEmitter();
  private onChange: Function = new Function();
  @ViewChild('input') input!: ElementRef;
  options = {
    precision: 0,
    align: "left",
    prefix: '',
    thousands: ',',
    inputMode: CurrencyMaskInputMode.FINANCIAL,
  };
  constructor(
    private dataFormatService: DataFormatService,
  ) {
    this.value = '';
  }

  changeValue(event: any) {
    const value = event;
    if (event.key === 'Enter') this.onClickInput.emit(value);

    if (value === '') {
      this.value = '';
    } else {
      this.value = value ?? '';
    }

    if (typeof this.onChange === 'function') {
      this.onChange(value ?? '');
    }

    if (this.type == "number" && parseInt(value) < this.min) {
      this.value = this.min;
    }
    if (this.type == "number" && parseInt(value) > this.max) {
      this.value = this.max;
    }
  }
  onFocusOutEvent(event) {
    this.focusOut.emit(event)
  }

  writeValue(val: any) {
    this.value = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  openModal(event: any) {
    const value = event;
    if (event.key === 'Enter') this.onClickInput.emit(value);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onClickInputValue(val: any) {
    this.onClickInput.emit(val);
  }

  refresh() {
    this.onRefresh.emit();
  }

  formatCurrentValue(val: any) {
    return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
