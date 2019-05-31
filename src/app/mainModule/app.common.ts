
import { Injectable } from "@angular/core";
import { HttpService } from "app/httpService/app.httpservice";
import { Subject } from "rxjs/Subject";
import { constVal } from "app/static/constants";
import { DeliveriesClass } from "app/static/deliveries";
import { MatchesClass } from "app/static/matches";


@Injectable()
export class CommonFunction {

    public matchDetailsList: Array<MatchesClass>[] = [];

    public delieverDetailsList: Array<DeliveriesClass>[] = [];

    public valueChangeSub: Subject<any> = new Subject<any>();

    constructor(public httpService: HttpService) {
        this.getMatchesFn();
        this.valueChangeSub.next([this.matchDetailsList, this.delieverDetailsList]);
    }



    //Get matches details
    public getMatchesFn = function () {
        this.httpService.httpGetFn(constVal.matchCSV).subscribe(response => {
            this.matchDetailsList = this.csvJSONFn(response._body);
            this.getDelieveriesDetailFn();
        }, err => {
            console.log(err);
        })
    };

    //Get Delieveries details of matches
    public getDelieveriesDetailFn = function () {
        this.httpService.httpGetFn(constVal.deliveriesCSV).subscribe(response => {
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
