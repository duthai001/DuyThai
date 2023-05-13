import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditBookDto, MstsleBookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-create-or-edit-books',
  templateUrl: './create-or-edit-books.component.html',
  styleUrls: ['./create-or-edit-books.component.less']
})
export class CreateOrEditBooksComponent extends AppComponentBase {

 
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active: boolean = false;
  saving: boolean= false;
  createOrEditBookDto: CreateOrEditBookDto = new CreateOrEditBookDto();
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
    this._mtsSleBokServiceProxy.getTypeOfBook().subscribe(re => {
      re.forEach(e => this.listTypeOfBookFilter.push({ value: e.id, label: e.bookTypeName }));
  });
  }
  show(selected?: number): void {
    if (!selected) {
      this.createOrEditBookDto = new CreateOrEditBookDto();
      this.active = true;
      this.modal.show();
    } else {
      this._mtsSleBokServiceProxy.getMstSleBookForEdit(selected)
        .subscribe((result) => {
          this.createOrEditBookDto = result.createOrEditBookValue;
          this.active = true;
          this.modal.show();
        });
    }
  }
  save(): void {
    this.saving = true;
    this._mtsSleBokServiceProxy.createOrEditBook(this.createOrEditBookDto).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.createOrEditBookDto = null;
        this.saving = false;
      });
  }
  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
