import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditTypeBook, MstSleTypeOfBookServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-type-book',
  templateUrl: './create-or-edit-type-book.component.html',
  styleUrls: ['./create-or-edit-type-book.component.less']
})
export class CreateOrEditTypeBookComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  active: boolean = false;
  saving: boolean= false;
  createOrEditTypeBook: CreateOrEditTypeBook = new CreateOrEditTypeBook();
    constructor(
    injector: Injector,
    private _mstSleTypeOfBookServiceProxy: MstSleTypeOfBookServiceProxy,
  
  ) {
    super(injector);
  }
  ngOnInit() {
  }
  show(selected?: number): void {
    if (!selected) {
      this.createOrEditTypeBook = new CreateOrEditTypeBook();
      this.active = true;
      this.modal.show();
    } else {
      this._mstSleTypeOfBookServiceProxy.getTypeBookForEdit(selected)
        .subscribe((result) => {
          this.createOrEditTypeBook = result.createOrEditTypeBookValue;
          this.active = true;
          this.modal.show();
        });
    }
  }
  save(): void {
    this.saving = true;
    this._mstSleTypeOfBookServiceProxy.createOrEditBookType(this.createOrEditTypeBook).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.createOrEditTypeBook = null;
        this.saving = false;
      });
  }
  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
