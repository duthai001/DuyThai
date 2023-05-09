import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditReaderDto, MstSleReaderServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-employee',
  templateUrl: './create-or-edit-employee.component.html',
  styleUrls: ['./create-or-edit-employee.component.less']
})
export class CreateOrEditEmployeeComponent extends AppComponentBase {

  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active: boolean = false;
  saving: boolean= false;
  createOrEditReader: CreateOrEditReaderDto = new CreateOrEditReaderDto();
  listEmp: any[] = [];
  listDealer: any[] = [];
  listDealerFilter: any[] = [];
  listExam: any[] = [];
  listExamDetail: any[] = [];
  typeOfCardId:number = -1;
  listTypeOfCardFilter = [];

  dealerId: number;
    constructor(
    injector: Injector,
    private _mtsSleReaderServiceProxy: MstSleReaderServiceProxy
  
  ) {
    super(injector);
  }

  ngOnInit() {
    this._mtsSleReaderServiceProxy.getTypeOfCard().subscribe(re => {
      re.forEach(e => this.listTypeOfCardFilter.push({ value: e.id, label: e.cardName }));
  });
      
  }

  show(selected?: number): void {
    if (!selected) {
      this.createOrEditReader = new CreateOrEditReaderDto();
      this.createOrEditReader.expiredDayFrom = moment();
      this.createOrEditReader.expiredDayTo = moment().add(30);
      this.createOrEditReader.isStatus = false;
      this.active = true;
      this.modal.show();
    } else {
      this._mtsSleReaderServiceProxy.getMstSleReaderForEdit(selected)
        .subscribe((result) => {
          this.createOrEditReader = result.createOrEdiReaderVlue;
          this.active = true;
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;
    this._mtsSleReaderServiceProxy.createOrEditReader(this.createOrEditReader).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.createOrEditReader = null;
        this.saving = false;
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  // getDetail(ExamId?: number){
  //   this.listExamDetail = [];
  //   this._mtsSleReaderServiceProxy.getMstSleReaderForEdit(ExamId).subscribe(re => {
  //       re.forEach(e => this.listExamDetail.push({value: e.id, label: e.name}))
  //     })
  // }

}
