import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { ICellEditorParams } from '@ag-grid-enterprise/all-modules';
import { InputMask } from 'primeng/inputmask';

const srcFormat = 'DD-MMM-YYYY HH:mm';
const desFormat = 'DD-MM-YYYY HH:mm';

@Component({
  selector: 'ag-datetimepicker-editor',
  templateUrl: './ag-datetimepicker-editor.component.html',
  styleUrls: ['./ag-datetimepicker-editor.component.scss']
})
export class AgDatetimepickerEditorComponent implements AfterViewInit, ICellEditorAngularComp {
  @ViewChild('dateTimeInput', { read: InputMask, static: false }) private dateTimeInput: InputMask;
  params: ICellEditorParams;
  dateTimeValue: string;

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.dateTimeInput.focus());
  }

  agInit(params: ICellEditorParams): void {
    this.params = params;
    const date = moment(params.value, srcFormat);
    this.dateTimeValue = date.isValid() ? date.format(desFormat) : null;
  }

  getValue(): any {
    const date = moment(this.dateTimeValue, desFormat);
    return date.isValid() ? date.format(srcFormat) : null;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  isCancelAfterEnd(): boolean {
    return false;
  }

  isPopup(): boolean {
    return false;
  }

}
