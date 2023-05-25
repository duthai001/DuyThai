import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng';
import { CreateOrEditTypeCardComponent } from './create-or-edit-type-card/create-or-edit-type-card.component';
import { GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { MstSleTypeOfCardServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';

@Component({
  selector: 'app-type-card',
  templateUrl: './type-card.component.html',
  styleUrls: ['./type-card.component.less']
})
export class TypeCardComponent extends AppComponentBase  {

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('createOrEditTypeCardModal') createOrEditTypeCardModal: CreateOrEditTypeCardComponent;
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
  typeCardName
  constructor(
    injector: Injector,
    private _mstSleTypeOfCardServiceProxy: MstSleTypeOfCardServiceProxy,
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
        headerName: this.l('Tên thể loại thẻ'),
        headerTooltip: this.l('Tên thể loại thẻ'),
        field: 'nameCard',
        flex: 2,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Giá tiền thẻ'),
        headerTooltip: this.l('Giá Tiền thẻ'),
        field: 'cardAmount',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Tỷ lệ(%)'),
        headerTooltip: this.l('Tỷ lệ(%)'),
        field: 'rate',
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
    return this._mstSleTypeOfCardServiceProxy.getAllTypeCard(
      this.typeCardName,
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
    this.typeCardName="";
  }
  eventEnter(event) {
    if (event.keyCode === 13) {
      this.search()
    }
  }
  onChangeFilterShown() {
    this.advancedFiltersAreShown = !this.advancedFiltersAreShown
  }
  createTypeCard() {
    this.createOrEditTypeCardModal.show();
  }

  editTypeCard() {
    this.createOrEditTypeCardModal.show(this.selected);
  }

  deleteTypeCard() {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._mstSleTypeOfCardServiceProxy
          .deleteCardType(this.selected)
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
