import { Component } from "@angular/core";
// import {
//     CreateOrEditSalesForSwapDto,
//     SalesSwappingVehicleSellServiceProxy,
// } from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
@Component({
    selector: "ag-checkbox-renderer-sale",
    templateUrl: "./ag-swappingvehiclecheckbox-render.component.html",
    styleUrls: ["ag-swappingvehiclecheckbox-render.component.less"],
})
export class SwappingVehicleInformationCheckboxComponent
    implements ICellRendererAngularComp {
    //VehicleSell: CreateOrEditSalesForSwapDto = new CreateOrEditSalesForSwapDto();
    params: any;
    field;
    disableCheckbox;
    data: any;
    value: any;
    class: string;
    delete;
    listSwappingVehicleSell;
    constructor(
        //private _salesSwappingVehiclesSellServiceProxy: SalesSwappingVehicleSellServiceProxy,
        private notify: NotifyService
    ) {}

    onChange(val) {
        // if (val) {
        //     this.VehicleSell.salesVehicleId = this.params.data.id;
        //     this.VehicleSell.swapTypeId=1;
        //     this.VehicleSell.statusId=1;
        //     this._salesSwappingVehiclesSellServiceProxy
        //         .createForSell(this.VehicleSell)
        //         .subscribe(() => {
        //             this.params.data.statusId=1;
        //             this.params.data.swapTypeId=1;
        //             this.notify.info("SavedSuccessfully");
        //         });
        // } else {
		// 	this.delete = this.params.data.id;
        //     this._salesSwappingVehiclesSellServiceProxy
        //         .deleteSwappingVehiclesSell(this.delete)
        //         .subscribe(() => {
        //             this.params.data.statusId=0;
        //             this.params.data.swapTypeId=null;
        //             this.notify.success("SuccessfullyDeleted");
        //         });
        // }
        if (this.data) {
            val ? (val = this.data[0]) : (val = this.data[1]);
        }
        this.params.node.setDataValue(this.field, val);
    }

    agInit(params) {
        this.params = params;
        this.data = this.params.colDef.data;
        this.field = this.params.colDef.field;
        if (typeof this.params.colDef.disableCheckbox === 'function') {
            this.disableCheckbox = this.params.colDef.disableCheckbox(params);
          } else {
            this.disableCheckbox = this.params.colDef.disableCheckbox || false;
          }
        this.value = this.params.data[this.field];
        if (this.value === null || this.value === undefined) {
            this.params.node.setDataValue(
                this.field,
                this.data ? this.data[1] : false
            );
        }
        if (this.data || (!this.data && this.value === true)) {
            this.class = "ag-icon-checkbox-checked";
        } else {
            this.class = "ag-icon-checkbox-unchecked";
		}
    }
    refresh(): boolean {
        return false;
    }
}
