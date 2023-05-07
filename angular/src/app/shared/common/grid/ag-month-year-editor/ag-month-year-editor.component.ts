import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { InputMask } from 'primeng/inputmask';
import * as moment from 'moment';
import { ICellEditorParams } from '@ag-grid-enterprise/all-modules';

const srcFormat = 'MMM-YYYY';
const desFormat = 'MM-YYYY';

@Component({
  selector: 'ag-month-year-editor',
  templateUrl: './ag-month-year-editor.component.html',
  styleUrls: ['./ag-month-year-editor.component.scss']
})
export class AgMonthYearEditorComponent implements AfterViewInit, ICellEditorAngularComp {
  @ViewChild('monthInput', { read: InputMask, static: false }) private monthInput: InputMask;
  params: ICellEditorParams;
  monthValue: string;

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.monthInput.focus());
  }

  agInit(params: ICellEditorParams): void {
    this.params = params;
    const month = moment(params.value, srcFormat);
    this.monthValue = month.isValid() ? month.format(desFormat) : null;
  }

  getValue(): any {
    const month = moment(this.monthValue, desFormat);
    return month.isValid() ? month.format(srcFormat) : null;
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