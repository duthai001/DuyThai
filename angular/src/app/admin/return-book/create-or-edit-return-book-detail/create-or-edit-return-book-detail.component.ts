import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AgCellButtonRendererComponent } from '@app/shared/common/grid/ag-cell-button-renderer/ag-cell-button-renderer.component';
import { AgDateEditorComponent } from '@app/shared/common/grid/ag-datepicker-editor/ag-date-editor.component';
import { AgDatepickerRendererComponent } from '@app/shared/common/grid/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { AgDropdownRendererComponent } from '@app/shared/common/grid/ag-dropdown-renderer/ag-dropdown-renderer.component';
import { AgTimeEditorComponent } from '@app/shared/common/grid/ag-timepicker-editor/ag-time-editor.component';
import { CustomColDef, FrameworkComponent, GridParams } from '@app/shared/common/models/base.model';
import { CustomFunctionService } from '@app/shared/common/services/custom-function.service';
import { DataFormatService } from '@app/shared/common/services/data-format.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateReturnDetailDto, ReturnBookServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-return-book-detail',
  templateUrl: './create-or-edit-return-book-detail.component.html',
  styleUrls: ['./create-or-edit-return-book-detail.component.less']
})
export class CreateOrEditReturnBookDetailComponent extends AppComponentBase {
  @Input() selectedBorrowId;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateQuantityOrPayment: EventEmitter<any> = new EventEmitter<any>();

  detailColumnDefs: CustomColDef[];
	rowData: CreateReturnDetailDto[] = [];
	params: GridParams;
	selectedDetail: CreateReturnDetailDto = new CreateReturnDetailDto();
	newDetail: CreateReturnDetailDto = new CreateReturnDetailDto();
	selectedChangeDetail: CreateReturnDetailDto = new CreateReturnDetailDto();

  checkClickBtn: boolean = false;
  loadingSave: boolean = false;
  saving: boolean = false;

  totalPaymentAndPrice = {
    amountBorrow: 0
  };

	listBook = [];
	listPrice = [];

  defaultColDef = {
		rowHeight: 50,
		minWidth: 80,
		floatingFilter: false,
		filter: 'agTextColumnFilter',
		resizable: true,
		sortable: true,
		floatingFilterComponentParams: { suppressFilterButton: true },
		singleClickEdit: true,
		textFormatter: function (r) {
			if (r == null) return null;
			return r.toLowerCase();
		},
		headerComponentParams: {
			template:
				'<div class="ag-cell-label-container" role="presentation">' +
				'  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
				'  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
				'    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
				'    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
				'    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
				'    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
				'    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
				'    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
				'  </div>' +
				'</div>',
		},
	};

  frameworkComponents: FrameworkComponent = {
		agSelectRendererComponent: AgDropdownRendererComponent,
		agDateEditorComponent: AgDateEditorComponent,
		agCellButtonComponent: AgCellButtonRendererComponent,
		agDatepickerRendererComponent: AgDatepickerRendererComponent,
		agTimeEditorComponent : AgTimeEditorComponent
	};

  constructor(
    injector: Injector,
	public dataFormatService: DataFormatService,
    private _returnBookServiceProxy: ReturnBookServiceProxy,
	private _customFunctionService: CustomFunctionService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
	this.rowData = [];
	this.getMasterVehicleData();
  }

  //Detail tab

  getMasterVehicleData() {
		this._returnBookServiceProxy.getMasterData()
			.pipe(finalize(() => {
				this.detailColumnDefs = [
					{
						headerName: this.l('Action'),
						headerTooltip: this.l('Action'),
						cellRenderer: 'agCellButtonComponent',
						buttonDef: {
							text: this.l('Delete'),
							useRowData: true,
							iconName: 'fa fa-trash',
							function: this.deleteDetail.bind(this),
						},
						maxWidth: 150,
						cellClass: ["text-center"]
					},
					{
						headerName: this.l("Book"), headerTooltip: this.l("Book"),
						cellEditor: 'agRichSelectCellEditor',
						cellClass: ["text-center", 'cell-clickable'], field: "bookId",
						width: 415,
						editable: true,
						cellRenderer: (params) => this.listBook.find(e => e.id == params.value)?.bookName,
						cellEditorParams: (p) => {
							return {
								cellRenderer: (params) => this.listBook.find(e => e.id == params.value)?.bookName,
								values: this.getListMaster(undefined, "bookId"),
								searchDebounceDelay: 5000
							}
						},
						cellStyle: { "background-color": "#FFC !important" },
						onCellClicked: this.onCellClicked.bind(this)
					},
					{
						headerName: this.l("Quantity"), headerTooltip: this.l("Quantity"),
						valueFormatter: (params) => this.dataFormatService.moneyFormat(params.value),
						cellClass: ['text-center'], field: "quantity",
						maxWidth: 150,
						editable: true,
					},
				];
			}))
			.subscribe((result) => {
				this.listBook = result.listBook;
				this.listPrice = result.listPrice;
        		this.getListVehicle();
				this.params.api.setRowData(this.rowData);
			})
	}

