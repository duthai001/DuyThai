// Angular
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// ngx-bootstrap
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

// primeng
import { TableModule } from "primeng/table";
import { ProgressBarModule } from "primeng/progressbar";
import { PaginatorModule } from "primeng/paginator";
import { TreeModule } from "primeng/tree";
import { CardModule } from "primeng/card";
import { SelectButtonModule } from "primeng/selectbutton";
import { FileUploadModule } from "primeng/fileupload";
import { PanelModule } from "primeng/panel";
import { CheckboxModule } from "primeng/checkbox";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { ColorPickerModule } from "primeng/colorpicker";
import { AutoCompleteModule } from "primeng/autocomplete";
import { EditorModule } from "primeng/editor";
import { InputMaskModule } from "primeng/inputmask";
import { DragDropModule } from "primeng/dragdrop";

// ngx-perfect-scrollbar
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

// angular2-counto // TODO: Review Code
import { CountoModule } from "angular2-counto";

// swimlane/ngx-charts
import { NgxChartsModule } from "@swimlane/ngx-charts";

// tmss
import { AppCommonModule } from "@app/shared/common/app-common.module";
import { UtilsModule } from "@shared/utils/utils.module";
import { AppBsModalModule } from "@shared/common/appBsModal/app-bs-modal.module";
import { AgGridModule } from "@ag-grid-community/angular";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),

        TableModule,
        ProgressBarModule,
        PaginatorModule,
        TreeModule,
        CardModule,
        SelectButtonModule,
        FileUploadModule,
        PanelModule,
        CheckboxModule,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ColorPickerModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        DragDropModule,

        AgGridModule.withComponents([]),

        PerfectScrollbarModule,

        CountoModule,

        NgxChartsModule,

        UtilsModule,
        AppCommonModule,
        AppBsModalModule,
    ],
    exports: [
        FormsModule,
        CommonModule,

        ModalModule,
        TooltipModule,
        TabsModule,
        BsDropdownModule,
        PopoverModule,
        BsDatepickerModule,

        TableModule,
        ProgressBarModule,
        ReactiveFormsModule,
        PaginatorModule,
        TreeModule,
        CardModule,
        SelectButtonModule,
        FileUploadModule,
        PanelModule,
        CheckboxModule,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ColorPickerModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        DragDropModule,
        AgGridModule,
        PerfectScrollbarModule,
        CountoModule,
        NgxChartsModule,
        UtilsModule,
        AppCommonModule,
        AppBsModalModule,
    ],
    providers: [],
})
export class CommonDeclareModule {}
