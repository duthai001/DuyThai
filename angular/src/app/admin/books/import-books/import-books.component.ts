import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { GridParams } from '@app/shared/common/models/base.model';
import { DataFormatService } from '@app/shared/common/services/data-format.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ListMstSleBookTemporary, MstSleBookTemporary, MstsleBookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-import-books',
  templateUrl: './import-books.component.html',
  styleUrls: ['./import-books.component.less']
})
export class ImportBooksComponent extends AppComponentBase {

  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @ViewChild('imgInput', { static: false }) InputVar: ElementRef;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() close = new EventEmitter();
  @Output() end = new EventEmitter();
  columnDef;
  defaultColDef;
  paginationParams;
  check: boolean = false;
  importMstSleBookTemporary: MstSleBookTemporary = new MstSleBookTemporary();
  rowData = [];
  delearImport = [];
  delearImportError: number;
  delearImportSuccess: number;
  result;
  maxResultCount: number = 20;
  params: GridParams;
  active: boolean;
  loading: boolean;
  data;
  fileName: any;
  code;
  checkFileError: boolean = true;
  isValidate: boolean;

  constructor(
    injector: Injector,
    private dataFormatService: DataFormatService,
  private _mtsSleBokServiceProxy: MstsleBookAppserviceServiceProxy,
  ) {
    super(injector);
    {
      this.columnDef = [
      {
          headerName: this.l("Tên sách"),
          headerTooltip: this.l("Tên sách"),
          field: "bookName",
          minWidth: 150,
          cellClass: ["text-left"],
        },
        {
          headerName: this.l("Thể loại"),
          headerTooltip: this.l("Thể loại"),
          field: "typeOfBook",
          minWidth: 120,
          cellClass: ["text-left"],
        },
        {
          headerName: this.l("Tác giả"),
          headerTooltip: this.l("Tác giả"),
          field: "author",
          minWidth: 120,
          cellClass: ["text-left"],
        },
        {
          headerName: this.l("Số lượng"),
          headerTooltip: this.l("Số lượng"),
          field: "amuont",
          minWidth: 120,
          cellClass: ["text-left"],
        },
        {
          headerName: this.l("Giá tiền"),
          headerTooltip: this.l("Giá tiền"),
          field: "price",
          minWidth: 120,
          cellClass: ["text-left"],
          cellEditor: 'agDateEditorComponent',
        },
        {
          headerName: this.l("Lý do lỗi"),
          headerTooltip: this.l("Lý do lỗi"),
          field: "note",
          cellStyle: params => {
            if (params.data.isLog == true) {
              return { 'color': "#FF0000" };
            }
          },
          minWidth: 500,
          cellClass: ["text-left"],
        },
      ]
      this.defaultColDef = {
        flex: 1,
        floatingFilter: false,
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
  }
  ngOnInit() {
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
  }
  onGridReady(paginationParams) {
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
  }
  callBackGrid(params) {
    this.params = params;
  }
  changePage(paginationParams) {
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount = (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.maxResultCount = paginationParams.pageSize;
  }
  show() {
    this.active = true;
    this.delearImportError = 0;
    this.delearImportSuccess = 0;
    this.onGridReady(this.paginationParams);
    this.checkFileError = true;
    this.modal.show();
  }
  reset() {
    setTimeout(() => {
      this.InputVar.nativeElement.value = "";
      this.fileName = '';
      this.InputVar.nativeElement.click();
    }, 500);
  }
  refresh() {
    this.delearImport = [];
    this.fileName = '';
    this.params.api.setRowData(this.delearImport);
    this.check = false;
    this.delearImportError = 0;
    this.delearImportSuccess = 0;
  }
  onUpload(evt: any): void {
    this.check = false;
    const formData: FormData = new FormData();
    const file = evt.target.files[0];
    this.fileName = file.name;
    formData.append('file', file, file.name);
    this.delearImport = [];
    /* wire up file reader */
    type AOA = any[][];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        for (var i = 1; i < this.data.length; i++) { // for each row
          this.importMstSleBookTemporary = new MstSleBookTemporary();
          this.importMstSleBookTemporary.bookName = this.data[i][0];
          this.importMstSleBookTemporary.typeOfBook = this.data[i][1];
          this.importMstSleBookTemporary.author = this.data[i][2];
          this.importMstSleBookTemporary.amuont = this.data[i][3];
          this.importMstSleBookTemporary.price = this.data[i][4];
          this.delearImport.push(this.importMstSleBookTemporary)
        }
        this.params.api.setRowData(this.delearImport)
    };
    reader.readAsBinaryString(target.files[0]);
  }
  convertLongFromExcelToDate(serial): string {
    if(!serial)
    {
      return '';
    }
    return this.dataFormatService.formatShortDateFromExcelToMoment(serial).format("MM-D-YYYY")
  }
  closeModal() {
    this.active = false;
    this.modal.hide();
    this.params.api.clearFocusedCell();
    this.delearImport = [];
    this.fileName = '';
    this.checkFileError = true;
    this.check = false;
  }
  validate() {
    this.loading = true;
    this.delearImport.forEach(e => e.origin = null)
    let listImportTemp = new ListMstSleBookTemporary();
    listImportTemp.listImportTemp = this.delearImport;
    this._mtsSleBokServiceProxy.validateImportAndReturnData(listImportTemp).subscribe(re => {
      this.delearImport = re;
      this.delearImportError = this.delearImport?.filter(e => e.isLog)?.length;
      this.delearImportSuccess = this.delearImport?.filter(e => !e.isLog)?.length;
      if (this.delearImportError > 0) {
        this.check = false;
        this.checkFileError = false;
      }
      else {
        this.check = true;
        this.checkFileError = true;
      }
      this.loading = false;
    }, err => this.loading = false)
}
importProcess() {
    this.loading = true;
    this._mtsSleBokServiceProxy.saveDataToMainTable().pipe(finalize(() => this.loading = false)).subscribe(
      () => {
        this.notify.info(this.l('Import thành công'));
        this.closeModal()
        this.modalSave.emit(null);
      },
      (error) => {
        this.notify.error(this.l('Yêu cầu import thất bại'));
        this.loading = false;
      },
    )
  }
}
