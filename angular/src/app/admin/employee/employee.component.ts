import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { CustomColDef, GridParams, PaginationParamsModel } from '@app/shared/common/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetReaderForInputDto, GetReaderForViewDto, MstSleReaderServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash';
import { Paginator, Table } from 'primeng';
import { CreateOrEditEmployeeComponent } from './create-or-edit-employee/create-or-edit-employee.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.less'],
  animations: [appModuleAnimation()]
})
export class EmployeeComponent extends AppComponentBase {

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('createOrEditReaderModal') createOrEditReaderModal: CreateOrEditEmployeeComponent;
  columnDefs;
  rowData: any;
  defaultColDef;
  listStatus = [{ value: 0, label: "Tất cả" }, { value: 1, label: "Chưa mượn sách" }, { value: 2, label: "Đang mượn sách" }]
  listTypeOfCardFilter = [];
  nameReader: string;
  selectReader: number;
  isStatus: number = 0;
  test: boolean;
  typeOfCardId: number = -1;
  advancedFiltersAreShown: boolean;
  getReaderForView: GetReaderForViewDto[];
  selected;
  selectedRow: any;

  body : GetReaderForInputDto = new GetReaderForInputDto();

  isExporting = false;

  frameworkComponents;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  params: GridParams;
  maxResultCount: number = 20;
  skipCount: number = 0;
  //@Output() modalCallBack: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _mtsSleReaderServiceProxy: MstSleReaderServiceProxy,
    private _fileDownloadService: FileDownloadService
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
        headerName: this.l('Họ và tên'),
        headerTooltip: this.l('Họ và tên'),
        field: 'name',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Loại thẻ'),
        headerTooltip: this.l('Loại thẻ'),
        field: 'nameCard',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Số điện thoại'),
        headerTooltip: this.l('Số điện thoại'),
        field: 'phoneNumber',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Địa chỉ'),
        headerTooltip: this.l('Địa chỉ'),
        field: 'address',
        flex: 1,
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Ngày Cấp'),
        headerTooltip: this.l('Ngày Cấp'),
        field: 'expiredDayFrom',
        flex: 1,
   
        cellClass: ["text-right"],
      },
      {
        headerName: this.l('Ngày hết hạn'),
        headerTooltip: this.l('Ngày hết hạn'),
        field: 'expiredDayTo',
        flex: 1,
    
        cellClass: ["text-center"],
      },

      {
        headerName: this.l('Trạng Thái'),
        headerTooltip: this.l('Trạng Thái'),
        field: 'isStatus',
        flex: 1.2,
        cellClass: ["text-left"],
      }
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
    this._mtsSleReaderServiceProxy.getTypeOfCard().subscribe(re => {
      this.listTypeOfCardFilter.push({ value: -1, label: "Tất cả" });
      re.forEach(e => this.listTypeOfCardFilter.push({ value: e.id, label: e.cardName }));
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
    return this._mtsSleReaderServiceProxy.getAllReader(
      this.nameReader,
      this.typeOfCardId,
      this.isStatus,
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
    this.nameReader = "";
    this.typeOfCardId = -1;
    this.isStatus = 0;
  }
  eventEnter(event) {
    if (event.keyCode === 13) {
      this.search()
    }
  }
  onChangeFilterShown() {
    this.advancedFiltersAreShown = !this.advancedFiltersAreShown
  }
  createEmployee() {
    this.createOrEditReaderModal.show();
  }

  editEmployee() {
    this.createOrEditReaderModal.show(this.selected);
  }

  deleteEmployee() {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._mtsSleReaderServiceProxy
          .deleteReader(this.selected)
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

  exportToExcel() {
    this.message.confirm('', this.l('DoYouWantToDownloadAFile'), (isConfirmed) => {
      if (isConfirmed) {
        this.isExporting = true;
        var input = new GetReaderForInputDto();
        input.isStatus = this.isStatus;
        input.listTypeOfCardId = this.typeOfCardId;
        input.nameReader = this.nameReader;
        input.sorting = this.sorting ?? null;
        input.skipCount = this.skipCount;
        input.maxResultCount = this.maxResultCount;
        this._mtsSleReaderServiceProxy.exportExcel
          (
            input
          ).pipe(finalize(() => this.isExporting = false))
          .subscribe((result) => {
            this._fileDownloadService.downloadTempFile(result);
          }, err => this.isExporting = false);
      }
    });
  }
}
