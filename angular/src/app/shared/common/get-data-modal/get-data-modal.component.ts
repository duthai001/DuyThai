import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-get-data-modal',
  templateUrl: './get-data-modal.component.html',
  styleUrls: ['./get-data-modal.component.less']
})
export class GetDataModalComponent extends AppComponentBase {
  @ViewChild('modal', { static: false }) modal!: ModalDirective;
  @Output() modalSave = new EventEmitter();
  @Input() headerText="";
  @Input() text1;
  @Input() submitText = 'Get Data';
  @Input() isCloseModal = false;
  @Input() dateFrom;
  @Input() dateTo;

  text1Value;
  dateFromValue;
  dateToValue;

  isLoading = false;

  constructor(
    injector: Injector,
    private _http : HttpClient
    ) {
    super(injector);

}
  ngOnInit() {

  }


  show(params? : any) {
    this.modal.show();
  }

  districtId ;

  close() {
    this.modal.hide();
  }

  getData(){
    let outputParam = Object.assign({},{
        text1Value : this.text1Value,
        dateFromValue : this.dateFromValue,
        dateToValue : this.dateToValue
    })
    this.modalSave.emit(outputParam);
    if (this.isCloseModal) this.close();
  }

}

