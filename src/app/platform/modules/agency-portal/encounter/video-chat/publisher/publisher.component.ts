import { AppService } from "./../../../../../../app-service.service";
import { MatDialog } from "@angular/material/dialog";
import { AddNewCallerComponent } from "./../../../../../../shared/add-new-caller/add-new-caller.component";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "./../../../../core/services/common.service";
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from "@angular/core";
import { OpentokService } from "../../opentok.service";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { TextChatService } from "src/app/shared/text-chat/text-chat.service";
import { VideoRecordModel } from "src/app/shared/models/videoRecordModel";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";
import { NotifierService } from "angular-notifier";
import { HubService } from "src/app/platform/modules/main-container/hub.service";

@Component({
  selector: "app-publisher",
  templateUrl: "./publisher.component.html",
  styleUrls: ["./publisher.component.css"],
 encapsulation: ViewEncapsulation.None,
})
export class PublisherComponent implements AfterViewInit, OnDestroy {
  @ViewChild("publisherDiv") publisherDiv!: ElementRef;
  @Input() session!: OT.Session;
  @Input() patientAppointmentId!: number;
  @Input() otSessionId!: number;
  publisher!: OT.Publisher;
  publishing: Boolean;
  isScreenShare: boolean = false;
  isVideo: boolean = true;
  userRole: any;
  isVideoBtn: boolean = false;
  isFullScreen: boolean = false;
  isProvider: boolean = false;
  isPatient: boolean = false;
  screenSize: Array<any> = [
    { id: 1, size: "1:8", class: "one-forth-width" },
    { id: 2, size: "1:4", class: "half-width" },
    { id: 3, size: "1:2", class: "" },
    { id: 4, size: "1:1", class: "video-call-fixed" },
  ];
  screenId: any;
  isVideoRecord: boolean = false;
  archiveId: string = "";
  constructor(
    private opentokService: OpentokService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogModal: MatDialog | null,
    private appService: AppService,
    private textChatService: TextChatService,
    private notifier: NotifierService,
    private hubservice: HubService
  ) {
    //////debugger;
    this.publishing = false;

    this.screenId = this.screenSize[2];
    console.log(this.screenId);
    this.archiveId = "";
  }
  ngOnInit() {
    console.log("14 oninit   called from publisher  ");
    this.appService.videoRecordingStarted.subscribe(
      (videoRecordModel: VideoRecordModel) => {
        this.isVideoRecord = videoRecordModel.isRecording;
        this.archiveId = "";
        if (videoRecordModel.isRecording)
          this.archiveId = videoRecordModel.archiveId;
      }
    );

    if (
      localStorage.getItem("UserRole") &&
      localStorage.getItem("UserRole") == "PROVIDER"
    ) {
      this.isProvider = true;
    } else if (
      localStorage.getItem("UserRole") &&
      localStorage.getItem("UserRole") == "CLIENT"
    ) {
      this.isPatient = true;
    }
    // this.commonService.loginUser.subscribe((user: LoginUser) => {
    //   if (user && user.data) {
    //     const userRoleName =
    //       user.data.users3 && user.data.users3.userRoles.userType;
    //     if ((userRoleName || "").toUpperCase() === "CLIENT") {
    //       this.isPatient = true;
    //     } else {
    //       this.isPatient = false;
    //     }
    //   }
    // });
    this.appService.newSelectedScreenSize.subscribe((s) => {
      if (s) {
        const size = this.screenSize.find((x) => x.size == s);
        const eventSize = { value: size };
        this.setScreenSize(eventSize);
      }
    });
  }

  // ngAfterViewInit() {
  //   this.startVideoCall();
  // }

  // cycleVideo() {
  //   this.publisher && this.publisher.cycleVideo();
  // }

  // toggleScreen() {
  //   if (this.isScreenShare)
  //     this.startVideoCall();
  //   else
  //     this.screenshare()
  //   this.isScreenShare = !this.isScreenShare;
  // }

  // startVideoCall() {
  //   const OT = this.opentokService.getOT();
  //   this.publisher = OT.initPublisher(this.publisherDiv.nativeElement,
  //     { name: 'OpenTok', style: {}, insertMode: 'append', width: '70px', height: '50px', showControls: true, },
  //     (err) => {
  //       err && alert(err.message);
  //     });

