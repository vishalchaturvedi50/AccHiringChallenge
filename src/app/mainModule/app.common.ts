
import { Injectable } from "@angular/core";
import { HttpService } from "app/httpService/app.httpservice";
import { Subject } from "rxjs/Subject";


@Injectable()
export class CommonFunction {

    public matchDetailsList: Array<any>[] = [];
    public delieverDetailsList: Array<any>[] = [];


    public valueChangeSub: Subject<any> = new Subject<any>();

    constructor(public httpService: HttpService) {
        this.getMatchesFn();
        this.valueChangeSub.next([this.matchDetailsList, this.delieverDetailsList]);
    }



    //Get matches details
    public getMatchesFn = function () {
        this.httpService.httpGetFn("./assets/matches.csv").subscribe(response => {
            localStorage.matchDetails = JSON.stringify(this.csvJSONFn(response._body));
            this.getMatcheslsFn();
        }, err => {
            console.log(err);
        })
    };

    //Function to retrive matches data from localstorage
    public getMatcheslsFn = function () {
        this.matchDetailsList = JSON.parse(localStorage.matchDetails);
        console.log(this.matchDetailsList);
        this.getDelieveriesDetailFn();

    };

    //Get Delieveries details of matches
    public getDelieveriesDetailFn = function () {
        this.httpService.httpGetFn("./assets/deliveries.csv").subscribe(response => {
            this.delieverDetailsList = this.csvJSONFn(response._body);
            this.valueChangeSub.next([this.matchDetailsList, this.delieverDetailsList]);
        }, err => {
            console.log(err);
        })
    };


    //Convert CSV to JSON
    public csvJSONFn = function (csv) {
        var lines = csv.split('\n');
        var result = [];
        var headers = lines[0].split(',');
        lines.splice(0, 1);
        lines.forEach(function (line) {
            var obj = {};
            var currentline = line.split(',');
            headers.forEach(function (header, i) {
                obj[header] = currentline[i];
            });
            result.push(obj);
        });
        return result;
    }
}
