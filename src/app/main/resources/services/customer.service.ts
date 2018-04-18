import { Injectable } from '@angular/core';
import { Customer } from '../classes/customer';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CustomerService {

  
  // Dependency injection to get data from an url
  constructor(private _http : Http){ }

  // Customer creation method
  createCustomer(customer: Customer): Observable<any>{
 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
 
    return this._http.post(
        "http://localhost:8888/cam2uAPI/customer/create.php", // TODO local configuration
        // "api/customer/create.php", // TODO server configuration
        customer,
        options
        ).map(res => res.json());
    }

  // Get customer from remote server.
  readCustomer(customer: Customer): Observable<any>{
    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(
        "http://localhost:8888/cam2uAPI/customer/search.php", // TODO local configuration
        // "api/customer/search.php", // TODO server configuration
        customer,
        options
        ).map(res => res.json());
    }

  // Update customer method
  updateCustomer(customer: Customer): Observable<any>{
 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
 
    return this._http.post(
        "http://localhost:8888/cam2uAPI/customer/update.php", // TODO local configuration
        // "api/customer/update.php", // TODO server configuration
        customer,
        options
        ).map(res => res.json());
    }
}
