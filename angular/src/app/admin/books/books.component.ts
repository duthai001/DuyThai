import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetBookForViewDto, MstsleBookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';
import { Paginator, Table } from 'primeng';
import { CreateOrEditBooksComponent } from './create-or-edit-books/create-or-edit-books.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class BooksComponent extends AppComponentBase {

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
   @ViewChild('createOrEditBookModal') createOrEditBookModal: CreateOrEditBooksComponent;
 
  columnDefs;
  rowData: any;
  defaultColDef;
 
  listTypeOfBookFilter = [];
  bookName;
  selectReader: number;
  isStatus = 0;
  test: boolean;
  author;
  typeOfBookId:number = -1;
  advancedFiltersAreShown: boolean;
  getBookForView: GetBookForViewDto[];
  selected;
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
        cellRenderer: (params) => params.rowIndex + 1 ,
        field: "stt",
        pinned: true,
        width:45,
    },
      {
        headerName: this.l('Tên sách'),
        headerTooltip: this.l('Tên sách'),
        field: 'bookName',
        minWidth: 80,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Thể loại'),
        headerTooltip: this.l('Thể loại'),
        field: 'bookTypeName',
        minWidth: 80,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Tác giả'),
        headerTooltip: this.l('Tác giả'),
        field: 'author',
        minWidth: 80,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Số lượng'),
        headerTooltip: this.l('Số lượng'),
        field: 'amuont',
        minWidth: 80,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Giá tiền'),
        headerTooltip: this.l('Giá tiền'),
        field: 'price',
        minWidth: 80,
        cellClass: ["text-right"],
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
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
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
  refresh()
{
  this.bookName="";
  this.author="";
  this.typeOfBookId=-1;
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

deleteEmployee() {
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
    const selected = params.api.getSelectedRows()[0];
    if (selected) {
      this.selected = selected.id;
    }
  }
}
