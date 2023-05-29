import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, forwardRef, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'tmss-combobox',
  templateUrl: './tmss-combobox.component.html',
  styleUrls: ['./tmss-combobox.component.less'],
  // changeDetection : ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssComboboxComponent),
      multi: true,
    },
  ],
})
export class TmssComboboxComponent implements ControlValueAccessor {
  @ViewChild('ngSelectComponent') ngSelectComponent: any
  @Input() hasCheck = false;
  @Input() className: string = '';
  @Input() value: any;
  @Input() items: any[] = [];
  @Input() text: string = '';
  @Input() isRequired: boolean = false;
  @Input() isValidate: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() selectedItem: any;
  @Input() label: string = 'label';
  @Input() inputLabel: string = '';
  @Input() key: string = 'value';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() hasFilter = true;
  @Input() isShowInfo = false;

  @Output() viewInfoEmit = new EventEmitter();

  errorMessage = "This field is required";
  // _items: any[] = [];

  // @Input() set items(value: any[]) {

  //   this._items = value;
  //   this.setItemListForCbb();

  // }

  // get items(): any[] {

  //   return this._items;

  // }

  @Output() onChangeValue = new EventEmitter();
  @Output() change = new EventEmitter();
  @ViewChild('input', { static: false }) input!: ElementRef;

  private onChange: Function = new Function();

  constructor() { }

  ngAfterViewInit(params : any) {
      // this.setData();
      // this.setItemListForCbb();
  }

  ngOnChanges(){
    this.inputLabel = this.items?.find(e => e[this.key] == this.value)?.[this.label];
  }

  // setItemListForCbb() {
  //   var myInterval = setInterval(() => {
  //     if (this.items?.length > 0) {
  //       // console.log(1)
  //       this.cd.markForCheck();
  //       this.cd.detectChanges();
  //       this.inputLabel = this.items?.find(e => e[this.key] == this.value)?.[this.label];
  //       // this.items = [...this.items];
  //       this.cd.markForCheck();
  //       this.cd.detectChanges();
  //       clearInterval(myInterval)

  //       setTimeout(() => {
  //         this.items = this.items
  //         this._items = this.items;
  //       }, 0)


  //     }
  //   }, 50)
  // }

  writeValue(val: any): void {
    this.value = val ?? '';
    // console.log(this.ngSelectComponent)
    // this.ngSelectComponent?.select(this.value)
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void { }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  changeValue(e: any) {

    if (!isNaN(e.target.value) && this.type === 'number') {
      this.value = Number(e.target.value);
      if (typeof this.onChange === 'function') {
        this.onChange(Number(e.target.value));
      }
      this.onChangeValue.emit(Number(e.target.value));
      this.change.emit(Number(e.target.value));
    } else {
      if (isNaN(e.target.value) && (e.target.value == 'undefined' || e.target.value == 'null' || !e.target.value))
        this.value = undefined;
      //if (isNaN(e.target.value)) this.value = undefined;
      else this.value = e.target.value;
      if (typeof this.onChange === 'function') {
        this.onChange(this.value);
      }
      this.onChangeValue.emit(this.value);
      this.change.emit(this.value);
    }
  }


  changeValueFilterCbb(e: any) {
    // console.log(e)
    // this.items = [...this.items]
    if (!isNaN(e) && this.type === 'number') {
      // this.cd.markForCheck();s
      this.value = Number(e);
      if (typeof this.onChange === 'function') {
        this.onChange(Number(e));
      }
      this.onChangeValue.emit(Number(e));
      this.change.emit(Number(e));
      // console.log(this.value)

      // this.cd.markForCheck();
      // this.cd.detectChanges();
      this.inputLabel = this.items?.find(e => e[this.key] == this.value)?.[this.label];
      // this.cd.markForCheck();
      // this.cd.detectChanges();

    } else {
      if (isNaN(e) && (e == 'undefined' || e == 'null' || !e))
        this.value = undefined;
      //if (isNaN(e.target.value)) this.value = undefined;
      else this.value = e;
      if (typeof this.onChange === 'function') {
        this.onChange(this.value);
      }
      this.onChangeValue.emit(this.value);
      this.change.emit(this.value);

      // this.cd.markForCheck();
      // this.cd.detectChanges();

      this.inputLabel = this.items?.find(e => e[this.key] == this.value)?.[this.label];
      // this.cd.markForCheck();
      // this.cd.detectChanges();

      // console.log(this.value)
    }


  }

  viewInfo() {
    this.viewInfoEmit.emit();
  }
}
