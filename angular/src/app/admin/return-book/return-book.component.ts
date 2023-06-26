import { Component, Injector, ViewChild } from "@angular/core";
import { AppCommonModule } from "@app/shared/common/app-common.module";
import { AgCheckboxRendererComponent } from "@app/shared/common/grid/ag-checkbox-renderer/ag-checkbox-renderer.component";
import { CustomColDef, FrameworkComponent, GridParams, PaginationParamsModel } from "@app/shared/common/models/base.model";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ceil } from "lodash";
import { finalize } from "rxjs/operators";
import * as moment from "moment";
import { ReturnBookServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditReturnBookComponent } from "./create-or-edit-return-book/create-or-edit-return-book.component";

@Component({
    selector: 'return-book',
    templateUrl: './return-book.component.html',
    styleUrls: ['./return-book.component.less'],
})

export class ReturnBookComponent extends AppComponentBase {
    @ViewChild("createOrEditModal") createOrEditModal: CreateOrEditReturnBookComponent;

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
        { value: 0, label: "Đang trả" }, 
        { value: 1, label: "Đã trả" }, 
        { value: 2, label: "Đã quá hạn" }
    ]

    reader: string;
    status: number = -1;
    firstDay = moment().subtract(1, 'months').startOf('month')
    lastDay = moment();
    returnDate: moment.Moment[] = [this.firstDay, this.lastDay];
    isReturnDate: boolean;

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
    advancedFiltersAreShown: boolean = false;

    selectedReturn;
    selectedReturnId: number;

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
                headerName: this.l('Mã độc giả'),
                headerTooltip: this.l('Mã độc giả'),
                field: 'readerNo',
                width: 150,
                cellClass: ["text-right"],
            },
            {
                headerName: this.l('Tên độc giả'),
                headerTooltip: this.l('Tên độc giả'),
                field: 'readerName',
                width: 200,
                cellClass: ["text-right"],
            },
            {
                headerName: this.l('Mã phiếu trả'),
                headerTooltip: this.l('Mã phiếu trả'),
                field: 'returnNo',
                width: 150,
                cellClass: ["text-right"],
            },
            {
                headerName: this.l('Ngày trả'),
                headerTooltip: this.l('Ngày trả'),
                field: 'returnBookDate',
                width: 150,
                cellClass: ["text-center"],
            },
            {
                headerName: this.l('Tổng SL'),
                headerTooltip: this.l('Tổng SL'),
                field: 'quantity',
                width: 75,
                cellClass: ["text-left"],
            },
        ];

        this.columnDefsDetail = [
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
                field: 'book',
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
        ];
    }
    ngOnInit() {
        this.rowData = [];
        this.rowDataDetail = [];
        this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
        this.paginationParamsDetail = { pageNum: 1, pageSize: 20, totalCount: 0 };
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
        this._returnBookServiceProxy.getAll(
            this.reader,
            this.isReturnDate == true ? this.returnDate[0] : null,
            this.isReturnDate == true ? this.returnDate[1] : null,
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
                    if (this.rowData.length && !this.selectedReturnId) {
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
        this.selectedReturn = params.api.getSelectedRows()[0];
        if (this.selectedReturn) {
            this.selectedReturnId = this.selectedReturn.id; //lấy Id của hàng đang select
        }
        this.getAllDetail();
    }

    search() {
        this.paginationParams = { pageNum: 1, pageSize: 10000, totalCount: 0 };
        this.onGridReady(this.paginationParams);
    }

    //Create or Edit Return Book
    create() {
        this.createOrEditModal.show();
    }

    edit() {
        this.createOrEditModal.show(this.selectedReturnId);
    }

    delete() {
        this.message.confirm('', this.l('Anh/Chị có chắc chắn xoá vĩnh viễn đề xuất này?'), (isConfirmed) => {
            if (isConfirmed) {
                this._returnBookServiceProxy.delete(this.selectedReturnId).subscribe(() => {
                    this.notify.info(this.l("SuccessfullyDeleted"));
                    this.onGridReady(this.paginationParams);
                })
            }
        });
    }

    getAllDetail() {
        this._returnBookServiceProxy.getListDetail(this.selectedReturnId)
            .subscribe((re) => {
                this.rowDataDetail = re;
                //this.paramsDetail.api.setRowData(this.rowDataDetail);
            })
    }

    eventEnter(event) {
        if (event.keyCode === 13) {
            this.search()
        }
    }

    refresh() {
        this.reader = "";
        this.status = undefined;
        this.isReturnDate = undefined;
    }

    onChangeFilterShown() {
        this.advancedFiltersAreShown = !this.advancedFiltersAreShown
    }
}