  //   if (this.session) {
  //     if (this.session['isConnected']()) {
  //       this.publish();
  //     }
  //     this.session.on('sessionConnected', () => this.publish());
  //   }
  // }

  // screenshare() {
  //   const OT = this.opentokService.getOT();
  //   OT.checkScreenSharingCapability((response) => {
  //     if (!response.supported || response.extensionRegistered === false) {
  //       alert('This browser does not support screen sharing.');
  //     } else if (response.extensionInstalled === false) {
  //       alert('Please install the screen sharing extension and load your app over https.');
  //     } else {
  //       // Screen sharing is available. Publish the screen.
  //       this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {width: '70px',  height: '50px', showControls: true, videoSource: 'window' });
  //       if (this.session) {
  //         if (this.session['isConnected']()) {
  //           this.publish();
  //         }
  //         this.session.on('sessionConnected', () => this.publish());
  //       }
  //     }
  //   })
  // }

  // publish() {
  //   this.session.publish(this.publisher, (err) => {
  //     if (err) {
  //       alert(err.message);
  //     } else {
  //       this.publishing = true;
  //     }
  //   });
  // }

  // ngOnDestroy() {
  //   if (!this.isScreenShare)
  //     this.session.disconnect();
  // }

  

  ngAfterViewInit() {
    this.startVideoCall();
  }

  cycleVideo() {
    this.publisher && this.publisher.cycleVideo();
  }

  toggleVideo(video: boolean) {
    // this.isVideoBtn = false;
    if (video == true) {
      this.publisher.publishVideo(false);
      this.publisher.publishAudio(true);
      this.isVideo = false;
    } else {
      this.publisher.publishVideo(true);
      this.publisher.publishAudio(true);
      this.isVideo = true;
    }
  }
  toggleFullScreen(isFullScreen: boolean) {
    this.isFullScreen = !isFullScreen;
    let videoTool = document.getElementsByClassName("video-call");
    videoTool[0].classList.toggle("video-call-fixed");
  }
  toggleScreen() {
    if (this.isScreenShare) this.startVideoCall();
    else this.screenshare();
    this.isScreenShare = !this.isScreenShare;
  }
  screenshare() {
    const OT = this.opentokService.getOT();
    OT.checkScreenSharingCapability((response) => {
      if (!response.supported || response.extensionRegistered === false) {
        alert("This browser does not support screen sharing.");
      } else if (response.extensionInstalled === false) {
        alert(
          "Please install the screen sharing extension and load your app over https."
        );
      } else {
        // Screen sharing is available. Publish the screen.
        this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
          width: "70px",
          height: "50px",
          showControls: true,
          videoSource: "window",
        });
        if (this.session) {

           // commented due to error
          // if (this.session["isConnected"]()) {
          //   this.publish();
          // }
          this.session.on("sessionConnected", () => this.publish());
        }
      }
    });
  }
  endCall() {
    console.log("15 endcall   called from publisher  ");
    let callInitModel: CallInitModel = new CallInitModel();
    callInitModel.AppointmentId = 0;
    callInitModel.CallStatus = CallStatus.Over;
    this.commonService.videoSession(false);
    this.commonService.endCallsession(true);
    this.appService.CheckCallStarted(callInitModel);
    localStorage.removeItem("callPicked");
    this.commonService.callStartStopSubject.next(false);

    var apptId = 0;

    this.activatedRoute.queryParams.subscribe((param) => {
      apptId = param["apptId"];
    });
    // localStorage.removeItem("otSession");
    // localStorage.removeItem("isCallStart");
    // localStorage.removeItem("called_" + this.patientAppointmentId);

    this.commonService.isPatient.subscribe((isPatient) => {
      if (isPatient) {
        console.log(
          "16 ispatient condition in endcall   called from publisher  "
        );
        this.session.on("streamDestroyed", (e) => e.preventDefault());
        this.session.disconnect();
        this.router.navigate(["/web/encounter/thank-you"], {
          queryParams: {
            apptId: apptId,
          },
        });
      } else {
        console.log("17 ispatient false in endcall   called from publisher  ");
        this.session.on("streamDestroyed", (e) => e.preventDefault());
        this.session.disconnect();
      }
    });
    // setTimeout(() => {
    //   if (localStorage.getItem("access_token")) {
    //     this.commonService.userRole.subscribe((res) => {

    //       if (localStorage.getItem("UserRole").toLowerCase()=="client" || res.toLowerCase()=="client") //
    //       {
    //         this.router.navigate(["/web/client/my-scheduling"]);

    //      }
    //   else {
    //     this.router.navigate(["/web/scheduling"]);
    //   }

    //     });
    //   }
    // }, 1000);

    if (
      this.patientAppointmentId > 0 &&
      Number(localStorage.getItem("UserId")) > 0
    ) {
      this.appService
        .getEndCall(
          this.patientAppointmentId,
          Number(localStorage.getItem("UserId"))
        )
        .subscribe((res) => {
          //////debugger;
        });
    }

    this.commonService.changeCallStartStopStatus(false);
    let videoCall = document.getElementsByClassName("video-call");
    videoCall[0].classList.add("video-call-hide");
    let videoTool = document.getElementsByClassName("video-tool");
    videoTool[0].classList.add("video-tool-hide");
  }
