import { Injectable } from '@angular/core';
import { Administrator } from '../classes/administrator';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AdminService {

  // Dependency injection to get data from an url
  constructor(private _http : Http){ }

  // Get customer from remote server.
  readAdmin(admin: Administrator): Observable<any>{
      
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(
        "http://localhost:8888/cam2uAPI/admin/search.php", // TODO local configuration
        // "api/admin/search.php", // TODO server configuration
        admin,
        options
        ).map(res => res.json());
  }

  // Update admin method
  updateCustomer(admin: Administrator): Observable<any>{
 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
 
    return this._http.post(
        "http://localhost:8888/cam2uAPI/admin/update.php", // TODO local configuration
        // "api/admin/update.php", // TODO server configuration
        admin,
        options
        ).map(res => res.json());
  }

}
