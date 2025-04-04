import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { AppService } from "src/app/app-service.service";
import { HomeService } from "src/app/front/home/home.service";
import { OpentokService } from "src/app/platform/modules/agency-portal/encounter/opentok.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { VideoRecordModel } from "../models/videoRecordModel";
// import { CommonService } from "./platform/modules/core/services/common.service";

@Component({
  selector: "app-invite-call-join",
  templateUrl: "./invite-call-join.component.html",
  styleUrls: ["./invite-call-join.component.css"],
})
export class InviteCallJoinComponent implements OnInit, OnDestroy {
  backgroundColur: any;
  myInterval: any;
  session!: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef!: ChangeDetectorRef;
  startTime!: Date;
  endTime!: Date;
  actualMin: any;

  sessionId: any;
  token: any;
  otSessionId: any;
  constructor(
    private route: ActivatedRoute,
    private opentokService: OpentokService,
    private notifierService: NotifierService,
    private appService: AppService,
    private homeService: HomeService,
    private commonService: CommonService
  ) {}
  ngOnDestroy(): void {
    clearInterval(this.myInterval);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      var routeToken = params["token"];
      this.token = atob(routeToken);
      console.log(this.token);
    });

    let index = 0;
    this.myInterval = setInterval(() => {
      let myColorArray = [
        "#F8D709",
        "#09F8ED",
        "#09D4F8",
        "#099AF8",
        "#094AF8",
        "#6B09F8",
        "#F8098F",
        "#F8093C",
      ];
      this.backgroundColur = myColorArray[index];
      index += 1;
      index > 7 ? (index = 0) : "";
    }, 3000);
  }

  getConfigData = () => {
    //debugger;
    this.homeService
      .getOTSessionDetail(this.token)
      .subscribe((response: any) => {
        var data = response;
        if (response.statusCode == 200) {
          let videoTool = document.getElementsByClassName("video-tool");
          if (videoTool != undefined && videoTool.length > 0)
            videoTool[0].classList.remove("video-tool-hide");
          let videoCall = document.getElementsByClassName("video-call");
          if (videoCall != undefined && videoCall.length > 0)
            videoCall[0].classList.remove("video-call-hide");
          var otSession = this.commonService.encryptValue(
            JSON.stringify(response.data)
          );
          localStorage.setItem("otSession", otSession);
          this.otSessionId = response.data.id;
          // console.log("apikey=" + response.data.apiKey);
          // console.log("token=" + response.data.token);
          // console.log("session=" + response.data.sessionID);

          const config = {
            API_KEY: +response.data.apiKey,
            TOKEN: response.data.token,
            SESSION_ID: response.data.sessionID,
            SAMPLE_SERVER_BASE_URL: "",
          };
          // this.apptId = response.data.appointmentId;
          this.getSession(config);
        } else {
          this.notifierService.notify("error", "Token is not valid or expired");
        }
      });
  };

  getSession(config: any) {
    // console.log("21 getsession  is called from app.component.ts  ");
    this.opentokService
      .initSession(config)
      .then((session: OT.Session) => {
        this.session = session;
        // this.isVideoStarted = true;
        this.streams = Array<OT.Stream>();
        this.session.on("streamCreated", (event) => {
          this.startTime = new Date();
          this.streams.push(event.stream);
          this.changeDetectorRef.detectChanges();
        });
        this.session.on("streamDestroyed", (event) => {
          this.capturedEndTime();
          if (event.reason === "networkDisconnected") {
            event.preventDefault();
            var subscribers = session.getSubscribersForStream(event.stream);
            if (subscribers.length > 0) {
              var subscriber = document.getElementById(subscribers[0].id || "");
              // Display error message inside the Subscriber
              if (subscriber) {
              subscriber.innerHTML =
                "Lost connection. This could be due to your internet connection " +
                "or because the other party lost their connection.";
              event.preventDefault(); // Prevent the Subscriber from being removed
              }
            }
          }
          const idx = this.streams.indexOf(event.stream);
          if (idx > -1) {
            this.streams.splice(idx, 1);
            this.changeDetectorRef.detectChanges();
          }
        });
        this.session.on("sessionDisconnected", (event) => {
          this.capturedEndTime();
        });
        this.session.on("archiveStarted", (event) => {
          console.log("Archive Started : " + event.id);
          let videoRecordModel: VideoRecordModel = new VideoRecordModel();
          videoRecordModel.isRecording = true;
          videoRecordModel.archiveId = event.id;
          this.appService.CheckVideoRecordStatus(videoRecordModel);
          this.notifierService.notify("success", "Recording Started");
        });
        this.session.on("archiveStopped", (event) => {
          console.log("Archive Stopped : " + event.id);
          let videoRecordModel: VideoRecordModel = new VideoRecordModel();
          videoRecordModel.isRecording = false;
          videoRecordModel.archiveId = event.id;
          this.appService.CheckVideoRecordStatus(videoRecordModel);
          this.notifierService.notify("success", "Recording Stopped");
        });
      })
      .then(() => {
        // Added New
        this.session.on("streamCreated", (event) => {
          this.startTime = new Date();
          this.streams.push(event.stream);
          this.changeDetectorRef.detectChanges();
          console.log("log stream", this.streams);
        });
        this.opentokService.connect();
      })
      .catch((err:any) => {
        console.error("error", err);
        // alert(
        //   "Unable to connect. Make sure you have updated the config.ts file with your OpenTok details."
        // );
      });
  }

  private capturedEndTime() {
    this.startTime = new Date();
    var minutesToAdd = 10;
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    this.endTime = futureDate;
    this.diff_minutes(this.endTime, this.startTime);
    this.updateCallDuration();
  }

  diff_minutes(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    this.actualMin = Math.abs(Math.round(diff));
  }
  updateCallDuration() {
    const OT = this.opentokService.getOT();
    // this.schedulerService
    //   .UpdateCallDuration(this.apptId, this.actualMin)
    //   .subscribe(response => {
    //     if (response.statusCode === 200) {
    //       console.log("Call time duration sucessfully captured");
    //     } else {
    //       console.log("On call duration captured time something went wrong");
    //     }
    //   });
  }

  addNewCaller = () => {
    var response = JSON.parse(
      this.commonService.encryptValue(this.token, false)
    );
    this.otSessionId = response.id;
    const config = {
      API_KEY: +response.apiKey,
      TOKEN: response.token,
      SESSION_ID: response.sessionID,
      SAMPLE_SERVER_BASE_URL: "",
    };

    console.log(config);

    this.getSession(config);

    // this.apptId = response.appointmentId;
    console.log(" Join call!!!!");
  };
}
