
import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'upload',
	templateUrl: './upload.component.html',
})

export class UploadComponent extends AppComponentBase {
	@ViewChild('FileUpload', { static: false }) fileUpload: FileUpload;
	@Output() public onUploadFinished = new EventEmitter();
	@Output() public fileName = new EventEmitter();
	@Input() typeFile: string = '';

	uploadUrl: string = "";
	uploadedFiles: any[] = [];
	public progress: number;
	public messages: string = "";
	uploadImg: string = "";
	result: any [] = [];
	constructor(
		injector: Injector,
		private _httpClient: HttpClient,
	) {
		super(injector);
	}

	//upload file to server folder
	
	public uploadFile(data: { files: File }): void {
		if (this.typeFile == 'zipContractTmssManagement'){
			this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadFileToFolderForContractTmssManagement';
		} else {
			this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Upload/UploadFileToFolder';
		}
		this.uploadImg = AppConsts.remoteServiceBaseUrl + '/';

		const formData: FormData = new FormData();
		const file = data.files[0];
		//file.name
		formData.append("file", file, file.name);

		this._httpClient
			.post<any>(
				this.uploadUrl, formData, { reportProgress: true, observe: 'events' }
			)
			.pipe(
				finalize(() => this.fileUpload.clear())
			)
			.subscribe((event) => {
				if (event.type === HttpEventType.UploadProgress) {
					this.progress = Math.round(100 * event.loaded / event.total);
				}
				else if (event.type === HttpEventType.Response) {
					this.messages = 'Đã upload file lên server thành công';
					this.result = [];
					this.result.push(event.body);
					this.result.push(file.size);
					this.onUploadFinished.emit(this.result);
					this.uploadImg = AppConsts.remoteServiceBaseUrl + '/';
					this.uploadImg = this.uploadImg + event.body.result.dbPath;
				}
			});
	}

	onUploadFileError(): void {
		this.notify.error(this.l("UploadFileFailed"));
	}

	public createImgPath = () => {
		return this.uploadImg;
	}
}
