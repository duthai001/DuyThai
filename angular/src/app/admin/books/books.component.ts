import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetBookForViewDto, MstsleBookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';
import { Paginator, Table } from 'primeng';
import { CreateOrEditBooksComponent } from './create-or-edit-books/create-or-edit-books.component';
import { ImportBooksComponent } from './import-books/import-books.component';
import { CreateOrEditOrderBookComponent } from './create-or-edit-order-book/create-or-edit-order-book.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class BooksComponent extends AppComponentBase {

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('createOrEditBookModal') createOrEditBookModal: CreateOrEditBooksComponent;
  @ViewChild('createOrEditOrderModal') createOrEditOrderModal:CreateOrEditOrderBookComponent;
  @ViewChild('importBookModal') importBookModal: ImportBooksComponent;
  columnDefs;
  rowData: any;
  defaultColDef;

  columnDefsOrder;
  rowDataOrder: any;
  paginationParamsOrder: PaginationParamsModel;

  listTypeOfBookFilter = [];
  bookName;
  selectReader: number;
  isStatus = 0;
  test: boolean;
  author;
  typeOfBookId: number = -1;
  advancedFiltersAreShown: boolean;
  getBookForView: GetBookForViewDto[];
  selected;
  selectedId;

  selectedOrder;
  selectedOrderId;
  selectedRow: any;

  frameworkComponents;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  params: GridParams;
  maxResultCount: number = 20;
  skipCount: number = 0;
  //@Output() modalCallBack: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _mtsSleBokServiceProxy: MstsleBookAppserviceServiceProxy,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: "STT",
        headerTooltip: "STT",
        cellRenderer: (params) => params.rowIndex + 1,
        field: "stt",
        pinned: true,
        width: 45,
      },
      {
        headerName: this.l('Tên sách'),
        headerTooltip: this.l('Tên sách'),
        field: 'bookName',
        flex: 2,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Thể loại'),
        headerTooltip: this.l('Thể loại'),
        field: 'bookTypeName',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Tác giả'),
        headerTooltip: this.l('Tác giả'),
        field: 'author',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Số lượng'),
        headerTooltip: this.l('Số lượng'),
        field: 'amuont',
        flex: 1,
        cellClass: ["text-center"],
      },
      {
        headerName: this.l('Giá tiền'),
        headerTooltip: this.l('Giá tiền'),
        field: 'price',
        flex: 1,
        cellClass: ["text-center"],
      },
    ];

    this.columnDefsOrder = [
      {
        headerName: "STT",
        headerTooltip: "STT",
        cellRenderer: (params) => params.rowIndex + 1,
        field: "stt",
        pinned: true,
        width: 45,
      },
      {
        headerName: this.l('Nhà xuất bản'),
        headerTooltip: this.l('Nhà xuất bản'),
        field: 'publishing',
        flex: 2,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Số lượng'),
        headerTooltip: this.l('Số lượng'),
        field: 'quantity',
        flex: 1,
        cellClass: ["text-center"],
      },
      {
        headerName: this.l('Ngày nhập'),
        headerTooltip: this.l('Ngày nhập'),
        field: 'date',
        flex: 1,
        cellClass: ["text-left"],
      },
    ];

    this.defaultColDef = {
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      textFormatter: function (r) {
        if (r == null) return null;
        return r.toLowerCase();
      },
    };
  }
  ngOnInit() {
    this.rowData = [];
    this.rowDataOrder = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.paginationParamsOrder = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this._mtsSleBokServiceProxy.getTypeOfBook().subscribe(re => {
      this.listTypeOfBookFilter.push({ value: -1, label: "Tất cả" });
      re.forEach(e => this.listTypeOfBookFilter.push({ value: e.id, label: e.bookTypeName }));
    });

  }

  onGridReady(paginationParams) {
    this.rowData = [];
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
    this.getAll(this.paginationParams).subscribe((result) => {
      this.rowData = result.items;
      this.paginationParams.totalPage = ceil(result.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = result.totalCount;
    });
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._mtsSleBokServiceProxy.getAllBook(
      this.bookName,
      this.author,
      this.typeOfBookId,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20
    );
  }

  callBackGrid(params) {
    this.params = params;
    this.params.api.paginationSetPageSize(this.paginationParams.pageSize);
    this.onGridReady(this.paginationParams);
  }

  changePage(paginationParams) {
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
    this.getAll(this.paginationParams).subscribe((result) => {
      this.rowData = result.items;
      this.paginationParams.totalPage = ceil(result.totalCount / this.maxResultCount);
    });
  }
  refresh() {
    this.bookName = "";
    this.author = "";
    this.typeOfBookId = -1;
  }
  eventEnter(event) {
    if (event.keyCode === 13) {
      this.search()
    }
  }
  onChangeFilterShown() {
    this.advancedFiltersAreShown = !this.advancedFiltersAreShown
  }
  createBook() {
    this.createOrEditBookModal.show();
  }

  editBook() {
    this.createOrEditBookModal.show(this.selected);
  }
  importmodeal() {
    this.importBookModal.show();
  }

  delete() {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._mtsSleBokServiceProxy
          .deleteBook(this.selected)
          .subscribe(() => {
            this.onGridReady(this.paginationParams);
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    });
  }

  search() {
    this.onGridReady(this.paginationParams);
  }

  onChangeSelection(params) {
    this.selected = params.api.getSelectedRows()[0];
    if (this.selected) {
      this.selectedId = this.selected.id;
      this.onGridReadyOrder(this.paginationParamsOrder);
    }
  }

  //Order Book
  onGridReadyOrder(paginationParams) {
    this.rowDataOrder = [];
    this.paginationParamsOrder = paginationParams;
    this.paginationParamsOrder.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
    this.getAllOrder(this.paginationParamsOrder).subscribe((result) => {
      this.rowDataOrder = result.items;
      this.paginationParamsOrder.totalPage = ceil(result.totalCount / this.maxResultCount);
      this.paginationParamsOrder.totalCount = result.totalCount;
    });
  }

  getAllOrder(paginationParams: PaginationParamsModel) {
    return this._mtsSleBokServiceProxy.getAllOrder(
      this.selectedId,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20
    );
  }

  callBackGridOrder(params) {
    this.params = params;
    this.params.api.paginationSetPageSize(this.paginationParamsOrder.pageSize);
    this.onGridReadyOrder(this.paginationParamsOrder);
  }

  changePageOrder(paginationParams) {
    this.paginationParamsOrder = paginationParams;
    this.paginationParamsOrder.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
    this.getAllOrder(this.paginationParamsOrder).subscribe((result) => {
      this.rowData = result.items;
      this.paginationParamsOrder.totalPage = ceil(result.totalCount / this.maxResultCount);
    });
  }
  createOrder() {
    this.createOrEditOrderModal.show(this.selectedId);
  }

  editOrder() {
    this.createOrEditOrderModal.show(this.selectedId,this.selectedOrderId);
  }

  deleteOrder() {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._mtsSleBokServiceProxy
          .deleteBook(this.selected)
          .subscribe(() => {
            this.onGridReady(this.paginationParams);
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    });
  }

  onChangeSelectionOrder(params) {
    this.selectedOrder = params.api.getSelectedRows()[0];
    if (this.selectedOrder) {
      this.selectedOrderId = this.selectedOrder.id;
    }
  }

}
