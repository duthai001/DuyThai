import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MstSleTypeOfBookServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';
import { Paginator } from 'primeng';
import { CreateOrEditTypeBookComponent } from './create-or-edit-type-book/create-or-edit-type-book.component';

@Component({
  selector: 'app-type-book',
  templateUrl: './type-book.component.html',
  styleUrls: ['./type-book.component.less']
})
export class TypeBookComponent extends AppComponentBase {

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('createOrEditTypeBookModal') createOrEditTypeBookModal: CreateOrEditTypeBookComponent;
  columnDefs;
  rowData: any;
  defaultColDef;
  selected;
  selectReader: number;
  advancedFiltersAreShown: boolean;
  selectedRow: any;
  frameworkComponents;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  params: GridParams;
  maxResultCount: number = 20;
  skipCount: number = 0;
  typeBookName
  //@Output() modalCallBack: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _mstSleTypeOfBookServiceProxy: MstSleTypeOfBookServiceProxy,
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
        headerName: this.l('Tên thể loại sách'),
        headerTooltip: this.l('Tên thể loại sách'),
        field: 'bookTypeName',
        flex: 1,
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
    return this._mstSleTypeOfBookServiceProxy.getAllTypeBook(
      this.typeBookName,
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
    this.typeBookName="";
  }
  eventEnter(event) {
    if (event.keyCode === 13) {
      this.search()
    }
  }
  onChangeFilterShown() {
    this.advancedFiltersAreShown = !this.advancedFiltersAreShown
  }
  createTypeBook() {
    this.createOrEditTypeBookModal.show();
  }

  editTypeBook() {
    this.createOrEditTypeBookModal.show(this.selected);
  }

  deleteTypeBook() {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._mstSleTypeOfBookServiceProxy
          .deleteBookType(this.selected)
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
