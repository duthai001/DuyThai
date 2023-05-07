import { BsDatepickerContainerComponent, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Component, forwardRef, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector } from '@angular/core';

@Component({
	selector: 'tmss-datepicker',
	templateUrl: './tmss-datepicker.component.html',
	styleUrls: ['./tmss-datepicker.component.less'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TmssDatepickerComponent),
			multi: true
		}]
})
export class TmssDatepickerComponent extends AppComponentBase implements ControlValueAccessor, OnInit {
	@ViewChild('datepicker', { static: false }) datepicker!: BsDatepickerDirective;
	@ViewChild('input', { static: false }) input!: ElementRef;

	@Input() defaultValue: Date = undefined;
	@Input() className: string = '';
	@Input() addOnMinWidth: string = '';
	@Input() text: string = '';
	@Input() isValidate: boolean = false;
	@Input() isRequired: boolean = false;
	@Input() minDate!: Date;
	@Input() maxDate!: Date;
	@Input() showMonth: boolean = false;
	@Input() showDeleteBtn: boolean = false;
	@Input() dateInputFormat: string = 'DD/MM/YYYY';
	private onChange!: Function;
	@Input() isDisabled: boolean = false;
	@Input() value: Date = undefined;
	@Input() hasTimePicker: boolean = false;
	@Input() placementDatePicker = 'bottom'; //Hiển thị datePicker trên hoặc dưới ô Input
	@Input() minMode: string = 'day';
	@Input() showIcon : boolean = true;
	inputValue;
	hour: string = new Date().getHours().toString();
	minute: string = new Date().getMinutes().toString();
	@Input() disabledStageDates = [];
	datesEnabled = [];
	@Output() change: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		injector: Injector) {
		super(injector);
	}
	registerOnTouched(fn: any): void {
	}

	ngOnInit() {
		document.addEventListener('click', event => {
			if (!this.input.nativeElement.contains(event.target)) {
				this.datepicker.hide();
			}
		});
	}

	keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (!this.inputValue || this.inputValue.toString() === 'Invalid Date') {
				// this.inputValue = new Date();
				// this.hour = new Date().getHours().toString();
				// this.minute = new Date().getMinutes().toString();
				this.inputValue = undefined;
			}
			this.value = this.inputValue;
		}
		if (e.key === 'Control' || e.key === 'Alt') {
			if (!this.inputValue || this.inputValue.toString() === 'Invalid Date') this.inputValue = undefined;
			this.datepicker.bsValueChange.emit(this.inputValue ?? this.value);
		}
	}

	//#region --  thay đổi trên control
	inputChange(event: InputEvent) {
		let value = event.target['value'] ? moment(event.target['value'], 'DD/MM/YYYY').toDate() : undefined;
		if (event.target['value'].length === 7) value = moment(`01/${event.target['value']}`, 'DD/MM/YYYY').toDate()
		if (event.target['value'].length === 4) value = moment(`01/01/${event.target['value']}`, 'DD/MM/YYYY').toDate()
        this.hour = value ? (value.getHours() + 8).toString() : (new Date().getHours() + 8).toString(); //+8 vì Date picker Mặc định trừ đi 7 tiếng (Theo chuẩn RFC2822/ISO ) Thế nhưng vì những năm như 1974 thì phải +1 = 8 nữa
		this.minute = value ? value.getMinutes().toString() : new Date().getMinutes().toString();
		this.inputValue = value;
		this.change.emit(this.input);
	}
	//#endregion

	//#region --  Thay đổi trên date picker
	bsValueChange(val?: any) { // Thay đổi trên control
		if (val && val != null) {
			val?.setHours(Number(this.hour) ?? new Date().getHours());
			val?.setMinutes(Number(this.minute) ?? new Date().getMinutes());
			this.value = val;
			if (typeof this.onChange === 'function') {
				this.onChange(this.value);
				this.change.emit(this.value);
			};
		} else if (typeof this.onChange === 'function') this.onChange(undefined);
	}

	onChangeTimeInput(event: any, field: any) {
		if (isNaN(event.target.value)) return this.notify.warn(this.l('NotValid', this.l('Time')));
		const value = Number(event.target.value);
		if (!(this.value instanceof Date)) this.value = this.value ? new Date(this.value) : new Date();

		if (field === 'minute') {
			this.minute = value % 60 < 10 ? `0${value % 60}` : `${value % 60}`
			this.hour = Number(this.hour) + Math.floor(value / 60) < 10 ? `0${Number(this.hour) + Math.floor(value / 60)}` : `${Number(this.hour) + Math.floor(value / 60)}`
			this.value.setHours(Number(this.hour), Number(this.minute));
		}
		this.datepicker.bsValueChange.emit(new Date(this.value));
	}
	//#endregion

	writeValue(val: any) {
		this.value = val ?? this.defaultValue;
		if (!val && !this.defaultValue) return this.datepicker?.bsValueChange.emit(undefined);
		if (val instanceof Date) { this.value = val; } //this.datepicker?.bsValueChange.emit(this.value); this.value = val; }
		if (val instanceof moment) { this.datepicker?.bsValueChange.emit(moment(val).toDate()); this.value = moment(val).toDate(); }

		if (this.hasTimePicker && typeof this.value.getHours === 'function') {
			this.hour = this.value?.getHours() < 10 ? '0' + this.value?.getHours() : this.value?.getHours().toString();
			this.minute = this.value?.getMinutes() < 10 ? '0' + this.value?.getMinutes() : this.value?.getMinutes().toString();
		}
	}

	registerOnChange(fn: Function) {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this.isDisabled = isDisabled || false;
	}

	hideDatePicker(event: BsDatepickerContainerComponent) {
		event._stopPropagation;
		event.containerClass = `${event.containerClass} display-none`
	}

	openDatePicker() {
        if(this.disabledStageDates?.length > 0){
			let current = this.disabledStageDates[0];
			let endDate = this.disabledStageDates[1];

			while(current <= endDate){
				this.datesEnabled.push(new Date(current));
				current.setDate(current.getDate() + 1);
			}
		}
		this.datepicker._bsValue = this.value ?? new Date();
		setTimeout(() => {
			this.datepicker.show();
			const array = Array.from(document.getElementsByClassName('bs-datepicker'));
			array.forEach(e => e.setAttribute('style', 'display: block'));
		}, 0);
		if (this.hasTimePicker) {
			setTimeout(() => {
				this.createTimeChoosingComponent();
			});
            setTimeout(() => {
				document.getElementById('hourControl')?.focus();
			});
		}
	}

	createTimeChoosingComponent() { // Tạo 2 ô tính giờ ở cuối khi date picker được show ra
		const currentHour = new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours();
		const currentMinute = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
		if (!this.value) this.value = this.datepicker._bsValue;

		this.hour = Number(this.value?.getHours() ?? this.hour) % 24 < 10 ? `0${Number(this.hour) % 24}` : `${Number(this.hour) % 24}`;
		this.minute = Number(this.value?.getMinutes() ?? this.minute) % 60 < 10 ? `0${Number(this.minute) % 60}` : `${Number(this.minute) % 60}`;

		this.hour = isNaN(Number(this.hour)) || !this.value ? `${currentHour}` : this.hour;
		this.minute = isNaN(Number(this.minute)) || !this.value ? `${currentMinute}` : this.minute;

		let container = document.getElementsByClassName('.bs-datepicker');

		if (container[0]) {
			if (this.placementDatePicker === 'top') {
				container[0].setAttribute('style', 'position: relative !important; top: -28px; display: block;');
			} else container[0].setAttribute('style', 'display: block;');
		}

		let elem = document.querySelector('.bs-datepicker-container');
		let div = document.createElement('div');
		elem?.appendChild(div);
		div.className = 'custom-content';
		div.setAttribute('style', 'width: 280px; height: 30px; left: 0px; background: white; position: absolute; box-shadow: 0 2px 4px 0 #aaa; display: flex; align-items: center;');

		let hourControl = document.createElement('input');
		hourControl.setAttribute('id', 'hourControl');
		hourControl.setAttribute('style', 'width: 35px; height: 25px; margin-right: 5px; position: absolute; left: 6px; text-align: center;');
		hourControl.setAttribute('value', this.hour);
		hourControl.className = 'hour-control';
		hourControl.onchange = e => {
			const value = e.target['value'];
			this.hour = value < 10 ? `0${value}` : value.toString();
			this.value.setHours(Number(this.hour), Number(this.minute));

			e.preventDefault();
		};

		hourControl.onkeyup = e => {
			if (e.key === 'Enter') {
				this.datepicker.bsValueChange.emit(new Date(this.value));
				this.datepicker.hide();
			};
		};

		div.appendChild(hourControl);

		let strongTag = document.createElement('strong');
		strongTag.className = 'text-strong';
		strongTag.setAttribute('style', 'position: absolute; left: 45px;');
		strongTag.innerHTML = ':';
		div.appendChild(strongTag);

		let minuteControl = document.createElement('input');
		minuteControl.className = 'minute-control'
		minuteControl.setAttribute('style', 'width: 35px; height: 25px; position: absolute; left: 54px; text-align: center;');
		minuteControl.setAttribute('value', this.minute);
		minuteControl.onchange = event => this.onChangeTimeInput(event, 'minute');
		minuteControl.onkeydown = e => {
			if ((e.key === 'Tab' || e.key === 'Enter') && !e.shiftKey && !e.altKey) {
this.value?.setHours(Number(this.hour), Number(this.minute));
				this.datepicker.bsValueChange.emit(new Date(this.value));
				this.datepicker.hide();
			}
		};

		div.appendChild(minuteControl);
	}

	hidden() {
		if (!this.value) {
			let value = new Date("");
			if (!isNaN(Number(this.hour)) && !isNaN(Number(this.minute))) value.setHours(Number(this.hour), Number(this.minute))
			if (value.toString() === "Invalid Date") value = undefined;
			this.datepicker.bsValueChange.emit(value);
		}

		if (this.value?.getHours() === Number(this.hour) && this.value.getMinutes() === Number(this.minute)) this.datepicker.bsValueChange.emit(this.value);
		this.input?.nativeElement.focus();
	}
}
