import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, Injector, Input, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { TmssCheckboxComponent } from '../tmss-checkbox/tmss-checkbox.component';
import { TmssSelectGridModalComponent } from '../../grid/tmss-select-grid-modal/tmss-select-grid-modal.component';
import { PaginationParamsModel } from '../../models/base.model';

@Component({
    selector: 'tmss-report',
    templateUrl: './tmss-report-modal.component.html',
    styleUrls: ['./tmss-report-modal.component.less'],
})
export class TmssReportModalComponent extends AppComponentBase {
    @ViewChild('modal', { static: false }) modal: ModalDirective;
    @ViewChild('combobox') combobox: ElementRef;
    @ViewChild('doc') doc: ElementRef;
    @ViewChild('checkbox1') checkbox1: TmssCheckboxComponent;
    @ViewChild('searchInput1', { static: false }) searchInput1: ElementRef | any;
    @ViewChild('showPartList') showPartList: TmssSelectGridModalComponent;

    @Input() headerText: string = '';
    @Input() minMode: string = '';
    @Input() hideLeftButton: boolean = false;
    @Input() getTenantInfo: boolean = false;
    @Input() modalClass: string = 'tmss-modal-md';
    @Input() className: string = '';
    @Input() apiCall: Function;
    @Input() defaultDateValue: Date = new Date();
    @Input() hasTimePicker: boolean = false;
    @Input() showCheckbox1: boolean = false;
    @Input() showCheckbox2: boolean = false;
    @Input() showCheckbox3: boolean = false;
    @Input() checkBoxText1: string = '';
    @Input() checkBoxTetx2: string = '';
    @Input() checkBoxText3: string = '';
    @Input() showSingleDate: boolean = false;
    @Input() hideReportType: boolean = false;
    @Input() hideDateRange: boolean = false;
    @Input() hideRegionType: boolean = false;
    @Input() showCombobox: boolean = false;
    @Input() showCombobox1: boolean = false;
    @Input() showCombobox2: boolean = false;
    @Input() isDisabledCombobox: boolean = true;
    @Input() comboboxText: string = undefined;
    @Input() comboboxText1: string = undefined;
    @Input() comboboxText2: string = undefined;
    @Input() list: any[] = [];
    @Input() leftButton: string = this.l('Print');
    @Input() rightButton: string = this.l('Cancel');
    @Input() rpTypeFullRow: boolean = false;
    @Input() inputText1: string = '';
    @Input() inputText2: string = '';
    @Input() combobox1Items:  {label: string , value: number | string}[]=[];
    @Input() combobox2Items:  {label: string , value: number | string}[]=[];
    @Input() fromDatePicker:  Date = new Date();
    @Input() toDatePicker:  Date = new Date();
    @Input() comboboxValue:  number | string;
    @Input() combobox1Value:  number | string;
    @Input() combobox2Value:  number | string;
    @Input() isShowModal: boolean = false;
    @Input() isRequiredInput1: boolean = false;
    @Input() dateInputFormat: string = 'DD/MM/YYYY';
    inputText1Value: any;
    inputText1ValueCheck: any;
    inputText2Value: any;
    //GetAllPart
    paginationParams: PaginationParamsModel = { pageNum: 1, pageSize: 10, totalCount: 0, totalPage: 0, sorting: '', skipCount: 0 };
    isLoading: boolean = false;
    addPartColDef = [
            {
                headerName: this.l('PrtCode'),
                headerTooltip: this.l('PrtCode'),
                field: 'partCode',
            },
            {
                headerName: this.l('PrtName'),
                headerTooltip: this.l('PrtName'),
                field: 'partName',
            },
            {
                headerName: this.l('SellPrice'),
                headerTooltip: this.l('SellPrice'),
                field: 'sellPrice',
                cellClass: ['text-right'],
            },
            {
                headerName: this.l('Unit'),
                headerTooltip: this.l('Unit'),
                field: 'unitName',
                cellClass: ['text-center'],
            },
            {
                headerName: this.l('TaxRate'),
                headerTooltip: this.l('TaxRate'),
                field: 'taxRate',
                cellClass: ['text-right'],
            },
        ];
        defaultColDef = {
            resizable: true,
            flex: 1,
            suppressMenu: false,
            sortable: true,
            suppressHorizontalScroll: true,
            textFormatter: function (r: string | null) {
                if (r == null) return null;
                return r.toLowerCase();
            },
        };


