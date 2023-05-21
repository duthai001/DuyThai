import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditBookDto, CreateOrEditOrderDto, MstsleBookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'create-or-edit-order-book',
    templateUrl: './create-or-edit-order-book.component.html',
    styleUrls: ['./create-or-edit-order-book.component.less']
})
export class CreateOrEditOrderBookComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active: boolean = false;
    saving: boolean = false;
    orderBook: CreateOrEditOrderDto = new CreateOrEditOrderDto();
    listTypeOfBookFilter = [];
    options = {
        precision: 0,
        align: "left",
        prefix: '',
        thousands: ',',
        inputMode: CurrencyMaskInputMode.FINANCIAL,
    };;

    constructor(
        injector: Injector,
        private _mtsSleBokServiceProxy: MstsleBookAppserviceServiceProxy,

    ) {
        super(injector);
    }
    ngOnInit() {

    }
    show(BookId?: number, selected?: number): void {
        if (!selected) {
            this.orderBook = new CreateOrEditOrderDto();
            this.orderBook.bookId = BookId;
            this.active = true;
            this.modal.show();
        } else {
            this._mtsSleBokServiceProxy.getOrderForEdit(selected)
                .subscribe((result) => {
                    this.orderBook = result.orderBook;
                    this.active = true;
                    this.modal.show();
                });
        }
    }
    save(): void {
        this.saving = true;
        this._mtsSleBokServiceProxy.createOrEditOrder(this.orderBook).pipe(
            finalize(() => {
                this.saving = false;
            })).subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
                this.orderBook = null;
                this.saving = false;
            });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
