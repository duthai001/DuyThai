import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditTypeCard, MstSleTypeOfCardServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-type-card',
  templateUrl: './create-or-edit-type-card.component.html',
  styleUrls: ['./create-or-edit-type-card.component.less']
})
export class CreateOrEditTypeCardComponent extends AppComponentBase {

  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  active: boolean = false;
  saving: boolean= false;
  createOrEditTypeCard: CreateOrEditTypeCard = new CreateOrEditTypeCard();
    constructor(
    injector: Injector,
    private _mstSleTypeOfCardServiceProxy: MstSleTypeOfCardServiceProxy,
  
  ) {
    super(injector);
  }
  ngOnInit() {
  }
  show(selected?: number): void {
    if (!selected) {
      this.createOrEditTypeCard = new CreateOrEditTypeCard();
      this.active = true;
      this.modal.show();
    } else {
      this._mstSleTypeOfCardServiceProxy.getTypeCardForEdit(selected)
        .subscribe((result) => {
          this.createOrEditTypeCard = result.createOrEditTypeCardValue;
          this.active = true;
          this.modal.show();
        });
    }
  }
  save(): void {
    this.saving = true;
    this._mstSleTypeOfCardServiceProxy.createOrEditCardType(this.createOrEditTypeCard).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.createOrEditTypeCard = null;
        this.saving = false;
      });
  }
  close(): void {
    this.active = false;
    this.modal.hide();
  }

}
