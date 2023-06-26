import { Component, EventEmitter, Injector, Output, ViewChild } from "@angular/core";
import { AppCommonModule } from "@app/shared/common/app-common.module";
import { AgCheckboxRendererComponent } from "@app/shared/common/grid/ag-checkbox-renderer/ag-checkbox-renderer.component";
import { CustomColDef, FrameworkComponent, GridParams, PaginationParamsModel } from "@app/shared/common/models/base.model";
import { AppComponentBase } from "@shared/common/app-component-base";
import { BorrowBookServiceProxy, GetListBorrowBookForReturnDto, ReturnBookServiceProxy } from "@shared/service-proxies/service-proxies";
import { ceil } from "lodash";
import { finalize } from "rxjs/operators";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-borrow-book-info',
  templateUrl: './borrow-book-info.component.html',
  styleUrls: ['./borrow-book-info.component.less']
})
export class BorrowBookInfoComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
	@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  defaultColDef = {
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      textFormatter: function (r) {
          if (r == null) return null;
          return r.toLowerCase();
      },
      width: 100,
  };

  listStatus = [
      { value: -1, label: "Tất cả" }, 
      { value: 0, label: "Đang mượn" }, 
      { value: 1, label: "Đã trả" }, 
      { value: 2, label: "Đã quá hạn" }
  ]

  reader: string;
  status: number = -1;
  firstDay = moment().subtract(1, 'months').startOf('month')
  lastDay = moment();
  borrowDate: moment.Moment[] = [this.firstDay, this.lastDay];
  isBorrowDate: boolean;

  columnDefs: CustomColDef[];
  paginationParams: PaginationParamsModel = { pageNum: 1, pageSize: 1000, totalCount: 0 };
  rowData: any;
  paramsDetail: GridParams;

  columnDefsDetail: CustomColDef[];
  paginationParamsDetail: PaginationParamsModel = { pageNum: 1, pageSize: 1000, totalCount: 0 };
  rowDataDetail: any;
  maxResultCount: number = 1000;
  skipCount: number = 0;
  sorting: string = '';
  totalPages: number = 0;
  params: GridParams;
  loading: boolean = false;
  advancedFiltersAreShown;

  selectedBorrow: GetListBorrowBookForReturnDto = new GetListBorrowBookForReturnDto();;
  selectedBorrowId: number;

  frameworkComponents: FrameworkComponent = { agCheckboxRendererComponent: AgCheckboxRendererComponent };

  constructor(
      injector: Injector,
      private _returnBookServiceProxy: ReturnBookServiceProxy,
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
              headerName: this.l('Tên độc giả'),
              headerTooltip: this.l('Tên độc giả'),
              field: 'reader',
              width: 165,
              cellClass: ["text-right"],
          },
          {
              headerName: this.l('Mã phiếu mượn'),
              headerTooltip: this.l('Mã phiếu mượn'),
              field: 'borrowNo',
              width: 130,
              cellClass: ["text-right"],
          },
          {
              headerName: this.l('Ngày mượn'),
              headerTooltip: this.l('Ngày mượn'),
              field: 'borrowDate',
              width: 115,
              cellClass: ["text-center"],
          },
          {
              headerName: this.l('Hạn trả'),
              headerTooltip: this.l('Hạn trả'),
              field: 'dueDate',
              width: 115,
              cellClass: ["text-left"],
          },
          {
              headerName: this.l('Tổng SL'),
              headerTooltip: this.l('Tổng SL'),
              field: 'amountBorrow',
              width: 50,
              cellClass: ["text-left"],
          },
          {
              headerName: this.l('Tổng tiền'),
              headerTooltip: this.l('Tổng tiền'),
              field: 'totalLoanAmount',
              width: 90,
              cellClass: ["text-left"],
          },
          {
              headerName: this.l('Trạng thái'),
              headerTooltip: this.l('Trạng thái'),
              field: 'status',
              width: 115,
              cellClass: ["text-left"],
          },
      ];
  }
  ngOnInit() {
      this.rowData = [];
      this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
  }

  callBackGrid(params) {
      this.params = params;
      this.params.api.paginationSetPageSize(this.paginationParams.pageSize);
      this.onGridReady(this.paginationParams);
  }

  onGridReady(paginationParams) {
      this.paginationParams = paginationParams;
      this.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
      this.maxResultCount = paginationParams.pageSize;
      this.getAllProposal();
  }

  changePage(paginationParams: PaginationParamsModel) {
      this.paginationParams = paginationParams;
      this.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
      this.maxResultCount = paginationParams.pageSize;
      this.getAllProposal();
  }


  getAllProposal() {
      //this.rowData = [];
      this.rowData.length = 0;
      this._returnBookServiceProxy.getListBorrow(
          this.reader,
          this.isBorrowDate == true ? this.borrowDate[0] : null,
          this.isBorrowDate == true ? this.borrowDate[1] : null,
          this.status,
          this.sorting ?? null,
          this.skipCount,
          this.maxResultCount
      )
          .pipe(finalize(() => this.loading = false))
          .subscribe((result) => {
              this.rowData = result.items;
              this.totalPages = ceil(result.totalCount / this.maxResultCount);
              this.paginationParams.totalCount = result.totalCount;
              this.paginationParams.totalPage = this.totalPages;
              this.params.api.setRowData(this.rowData);

              setTimeout(() => {
                  if (this.rowData.length && !this.selectedBorrowId) {
                      var selectedRow = this.params.api.getSelectedNodes();
                      if (selectedRow.length == 0) {
                          this.params.api.getRowNode('0').selectThisNode(true);
                          this.onChangeSelection(this.params);
                      }
                  }
              })
          });
  }

  onChangeSelection(params) {
      this.selectedBorrow = params.api.getSelectedRows()[0];
      if (this.selectedBorrow) {
          this.selectedBorrowId = this.selectedBorrow.id; //lấy Id của hàng đang select
      }
  }

  search() {
      this.paginationParams = { pageNum: 1, pageSize: 10000, totalCount: 0 };
      this.onGridReady(this.paginationParams);
  }

  eventEnter(event) {
      if (event.keyCode === 13) {
          this.search()
      }
  }

  refresh() {
      this.reader = "";
      this.status = undefined;
      this.isBorrowDate = undefined;
      this.selectedBorrow = new GetListBorrowBookForReturnDto();
      this.selectedBorrowId = undefined;
  }

  onChangeFilterShown() {
      this.advancedFiltersAreShown = !this.advancedFiltersAreShown
  }

  show() {
		this.onGridReady(this.paginationParams);
		this.modal.show()
	}

  close() {
		this.modal.hide();
		this.selectedBorrow = new GetListBorrowBookForReturnDto();
		this.selectedBorrowId = undefined;

		this.refresh();
		this.params.api.clearFocusedCell();
	}

	save() {
		this.modalSave.emit(this.selectedBorrow);
		this.close();
	}
}