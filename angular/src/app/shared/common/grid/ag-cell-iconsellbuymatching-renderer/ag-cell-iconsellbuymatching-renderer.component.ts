import { Component, OnInit } from "@angular/core";
import {
    SalesSwappingVehicleSellBuyMatchingServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { MessageService, NotifyService } from "abp-ng2-module";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
@Component({
    selector: "ag-icon-trash-sales",
    templateUrl: "./ag-cell-iconsellbuymatching-renderer.component.html",
    styleUrls: ["ag-cell-iconsellbuymatching-renderer.component.less"],
})
export class SellBuyMatchingIconTrashComponent
    implements ICellRendererAngularComp {
    params: any;
    field;
    data: any;
    value: any;
    class: string;
    buttonDefThree;
   
    constructor(
        private _salesSwappingVehicleSellBuyMatchingServiceProxy:SalesSwappingVehicleSellBuyMatchingServiceProxy,
        private notify: NotifyService,
        private message: MessageService
    ) {}
    ngOnInit() {
    }

    DisableIcon() {
        this.params.node.setDataValue(this.field,this.data=false);
    }

    agInit(params) {
        this.params = params;
        this.data = this.params.colDef.data;
        this.field = this.params.colDef.field;
         this.buttonDefThree =   this.params.colDef.checkIcon(this.params)|| false;
      
    }

    refresh(): boolean {
        return false;
    }

}