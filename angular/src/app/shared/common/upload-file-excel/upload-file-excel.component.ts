import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'UploadFileExcel',
  templateUrl: './upload-file-excel.component.html',
  styleUrls: ['./upload-file-excel.component.less']
})
export class UploadFileExcelComponent extends AppComponentBase {
	@ViewChild('FileUpload', { static: false }) fileUpload: FileUpload;
	@Output() public onUploadFileFinished = new EventEmitter();
	@Output() public fileName = new EventEmitter();
	uploadUrl: string;
	uploadedFiles: any[] = [];
	result: any[] = [];
	public progress: number;
	public messages: string;
	uploadImg: string;
	@Input() uploadType: string;//upload trên màn hình nào
	constructor(
		injector: Injector,
		private _httpClient: HttpClient,
	) {
		super(injector);
		this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadFileToFolderAndGetName';
		this.uploadImg = AppConsts.remoteServiceBaseUrl + '/';
	}

	//upload file to server folder
	public uploadFile(data: { files: File }): void {
		if(this.uploadType === "rundown"){
			this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadFileRundown'
		}
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
				}
			});
	}

	onUploadFileError(): void {
		this.notify.error(this.l("UploadFileFailed"));
	}

}

