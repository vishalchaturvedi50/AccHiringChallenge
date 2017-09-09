import { Injectable } from "@angular/core";
import { Http, HttpModule } from "@angular/http";

@Injectable()
export class HttpService {
    public http: Http;
    constructor(http: Http) {
        this.http = http;
    }

    public httpGetFn = function (url: String) {
        return this.http.get(url);
    }

}