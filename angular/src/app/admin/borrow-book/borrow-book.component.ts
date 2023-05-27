import { Component, Injector, ViewChild } from "@angular/core";
import { AppCommonModule } from "@app/shared/common/app-common.module";
import { AgCheckboxRendererComponent } from "@app/shared/common/grid/ag-checkbox-renderer/ag-checkbox-renderer.component";
import { CustomColDef, FrameworkComponent, GridParams, PaginationParamsModel } from "@app/shared/common/models/base.model";
import { AppComponentBase } from "@shared/common/app-component-base";
import { BorrowBookServiceProxy } from "@shared/service-proxies/service-proxies";
import { ceil } from "lodash";
import { finalize } from "rxjs/operators";
import { CreateOrEditBorrowBookComponent } from "./create-or-edit-borrow-book/create-or-edit-borrow-book.component";
import * as moment from "moment";

@Component({
    selector: 'borrow-book',
    templateUrl: './borrow-book.component.html',
    styleUrls: ['./borrow-book.component.less'],
})

export class BorrowBookComponent extends AppComponentBase {
    @ViewChild("createOrEditModal") createOrEditModal: CreateOrEditBorrowBookComponent;

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

    selectedBorrow;
    selectedBorrowId: number;

    frameworkComponents: FrameworkComponent = { agCheckboxRendererComponent: AgCheckboxRendererComponent };

    constructor(
        injector: Injector,
        private _borrowBookServiceProxy: BorrowBookServiceProxy,
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
                headerName: this.l('Độc giả'),
                headerTooltip: this.l('Độc giả'),
                field: 'reader',
                flex: 2,
                cellClass: ["text-right"],
            },
            {
                headerName: this.l('Ngày mượn'),
                headerTooltip: this.l('Ngày mượn'),
                field: 'borrowDate',
                flex: 1,
                cellClass: ["text-center"],
            },
            {
                headerName: this.l('Hạn trả'),
                headerTooltip: this.l('Hạn trả'),
                field: 'dueDate',
                flex: 1,
                cellClass: ["text-left"],
            },
            // {
            //     headerName: this.l('Ngày'),
            //     headerTooltip: this.l('Ngày'),
            //     field: 'day',
            //     flex: 1,
            //     cellClass: ["text-left"],
            // },
            {
                headerName: this.l('Tổng số lượng mượn'),
                headerTooltip: this.l('Tổng số lượng mượn'),
                field: 'amountBorrow',
                flex: 1,
                cellClass: ["text-left"],
            },
            {
                headerName: this.l('Tổng tiền'),
                headerTooltip: this.l('Tổng tiền'),
                field: 'totalLoanAmount',
                flex: 1,
                cellClass: ["text-left"],
            },
            {
                headerName: this.l('Trạng thái'),
                headerTooltip: this.l('Trạng thái'),
                field: 'status',
                flex: 1,
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
            {
                headerName: this.l('Giá niêm yết'),
                headerTooltip: this.l('Giá niêm yết'),
                field: 'money',
                flex: 1,
                cellClass: ["text-left"],
            },
        ];
    }
    ngOnInit() {
        this.rowData = [];
        //this.getMasterData();
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
        this._borrowBookServiceProxy.getAll(
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
        this.getAllDetail();
    }

    search() {
        this.paginationParams = { pageNum: 1, pageSize: 10000, totalCount: 0 };
        this.onGridReady(this.paginationParams);
    }

    // Create or Edit Borrow Book
    create() {
        this.createOrEditModal.show();
    }

    edit() {
        this.createOrEditModal.show(this.selectedBorrowId);
    }

    delete() {
        this.message.confirm('', this.l('Anh/Chị có chắc chắn xoá vĩnh viễn đề xuất này?'), (isConfirmed) => {
            if (isConfirmed) {
                this._borrowBookServiceProxy.delete(this.selectedBorrowId).subscribe(() => {
                    this.notify.info(this.l("SuccessfullyDeleted"));
                    this.onGridReady(this.paginationParams);
                })
            }
        });
    }

    getAllDetail() {
        this._borrowBookServiceProxy.getListDetail(this.selectedBorrowId)
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
        this.isBorrowDate = undefined;
    }

    onChangeFilterShown() {
        this.advancedFiltersAreShown = !this.advancedFiltersAreShown
    }
}