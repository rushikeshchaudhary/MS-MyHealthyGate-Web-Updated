import { TextChatService } from "./shared/text-chat/text-chat.service";
import { TextChatModel } from "./shared/text-chat/textChatModel";
import { ChatInitModel } from "./shared/models/chatModel";
import { AppService } from "./app-service.service";
import { NotifierService } from "angular-notifier";
import { state } from "@angular/animations";
import { CommonService } from "./platform/modules/core/services/common.service";
import { ActivatedRoute } from "@angular/router";
import { HomeService } from "./front/home/home.service";
import { MediaMatcher } from "@angular/cdk/layout";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from "@angular/core";
import { Subscription } from "rxjs";
import { SubDomainService } from "./subDomain.service";
import * as OT from "@opentok/client";
import { ResizeEvent } from "angular-resizable-element";
import { OpentokService } from "src/app/platform/modules/agency-portal/encounter/opentok.service";
import { VideoRecordModel } from "./shared/models/videoRecordModel";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("videoDiv")
  panelVideo!: ElementRef;
  @ViewChild("textChat")
  textChat!: ElementRef;
  mobileQuery: MediaQueryList; 

  title = "healthcare-frontend-angular";
  private subscription!: Subscription;
  subDomainInfo: any;
  isLoadingSubdomain: boolean = false;
  isDarkTheme: boolean = false;

  private _mobileQueryListener: () => void;
  sessionId: string = "";
  apptId: any = "0";
  public style: object = {};
  public styleVideo: object = {};
  public styleChat: object = {};
  session!: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef!: ChangeDetectorRef;
  startTime!: Date;
  endTime!: Date;
  actualMin: any;
  invitationToken: string = "";
  otSessionId: number = 0;
  isVideoStarted: boolean = false;
  isChatActivated: boolean = false;
  appointmentId: number = 0;
  chatInitModel!: ChatInitModel;
  textChatModel!: TextChatModel;
  roomId: any;
  chatHistory: any = [];
  userInChatRoom: any = [];
  chatSub: any;
  organizationModel!: string;
  loaderHide: boolean = true;
  constructor(
    private subDomainService: SubDomainService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private renderer: Renderer2,
    private opentokService: OpentokService,
    private notifierService: NotifierService,
    private appService: AppService,
    private textChatService: TextChatService,
    private titleService: Title,
    private translate: TranslateService
  ) {
    if (!localStorage.getItem("language") || "en") {
      localStorage.setItem("language", "en");
      this.translate.use("en");

    }
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }



  ngOnInit() {
    debugger
    if (!localStorage.getItem("language") || "en") {
      localStorage.setItem("language", "en");
      this.translate.use("en");
    }

    const subDomainUrl = this.subDomainService.getSubDomainUrl();
    if (subDomainUrl) {
      this.isLoadingSubdomain = true;
      console.log("app=> subdomain");
      this.subDomainService.verifyBusinessName(subDomainUrl).subscribe();
      //this.subDomainService.setupVerifyBusinessResponse(response);
      setTimeout(() => {
        this.subscription = this.subDomainService
          .getSubDomainInfo()
          .subscribe((domainInfo) => {
            if (domainInfo)
              this.subDomainService.updateFavicon(
                "data:image/png;base64," + domainInfo.organization.faviconBase64
              );
            // sessionStorage.setItem("businessName",domainInfo.organization.businessName);
          });
      }, 2000);
    }
    setTimeout(() => {
      this.chatInitModel = new ChatInitModel();
      this.chatHistory = [];
      this.titleService.setTitle(sessionStorage.getItem("businessName")||"");

      this.appService.chat.subscribe((chatModel: ChatInitModel) => {
        this.chatHistory = [];
        if (!chatModel) {
          chatModel = new ChatInitModel();
        }
        this.chatInitModel = chatModel;
        this.isChatActivated = chatModel.isActive;
        this.appService.chatRoom.subscribe((response: any) => {
          console.log("chat room id message from server: ", response);

          this.roomId = response as Number;

          if (this.roomId > 0) {
            this.chatHistory = [];

            this.getChatHistory(this.roomId);
            if (this.roomId > 0) {
              this.appService
                .getUserInChatRoom(this.roomId)
                .subscribe((res) => {
                  if (res.statusCode == 200) {
                    this.userInChatRoom = res.data;
                  } else this.userInChatRoom = [];
                });
            }
          }
        });
      });

      this.appService.chatUser.subscribe((textChatModel: TextChatModel) => {
        if (!textChatModel) {
          textChatModel = new TextChatModel();
        }
        this.textChatModel = textChatModel;
      });
      // this.chatSub = this.appService.chatRoom.subscribe((response: any) => {
      //   this.roomId = response as Number;
      //   if (this.roomId > 0) {
      //     this.chatHistory = [];
      //     this.getChatHistory(this.roomId);
      //     if (this.roomId > 0) {
      //       this.appService.getUserInChatRoom(this.roomId).subscribe((res) => {
      //         if (res.statusCode == 200) {
      //           this.userInChatRoom = res.data;
      //         } else this.userInChatRoom = [];
      //       });
      //     }
      //   }
      // });

      this.activatedRoute.queryParams.subscribe((param) => {
        if (
          param["token"] != null &&
          param["token"] != undefined &&
          param["token"] != ""
        ) {
          this.invitationToken = param["token"];
          if (!localStorage.getItem("otSession")) this.checkOTSession();
        }
      });

      this.commonService.videoSessionStarted.subscribe((res) => {
        var a = res;
        if (
          localStorage.getItem("otSession") &&
          localStorage.getItem("otSession") != ""
        )
          this.checkOTSession();
      });
      var interval = setInterval(() => {
        if (
          localStorage.getItem("otSession") &&
          localStorage.getItem("otSession") != ""
        ) {
          //if (!this.isVideoStarted) {
          let videoTool = document.getElementsByClassName("video-tool");
          if (videoTool != undefined && videoTool.length > 0) {
            if (videoTool[0].classList.contains("video-tool-hide")) {
              //this.session = new OT.Session();
              this.checkOTSession();
            }
          } else this.checkOTSession();
          //}
        } else {
          this.isVideoStarted = false;
        }
      }, 2000);

      //this.playAudio();

      this.appService.newSelectedVideoPosition.subscribe((s: string) => {
        if (s) {
          const [a, b] = s.split(",");
          const event = { x: a, y: b };
          this.onDragVideo(event, false);
          this.appService.newSelectedVideoPositionSubject.next(null);
        }
      });

      setTimeout(() => {
        this.loaderHide = false;
      }, 3000);
    }, 2000);
  }

  getChatHistory(roomId: number) {
    this.appService
      .getChatHistory(roomId, this.chatInitModel.UserId)
      .subscribe((response) => {
        if (response.statusCode == 200) this.chatHistory = response.data;
        else this.chatHistory = [];
      });
  }


  checkVideoStarted() {}
  ngAfterViewInit() {}
  ngAfterViewChecked() {
    this.titleService.setTitle(sessionStorage.getItem("businessName")!);
  }

  ngOnChanges() {}
  playAudio() {
    let audio = new Audio();
    audio.src = "../assets/cell-phone-vibrate-1.wav";
    audio.load();
    audio.muted = false;
    if (typeof audio.loop == "boolean") {
      audio.loop = true;
    } else {
      audio.addEventListener(
        "ended",
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
    }
    audio.play();
  }
  checkOTSession() {
    debugger
    console.log("22 checkotsesson  is called from app.component  ");
    if (!localStorage.getItem("otSession")) {
      if (
        this.invitationToken != undefined &&
        this.invitationToken != null &&
        this.invitationToken != ""
      ) {
        //if (localStorage.getItem("inv_token")) {
        console.log("invitationtoken=" + this.invitationToken);
        this.homeService
          .getOTSessionDetail(this.invitationToken)
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
              this.apptId = response.data.appointmentId;
              this.getSession(config);
            } else {
              this.notifierService.notify(
                "error",
                "Token is not valid or expired"
              );
            }
          });
        //}
      }
    } else {
      let videoTool = document.getElementsByClassName("video-tool");
      if (videoTool != undefined && videoTool.length > 0)
        videoTool[0].classList.remove("video-tool-hide");
      let videoCall = document.getElementsByClassName("video-call");
      if (videoCall != undefined && videoCall.length > 0)
        videoCall[0].classList.remove("video-call-hide");
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
      this.apptId = response.appointmentId;
      this.getSession(config);
    }
  }
  getSession(config: any) {
    console.log("21 getsession  is called from app.component.ts  ");
    this.opentokService
      .initSession(config)
      .then((session: OT.Session) => {
        this.session = session;
        this.isVideoStarted = true;
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
            var subscribers:any = session.getSubscribersForStream(event.stream);
            if (subscribers.length > 0) {
              var subscriber:any = document.getElementById(subscribers[0].id);
              // Display error message inside the Subscriber
              subscriber.innerHTML =
                "Lost connection. This could be due to your internet connection " +
                "or because the other party lost their connection.";
              event.preventDefault(); // Prevent the Subscriber from being removed
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
      .then(() => this.opentokService.connect())
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
  onResizingVideo(event: ResizeEvent|any):any {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "width",
      `${perValue}%`
    );
    return
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragVideo(event: any, iserUserDrag = true) {
    // let videoTool = document.getElementsByClassName("video-tool");
    // if (videoTool != undefined && videoTool.length > 0)
    //   videoTool[0].classList.remove("soap-note-video");
    let top;
    let left;
    if (iserUserDrag) {
      (top = this.panelVideo.nativeElement.style.top),
        (left = this.panelVideo.nativeElement.style.left);
      (top = (parseInt(top) || 0) + event.y),
        (left = (parseInt(left) || 0) + event.x);
    } else {
      (top = event.y), (left = event.x);
    }

    //(top = top.replace("px", "")), (right = right.replace("px", ""));

    // this.renderer.setStyle(this.panelVideo.nativeElement, "top", `${top}px`);
    this.renderer.setStyle(this.panelVideo.nativeElement, "left", `${left}px`);
    // let bottom = this.panelVideo.nativeElement.style.bottom,
    //   right = this.panelVideo.nativeElement.style.right;

    // (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    // (bottom = (parseInt(bottom) || 0) + -event.y),
    //   (right = (parseInt(right) || 0) + -event.x);
    // this.renderer.setStyle(
    //   this.panelVideo.nativeElement,
    //   "bottom",
    //   `${bottom}px`
    // );
    // this.renderer.setStyle(
    //   this.panelVideo.nativeElement,
    //   "right",
    //   `${right}px`
    // );
  }
  onValidateResize(event: ResizeEvent | any): boolean {
    let perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    return true;
  }
  onValidateResizeVideo(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeVideoEnd(event: ResizeEvent): void {
    this.styleVideo = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }
  toggleActivation(i:any) {
    var activeSub = document.getElementsByClassName("sub-active");
    activeSub[0].classList.add("sub-not-active");
    activeSub[0].classList.remove("sub-active");

    var subscriber = document.getElementsByClassName("app-subscriber");
    subscriber[i].classList.add("sub-active");
    subscriber[i].classList.remove("sub-not-active");
  }

  onResizingChat(event: ResizeEvent |any): any {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(
      this.textChat.nativeElement,
      "width",
      `${perValue}%`
    );
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragChat(event: any) {
    let top = this.textChat.nativeElement.style.top,
      right = this.textChat.nativeElement.style.right;

    //(top = top.replace("px", "")), (right = right.replace("px", ""));
    (top = (parseInt(top) || 0) + event.y),
      (right = (parseInt(right) || 0) + -event.x);
    //this.renderer.setStyle(this.panelVideo.nativeElement, "top", `${top}px`);
    this.renderer.setStyle(this.textChat.nativeElement, "right", `${right}px`);
    // let bottom = this.panelVideo.nativeElement.style.bottom,
    //   right = this.panelVideo.nativeElement.style.right;

    // (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    // (bottom = (parseInt(bottom) || 0) + -event.y),
    //   (right = (parseInt(right) || 0) + -event.x);
    // this.renderer.setStyle(
    //   this.panelVideo.nativeElement,
    //   "bottom",
    //   `${bottom}px`
    // );
    // this.renderer.setStyle(
    //   this.panelVideo.nativeElement,
    //   "right",
    //   `${right}px`
    // );
  }
  onValidateChatResize(event: any): boolean {
    let perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    return true;
  }
  onValidateResizeChat(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeChatEnd(event: ResizeEvent): void {
    this.styleChat = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  //   this.mobileQuery.removeListener(this._mobileQueryListener);
  //   this.chatSub.unsubscribe();
  // }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.mobileQuery && this._mobileQueryListener) {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }
  
}
