import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { DocViewerComponent } from "src/app/shared/doc-viewer/doc-viewer.component";
import { VideoConsultationTestModalComponent } from "src/app/shared/video-consultation-test-modal/video-consultation-test-modal.component";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import {
  FileViewModel,
  UserDocumentModel,
} from "../../agency-portal/users/users.model";
import { UsersService } from "../../agency-portal/users/users.service";
import { PatientAppointmentListModel } from "../../client-portal/client-profile.model";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { CommonService } from "../../core/services";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";
import { WaitingRoomService } from "../waiting-room.service";

@Component({
  selector: "app-check-in-call",
  templateUrl: "./check-in-call.component.html",
  styleUrls: ["./check-in-call.component.scss"],
})
export class CheckInCallComponent implements OnInit, OnDestroy {
  appointmentId!: number;
  patientAppointment!: PatientAppointmentListModel;
  isShowTimer = true;
  isEnded!: boolean;
  isStarted: boolean = false;
  isPatient = false;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  documentList: Array<UserDocumentModel> = [];
  userId!: number;
  staffid!: number;
  isShowCheckinBtns: boolean = false;
  isAppointmentCompleted:boolean=true;
  completeStatus="Completed";
  cancellStatus="Cancelled";

  constructor(
    private waitingRoomService: WaitingRoomService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private dailog: MatDialog,
    private userService: UsersService,
    private router: Router,
    private schedulerService: SchedulerService
  ) {
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        //////debugger
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.isPatient = true;
        }
      }
    });
  }

  ngOnInit(): void {
    const apptId = this.route.snapshot.paramMap.get("id");
    this.appointmentId = Number(apptId);
    this.getAppointmentDetails(this.appointmentId);
    //this.commonService._isAppointmentCompleted.subscribe(res=>this.isAppointmentCompleted=res);
    //this.call();
    /*if (
      this.isPatient == false &&
      localStorage.getItem("called_" + this.appointmentId)
      && localStorage.getItem("called_" + this.appointmentId) == "true"
    ) {
      this.router.navigate([
        "/web/waiting-room/check-in-soap/" + this.appointmentId,
      ]);
    }*/
    if (this.isPatient == false) {
      this.router.navigate([
        "/web/waiting-room/check-in-soap/" + this.appointmentId,
      ]);
    }
  }

  getAppointmentDetails(id:any) {
    //////debugger;
    return this.waitingRoomService
      .getAppointmentDetails(id)
      .subscribe((res) => {
        if (res.data) {
          this.patientAppointment = res.data;
          this.patientAppointment.startDateTime = new Date(this.patientAppointment.startDateTime);
          // this.patientAppointment.startDateTime = moment(new Date(this.patientAppointment.startDateTime))
          //   .subtract(15, "minutes").toDate();
          this.getUserDocuments();
          this.isAppointmentCompleted=res.data.statusName==="Completed"?true:false;
          if (new Date(this.patientAppointment.endDateTime) < new Date()) {
            this.isEnded = true;
          } else if (
            new Date(this.patientAppointment.startDateTime) < new Date()
          ) {
            this.isStarted = true;
          } else {
            this.isShowTimer = true;
          }
        }
      });
  }

  call() {
    console.log("1 Call method called from check page");
    localStorage.setItem("called_" + this.appointmentId, "true");
    // localStorage.setItem("isCallStart", "true");
    if (this.isPatient == true) {
      this.router.navigate([
        "/web/waiting-room/check-in-video-call/" + this.appointmentId,
      ]);
    } else {
      this.router.navigate([
        "/web/waiting-room/check-in-soap/" + this.appointmentId,
      ]);
    }
  }

  enableAllButtons(status: any) {
    this.isShowCheckinBtns = status;
  }

  EndSession() {
    const appointmentData = {
      id: this.appointmentId,
      status: "COMPLETED",
    };
    this.schedulerService
      .updateAppointmentStatus(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifierService.notify("success", 'Appointment has been completed successfully.');
        } else {
        }
      });
  }

  onAudioVideoTest() {
    const modalPopup = this.dailog.open(VideoConsultationTestModalComponent, {
      hasBackdrop: true,

      width: "55%",
    });
  }

  ngOnDestroy(): void { }

  getUserDocuments() {
    //this.userId=6
    this.staffid = this.patientAppointment.appointmentStaffs[0].staffId;
    if (this.staffid != null) {
      //this.fromDate = this.fromDate == null ? '1990-01-01' : format(this.fromDate, "yyyy-MM-dd");
      //this.toDate = this.toDate == null ? format(this.todayDate, "yyyy-MM-dd") : format(this.toDate, "yyyy-MM-dd");
      this.userService
        .getprovidereductaionalDocumentsForPatientCheckin(this.staffid)
        .subscribe((response: ResponseModel) => {
          if (response != null) {
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            // if(response.statusCode== 404){
            //   this.notifier.notify('error', "No Records Found")
            // }
          }
        });
    }
  }

  onOpenDocViewer(doc:any) {
    const modalPopup = this.dailog.open(DocViewerComponent, {
      hasBackdrop: true,
      width: "62%",
      data: doc,
    });

    // modalPopup.afterClosed().subscribe((result) => {
    //   // if (result === "SAVE") this.fetchEvents();
    // });
  }

  getUserDocument(value: UserDocumentModel) {
    // this.userService.getUserDocument(value.id).subscribe((response: any) => {
    //   this.userService.downloadFile(response, response.type, value.url);
    // });
    let key = "userdoc";
    if (value.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.userService.getDocumentForDownlod(value.id,key).subscribe((response: any) => {
      console.log(response);
      debugger;
      if (response.statusCode == 200) {
        var fileType = "";
        switch (response.data.extenstion) {
          case ".png":
            fileType = "image/png";
            break;
          case ".gif":
            fileType = "image/gif";
            break;
          case ".pdf":
            fileType = "application/pdf";
            break; // Assuming PDF for illustration
          case ".jpeg":
            fileType = "image/jpeg";
            break;
          case ".jpg":
            fileType = "image/jpeg";
            break;
          case ".xls":
            fileType = "application/vnd.ms-excel";
            break;
          default:
            fileType = "";
        }
        var binaryString = atob(response.data.base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        var newBlob = new Blob([bytes], {
          type: fileType,
        });
       // this.userService.downloadFile(response, response.type, value.url);
       this.userService.downloadFile( newBlob,
        fileType,
        response.data.fileName);
      }
      else {

        this.notifierService.notify("error", response.message);
      }
    });

  }

  openFileViewer(value: UserDocumentModel) {
    // this.userService.getUserDocument(value.id).subscribe((response: any) => {
    //   //////debugger
    //   //  this.userService.downloadFile(response, response.type, value.url);
    //   const model: FileViewModel = {
    //     blob: response,
    //     filetype: value.extenstion,
    //     fileUrl: value.url,
    //   };

    //   const modalPopup = this.dailog.open(DocViewerComponent, {
    //     hasBackdrop: true,
    //     width: "62%",
    //     data: model,
    //   });
    // });
    let key = "userdoc";
    if (value.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.userService
      .getDocumentForDownlod(value.id,key)
      .subscribe((response: any) => {
        console.log(response);
        debugger;
        if (response.statusCode == 200) {
          var fileType = "";
          switch (response.data.extenstion) {
            case ".png":
              fileType = "image/png";
              break;
            case ".gif":
              fileType = "image/gif";
              break;
            case ".pdf":
              fileType = "application/pdf";
              break;
            case ".jpeg":
              fileType = "image/jpeg";
              break;
            case ".jpg":
              fileType = "image/jpeg";
              break;
            case ".xls":
              fileType = "application/vnd.ms-excel";
              break;
            default:
              fileType = "";
          }
          var binaryString = atob(response.data.base64);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          var newBlob = new Blob([bytes], {
            type: fileType,
          });

          const model: FileViewModel = {
            blob: newBlob,
            filetype: value.extenstion,
            fileUrl: value.url,
          };

          const modalPopup = this.dailog.open(DocViewerComponent, {
            hasBackdrop: true,
            width: "62%",
            data: model,
          });
        }
        else {
          this.notifierService.notify("error", response.message);
        }
      });

  }
}
