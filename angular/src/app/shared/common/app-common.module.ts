import { TmssSearchInputComponent } from './input-types/tmss-search-input/tmss-search-input.component';
import { SimpleAgGridComponent } from './ag-grid-custom/simple-ag-grid/simple-ag-grid.component';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { tmssCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { GridsterModule } from 'angular-gridster2';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CountoModule } from 'angular2-counto';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { SingleLineStringInputTypeComponent } from './input-types/single-line-string-input-type/single-line-string-input-type.component';
import { ComboboxInputTypeComponent } from './input-types/combobox-input-type/combobox-input-type.component';
import { CheckboxInputTypeComponent } from './input-types/checkbox-input-type/checkbox-input-type.component';
import { MultipleSelectComboboxInputTypeComponent } from './input-types/multiple-select-combobox-input-type/multiple-select-combobox-input-type.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AgGridModule } from "@ag-grid-community/angular";
import { AgTimeEditorComponent } from './grid/ag-timepicker-editor/ag-time-editor.component';
import { AgDateEditorComponent } from './grid/ag-datepicker-editor/ag-date-editor.component';
import { AgDatepickerRendererComponent } from './grid/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { InputMaskModule } from 'primeng/inputmask';
import { AgCheckboxRendererComponent } from './grid/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { DataFormatService } from './services/data-format.service';
import { AgDropdownRendererComponent } from './grid/ag-dropdown-renderer/ag-dropdown-renderer.component';
import { AgNumericEditorComponent } from './grid/ag-numeric-editor/ag-numeric-editor.component';
import { TmssComboboxComponent } from './input-types/tmss-combobox/tmss-combobox.component';
import { TmssCheckboxComponent } from './input-types/tmss-checkbox/tmss-checkbox.component';
import { TmssDatepickerComponent } from './input-types/tmss-datepicker/tmss-datepicker.component';
import { TmssTextInputComponent } from './input-types/tmss-text-input/tmss-text-input.component';
import{UploadComponent} from './upload/upload.component'
import {FileUploadModule as PrimeNgFileUploadModule} from 'primeng/fileupload';
import {FileUploadModule} from 'ng2-file-upload';
import { TmssMultiColumnDropdownComponent } from './grid/tmss-multi-column-dropdown/tmss-multi-column-dropdown.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TmssReportModalComponent } from './input-types/tmss-report-modal/tmss-report-modal.component';
import { TmssTextareaComponent } from './input-types/tmss-textarea/tmss-textarea.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { UploadFileExcelComponent } from './upload-file-excel/upload-file-excel.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TmssMultiselectComponent } from './input-types/tmss-multiselect/tmss-multiselect.component';
import { AgDatetimepickerEditorComponent } from './grid/ag-datetimepicker-editor/ag-datetimepicker-editor.component';
import { UploadFileImportComponent } from './upload-file-import/upload-file-import.component';
import { AgMonthYearEditorComponent } from './grid/ag-month-year-editor/ag-month-year-editor.component';
import { CustomFunctionService } from './services/custom-function.service';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ProgressBarModule } from "primeng/progressbar";
import { TreeModule } from "primeng/tree";
import { CardModule } from "primeng/card";
import { SelectButtonModule } from "primeng/selectbutton";
import { PanelModule } from "primeng/panel";
import { CheckboxModule } from "primeng/checkbox";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { ColorPickerModule } from "primeng/colorpicker";
import { EditorModule } from "primeng/editor";
import { UploadFileDocxComponent } from './upload-file-docx/upload-file-docx.component';
import { TmssSelectGridModalComponent } from './grid/tmss-select-grid-modal/tmss-select-grid-modal.component';
import { TmssNumberInputComponent } from './input-types/tmss-number-input/tmss-number-input.component';
import { GetDataModalComponent } from './get-data-modal/get-data-modal.component';
// import { UploadFileVodComponent } from '@app/admin/sales/master/mst-sle-vod-issue/upload-file-vod/upload-file-vod.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { GridTableComponent } from './grid-table/grid-table.component';
import { GridPaginationComponent } from './grid-pagination/grid-pagination.component';
import { CommonDeclareModule } from '../common-declare.module';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { BrowserModule } from '@angular/platform-browser';
import { AgCellButtonRendererComponent } from './grid/ag-cell-button-renderer/ag-cell-button-renderer.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        tmssCommonModule,
        TableModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        AppBsModalModule,
        AutoCompleteModule,
        //BrowserModule,
        AgGridModule.withComponents([]),
        InputMaskModule,
        FileUploadModule,
        PrimeNgFileUploadModule,
        MultiSelectModule,
        DragDropModule,
        //InputNumberModule,
        NgxCurrencyModule,
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        ProgressBarModule,
        TreeModule,
        CardModule,
        SelectButtonModule,
        PanelModule,
        CheckboxModule,
        CalendarModule,
        DropdownModule,
        ColorPickerModule,
        EditorModule,
    ],
    declarations: [
        AgDropdownRendererComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        GridTableComponent,
        GridPaginationComponent,
        MultipleSelectComboboxInputTypeComponent,
        AgDatepickerRendererComponent,
        AgDateEditorComponent,
        AgMonthYearEditorComponent,
        AgTimeEditorComponent,
        AgCheckboxRendererComponent,
        AgNumericEditorComponent,
        TmssComboboxComponent,
        TmssMultiselectComponent,
        TmssCheckboxComponent,
        TmssDatepickerComponent,
        TmssReportModalComponent,
        TmssTextInputComponent,
        TmssNumberInputComponent,
        TmssTextareaComponent,
        UploadComponent,
        UploadFileComponent,
        UploadFileExcelComponent,
        UploadFileImportComponent,
        UploadFileDocxComponent,
        TmssMultiColumnDropdownComponent,
        AgDatetimepickerEditorComponent,
        TmssSelectGridModalComponent,
        GetDataModalComponent,
        SimpleAgGridComponent,
        TmssSearchInputComponent,
        WidgetHostTopStatsComponent,
                // UploadFileVodComponent
        AgCellButtonRendererComponent
    ],
    exports: [
        AgDropdownRendererComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        NgxChartsModule,
        GridTableComponent,
        GridPaginationComponent,
        AgGridModule,
        AgDatepickerRendererComponent,
        AgDateEditorComponent,
        AgMonthYearEditorComponent,
        AgTimeEditorComponent,
        AgCheckboxRendererComponent,
        AgNumericEditorComponent,
        TmssComboboxComponent,
        TmssMultiselectComponent,
        TmssCheckboxComponent,
        TmssDatepickerComponent,
        TmssTextInputComponent,
        TmssNumberInputComponent,
        TmssReportModalComponent,
        TmssTextareaComponent,
        UploadComponent,
        UploadFileComponent,
        UploadFileExcelComponent,
        UploadFileDocxComponent,
        UploadFileImportComponent,
        TmssMultiColumnDropdownComponent,
        MultiSelectModule,
        DragDropModule,
        //InputNumberModule,
        AgDatetimepickerEditorComponent,
        TmssSelectGridModalComponent,
        GetDataModalComponent,
        SimpleAgGridComponent,
        TmssSearchInputComponent,
        AgCellButtonRendererComponent
        // UploadFileVodComponent
    ],
    providers: [
        DataFormatService,
        CustomFunctionService,
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig }
    ],

    entryComponents: [
        AgDatepickerRendererComponent,
        AgDropdownRendererComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        SingleLineStringInputTypeComponent,
        
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        MultipleSelectComboboxInputTypeComponent,
        TmssComboboxComponent,
        TmssMultiselectComponent,
        TmssCheckboxComponent,
        TmssDatepickerComponent,
        TmssTextInputComponent,
        TmssNumberInputComponent,
        TmssTextareaComponent,
        TmssReportModalComponent,
        TmssMultiColumnDropdownComponent,
        TmssSelectGridModalComponent,
        GetDataModalComponent,
        TmssSearchInputComponent,
        WidgetHostTopStatsComponent
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
