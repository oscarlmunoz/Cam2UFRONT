import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Article } from '../classes/article';

@Injectable()

// Service for articles data.
export class ArticleService {

    // Dependency injection to get data from an url
    constructor(private _http: Http) { }

    // Get list of articles from remote server.
    readArticles(): Observable<Article[]> {
        return this._http
            .get("http://localhost:8888/cam2uAPI/article/read.php") // TODO local configuration
            //   .get("api/article/read.php") // TODO server configuration
            .map(res => res.json());
    }

    // Get list of articles from remote server.
    readAllArticles(): Observable<Article[]> {
        return this._http
            .get("http://localhost:8888/cam2uAPI/article/readAll.php") // TODO local configuration
            //   .get("api/article/readAll.php") // TODO server configuration
            .map(res => res.json());
    }

    createArticle(article): Observable<Article> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/article/create.php", // TODO local configuration
            // "api/article/create.php", // TODO server configuration
            article,
            options
        ).map(res => res.json());
    }

    // Update customer method
    updateArticle(article: Article): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/article/update.php", // TODO local configuration
            // "api/article/update.php", // TODO server configuration
            article,
            options
        ).map(res => res.json());
    }

    deleteArticle(article: Article): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/article/delete.php", // TODO local configuration
            // "api/article/delete.php", // TODO server configuration
            article,
            options
        ).map(res => res.json());
    }

    // Update customer method
    searchArticle(article: Article): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost:8888/cam2uAPI/article/search.php", // TODO local configuration
            // "api/article/search.php", // TODO server configuration
            article,
            options
        ).map(res => res.json());
    }


}
