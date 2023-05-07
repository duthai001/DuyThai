import { Injectable } from '@angular/core';
import { GridParams, CustomColDef } from '@app/shared/common/models/base.model';
import { LocalStorageService } from '@shared/utils/local-storage.service';
class ColumnForSaveDto{
  field: string;
  width: number;
  position: number;
  constructor(_field, _width,_position){
    this.field = _field;
    this.width = _width;
    this.position = _position;
  }
}
@Injectable()
export class CustomFunctionService {

  constructor(private _localStorage: LocalStorageService) { }

  // sắp xếp động. Link: https://www.educative.io/edpresso/how-to-sort-an-array-of-objects-in-javascript
  dynamicsort(property, order) {
    var sortOrder = 1;
    if (order === "desc") {
      sortOrder = -1;
    }
    return function (a, b) {
      // a should come before b in the sorted order
      if (a[property] < b[property]) {
        return -1 * sortOrder;
        // a should come after b in the sorted order
      } else if (a[property] > b[property]) {
        return 1 * sortOrder;
        // a and b are the same
      } else {
        return 0 * sortOrder;
      }
    }
  }

  //set list column visible
  setColumnVisible(gridParams: GridParams, localStorageKey: string) {
    if (!localStorageKey) {
      console.log("Cần nhập localStorageKey");
      return;
    }
    let columns: CustomColDef[] = gridParams.api.getColumnDefs();
    let listChildrenColumn: CustomColDef[] = [];
    columns.forEach(column => {
      this.getChildrenColumn(column, listChildrenColumn);
    })
    let listColumnForSave: ColumnForSaveDto[] = listChildrenColumn.filter(e => !e.hide)
          .map((column, index) => new ColumnForSaveDto(column.field, column.width, index));

    this._localStorage.setItem(localStorageKey, listColumnForSave);
  }

  private getChildrenColumn(column: CustomColDef, listChildren: CustomColDef[]) {
    if (!column.children) {
      listChildren.push(column);
      return listChildren;
    }
    else {
      column.children.forEach(child => {
        this.getChildrenColumn(child, listChildren)
      })
    }
  }
}

