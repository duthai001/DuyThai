import { AfterViewInit, ChangeDetectorRef, EventEmitter, Injector, Input, Output, SimpleChanges } from '@angular/core';
import { Component } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ceil } from 'lodash';

@Component({
  selector: 'grid-pagination',
  templateUrl: './grid-pagination.component.html',
  styleUrls: ['./grid-pagination.component.scss']
})
export class GridPaginationComponent extends AppComponentBase implements AfterViewInit {

  @Input() pageSize = 0;
  @Input() gridApi;
  @Input() paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0, totalPage: 1 };
  @Output() pageChangedEvent = new EventEmitter();

  constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
    super(injector);
  }

  get fromRecord() {
    if (this.paginationParams.totalCount === 0) return 0;
    return (
      (this.paginationParams.pageNum - 1) *
      this.paginationParams.pageSize +
      1
    );
  }

  get toRecord() {
    let calcRecord =
      this.paginationParams.pageNum * this.paginationParams.pageSize;
    return calcRecord > this.paginationParams.totalCount
      ? this.paginationParams.totalCount
      : calcRecord;
  }

  ngAfterViewInit() {
    this.paginationParams.pageSize =
      this.paginationParams.pageSize > 0
        ? this.paginationParams.pageSize
        : 10;
    this.paginationParams.totalPage = this.paginationParams.totalPage ?? 0;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) { }

  // Next button click
  goToNext() {
    this.paginationParams.pageNum = this.paginationParams.pageNum + 1;
    this.pageChangedEvent.emit(this.paginationParams);
  }

  // Back button click
  goToPrevious() {
    // Allow to go to previous page only if Current Page > 1
    if (this.paginationParams.pageNum > 1) {
      this.paginationParams.pageNum = this.paginationParams.pageNum - 1;
    }

    this.pageChangedEvent.emit(this.paginationParams);
  }

  // First or Last button click
  goToPage(index: number) {
    this.paginationParams.pageNum = index;
    this.pageChangedEvent.emit(this.paginationParams);
  }

  // Change page size
  onPageSizeChanged() {
    let newTotalPage = ceil(
      this.paginationParams.totalCount / this.pageSize
    );
    this.paginationParams.pageNum =
      newTotalPage < this.paginationParams.pageNum
        ? newTotalPage
        : this.paginationParams.pageNum;
    this.paginationParams.pageSize = this.pageSize;
    this.paginationParams.totalPage = newTotalPage ?? 0;
    this.pageChangedEvent.emit(this.paginationParams);
  }

}
