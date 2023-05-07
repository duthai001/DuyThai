import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
    selector: 'ag-datepicker-renderer',
    templateUrl: './ag-datepicker-renderer.component.html',
    styleUrls: ['./ag-datepicker-renderer.component.less']
})
export class AgDatepickerRendererComponent implements ICellRendererAngularComp {

    hasTimePicker: boolean | Function;
    public params: any;
    field: string;
    disableSelect: boolean | Function;
    datePicker;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        if (typeof this.params.colDef.disableSelect === 'function') {
            this.disableSelect = this.params.colDef.disableSelect(params);
        } else {
            this.disableSelect = this.params.colDef.disableSelect || false;
        }

        this.field = this.params.colDef.field;
        this.datePicker = this.params.data[this.field];
        this.hasTimePicker = this.params.colDef.hasTimePicker;
    }

    changeDateValue(val) {
        if (!this.params.data[this.field] || ((this.params.data[this.field] && val) && this.params.data[this.field] !== val)) {
            this.params.column.editingStartedValue = this.params.data[this.field];
            this.params.node.setDataValue(this.params.colDef.field, val);
        }
        if(val == undefined){
            this.params.node.setDataValue(this.params.colDef.field, undefined);
        }
    }

    refresh(): boolean {
        return false;
    }

}
