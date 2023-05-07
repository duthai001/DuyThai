import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'up-down-button',
  template: `
    <a href="#" style="font-size: 1.8em !important;" (click)="onUpClick($event)">&uarr;</a>
    &nbsp;
    <a href="#" style="font-size: 1.8em !important;" (click)="onDownClick($event)">&darr;</a>
  `
})
export class UpDownButtonComponent implements ICellRendererAngularComp  {

  params;

  constructor() { }
  agInit(params: ICellRendererParams): void {
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
  }

  onUpClick($event) {
    if (this.params.onUpClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params //.node.data
        // ...something
      };
      this.params.onUpClick(params);
    }
  }

  onDownClick($event) {
    if (this.params.onDownClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params //.node.data
        // ...something
      };
      this.params.onDownClick(params);
    }
  }

  refresh(params: any): boolean {
    return this.params = params;
  }
}
