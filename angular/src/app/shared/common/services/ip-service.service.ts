import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {
  constructor(private http:HttpClient) { }
  getIPv4Address()
  {
    // return this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json");
  }
  getIPv6Address()
  {
    // return this.http.get("https://cors-anywhere.herokuapp.com/http://api64.ipify.org/?format=json");
  }
}
