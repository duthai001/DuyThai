import { NotifyService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridTableService {

  constructor(private notify: NotifyService) { }

  // gridApi = params.api
  selectFirstRow(gridApi) {
    gridApi?.forEachNode(node => {
      if (node.childIndex === 0) {
        node.setSelected(true);
      }
    });
  }

  getAllData(params) {
    const dataArr = [];
    params.api.forEachNode(node => {
      if (node.level) dataArr.push(node.data);
    });
    return dataArr;
  }

  // gridApi = params.api
  async setFocusCell(gridApi, colName, displayedData?, rowIndex?, editing?) {

    let rowToFocus = rowIndex != null ? rowIndex : (displayedData ? displayedData.length : 0);
    await gridApi?.forEachNode(node => {
      if (node.rowIndex === rowToFocus) {

        node.setSelected(true);
        var focus = gridApi.setFocusedCell(rowToFocus, colName);
        if (editing) {
          gridApi.startEditingCell({
            rowIndex: rowToFocus,
            colKey: colName,
            floating: null
          });
          return
        }
        return;
      }
    });
  }

  // Check nếu dòng trước đó dữ liệu không hợp lệ thì không cho thêm dòng nữa
  validateRow(gridApi, field, displayedData, headerName?, checkRow?) {
    const rowToCheck = checkRow ?? (displayedData ? displayedData.length : 0);
    let validateCheck = true;

    if (checkRow) {
    }
    gridApi.forEachNode(node => {
      if (node.childIndex === rowToCheck) {
        if (!node.data[field] || node.data[field] === '' || node.data[field] === 0) {
          this.notify.warn(`${headerName} không được phép bỏ trống`);
          validateCheck = false;
        }
      }
    });
    return validateCheck;
  }
}
