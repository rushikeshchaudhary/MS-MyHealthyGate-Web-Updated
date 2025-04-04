import { Component, OnInit, Input, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { PublisherComponent } from "src/app/platform/modules/agency-portal/encounter/video-chat/publisher/publisher.component";
import { OpentokService } from "src/app/platform/modules/agency-portal/encounter/opentok.service";
import { NotifierService } from "angular-notifier";
import { TextChatService } from "./../../../app/shared/text-chat/text-chat.service";
import { AppService } from "./../../app-service.service";
import { state } from "@angular/animations";
import { CommonService } from "./../../../app/platform/modules/core/services/common.service";
import { HubService } from "src/app/platform/modules/main-container/hub.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-call-notification",
  templateUrl: "./call-notification.component.html",
  styleUrls: ["./call-notification.component.css"],
  //providers: [PublisherComponent],
})
export class CallNotificationComponent implements OnInit {
  callerName: any;
  userType: any;

  constructor(
    private dialogRef: MatDialogRef<CallNotificationComponent>,
    router: Router,
    activatedRoute: ActivatedRoute,
    private publisher: PublisherComponent,
    opentokService: OpentokService,
    notifierService: NotifierService,
    commonService: CommonService,
    appService: AppService,
    textChatService: TextChatService,
    hubservice:HubService,
    private translate:TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any // private encounterService: EncounterService,
  ) // private notifierService: NotifierService
  {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.callerName = this.data.callerName;
    this.userType = this.data.userType;
    this.publisher = new PublisherComponent(
      opentokService,
      commonService,
      router,
      activatedRoute,
      null,
      appService,
      textChatService,
      notifierService,
      hubservice
    );
    // this.patientname = data.patientname;
    // this.isEndCall = data.isEndCall;
    // this.isUrgentCall = data.isUrgentCall;
    // this.CallerName = this.notificationPayload.callerName;
    // this.telehealthSessionDetailId = this.notificationPayload.telehealthSessionDetailId;
    // this.notificationType = this.notificationPayload.notificationType;
  }

  ngOnInit() {}

  declineCall(): void {
    try {
      this.publisher.endCall();
      this.dialogRef.close("close");
    } catch {
      this.dialogRef.close("close");
    }
  }
}