//old code
  // startVideoCall() {
  //   this.hubservice.setModalPopupEndUndefined();
  //   console.log("18 start video call  is called from publisher  ");
  //   const OT = this.opentokService.getOT();

  //   this.publisher = OT.initPublisher(
  //     this.publisherDiv.nativeElement,
  //     {
  //       name: "OpenTok",
  //       style: {},
  //       insertMode: "append",
  //       width: "70px",
  //       height: "50px",
  //       showControls: true,
  //     },
  //     (err) => {
  //       err && console.log(err.message); //alert(err.message);
  //     }
  //   );

  //   if (this.session) {

  //     // commented due to error
  //     // if (this.session["isConnected"]()) {
  //     //   this.publish();
  //     // }
  //     this.session.on("sessionConnected", () => this.publish());
  //     this.session.on("sessionDisconnected", function (event) { });
  //   }

  //   this.commonService.changeCallStartStopStatus(true);
  // }


  //new code
  startVideoCall() {
    this.hubservice.setModalPopupEndUndefined();
    console.log("18 start video call is called from publisher");
  
    const OT = this.opentokService.getOT();
    if (!OT) {
      console.error("OpenTok service is not initialized.");
      return;
    }
  
    this.publisher = OT.initPublisher(
      this.publisherDiv.nativeElement,
      {
        name: "OpenTok",
        style: {},
        insertMode: "append",
        width: "70px",
        height: "50px",
        showControls: true,
      },
      (err) => {
        if (err) {
          console.log("Publisher initialization error:", err.message);
          return;
        }
        console.log("Publisher initialized successfully");
      }
    );
  
    if (this.session) {
      console.log("Session exists, setting up event listeners...");
  
      this.session.on("sessionConnected", () => {
        console.log("Session connected, publishing...");
        this.publish();
      });
  
      this.session.on("sessionDisconnected", (event) => {
        console.log("Session disconnected:", event);
      });
  
      // Check if the session is already connected
      if (this.session.connection) {
        console.log("Session is already connected, publishing...");
        this.publish();
      }
    } else {
      console.error("Session does not exist.");
    }
  
    this.commonService.changeCallStartStopStatus(true);
  }
  

  publish() {
    console.log("19 publish  is called from publisher  ");
    this.session.unpublish(this.publisher);
    this.session.publish(this.publisher, (err) => {
      if (err) {
        console.log(err.message); 
        //alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }
  addNewCaller() {
    let dbModal;
    if (this.dialogModal != null) {
      dbModal = this.dialogModal.open(AddNewCallerComponent, {
        data: {
          appointmentId: this.patientAppointmentId,
          sessionId: this.otSessionId,
        },
      });
      dbModal.afterClosed().subscribe((result: string) => {
        if (result == "save") {
        }
      });
    }

  }
  startChat() {
    var chatInitModel = new ChatInitModel();
    var response = JSON.parse(
      this.commonService.encryptValue(localStorage.getItem("otSession"), false)
    );

    if (!localStorage.getItem("access_token")) {
      chatInitModel.isActive = true;
      chatInitModel.AppointmentId = response.appointmentId;
      chatInitModel.UserId = response.userId;
      chatInitModel.UserRole = "Invited";
    } else {
      chatInitModel.isActive = true;
      chatInitModel.AppointmentId = response.appointmentId;
      chatInitModel.UserId = Number(localStorage.getItem("UserId"));
      chatInitModel.UserRole = localStorage.getItem("UserRole")!;

      // this.commonService.userRole.subscribe((role) => {
      //   if (role != "PROVIDER") {
      //     this.commonService.loginUser.subscribe((loginDetail: any) => {
      //       if (loginDetail.access_token) {
      //         chatInitModel.isActive = true;
      //         chatInitModel.AppointmentId = response.appointmentId;
      //         chatInitModel.UserId = loginDetail.data.userID;
      //         chatInitModel.UserRole =
      //           loginDetail.data.users1.userRoles.userType;
      //       }
      //     });
      //   } else {
      //     this.commonService.loginUser.subscribe((loginDetail: any) => {
      //       if (loginDetail.access_token) {
      //         chatInitModel.isActive = true;
      //         chatInitModel.AppointmentId = response.appointmentId;
      //         chatInitModel.UserId = loginDetail.data.userID;
      //         chatInitModel.UserRole = loginDetail.data.userRoles.userType;
      //       }
      //     });
      //   }
      // });
    }
    this.appService.CheckChatActivated(chatInitModel);
    // this.getAppointmentInfo(
    //   chatInitModel.AppointmentId,
    //   chatInitModel.UserRole
    // );
    this.textChatService.setAppointmentDetail(
      chatInitModel.AppointmentId,
      chatInitModel.UserRole
    );
    this.textChatService.setRoomDetail(
      chatInitModel.UserId,
      chatInitModel.AppointmentId
    );
  }
  setScreenSize(event: any) {
    this.screenId = event.value;

    let videoTool = document.getElementsByClassName("video-tool");
    if (videoTool != undefined && videoTool.length > 0) {
      videoTool[0].classList.remove("video-call-fixed");
      videoTool[0].classList.remove("half-width");
      videoTool[0].classList.remove("one-forth-width");
      var className = this.screenId.class;
      console.log(className);
      videoTool[0].classList.add(className);
    }
  }
  startStopCallRecording() {
    this.isVideoRecord = !this.isVideoRecord;
    if (this.isVideoRecord) {
      var response = JSON.parse(
        this.commonService.encryptValue(
          localStorage.getItem("otSession"),
          false
        )
      );
      this.otSessionId = response.id;
      const config = {
        API_KEY: +response.apiKey,
        TOKEN: response.token,
        SESSION_ID: response.sessionID,
        SAMPLE_SERVER_BASE_URL: "",
      };
      this.appService
        .startVideoRecording(response.sessionID)
        .subscribe((response) => {
          console.log(response);
        });
    } else if (this.archiveId != "") {
      this.appService
        .stopVideoRecording(this.archiveId, this.patientAppointmentId)
        .subscribe((response) => {
          console.log(response);
        });
    }
  }

  ngOnDestroy() {
    if(this.session){

      this.session.disconnect();
    }
   // this.hubservice.resetCallState();
  }

  copyInvitation = () => {
    // var response = JSON.parse(
    //   this.commonService.encryptValue(localStorage.getItem("otSession"), false)
    // );
    // this.otSessionId = response.id;
    // const config = {
    //   API_KEY: +response.apiKey,
    //   TOKEN: response.token,
    //   SESSION_ID: response.sessionID,
    //   SAMPLE_SERVER_BASE_URL: "",
    // };

    // console.log(config);

    const encryptedToken = btoa(localStorage.getItem("otSession")!);

    // console.log("invitation");
    window.navigator["clipboard"].writeText(
      `https://localhost:4200/web/videocall/${encryptedToken}`
    );
    this.notifier.notify("success", "invitaion link copied successfully.");
  };
}
