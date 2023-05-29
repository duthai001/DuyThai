import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BorrowBookServiceProxy, CreateOrEditBorrowBookDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateOrEditBorrowDetailComponent } from '../create-or-edit-borrow-detail/create-or-edit-borrow-detail.component';

@Component({
  selector: 'app-create-or-edit-borrow-book',
  templateUrl: './create-or-edit-borrow-book.component.html',
  styleUrls: ['./create-or-edit-borrow-book.component.less']
})
export class CreateOrEditBorrowBookComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("detailBorrowModal") detailBorrowModal: CreateOrEditBorrowDetailComponent;

  selectedBorrowId;

  totalPaymentAndPrice = {
    totalLoanAmount: 0,
    amountBorrow: 0
  };

  borrowBook: CreateOrEditBorrowBookDto = new CreateOrEditBorrowBookDto();
  active: boolean = false;
  saving: boolean = false;
  loading: boolean = false;

  listReader = [];

  isShowDetailInfo: boolean = false;

  emit: boolean = false;

  constructor(
    injector: Injector,
    private _borrowBookServiceProxy: BorrowBookServiceProxy,
  ) { 
    super(injector);
  }

  ngOnInit() {
    this._borrowBookServiceProxy.getListReaders().subscribe(re => {
      re.forEach(e => this.listReader.push({ value: e.id, label: e.name }));
    });
  }

  show(selected?: number): void {
    this.selectedBorrowId = selected;
    if (!selected) {
      this.borrowBook = new CreateOrEditBorrowBookDto();
      this.active = true;
      this.modal.show();
    } else {
      this._borrowBookServiceProxy.getForEdit(selected)
        .subscribe((result) => {
          this.borrowBook = result.borrowBook;
          this.active = true;
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;
    if(this.detailBorrowModal.rowData.length == 0)
    {
      this.notify.warn("Cần thêm thông tin xe hợp đồng!");
      this.saving = false;
      return;
    }
    this.borrowBook.details = this.detailBorrowModal.rowData;
    this._borrowBookServiceProxy.createOrEdit(this.borrowBook).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.borrowBook = null;
        this.saving = false;
      });
  }

  close() {
    this.borrowBook = new CreateOrEditBorrowBookDto();
    this.modalSave.emit(null);
    this.active = false;
    this.modal.hide();
  }

  showVehicleDetail() {
    this.emit = true;
    this.save();
  }

  updateQuantityOrPayment(totalPaymentAndPrice: { totalLoanAmount: number; amountBorrow: number; }) {
    this.borrowBook.totalLoanAmount = totalPaymentAndPrice.totalLoanAmount;
    this.borrowBook.amountBorrow = totalPaymentAndPrice.amountBorrow;
  }

  changeReader() {
    //this.borrowBook.readerId = this.reader;
  }
}
