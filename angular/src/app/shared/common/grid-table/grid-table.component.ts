import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Module } from '@ag-grid-community/all-modules';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GridTableService } from '../services/grid-table.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class GridTableComponent extends AppComponentBase implements OnInit {

  @ViewChild('input', { static: false }) input: ElementRef;

  //Col Def
  @Input() columnDefs;
  @Input() defaultColDef;
  @Input() autoGroupColumnDef;
  @Input() groupIncludeTotalFooter;
  @Input() groupIncludeFooter;
  @Input() suppressAggFuncInHeader;
  @Input() rowGroupPanelShow;
  @Input() frameworkComponents;
  @Input() rowClassRules;
  @Input() rowData: any;
  @Input() ignoreEnterEvent: boolean;
  @Input() alwaysEnableBtn: boolean;
  @Input() isDisabled: boolean;
  @Input() detailCellRendererParams;
  @Input() masterDetail: boolean;
  @Input() modules: Module[] = AllModules;
  @Input() detailRowData;
  @Input() rowModelType;
  @Input() columnTypes;
  @Input() groupDefaultExpanded;
  @Input() groupUseEntireRow;
  @Input() rowDragManaged;
  @Input() animateRows;
  @Input() suppressMoveWhenRowDragging;
  @Input() detailRowHeight;
  @Input() headerHeight;
  @Input() suppressRowTransform: boolean;

  //Grid and pagintion
  @Input() paginationParams = { pageNum: 1, pageSize: 10, totalCount: 0 };
  @Output() changePaginationParams = new EventEmitter();
  @Output() callBackEvent = new EventEmitter();
  @Input() disabledHorizontalScroll: boolean = false;

  //StyleonChangeSelection
  @Input() height;
  @Input() getRowStyle;
  @Input() pinnedBottomRowData;

  // Cell
  @Output() onChangeSelection = new EventEmitter();
  @Input() rowSelection;
  @Output() cellClicked = new EventEmitter();
  @Output() cellDoubleClicked = new EventEmitter();
  @Output() cellKeyPress = new EventEmitter();
  @Output() cellValueChanged = new EventEmitter();
  @Output() rowValueChanged = new EventEmitter();
  @Output() cellEditingStopped = new EventEmitter();
  @Output() cellEditingStarted = new EventEmitter();
  @Output() cellFocused = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  @Output() rowSelected = new EventEmitter();
  @Output() cellMouseOver = new EventEmitter();
  @Output() keyPress = new EventEmitter();
  @Output() rowDragEnter = new EventEmitter();
  @Output() rowDragEnd = new EventEmitter();
  @Output() rowDragMove = new EventEmitter();
  @Output() rowDragLeave = new EventEmitter();
  @Output() keydown = new EventEmitter();

  cellEditStopParams;
  @Input() isKeepFocus: boolean;

  @Input() showPagination: boolean = true;

  @Input() isSuppressHorizontalScroll: boolean = false;
  @Input() isSuppressRowClickSelection: boolean = false;
  @Input() singleClickEdit = false;
  @Input() className;
  style;
  autoHeight;
  cellEditStartParams;
  @Input() checkedData;
  params;
  gridColumnApi;
  gridApi;
  @Input() enableFilter;
  @Input() isViewSideBar = true;
  sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: this.l("Columns"),
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressColumnFilter: false
        },
      },
    ],
    defaultToolPanel: '',
  };
  constructor(injector: Injector,
    private gridTableService: GridTableService) {
    super(injector);
    this.rowSelection = this.rowSelection ?? 'single';
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(): void {
    if (this.height) {
      this.setHeight(this.height);
    } else {
      this.autoHeight = 'autoHeight';
    }


    this.columnTypes = {
      "dateColumn": {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateParts = cellValue.split('/');
            var day = Number(dateParts[0]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[2]);
            var cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          },
        },
      }
    };
    if (!this.autoGroupColumnDef) {
      this.defaultColDef = Object.assign({}, {
        editable: false,
        resizable: true,
        menuTabs: [],
        tooltipValueGetter: (t: any) => t.value,
        filter: 'agTextColumnFilter',
        // filterParams: {
        //   caseSensitive: true,
        // },
        //floatingFilterComponentParams: { suppressFilterButton: true },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        //cellClass: ['cell-border', 'cell-readonly'],
        cellStyle: params => {
          if (params.colDef.field === 'stt') {
            return { textAlign: 'center' };
          }
        },
      }, this.defaultColDef);
    }
  }

  processCellForClipboard(params) {
    return params?.value ?? '';
 };

  setHeight(height) {
    this.style = Object.assign({}, { height });
  }

  onGridReady(params) {
    this.params = params;
    this.callBackEvent.emit(params);
  }

  tabToNextCell(params) { // Sử dụng tab để focus vào những ô cần sửa
    var previousCell = params.previousCellPosition,
      nextCell = params.nextCellPosition,
      nextRowIndex = previousCell.rowIndex,
      renderedRowCount = params?.api?.getModel().getRowCount(),
      result;

    if (nextRowIndex < 0) nextRowIndex = -1;

    if (nextRowIndex >= renderedRowCount) nextRowIndex = renderedRowCount - 1;

    result = {
      rowIndex: nextRowIndex,
      column: nextCell != null ? nextCell.column : previousCell.column,
      floating: nextCell != null ? nextCell.floating : previousCell.floating,
    };

    return result;
  }

  onCellKeyPress(params) {
    if (['Enter'].indexOf(params.event.key.toString()) !== -1) this.onSearch.emit(params);
    else this.cellKeyPress.emit(params);
  }

  onKeyPress(params) {
    this.keyPress.emit(params);
  }

  changePage(params) {
    this.changePaginationParams.emit(params);
  }

  onRowFocused(params) {
  }

  onSelectionChanged(params) {
    return this.onChangeSelection.emit(params);
  }

  cellDoubleClickedEvent(params) {
    return this.cellDoubleClicked.emit(params);
  }

  cellClickedEvent(params) {
    return this.cellClicked.emit(params);
  }

  onCellMouseOver(params) {
    return this.cellMouseOver.emit(params);
  }

  onCellValueChanged(params) {
    if (this.checkedData) {
      this.checkedValueChange(params);
    }

    if (params.colDef.field !== 'checked') {
      this.cellValueChanged.emit(params);
    }
  }

  onRowClicked(event) {
    return this.rowClicked.emit(event);

  }

  onRowSelected(event) {
    return this.rowSelected.emit(event);
  }

  //event drag-n-drop
  onRowDragEnter(event) {
    return this.rowDragEnter.emit(event);
  }
  onRowDragEnd(event) {
    return this.rowDragEnd.emit(event);

  }
  onRowDragMove(event) {
    return this.rowDragMove.emit(event);

  }
  onRowDragLeave(event) {
    return this.rowDragLeave.emit(event);

  }

  checkedValueChange(params) {
    let index;
    if (params.api.getColumnDef('checked')) {
      index = params.api.getColumnDef('checked').fieldCheck;
    }
    if (params.data.checked) {
      this.checkedData[params.data[index]] = params.data;
    } else if (this.checkedData[params.data[index]]) {
      delete this.checkedData[params.data[index]];
    }
  }

  onRowValueChanged(params) {
    this.rowValueChanged.emit(params);
  }

  onCellEditingStopped(params) {
    this.cellEditStopParams = params;
    this.cellEditingStopped.emit(params);
  }

  onCellEditingStarted(params) {
    this.cellEditStartParams = params;
    params.column.editingStartedValue = params.value;
    this.cellEditingStarted.emit(params);
  }

  onCellFocused(params) {
    this.cellFocused.emit(params);
  }

  focus(event) {
  }

  onKeyUp(params) {

  }

  onKeyDown(params) {
    this.navigateToNextCell(params);
    // Những nút không thuộc hàng phím số và phím chữ
    if (params.keyCode < 45) {
      return;
    }

    if(params.keyCode == 67 && params.ctrlKey){ //ctrl + C
      this.params.api.copySelectedRangeToClipboard(false);
    }
    const validators = this.cellEditStartParams ? this.cellEditStartParams.colDef.validators : null;

    if (validators && validators.length > 0) {
      for (let i = 0, length = validators.length; i < length; i++) {
        if (this[`${validators[i]}Validate`].call(this, params)) {
          return;
        }
      }
    }
  }

  focusAfterEdit(params) {
  }

  resetAfterEdit(params) {
    params.node.setDataValue(params.colDef.field, params.column.editingStartedValue);
    // params.api.setFocusedCell(params.rowIndex, params.colDef.field);
  }

  numberValidate(params) {
    const NUMBER_REGEX = /^\d+$/g;
    if (params.key !== '' && (params.key !== ',' && params.key !== '.' && params.key && !NUMBER_REGEX.test(params.key))) {
      this.resetAfterEdit(this.cellEditStartParams);
      this.notify.warn('Sai định dạng số');
      this.focusAfterEdit(this.cellEditStartParams);
      return true;
    }
    return false;
  }

  requiredValidate(params) {
    if (params.column.editingStartedValue && (!params.value || !params.value.toString())) {
      this.notify.warn('Dữ liệu không được trống');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  integerNumberValidate(params) {
    const NUMBER_REGEX = /^\d+$/g;
    if (params.value !== '' && (params.value && !NUMBER_REGEX.test(params.value))) {
      // this.resetAfterEdit(params);
      this.notify.warn('Chỉ được nhập số nguyên');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  navigateToNextCell(params) {
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;

    if (params.keyCode === KEY_UP || params.keyCode === KEY_DOWN) {
      // this.keydown.emit(params);
      // console.log(12312);
    }
    if (!this.isSuppressRowClickSelection) {
      let focusCell = this.params.api.getFocusedCell();
      switch (params.keyCode) {
        case KEY_DOWN:
          // set selected cell on current cell + 1
          this.params.api.forEachNode(function (node) {
            if (focusCell.rowIndex === node.rowIndex) {
              node.setSelected(true);
            }
          });
          return;
        case KEY_UP:
          // set selected cell on current cell - 1
          this.params.api.forEachNode(function (node) {
            if (focusCell.rowIndex === node.rowIndex) {
              node.setSelected(true);
            }
          });
          return;
        case KEY_LEFT:
        case KEY_RIGHT:
          return;
        default: return;
      }
    }
  }


}
