import { Component, Injector, OnInit } from '@angular/core';
import { GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PunishServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';

@Component({
  selector: 'punish',
  templateUrl: './punish.component.html',
  styleUrls: ['./punish.component.less']
})
export class PunishComponent extends AppComponentBase {

  columnDefs;
  rowData: any;
  defaultColDef;
  frameworkComponents;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  params: GridParams;
  maxResultCount: number = 20;
  skipCount: number = 0;
  advancedFiltersAreShown: boolean;
  
  constructor(
    injector: Injector,
    private _punishServiceProxy: PunishServiceProxy,
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
        headerName: this.l('Mã độc giả'),
        headerTooltip: this.l('Mã độc giả'),
        field: 'readerNo',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Tên độc giả'),
        headerTooltip: this.l('Tên độc giả'),
        field: 'reader',
        flex: 2,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Mã phiếu mượn'),
        headerTooltip: this.l('Mã phiếu mượn'),
        field: 'borrowNo',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Mã phiếu trả'),
        headerTooltip: this.l('Mã phiếu trả'),
        field: 'returnNo',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Tiền phạt'),
        headerTooltip: this.l('Tiền phạt'),
        field: 'punisnhMoney',
        flex: 1,
        cellClass: ["text-center"],
      },
      {
        headerName: this.l('Lý do'),
        headerTooltip: this.l('Lý do'),
        field: 'status',
        flex: 1,
        cellClass: ["text-center"],
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

  ngOnInit(): void {
    this.rowData = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._punishServiceProxy.getAll(
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20
    );
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
}
