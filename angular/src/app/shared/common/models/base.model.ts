import { AgCheckboxRendererComponent } from './../grid/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { ColDef, Column, ColumnApi, GridApi, IAggFunc, ICellEditorParams, IsColumnFunc } from '@ag-grid-enterprise/all-modules';
import { AgCellButtonRendererComponent } from '../grid/ag-cell-button-renderer/ag-cell-button-renderer.component';
import { AgDropdownRendererComponent } from '../grid/ag-dropdown-renderer/ag-dropdown-renderer.component';
import { AgDateEditorComponent } from '../grid/ag-datepicker-editor/ag-date-editor.component';
import { AgTimeEditorComponent } from '../grid/ag-timepicker-editor/ag-time-editor.component';
import { AgDatetimepickerEditorComponent } from '../grid/ag-datetimepicker-editor/ag-datetimepicker-editor.component';
import { AgDatepickerRendererComponent } from '../grid/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { AgMonthYearEditorComponent } from '../grid/ag-month-year-editor/ag-month-year-editor.component';

export interface PaginationParamsModel {
	totalCount?: number | undefined;
	totalPage?: number | undefined;
	sorting?: string | undefined;
	skipCount?: number | undefined;
	pageSize?: number | undefined;
	pageNum?: number | undefined;
}

export interface GridParams {
	api: GridApi,
	columnApi: ColumnApi,
	editingStartedValue: string,
}

export interface GridFrameworkComponent {

}

export interface RowSelectionParams {
	api: GridApi,
	columnApi: ColumnApi
}

export interface CustomColDef extends ColDef {
	buttonDef?: {
		text?: string | Function;
		useRowData?: boolean;
		disabled?: boolean | Function;
		function?: (params: any) => void;
		iconName?: string;
		className?: string;
		message?: string;
	},
	buttonDefTwo?: {
		text?: string | Function;
		useRowData?: boolean;
		disabled?: boolean | Function;
		function?: (params: any) => void;
		iconName?: string;
		className?: string;
		message?: string;
	},
	buttonDefThree?: {
		text?: string | Function;
		useRowData?: boolean;
		disabled?: boolean | Function;
		function?: (params: any) => void;
		iconName?: string;
		className?: string;
		message?: string;
	},
	disableSelect?: boolean | IsColumnFunc,
	list?: any[] | IAggFunc,
	disabled?: boolean | IsColumnFunc,
	disableCheckbox?: boolean | IsColumnFunc,
	data?: string[] | boolean[] | number[],
	children?: CustomColDef[],
	validators?: string[],
	textFormatter?: IsColumnFunc | Function | any,
	property?: { key: string, value: string },
	listName?: string,
	api?: any,
	cellClass?: any,
	maxLength?: number,
	isSearch?: boolean,
	position?: number | any
}

export interface FrameworkComponent {
	agSelectRendererComponent?: typeof AgDropdownRendererComponent,
	agCellButtonComponent?: typeof AgCellButtonRendererComponent,
	agCheckboxRendererComponent?: typeof AgCheckboxRendererComponent,
	agDateEditorComponent?: typeof AgDateEditorComponent,
	agMonthYearEditorComponent?: typeof AgMonthYearEditorComponent,
	agTimeEditorComponent?: typeof AgTimeEditorComponent,
	agDatetimepickerEditorComponent?: typeof AgDatetimepickerEditorComponent
	agDatepickerRendererComponent?: typeof AgDatepickerRendererComponent
}

export interface AgCellEditorParams extends ICellEditorParams {
	column: AgColumn,
	oldValue: string | number | undefined,
	newValue: string | number | undefined
	key?: string | number,
	event?: KeyboardEvent,
	colDef: CustomColDef,
	api: GridApi
}
export interface AgColumn extends Column {
	editingStartedValue: string | number | undefined
}
export interface PaginationParamsModel {
	totalCount?: number | undefined;
	totalPage?: number | undefined;
	sorting?: string | undefined;
	skipCount?: number | undefined;
	pageSize?: number | undefined;
	pageNum?: number | undefined;
}

export interface GridParams {
	api: GridApi,
	columnApi: ColumnApi,
	editingStartedValue: string
}

export interface GridFrameworkComponent {

}

export interface RowSelectionParams {
	api: GridApi,
	columnApi: ColumnApi
}
export interface AgCellPositionParams {
	column?: Column,
	rowIndex?: number,
	rowPinned: string | undefined,
	floating: string | undefined
}
