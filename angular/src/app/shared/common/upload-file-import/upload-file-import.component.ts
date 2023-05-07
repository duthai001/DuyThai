import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUpload } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'uploadFileImport',
  templateUrl: './upload-file-import.component.html',
  styleUrls: ['./upload-file-import.component.less']
})
export class UploadFileImportComponent extends AppComponentBase {
  @ViewChild('FileUpload', { static: false }) fileUpload: FileUpload;
  @Output() public onUploadFileFinished = new EventEmitter();
  @Output() public fileName = new EventEmitter();
  @Output() public upload = new EventEmitter();
  @Input() importCode:string;
  isImported: boolean = false;
  uploadUrl: string;
  result: any[] = [];
  public progress: number;
  public messages: string;
  uploadImg: string;

  constructor(
    injector: Injector,
    private _httpClient: HttpClient,
  ) {
    super(injector);
    this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadFileImport';
    this.uploadImg = AppConsts.remoteServiceBaseUrl + '/';
  }

  //upload file to server folder
  public uploadFile(data: { files: File }): void {
    const formData: FormData = new FormData();
    const file = data.files[0];
    //file.name
    formData.append("file", file, file.name);
    this._httpClient
      .post<any>(this.uploadUrl, formData, { reportProgress: true, observe: 'events' })
      .pipe(finalize(() => this.fileUpload.clear()))
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.messages = 'Uploaded success to server.';
          this.result = [];
          this.result.push(event.body);
          this.result.push(file.size);
          this.onUploadFileFinished.emit(this.result);
          this.uploadImg = AppConsts.remoteServiceBaseUrl + '/';
          this.uploadImg = this.uploadImg + event.body.result.dbPath;
          this.upload.emit(event.body.result.dbPath);//truyền tên ra component saleVehicleImport để import
        }
      });
  }

  checkImported(isImported: boolean) { //check de disable message
    this.isImported = isImported;
  }

  onUploadFileError(): void {
    this.notify.error(this.l("UploadFileFailed"));
  }
}