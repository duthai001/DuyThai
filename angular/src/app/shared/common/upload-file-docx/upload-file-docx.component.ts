import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'UploadFileDocx',
  templateUrl: './upload-file-docx.component.html',
  styleUrls: ['./upload-file-docx.component.less']
})
export class UploadFileDocxComponent extends AppComponentBase {
	@ViewChild('FileUpload', { static: false }) fileUpload: FileUpload;
	@Output() public onUploadFileFinished = new EventEmitter();
	@Output() public fileName = new EventEmitter();
	uploadUrl: string;
	uploadedFiles: any[] = [];
	result: any[] = [];
	public progress: number;
	public messages: string;
	uploadImg: string;

	constructor(
		injector: Injector,
		private _httpClient: HttpClient,
	) {
		super(injector);
		this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadDocumentFile';
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
				}
			});
	}

	onUploadFileError(): void {
		this.notify.error(this.l("UploadFileFailed"));
	}

}

