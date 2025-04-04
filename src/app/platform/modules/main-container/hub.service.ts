import { Inject, Injectable } from "@angular/core";
import { HubConnection } from "src/app/hubconnection.service";
import { AppService } from "src/app/app-service.service";
import {
  CallInitModel,
  CallStatus,
  UrgentCareProviderActionInitModel,
} from "src/app/shared/models/callModel";
import { ChatHistoryModel } from "../agency-portal/clients/profile/chat-history.model";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { TextChatService } from "src/app/shared/text-chat/text-chat.service";
import { CommonService } from "../core/services";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SaveDocumentComponent } from "src/app/front/save-document/save-document.component";
import { UrgentCareProviderActionComponent } from "src/app/shared/urgentcare-provideraction/urgentcare-provideraction.component";
import { PatientUrgentCareStatusComponent } from "src/app/shared/patient-urgentcare-status/patient-urgentcare-status.component";
import { CallNotificationComponent } from "../../../shared/call-notification/call-notification.component";
@Injectable({
  providedIn: "root",
})
export class HubService {
  private hubConnection: HubConnection;
  appointmentId: number;
  isClientLogin: boolean = false;
  userRole: any;
  modalPopupEnd: any;
  constructor(
    private appService: AppService,
    private commonService: CommonService,
    private activateRoute: ActivatedRoute,
    private textChatService: TextChatService,
    private appointmentDailog: MatDialog //private dialogModalRef: MatDialogRef<UrgentCareProviderActionComponent>
  ) {
    this.hubConnection = new HubConnection();
    this.appointmentId = 0;
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        if (user.users3 && user.users3.userRoles) {
          this.userRole = (user.users3.userRoles.userType || "").toUpperCase();
        }
        this.isClientLogin = this.userRole == "CLIENT";
      }
    });
  }

  getModalPopUpEnd = () => {
    return this.modalPopupEnd;
  };
  setModalPopupEndUndefined = () => {
    this.modalPopupEnd = undefined;
  };
  createHubConnection(userId: number) {
    this.modalPopupEnd = undefined;
    console.log("26 createhubconnection  is called from hub service  ");
    if (this.hubConnection) {
      var token = localStorage.getItem("business_token");
      this.hubConnection.createHubConnection(token).then((response:any) => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(userId);
        });

        this.hubConnection.ConnectWithBussinessToken(userId).then((res:any) => {
          this.getIncomingCallNotifications();
          this.getCallEndNotifications();
          this.getMessageNotifications();
          this.getIncomingUrgentCareProviderNotifications();
          this.getIncomingUrgentCarePatientNotifications();
          console.log("Connection: connection id to server : " + res);
        });
      });
    }
  }
  private ReconnectOnClose(userId: number) {
    setTimeout(() => {
      console.log("27 reconnectonclose  is called from hub service  ");
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectWithBussinessToken(userId).then((res:any) => {
          this.getIncomingCallNotifications();
          console.log("Restart Connection: connection id to server : " + res);
          // console.log('Restart Connection: user id sent to server : ' + fromUserId);
        });
      });
    }, 2000);
  }
  getIncomingCallNotifications() {
    console.log("28 getincomingcallnotification  is called from hub service  ");
    this.hubConnection
      .getHubConnection()
      .on(
        "CallInitiated",
        (
          appointmentId: number,
          fromUserId: number,
          toUserId: number,
          callerName: string
        ) => {
          //this.dialogModalRef.close();
          ////debugger;
          this.appointmentDailog.closeAll();
          this.modalPopupEnd = undefined;
          let previousCallModel: CallInitModel = new CallInitModel();
          this.appService.call.subscribe((callInitModel: CallInitModel) => {
            previousCallModel = callInitModel;
          });
          console.log(
            "Previous Call Initiated For Appointment Id : ",
            previousCallModel.AppointmentId
          );
          let callInitModel = new CallInitModel();
          callInitModel.CallStatus = CallStatus.Started;
          callInitModel.AppointmentId = appointmentId;
          callInitModel.CallerName = callerName;
          if (previousCallModel.AppointmentId != appointmentId) {
            console.log("Call MOdel Changed : ", callInitModel);
            this.appService.CheckCallStarted(callInitModel);
          }
          console.log("Call Initiated For Appointment : ", appointmentId);
          //var callButton = document.getElementById("divCallButton");
          //callButton.classList.add("active");
        }
      );
  }
  getCallEndNotifications() {
    console.log("28 getendcallnotification  is called from hub service  ");
   // this.resetCallState();
    this.hubConnection
      .getHubConnection()
      .on(
        "CallEnd",
        (
          appointmentId: number,
          fromUserId: number,
          toUserId: number,
          callerName: string,
          userType: string
        ) => {
          // this.appointmentDailog.closeAll();
          // let previousCallModel: CallInitModel = new CallInitModel();
          // this.appService.call.subscribe((callInitModel: CallInitModel) => {
          //   previousCallModel = callInitModel;
          // });
          console.log("CALL Ended in hub service : ");
          this.openEndCallActionDialog(callerName, userType);
        }
      );
  }
  handleIncomingCall(appointmentId: number, userId: number):any {
    
    console.log("29 handleincomingcall  is called from hub service  ");
    if (this.hubConnection.isConnected()) {
      this.hubConnection
        .getHubConnection()
        .invoke("CallInitiate", appointmentId, userId)
        // .then(() => {
        //   this.getMessageNotifications();
        // })
        .catch((err:any) => console.error(err, "Receive Incoming Call"));
      return appointmentId;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .getHubConnection()
          .invoke("CallInitiate", appointmentId, userId)
          // .then(() => {
          //   this.getMessageNotifications();
          // })
          .catch((err:any) => console.error(err, "Receive Incoming Call"));
        return appointmentId;
      });
    }
    return;
  }
  openProviderActionDialog(appointmentId: number) {
    console.log("29 openprovideractiondialog  is called from hub service  ");
    const modalPopup = this.appointmentDailog.open(
      UrgentCareProviderActionComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
        width: "60%",
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }
  openEndCallActionDialog(callerName: string, userType: string) {
    console.log("29 openendcallactiondialog  is called from hub service  ");
    // console.log(this.userRole);
    if (this.modalPopupEnd == undefined) {
      this.modalPopupEnd = this.appointmentDailog.open(
        CallNotificationComponent,
        {
          hasBackdrop: true,
          data: { callerName: callerName, userType: userType },
          width: "60%",
        }
      );

      console.log(this.modalPopupEnd);

      this.modalPopupEnd.afterClosed().subscribe((result:any) => {
        // if (result === "SAVE") this.fetchEvents();
      });
    }
  }

  openPatientActionDialog() {
    console.log("30 openpatientactiondialog  is called from hub service  ");
    const modalPopup = this.appointmentDailog.open(
      PatientUrgentCareStatusComponent,
      {
        hasBackdrop: true,
        //data: ,
        width: "60%",
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  // closeDialog(action: string): void {
  //   this.dialogModalRef.close(action);
  // }

  getIncomingUrgentCareProviderNotifications() {
    console.log("31 getincomingurgentcakk  is called from hub service  ");
    this.hubConnection
      .getHubConnection()
      .on(
        "CallProviderUrgentCare",
        (appointmentId: number, fromUserId: number, toUserId: number) => {
          //////debugger;
          this.openProviderActionDialog(appointmentId);
          //   let previousCallModel: UrgentCareProviderActionInitModel = new UrgentCareProviderActionInitModel();
          //   this.appService.ProviderActioncall.subscribe((callInitModel: UrgentCareProviderActionInitModel) => {
          //     previousCallModel = callInitModel;
          //   });
          //   console.log(
          //     "Previous Urgent Call Initiated For Appointment Id : ",
          //     previousCallModel.AppointmentId
          //   );
          //   let callInitModel = new UrgentCareProviderActionInitModel();
          //  // callInitModel.CallStatus = CallStatus.Started;
          //   callInitModel.AppointmentId = appointmentId;

          //     console.log("Call UrgentCare Model Changed : ", callInitModel);
          //     this.appService.ProviderActioncallStarted(callInitModel);

          //   console.log("Urgebt care Call Initiated For Appointment : ", appointmentId);

          //var callButton = document.getElementById("divCallButton");
          //callButton.classList.add("active");
        }
      );
  }

  getIncomingUrgentCarePatientNotifications() {
    this.hubConnection
      .getHubConnection()
      .on(
        "CallPatientUrgentCare",
        (appointmentId: number, fromUserId: number, toUserId: number) => {
          this.openPatientActionDialog();
        }
      );
  }

  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("ReceiveMessage", (result: any[], UserId: any, currentRoomId: any, appointmentId: any) => {
        console.log("message from server", result, currentRoomId);
        //hub service // if call is in progress and if someone send msg then chat window open automaticaly
        if (appointmentId > 0) {
          this.appointmentId = appointmentId;
          this.openChatRoom(this.appointmentId);
        }
        //
        if (
          currentRoomId == 0 //this.currentRoomId
        ) {
          result.forEach((element:any) => {
            var currentDate = new Date();
            const messageObj: ChatHistoryModel = {
              message: element.message,
              isRecieved:
                element.isRecieved != undefined ? element.isRecieved : true,
              chatDate: currentDate.toString(),
              fromUserId: UserId,
              fileType: element.fileType,
              messageType: element.messageType,
            };
            // this.allMessageArray.push(messageObj);
            // this.scrollbarRef.scrollToBottom(1000);
            // console.log(this.allMessageArray);
          });
        }
      });
  }
  openChatRoom(appointmentId: number) {
    // this.commonService.currentLoginUserInfo.subscribe((response: any) => {
    //if (!localStorage.getItem("access_token")) {
    var chatInitModel = new ChatInitModel();
    if (localStorage.getItem("access_token")) {
      chatInitModel.isActive = true;
      chatInitModel.AppointmentId = appointmentId;
      //chatInitModel.UserId = response.userID;
      chatInitModel.UserId = JSON.parse(localStorage.getItem("UserId")!) || "";
      chatInitModel.UserRole = localStorage.getItem("UserRole") || "";
      //         if(this.isClientLogin){
      //           //chatInitModel.UserRole = response.users3.userRoles.userType;
      //         }else{
      //           chatInitModel.UserRole = response.userRoles.userType;
    }
    //chatInitModel.UserRole = response.data.userRoles.userType;
    this.appService.CheckChatActivated(chatInitModel);
    //
    this.textChatService.setAppointmentDetail(
      chatInitModel.AppointmentId,
      chatInitModel.UserRole
    );
    //
    this.textChatService.setRoomDetail(
      chatInitModel.UserId,
      chatInitModel.AppointmentId
    );

    //});
  }


  // public resetCallState() {
  //   let callInitModel = new CallInitModel();
  //   callInitModel.CallStatus = CallStatus.Over;
  //   callInitModel.AppointmentId = 0;
  //   callInitModel.CallerName = '';
  //   this.appService.CheckCallStarted(callInitModel);
  //   localStorage.removeItem("callPicked");
  //   this.commonService.callStartStopSubject.next(false);
  // }
}
