import { Component, OnInit } from "@angular/core";
import { CommonFunction } from "app/mainModule/app.common";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/httpService/app.httpservice";

@Component({
    templateUrl: 'app.live.html'
})
export class LiveMatchComponent {


    public matchDetailsList: any[] = [];

    public delieverDetailsList: any[] = [];

    public liveData: any[] = [];

    public inningData: any = [];

    public liveInning: Number = 0;

    public stats: any = {};

    public index: number = 0;

    public lastUpdated: any = "";

    constructor(public router: ActivatedRoute,
        public httpService: HttpService,
        public commonFn: CommonFunction) {

        this.matchDetailsList = this.commonFn.matchDetailsList;

        this.delieverDetailsList = this.commonFn.delieverDetailsList;

        this.commonFn.valueChangeSub.subscribe(arrVal => {
            this.matchDetailsList = arrVal[0];
            this.delieverDetailsList = arrVal[1];
            for (let i = 0; i < this.index; i++) {
                this.liveData.push(this.delieverDetailsList[i]);
            }

            this.getLiveDataFn();
        });

        this.getLiveDataFn();
    }

    /*TO build live feed - I am considering match 1 and from there on every 10 sec match will refresh
    if you want to reset the counter you can open the page in incognito
    */
    public getLiveDataFn() {
        if (this.delieverDetailsList.length > 0) {


            let item = this.delieverDetailsList[this.index];
            this.liveData.push(item);
            this.lastUpdated = new Date();

            this.index++;
            this.statsOnLiveDataFn();
            setTimeout(() => {
                this.getLiveDataFn();
            }, 5000);
        }
    }

    /* Function to build stats on live data feed */
    public statsOnLiveDataFn() {
        console.log(this.liveData);

        this.stats.batting_team = this.liveData[this.liveData.length - 1].batting_team;
        this.stats.bowling_team = this.liveData[this.liveData.length - 1].bowling_team;
        this.liveInning = Number(this.liveData[this.liveData.length - 1].inning);

        let innings = [];

        if (this.liveInning == 1) {
            innings.push({ name: this.stats.batting_team });
        }
        else {
            innings.push({ name: this.stats.batting_team });
            innings.push({ name: this.stats.bowling_team });
        }



        for (var i = 0; i < innings.length; i++) {

            innings[i].batsmanList = [];
            innings[i].batsmanScore = [];
            innings[i].dismissalstype = [];
            innings[i].dismissalsby = [];
            innings[i].extras = 0;
            innings[i].total = 0;

            this.liveData.filter(each => {
                return each.batting_team == innings[i].name
            }).forEach(each => {
                //if the batsman doesn't exist then insert him in both the list
                if (innings[i].batsmanList.indexOf(each.batsman) == -1) {
                    innings[i].batsmanList.push(each.batsman);
                }

                let index = innings[i].batsmanList.indexOf(each.batsman);

                if (innings[i].batsmanScore[index] == undefined)
                    innings[i].batsmanScore[index] = 0;

                innings[i].batsmanScore[index] += Number(each.batsman_runs);
                innings[i].extras += Number(each.extra_runs);

                innings[i].total += Number(each.batsman_runs) + Number(each.extra_runs);

                if (each.player_dismissed != "") {
                    let indexPlayerDis = innings[i].batsmanList.indexOf(each.player_dismissed);
                    if (innings[i].dismissalstype[indexPlayerDis] == undefined)
                        innings[i].dismissalstype[indexPlayerDis] = "";

                    if (innings[i].dismissalsby[indexPlayerDis] == undefined)
                        innings[i].dismissalsby[indexPlayerDis] = "";

                    innings[i].dismissalstype[indexPlayerDis] = each.dismissal_kind;
                    innings[i].dismissalsby[indexPlayerDis] = each.bowler;
                }
            })
        }
        this.inningData = innings;

    };

}