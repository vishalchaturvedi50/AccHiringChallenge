import { Component, OnInit } from "@angular/core";
import { CommonFunction } from "app/mainModule/app.common";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/httpService/app.httpservice";

@Component({
    templateUrl: 'app.previous.html'
})
export class PreviousMatchComponent {


    public year: Number;
    public teamName: String;
    public matchDetailsList: any[] = [];
    public delieverDetailsList: any[] = [];
    public filteredListForSeason: any[];
    public filteredAllTeams: String[];
    public seasonSnapShot: any = {};

    constructor(public router: ActivatedRoute, public httpService: HttpService, public commonFn: CommonFunction) {
        //Changes in route values will be seen here
        this.router.params.subscribe(param => {
            this.year = param["year"];
            this.filteredAllTeams = [];
            this.getTeamNamesForYearFn();
        });

        this.commonFn.getMatchesFn();

        this.matchDetailsList = this.commonFn.matchDetailsList;
        this.delieverDetailsList = this.commonFn.delieverDetailsList;
        this.getTeamNamesForYearFn();
        //changes in match detail Value will be seen here
        this.commonFn.valueChangeSub.subscribe(arrVal => {
            this.matchDetailsList = arrVal[0];
            this.delieverDetailsList = arrVal[1];
            this.getTeamNamesForYearFn();
        })
    }


    //Get stats for the year
    public getTeamNamesForYearFn = function () {
        if (this.matchDetailsList.length > 0 && this.delieverDetailsList.length > 0) {
            this.filteredListForSeason = this.matchDetailsList.filter(each => {
                return each.season == this.year;
            });

            this.filteredListForSeason.forEach(each => {
                if (this.filteredAllTeams.indexOf(each.team1) == -1) {
                    this.filteredAllTeams.push(each.team1);
                }
            })

            if (this.filteredListForSeason.length > 0) {
                let lastRow = this.filteredListForSeason[this.filteredListForSeason.length - 1];
                this.seasonSnapShot = lastRow;

                if (lastRow.winner == lastRow.team1)
                    this.seasonSnapShot.loosingTeam = lastRow.team2;
                else
                    this.seasonSnapShot.loosingTeam = lastRow.team1;

            }


            let filteredList = this.delieverDetailsList.filter(each => {
                return each.match_id == this.seasonSnapShot.id;
            })

            if (filteredList.length > 0) {
                this.seasonSnapShot.firstInningTeam = filteredList[0].batting_team;
                this.seasonSnapShot.secondInningTeam = filteredList[0].bowling_team;
                this.seasonSnapShot.firstInningTeamScore = 0;
                this.seasonSnapShot.firstInningDismmisals = 0;
                this.seasonSnapShot.firstInningTeamOversPlayed = 0;
                let firstlist = filteredList.filter(each => {
                    return each.batting_team == this.seasonSnapShot.firstInningTeam;
                })
                firstlist.forEach(each => {
                    this.seasonSnapShot.firstInningTeamScore += Number(each.total_runs);
                    if (each.player_dismissed != "") {
                        this.seasonSnapShot.firstInningDismmisals += 1;
                    }

                })
                // this.seasonSnapShot.firstInningTeamOversPlayed = Number(firstlist[firstlist.length - 1].over);

                this.seasonSnapShot.secondInningTeamScore = 0;
                this.seasonSnapShot.secondInningDismmisals = 0;
                this.seasonSnapShot.secondInningTeamOversPlayed = 0;
                let secondlist = filteredList.filter(each => {
                    return each.batting_team == this.seasonSnapShot.secondInningTeam;
                })
                secondlist.forEach(each => {
                    this.seasonSnapShot.secondInningTeamScore += Number(each.total_runs);
                    if (each.player_dismissed != "") {
                        this.seasonSnapShot.secondInningDismmisals += 1;
                    }

                })
                //   this.seasonSnapShot.secondInningTeamOversPlayed = Number(secondlist[secondlist.length - 1].over);
            }
        }
    }



}