    @Output() modalPrint: EventEmitter<any> = new EventEmitter();

    checked1: boolean = false;
    // DatePicker
    date: Date = new Date();
    docReport = 'PDF';


    reportTypes = [
        { label: this.l('XLS'), value: 'XLS' },
        { label: this.l('DOCX'), value: 'DOCX' },
        { label: this.l('PDF'), value: 'PDF' },
        { label: this.l('RTF'), value: 'RTF' },
    ];

    regionTypes = [
        { label: this.l('AllRegion'), value: 0 },
        { label: this.l('Norland'), value: 1 },
        { label: this.l('SouthWard'), value: 2 },
    ];

    loading;

    constructor(injector: Injector,
        // private _serviceProxy: SrvPrtCounterSaleServiceProxy,
        // private _cacheProxy: MstGenCacheServiceProxy,
        private appSessionService: AppSessionService,
        ) {
        super(injector);
    }

    @HostListener('window:keydown.enter', ['$event']) onEnterEvent() {
        if (this.modal.isShown ){
            const input_focused = document.activeElement
            if(this.isShowModal && input_focused === this.searchInput1.input.nativeElement && document.hasFocus()){
                return;
            }
            else if (this.isShowModal && this.inputText1ValueCheck)
            {
                this.inputText1ValueCheck = undefined;
                return;
            }
            else this.print();
        }
    }

    show(date?) {
        // if (this.getTenantInfo && !abp.session.tenantId){
        //     this._cacheProxy.getAllTenant().subscribe((res: DealerDto[]) => {
        //         res.forEach((e: DealerDto)=>{
        //             this.list.push({
        //                 label: `${e.tenantCode} : ${e.tenantNameVn}`,
        //                 value: e.id,
        //             })
        //         })
        //     });
        // }
        if (this.getTenantInfo && abp.session.tenantId){
            this.list.push({
                label: `${this.appSessionService.tenant.name} : ${this.appSessionService.tenant.tenancyName}`,
                value: this.appSessionService.tenant.id,
            });
        }
        this.date = date ?? new Date();
        this.defaultDateValue = date ?? new Date();
        this.docReport = 'DOCX';
        this.modal.show();
        if (this.checkbox1) this.checkbox1.iCheckBox.nativeElement.focus();
    }

    ngOnInit() {}

    print() {
        if (!this.hideDateRange && this.fromDatePicker > this.toDatePicker){
            this.notify.warn(this.l('NotValid',this.l('Time')));
            return;
        }
        const report = Object.assign({
            date: this.date,
            checked1: this.checked1,
            reportType: this.docReport?.toLowerCase(),
            combobox1Value: this.combobox1Value,
            fromDatePicker: this.fromDatePicker,
            toDatePicker: this.toDatePicker,
            inputText1Value: this.inputText1Value,
            inputText2Value: this.inputText2Value,
            combobox2Value: this.combobox2Value,
            comboboxValue: this.comboboxValue
        });
        this.modalPrint.emit(report);
        this.modal.hide();
    }

    onCancelBtn() {
        this.modal.hide();
    }

    // getData(partCode?: string | null | undefined, paginationParams?: PaginationParamsModel) {
    //     return this._serviceProxy.getPartForOrders(
    //         paginationParams ? paginationParams.sorting : '',
    //         paginationParams ? paginationParams.skipCount : 0,
    //         paginationParams ? paginationParams.pageSize : 10,
    //         partCode,
    //     );
    // }
    setLoading(val: any) {
        this.isLoading = val;
    }
    getSelectedPart(params: any){
        this.inputText1Value = params.partCode;
        this.inputText1ValueCheck = params.partCode;
    }
}
