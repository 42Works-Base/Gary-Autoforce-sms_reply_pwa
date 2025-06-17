import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  constructor( private http: HttpClient ) { }

  getSmsData(data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(environment.apiUrl + "sms_pwa/get_request", data, { headers });
  }

  sendReply(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "sms_pwa/send_reply", data);
  }

}
