import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Order } from '../classes/order';
import { Content } from '../classes/content';

@Injectable()
export class OrderService {

    constructor(private _http: Http) { }

    createOrder(order): Observable<Order> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/order/create.php", // TODO local configuration
            // "api/order/create.php", // TODO server configuration
            order,
            options
        ).map(res => res.json());
    }

    createContent(content): Observable<Content> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/content/create.php", // TODO local configuration
            // "api/content/create.php", // TODO server configuration
            content,
            options
        ).map(res => res.json());
    }

    // Get list of articles from remote server.
    readAllOrders(): Observable<Order[]>{
        return this._http
            .get("http://localhost:8888/cam2uAPI/order/readAll.php") // TODO local configuration
        //   .get("api/order/readAll.php") // TODO server configuration
            .map(res => res.json());
    }

    searchContent(order: Order): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/order/searchContent.php", // TODO local configuration
            // "api/order/searchContent.php", // TODO server configuration
            order,
            options
            ).map(res => res.json());
      }

      updateOrder(order: Order): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/order/update.php", // TODO local configuration
            // "api/order/update.php", // TODO server configuration
            order,
            options
            ).map(res => res.json());
      }

      searchOrder(dni: any): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/order/search.php", // TODO local configuration
            // "api/order/search.php", // TODO server configuration
            dni,
            options
            ).map(res => res.json());
      }



}
