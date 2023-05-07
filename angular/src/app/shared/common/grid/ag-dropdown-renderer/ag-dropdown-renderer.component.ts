import { style } from '@angular/animations';
import { GridTableService } from './../../services/grid-table.service';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'ag-dropdown-renderer',
  templateUrl: './ag-dropdown-renderer.component.html',
  styleUrls: ['./ag-dropdown-renderer.component.less']
})
export class AgDropdownRendererComponent implements ICellRendererAngularComp {

  params: any;
  selectForm: FormGroup;
  field;
  disableSelect: boolean | Function;
  select;
  inputSelect;
  label: string = 'value';
  value: string = 'key';
  selectList = [];
  @ViewChild('selectTag', { static: false }) selectTag;
  noPadding: boolean = false;
  isSearch: boolean = false;
  selectListFilter = [];

  constructor(private formBuilder: FormBuilder, private gridTableService: GridTableService) {
  }

  ngOnInit() {

  }

  async agInit(params: any) {
    this.params = params ?? this.params;
    this.field = this.params.colDef.field;
    this.isSearch = this.params.colDef.isSearch == undefined ? false : this.params.colDef.isSearch
    if (typeof this.params.colDef.disableSelect === 'function') {
      this.disableSelect = this.params.colDef.disableSelect(params);
    } else {
      this.disableSelect = this.params.colDef.disableSelect || false;
    }
    this.label = this.params.colDef.property?.value ?? this.label;
    this.value = this.params.colDef.property?.key ?? this.value;
    if (typeof this.params.colDef.list === 'function') {
      this.selectList = this.params.colDef.list(params);
    } else {
      this.selectList = this.params.colDef.list;
    }
    if (this.params.colDef.listName) {
      this.selectList = this.params.data[this.params.colDef.listName.toString()];
    }
    if (typeof this.params.colDef?.api === 'function') {
      await this.params.colDef.api().subscribe((val) => {
        if (val) {
          this.selectList = val;
        }
      });
    }
    this.isSearch && (this.selectListFilter = [...this.selectList]);
    this.noPadding = this.params.colDef?.cellClass?.indexOf('p-0') !== -1;
    this.buildForm();
    if (this.params && this.params.api) {
      this.params.api.stopEditing();
    }
  }

  buildForm() {
    this.select = this.params.data ? this.params.data[this.field] : null;
    (this.isSearch && this.select != null) && (this.inputSelect = [...this.selectList].find(e => e[this.value] == this.select)[this.label]);
  }

  refresh(): boolean {
    return false;
  }

  onValueChange(value) {
    this.inputSelect = [...this.selectList].find(e => e[this.value] == this.select)[this.label];
    this.params.column.editingStartedValue = this.params.data[this.field];
    this.params.node.setDataValue(this.field, value);
    this.params.api.stopEditing();
    this.gridTableService.setFocusCell(this.params.api, this.params.colDef.field, [], this.params.node.childIndex);
  }

  onChangeInput(){
    this.select = undefined;
    const inputSelect = this.inputSelect.toLowerCase();
    this.selectListFilter = [...this.selectList].filter(e => e[this.label].toLowerCase().includes(inputSelect))
  }

  onBlur(event) {
    return;
  }
}