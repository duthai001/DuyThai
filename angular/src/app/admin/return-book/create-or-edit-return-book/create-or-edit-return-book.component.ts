import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditReturnBookDto, GetListBorrowBookForReturnDto, ReturnBookServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateOrEditReturnBookDetailComponent } from '../create-or-edit-return-book-detail/create-or-edit-return-book-detail.component';
import * as moment from 'moment';
import { BorrowBookInfoComponent } from '../borrow-book-info/borrow-book-info.component';

@Component({
  selector: 'app-create-or-edit-return-book',
  templateUrl: './create-or-edit-return-book.component.html',
  styleUrls: ['./create-or-edit-return-book.component.less']
})
export class CreateOrEditReturnBookComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("detailReturnModal") detailReturnModal: CreateOrEditReturnBookDetailComponent;
  @ViewChild("borrowModal") borrowModal: BorrowBookInfoComponent;

  selectedBorrowId;

  totalPaymentAndPrice = {
    amountBorrow: 0
  };

  returnBook: CreateOrEditReturnBookDto = new CreateOrEditReturnBookDto();
  active: boolean = false;
  saving: boolean = false;
  loading: boolean = false;

  returnBookDate = moment();

  listReader = [];
  selectedBorrow: GetListBorrowBookForReturnDto = new GetListBorrowBookForReturnDto();
  isShowDetailInfo: boolean = false;

  emit: boolean = false;

  constructor(
    injector: Injector,
    private _returnBookServiceProxy: ReturnBookServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this._returnBookServiceProxy.getListReaders().subscribe(re => {
      re.forEach(e => this.listReader.push({ value: e.id, label: e.name }));
    });
  }

  show(selected?: number): void {
    this.selectedBorrowId = selected;
    if (!selected) {
      this.returnBook = new CreateOrEditReturnBookDto();
      this.active = true;
      this.modal.show();
    } else {
      this._returnBookServiceProxy.getForEdit(selected)
        .subscribe((result) => {
          this.returnBook = result.returnBook;
          this.active = true;
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;
    if (this.detailReturnModal.rowData.length == 0) {
      this.notify.warn("Cần thêm thông tin xe hợp đồng!");
      this.saving = false;
      return;
    }
    this.returnBook.details = this.detailReturnModal.rowData;
    this.returnBook.returnBookDate = this.returnBookDate;
    this._returnBookServiceProxy.createOrEdit(this.returnBook).pipe(
      finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.close();
        this.modalSave.emit(null);
        this.returnBook = null;
        this.saving = false;
      });
  }

  close() {
    this.returnBook = new CreateOrEditReturnBookDto();
    this.modalSave.emit(null);
    this.active = false;
    this.modal.hide();
  }

  showVehicleDetail() {
    this.emit = true;
    this.save();
  }

  updateQuantityOrPayment(totalPaymentAndPrice: { amountBorrow: number; }) {
    this.returnBook.totalQuantity = totalPaymentAndPrice.amountBorrow;
  }

  getDetail(borrowId) {
    this._returnBookServiceProxy.getListDetailByBorrow(borrowId).subscribe(result => {
      this.detailReturnModal.getListDetailByBorrow(result);
    })
  }

  showBorrowModal() {
    this.borrowModal.show();
  }

  getSelectedBorrow(data) {
    this.selectedBorrow = new GetListBorrowBookForReturnDto();
    this.selectedBorrow = data;

    this.returnBook.borrowId = this.selectedBorrow.borrowId;
    this.returnBook.readerId = this.selectedBorrow.readerId;
    this.returnBook.totalQuantity = this.selectedBorrow.totalLoanAmount;
    // if (!this.selectedBorrowId) {
    //   this.getCarAttention(this.returnBook.borrowId);
    // }

  }

  getCarAttention(borrowId) {
      this._returnBookServiceProxy.getListDetailFromBorrow(borrowId).subscribe(result => {
          this.detailReturnModal.getListDetailByBorrow(result);
      })
  }
}
