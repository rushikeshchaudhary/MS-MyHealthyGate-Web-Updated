import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  OnDestroy,
} from "@angular/core";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "../models/callModel";
import { CommonService } from "src/app/platform/modules/core/services";
import { Router } from "@angular/router";
import { Observable, Subscription, Subject } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-call-button",
  templateUrl: "./call-button.component.html",
  styleUrls: ["./call-button.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CallButtonComponent implements OnInit, OnDestroy {
  callInitModel: CallInitModel;
  loggedInUserName: any;

  private subscription!: Subscription;
  constructor(
    private appService: AppService,
    private commonService: CommonService,
    private router: Router,
    private translate:TranslateService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log(" 40 call button constructor ");
    this.callInitModel = new CallInitModel();
  }

  ngOnInit() {
    console.log(" 50 call button ngoninit");
    this.appService.call.subscribe((callInitModel: CallInitModel) => {
      this.callInitModel = callInitModel;
    });
    this.checkLoggedInClient();
  }
  checkLoggedInClient() {
    this.subscription = this.commonService.loginUser.subscribe((user: any) => {
      if (user.data) {
        console.log(user.data, "data");
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.loggedInUserName = user.patientData
            ? user.patientData.firstName + " " + user.patientData.lastName
            : "";
        } else {
          this.loggedInUserName =
            user.data.firstName + " " + user.data.lastName;
        }
      }
    });
  }

  pickCall() {
    console.log("9 pick call  called from call button");
    //////debugger;

    localStorage.setItem("callPicked", "yes");
    this.callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(this.callInitModel);
    this.commonService.callStartStopSubject.next(true);
    this.commonService.userRole.subscribe((role) => {
      if (role.toLowerCase() == "provider") {
        this.reloadClient();

        //this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId]);
      } else {
        // this.router.navigateByUrl("/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId)
        // .then(()=>{this.reloadComponent()});

        this.reloadComponent();
      }
    });
  }
  reloadClient() {
    // let currentUrl = "/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/web/encounter/soap"], {
      queryParams: {
        apptId: this.callInitModel.AppointmentId,
        encId: 0,
      },
    });
  }
  reloadComponent() {
    let currentUrl =
      "/web/waiting-room/check-in-video-call/" +
      this.callInitModel.AppointmentId;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }
  ngOnDestroy() {
    console.log(
      "sdkjvcgbsduivjsbd uewrfvjevnoeirsxdv weiohcvw eihjf0piw3i4efgihi"
    );

    // window.location.reload();
  }

  declineCall() {
    debugger;
    console.log("8 declient call  called from call button");
    if (
      this.callInitModel.AppointmentId > 0 &&
      Number(localStorage.getItem("UserId")) > 0
    ) {
      console.log("inside publisher method");
      this.appService
        .getEndCall(
          this.callInitModel.AppointmentId,
          Number(localStorage.getItem("UserId"))
        )
        .subscribe((res) => {
          this.callInitModel = new CallInitModel();
          this.callInitModel.CallStatus = CallStatus.Declined;
          this.callInitModel.AppointmentId = 0;

          console.log(this.callInitModel);
          setTimeout(() => {
            this.appService.CheckCallStarted(this.callInitModel);
            this.commonService.callStartStopSubject.next(false);
          }, 500);

          console.log(res);
        });
    }
    //debugger
  }
}
