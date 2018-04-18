import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CategoryService {

  constructor(private _http : Http) { }

  // Read CATEGORY from folder
  readCategory() : Observable<any> {
    return this._http
      .get("http://localhost:8888/cam2uAPI/file/readCategories.php") // TODO local configuration
      // .get("api/file/readCategories.php") // TODO server configuration
      .map(res => res.json());
  }

  // Read CATEGORY from DB
  readCategoryDB() : Observable<any> {
    return this._http
      .get("http://localhost:8888/cam2uAPI/category/read.php") // TODO local configuration
      // .get("api/category/read.php") // TODO server configuration
      .map(res => res.json());
  }

}