  callBackGrid(params) {
		this.params = params;
	}

  onRowSelected(params) {
		this.selectedDetail = params.api.getSelectedRows()[0];
	}

  onCellClicked(event) {
		this.selectedChangeDetail = { ...event.data };
	}

  onCellValueChanged(cellParams) {
			if (cellParams.colDef.field === "bookId") {
			this.getTotal();
			this.params.api.setRowData(this.rowData);
		}

		if (cellParams.colDef.field === "quantity") {
			if (cellParams.data.quantity != null) {
				this.rowData[cellParams.rowIndex].quantity = Number(cellParams.data.quantity);
			}
			if (cellParams.data.quantity == null) {
				this.rowData[cellParams.rowIndex].quantity = 0;
			}
			this.params.api.setRowData(this.rowData);
			this.params.api.getRowNode(cellParams.rowIndex.toString()).setSelected(true);
			this.getTotal();
		}
	}

  getListVehicle() {
		this._returnBookServiceProxy.getDetailById(this.selectedBorrowId)
			.subscribe((result) => {
				this.rowData = result;
				this.params.api.setRowData(this.rowData);
				this.getTotal();
			})
	}

	// getListVehicleAfterCreateOrEdit(borrrowId) {
	// 	this.rowData.length = 0;

	// 	this._returnBookServiceProxy.getDetailById(borrrowId)
	// 		.subscribe((result) => {
	// 			this.rowData = result;
	// 			this.params.api.setRowData(this.rowData);
	// 			this.getTotal();
	// 		})
	// }

  getListMaster(value, key) {
		if (key == "bookId") {
			let result = [...this.listBook].map(e => e.id);
			return result;
		}
	}

  createDetail() {
		this.newDetail = new CreateReturnDetailDto();
		this.newDetail.quantity = 1;
		this.rowData.push(this.newDetail)
		this.params.api.setRowData(this.rowData);
		this.getTotal();
	}

  deleteDetail(event) {
		this.message.confirm('', this.l('Bạn có chắc chắn xoá? Bản ghi đã xoá sẽ không thể khôi phục lại'), (isConfirmed) => {
			if (isConfirmed) {
				if (event.data.id) {
					this._returnBookServiceProxy.deleteDetail(event.data.id).subscribe(() => {
						this.notify.info(this.l("SuccessfullyDeleted"));
					});
				}
				this.rowData.splice(event.node.rowIndex, 1);
				this.params.api.setRowData(this.rowData);

				this.getTotal();
			}
		});
	}

  cancelDetail() {
		this.message.confirm('', this.l('Hủy thay đổi xe sẽ hủy tất cả các thay đổi thông tin xe về tại thời điểm trước khi sửa (lấy lại dữ liệu xe cũ vả không thể khôi phục lại phụ kiện khi đã xóa)?'), (isConfirmed) => {
			if (isConfirmed) {
				this._returnBookServiceProxy.getDetailById(this.selectedBorrowId)
					.subscribe((result) => {
						this.rowData = result;
						this.params.api.setRowData(this.rowData)
						this.getTotal();
					})
			}
		});
	}

  saveDetail() {
		this.modalSave.emit(null);
		this.checkClickBtn = true;
		//this.loadingSave = true;
	}

  getListDetailByBorrow(listDetail) {
		this.rowData = listDetail;
		this.params.api.setRowData(this.rowData);
		this.getTotal();
	}

  getTotal() {
		this.totalPaymentAndPrice.amountBorrow = this.rowData.reduce((total, value) => {
			return total += value.quantity;
		}, 0);

		this.updateQuantityOrPayment.emit(this.totalPaymentAndPrice);
	}
}
