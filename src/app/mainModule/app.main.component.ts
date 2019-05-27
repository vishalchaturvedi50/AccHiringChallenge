import { Component } from "@angular/core";
import { HttpService } from "app/httpService/app.httpservice";
import { CommonFunction } from "app/mainModule/app.common";


@Component({
    templateUrl: 'app.main.html',
    selector: "main-root"
})

export class MainComponent {

    public httpService: HttpService;
    
    public matchDetailsList: any[];

    constructor(http: HttpService,commonFn:CommonFunction) {
        this.httpService = http;
    }

    public getMatchesFn = function () {
        this.httpService.httpGetFn("./assets/matches.csv").subscribe(response => {
            localStorage.matchDetails =JSON.stringify(this.commonFn.csvJSONFn(response._body));
            this.getMatcheslsFn();
        }, err => {
            console.log(err);
        })
    };

    //Function to retrive matches data from localstorage
    public getMatcheslsFn = function () {
        this.matchDetailsList =JSON.parse(localStorage.matchDetails);
        console.log(this.matchDetailsList);
    };



}


