import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DataFormatService {

  constructor() { }

  // Tiền
  moneyFormat(value) {
    return value ? Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0';
  }

  // Số
  numberFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    // return value ? parseFloat(Math.round((+value) * 100) / 100).toFixed(2) : '';
    return value ? parseFloat(value).toString() : '';
  }
  // Số
  numberIntFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    // return value ? parseFloat(Math.round((+value) * 100) / 100).toFixed(2) : '';
    return value ? parseFloat(value).toFixed(0).toString() : '';
  }
    // Số thập phân 1 số sau dấy phẩy
    onenumberFloatFormat(value) {
        if (value === 0) {
          return '0';
        }
        // @ts-ignore
        return value ? parseFloat(value).toFixed(1).toString() :  '';
        // return value ? parseFloat(value).toString() : '';
      }

  // Số thập phân
  numberPercentFloatFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    return value ? parseFloat((value*100).toFixed(2)).toString()+ "%" : '';
    // return value ? parseFloat(value).toString() : '';
  }

  // Số thập phân 1 số sau dấy phẩy
  onenumberPercentFloatFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    return value ? parseFloat(value*100).toFixed(1).toString()+ "%" : '';
    // return value ? parseFloat(value).toString() : '';
  }


  // Số nguyên phần trăm
  noFloatnumberPercentFloatFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    return value ? parseFloat((value*100)).toFixed(0).toString()+ "%" : '';
    // return value ? parseFloat(value).toString() : '';
  }

  numberValidate(value) {
    const NUMBER_REGEX = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;
    return NUMBER_REGEX.test(value);
  }

  // Ngày
  dateFormat(val) {
    return val ? moment(val).format('DD/MM/YYYY') : null
  }

  yearFormat(val) {
    return val ? moment(val).format('YYYY') : null
  }

  dateFormatMonth(val) {
    return val ? moment(val).format('MM/DD/YYYY') : null
  }

   // Ngày giờ
  datetimeFormat(val) {
    return val ? moment(val).format('DD/MM/YYYY HH:mm') : null
  }

  // Giờ
  timeFormat(val) {
    return val ? moment(val).format("HH:mm"): null
  }

  monthFormat(val) {
    return val ? moment(val).format('MM/YYYY') : null
  }

  getTimeZone() {
    const localeTimezone = abp.localization.currentLanguage;
    if (localeTimezone.name === 'vi') return 'Asia/Ho_Chi_Minh';
    if (localeTimezone.name === 'en') return 'America/New_York';
    if (localeTimezone.name === 'es-MX') return 'Mexico';
    if (localeTimezone.name === 'es') return 'Spain';
  }

  // Ngày giờ
  dateTimeFormat(val) {
    return val ? moment(val).tz(this.getTimeZone()).local().format('DD/MM/YYYY, HH:mm') : null;
  }
  dateTimeMonthFormat(val) {
    return val ? moment(val).tz(this.getTimeZone()).local().format('MM/DD/YYYY, HH:mm') : null;
  }

  //float money format
  floatMoneyFormat(value: Number | number | string, toFixedNum? : number) {
    let tempCurrency = parseFloat(value.toString()).toFixed(toFixedNum ? toFixedNum : 2);
    let result  = tempCurrency ? tempCurrency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : (0).toFixed(toFixedNum ? toFixedNum : 2);
    return result;
  }

  // Biển số xe
  registerNoValidate(registerNo: string) {
    const REGISTER_NO_REGEX = /^\d{2}\D{1}[-. ]?\d{4}[\d{1}]?$/g;
    return REGISTER_NO_REGEX.test(registerNo);
  }

  // Số điện thoại
  phoneNumberValidate(phoneNumber) {
    const PHONE_NUMBER_REGEX = /(0|[+]([0-9]{2})){1}[ ]?[0-9]{2}([-. ]?[0-9]){7}|((([0-9]{3}[- ]){2}[0-9]{4})|((0|[+][0-9]{2}[- ]?)(3|7|8|9|1)([0-9]{8}))|(^[\+]?[(][\+]??[0-9]{2}[)]?([- ]?[0-9]{2}){2}([- ]?[0-9]{3}){2}))$/gm;
    return !phoneNumber || PHONE_NUMBER_REGEX.test(phoneNumber);
  }

  // Mã màu
  colorValidate(color) {
    const COLOR_REGEX = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;
    return COLOR_REGEX.test(color);
  }

  // Không được là số âm
  notNegativeNumberValidate(params) {
    return !(params !== '' && (params && Number(params) < 0));
  }

  // Số nguyên dương
  positiveNumberValidate(params) {
    const NUMBER_REG = /^\d*[1-9]+\d*$/;
    // return !(params.value !== '' && ((params.value && Number(params.value) <= 0) || !NUMBER_REG.test(params.value)));
    return NUMBER_REG.test(params);
  }

  // Số nguyên không âm
  notNegativeIntNumberValidate(params) {
    const NUMBER_REG = /^\d+$/g;
    return NUMBER_REG.test(params);
  }

  // Số nguyên
  intNumberValidate(params) {
    const NUMBER_REG = /^([+-]?[1-9]\d*|0)$/;
    return !(params.value !== '' && !NUMBER_REG.test(params.value));
  }

  emailValidate(email) {
    const NUMBER_REG = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return NUMBER_REG.test(email);
  }

  /* For Sale */
  // Format input trong Cell Grid sang dạng DateTime để truyền xuống database
  formatInputToDateTime(input) {
    const date = new Date(input);
    return date;
  }

  // format từ số giây sang giờ
  formatHoursSecond(seconds) {
    if (seconds && seconds > 0) {
      return `${new Date(seconds * 1000).toISOString().substr(11,5)}`;
    } else if (seconds === 0) {
      return `00:00`;
    } else if (!seconds) {
      return '';
    }
  }

  //Lam chon so input chia het cho co so inputformat
  formatNumberByInputFormat(inputNumber:number , inputFormat){
    var checkNumber = inputNumber % inputFormat;
    if (checkNumber != 0)
    {
      inputNumber = inputNumber + (inputFormat-checkNumber);
    }
    return inputNumber;
  }

  //convert từ giờ nhập vào sang số giây
  convertTimeToSeconds(time: string): number {
    return time.split(':').reverse().reduce((prev, curr, i) => prev + +curr * Math.pow(60, i), 0);
  }

  //format Date for sale
  formatDateForSale(date) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    if (date) {
      let convertDate;
      if (typeof date === 'string' && date.length === 1) {
        return date;
      }

      if (isFirefox && typeof date === 'string') {
        const dateArr = date.split('-');
        date = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
      }
      convertDate = new Date(date);
      const displayDate = convertDate.getDate() < 10 ? `0${convertDate.getDate()}` : convertDate.getDate();
      const formattedMonth = convertDate.getMonth() < 9 ? `0${convertDate.getMonth() + 1}` : convertDate.getMonth() + 1;
      const displayMonth = moment(formattedMonth, 'MM').format('MMM');

      return convertDate ? `${displayDate}-${displayMonth}-${convertDate.getFullYear()}` : '';
    }
    return '';
  }

  formatDisplayValue(val: any, hideDecimal?: boolean) {
    val = hideDecimal ? val : this.numberFormat(val);
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/,([0-9]{3})/g, '$1');
        if ((+num).toString() === num) {
          return (+num).toLocaleString();
        }

        num = val.trim().replace(/,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return (+num).toLocaleString();
        }
        return val;
      } else {
        const num = val.toString().replace(/,/g, '');
        return (+num) ? (+num).toLocaleString() : val;
      }
    }
    return '';
  }

  formatMoney(val) {
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/\,([0-9]{3})/g, '$1');

        num = val.trim().replace(/\,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return parseFloat(num).toLocaleString('en-US');
        }
        return val;
      } else {
        const num = val.toString().replace(/\,/g, '');
        return parseFloat(num) ? parseFloat(num).toLocaleString('en-US') : val;
      }
    }
    return 0;
  }

  formatShortDateFromExcelToMoment(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    let date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    return moment(date);
 }
}
