import { Component, OnInit } from "@angular/core";
import { CommonFunction } from "app/mainModule/app.common";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/httpService/app.httpservice";

@Component({
    templateUrl: 'app.teamDetail.html'
})
export class TeamDetailComponent {

    public year: Number;
    public teamName: String;
    public snapShot: any = {};
    public matchDetailsList: any[] = [];
    public delieverDetailsList: any[] = [];
    public filteredListForSeason: any[] = [];
    public individualMatch: any = {};
    public inningData: any[] = [];

    constructor(public router: ActivatedRoute, public httpService: HttpService, public commonFn: CommonFunction) {
        this.router.params.subscribe(param => {
            this.year = param["year"];
            this.teamName = param["teamName"];
            this.getTeamNamesForYearFn();
        });

        this.matchDetailsList = this.commonFn.matchDetailsList;
        this.delieverDetailsList = this.commonFn.delieverDetailsList;
        this.getTeamNamesForYearFn();

        this.commonFn.valueChangeSub.subscribe(arrVal => {
            this.matchDetailsList = arrVal[0];
            this.delieverDetailsList = arrVal[1];
            this.getTeamNamesForYearFn();
        })


    }


    //team Data
    public getTeamNamesForYearFn = function () {
        if (this.matchDetailsList.length > 0 && this.delieverDetailsList.length > 0) {
            this.filteredListForSeason = this.matchDetailsList.filter(each => {
                return each.season == this.year && (each.team1 == this.teamName || each.team2 == this.teamName);
            });

            this.snapShot.totalWon = this.filteredListForSeason.filter(each => {
                return each.winner == this.teamName;
            }).length;
            this.snapShot.totalLoss = this.filteredListForSeason.filter(each => {
                return each.winner != this.teamName;
            }).length;

        }
    };

    public getMatchDetailsFn = function (match) {
        let deliveries = this.delieverDetailsList.filter(each => {
            return each.match_id == match.id;
        });

        this.individualMatch = match;

        let innings: Array<any> = [];

        if (deliveries.length > 0) {

            innings.push({ name: deliveries[0].batting_team });
            innings.push({ name: deliveries[0].bowling_team });

            for (var i = 0; i < innings.length; i++) {

                let filteredDeliveries = deliveries.filter(each => {
                    return each.batting_team == innings[i].name;
                })

                innings[i].batsmanList = [];
                innings[i].batsmanScore = [];
                innings[i].dismissalstype = [];
                innings[i].dismissalsby = [];
                innings[i].extras = 0;
                innings[i].total = 0;

                filteredDeliveries.forEach(each => {
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
        }
    }

};


