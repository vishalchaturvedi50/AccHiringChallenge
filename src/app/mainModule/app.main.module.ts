import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { MainComponent } from "app/mainModule/app.main.component";
import { HttpService } from "app/httpService/app.httpservice";
import { HttpModule } from "@angular/http";
import { CommonFunction } from "app/mainModule/app.common";
import { PreviousMatchComponent } from "app/previousMatch/app.previous.component";
import { TeamDetailComponent } from "app/teamDetail/app.teamDetail.component";
import { LiveMatchComponent } from "app/liveMatch/app.live.component";

@NgModule({
    imports: [CommonModule, BrowserModule, RouterModule.forRoot([
        { path: "", component: LiveMatchComponent },
        { path: "previousSession/:year", component: PreviousMatchComponent },
        { path: "teamDetail/:year/:teamName", component: TeamDetailComponent }
    ]), HttpModule],
    declarations: [MainComponent, PreviousMatchComponent, TeamDetailComponent, LiveMatchComponent],
    providers: [HttpService, CommonFunction],
    bootstrap: [MainComponent]
})

export class MainModule { }