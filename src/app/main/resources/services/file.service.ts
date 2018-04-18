import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FileService {


  constructor(private _http : Http) { }

  readFiles(url): Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(
        "http://localhost:8888/cam2uAPI/file/readFileNames.php", // TODO local configuration
        // "api/file/readFileNames.php", // TODO server configuration
        url,
        options
    ).map(res => res.json());

  }


}
