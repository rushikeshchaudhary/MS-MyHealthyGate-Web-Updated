import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { UserDocumentModel } from "../../agency-portal/users/users.model";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { CommonService } from "../../core/services";
import { WaitingRoomService } from "../waiting-room.service";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PatientDocModalComponent } from "./patient-doc-modal/patient-doc-modal.component";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";

@Component({
  selector: "app-patient-documents",
  templateUrl: "./patient-documents.component.html",
  styleUrls: ["./patient-documents.component.scss"],
})
export class PatientDocumentsComponent implements OnInit {
  appointmentId!: number;
  controls: any;
  documentList: Array<UserDocumentModel> = [];
  fileList: any = [];
  isPatient = false;
  userid = 0;
  isProvider = false;
  maxDate: any;
  fromDate: any;
  toDate: any;
  searchBox: boolean = true;
  filtermasterDocumentTypes: any = [];
  filterString: any;
  filterDocumentList: any = [];
  isHistoryShareable: boolean = true;

  constructor(
    private waitingRoomService: WaitingRoomService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private schedular: SchedulerService,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.isPatient = true;
          this.userid = user.data.userID;
        } else {
          this.isProvider = true;
        }
      }
    });
  }
  ngOnInit(): void {
    const apptId = this.route.snapshot.paramMap.get("id");
    this.appointmentId = Number(apptId);
    this.commonService.loadingStateSubject.next(true);
    this.getAppointmentDetails();

    this.getUserDocuments(this.appointmentId);
    var today = new Date().toLocaleDateString();
    var dateArray = today.split("/");
    this.maxDate = new Date(
      parseInt(dateArray[2]),
      parseInt(dateArray[0]) - 1,
      parseInt(dateArray[1])
    );
  }

  getAppointmentDetails() {
    console.log(this.appointmentId);
    this.schedular
      .getAppointmentDetails(this.appointmentId)
      .subscribe((responce) => {
        this.isHistoryShareable = responce.data.isHistoryShareable;
      });
  }
  searchDocument = (e: any) => {
    if (e !== "") {
      this.filterDocumentList = this.documentList.filter(
        (doc) =>
          doc.documentTitle.toLowerCase().indexOf(e) != -1 ||
          (doc.documentTypeNameStaff != null
            ? doc.documentTypeNameStaff
            : doc.otherDocumentType != null
              ? doc.otherDocumentType
              : doc.documentTypeName
          )
            .toLowerCase()
            .indexOf(e) != -1
      );
    } else {
      this.filterDocumentList = [...this.documentList];
    }
  };

  onSelFunc(data: { documentTitle: string; }) {
    this.filterString = data.documentTitle;
    this.filterDocumentList = this.documentList.filter(
      (doc) =>
        doc.documentTitle.toLowerCase() == data.documentTitle.toLowerCase()
    );
  }

  searcOnDatehHandler = () => {
    if (this.fromDate.jsonValue < this.toDate.jsonValue) {
      var date = new Date(this.toDate.stringValue).setDate(
        this.toDate.stringValue.getDate() + 1
      );
      this.toDate.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc) =>
          doc.createdDate >= this.fromDate.jsonValue &&
          doc.createdDate <= this.toDate.jsonValue
      );
    } else {
      var date = new Date(this.fromDate.stringValue).setDate(
        this.fromDate.stringValue.getDate() + 1
      );
      this.fromDate.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc) =>
          doc.createdDate >= this.toDate.jsonValue &&
          doc.createdDate <= this.fromDate.jsonValue
      );
    }
  };

  sortHandler = (type: string) => {
    if (type === "atoz") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a: { documentTitle: string; }, b: { documentTitle: any; }) => a.documentTitle.localeCompare(b.documentTitle));
    } else if (type === "ztoa") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a: { documentTitle: any; }, b: { documentTitle: string; }) => b.documentTitle.localeCompare(a.documentTitle));
    } else if (type === "latest") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a: { createdDate: any; }, b: { createdDate: string; }) => b.createdDate.localeCompare(a.createdDate));
    } else if (type === "oldest") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a: { createdDate: string; }, b: { createdDate: any; }) => a.createdDate.localeCompare(b.createdDate));
    } else {
      this.filterDocumentList = [...this.documentList];
      console.log(this.filterDocumentList);
    }
  };

  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date> | any) => {
    var data = {
      jsonValue: new Date(event.value).toJSON(),
      stringValue: event.value,
    };
    if (type !== "to") {
      this.fromDate = data;
    } else {
      this.toDate = data;
    }
    // var date = new Date(event.value).toJSON()
  };

  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
  };

  getUserDocuments(appyId: number) {
    this.commonService.loadingStateSubject.next(true);
    this.waitingRoomService
      .getPateintApptDocuments(appyId)
      .subscribe((response: ResponseModel) => {
        this.commonService.loadingStateSubject.next(false);

        if (response != null) {
          this.documentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.filterDocumentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
        }

      });
  }

  getUserDocument(value: UserDocumentModel) {
    // this.waitingRoomService
    //   .getUserDocument(value.id)
    //   .subscribe((response: any) => {
    //     this.waitingRoomService.downloadFile(
    //       response,
    //       response.type,
    //       value.url
    //     );
    //   });

    this.waitingRoomService
      .getDocumentForDownlod(value.id)
      .subscribe((response: any) => {

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
          this.waitingRoomService.downloadFile(
            newBlob,
            fileType,
            response.data.fileName
          );
        }
        else {

          this.notifier.notify("error", response.message);
        }
      });

  }

  deleteUserDocument(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.waitingRoomService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response.statusCode == 200) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments(this.appointmentId);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  createModal() {
    if (this.userid != null) {
      let documentModal;
      let idData = { userId: this.userid, appointmentId: this.appointmentId };
      documentModal = this.dialogModal.open(PatientDocModalComponent, {
        data: idData,
      });
      documentModal.afterClosed().subscribe((result: string) => {
        if (result !== "close") {
          this.getUserDocuments(this.appointmentId);
        }
      });
    } else this.notifier.notify("error", "Please select user");
  }

  // uploadFile(e) {

  //   let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
  //   var input = e.target;
  //   var reader = new FileReader();
  //   reader.onload = () => {
  //    const dataURL = reader.result;
  //     this.fileList.push({
  //       data: dataURL,
  //       ext: fileExtension,
  //       fileName: e.target.files[0].name
  //     });

  //     this.saveDocuments(this.appointmentId);
  //   };

  //   reader.readAsDataURL(input.files[0]);

  // }
  //   removeFile(index: number) {
  //     this.fileList.splice(index, 1);
  //   }

  // saveDocuments(apptId:number) {
  //   ///Please chnage this API to avoid loops

  //     if (this.fileList.length > 0) {
  //       this.commonService.loadingStateSubject.next(true);
  //       let formValues = {
  //         base64: this.fileList,
  //         documentTitle: "Document",
  //         documentTypeId: 17,
  //         expiration: "",
  //         key: "PATIENT",
  //         otherDocumentType: "",
  //         userId: this.userid,
  //         patientAppointmentId: apptId
  //       }
  //       let dic = [];
  //       formValues.base64.forEach((element, index) => {
  //         dic.push(`"${element.data.replace(/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/, '')}": "${element.ext}"`);
  //       });
  //       let newObj = dic.reduce((acc, cur, index) => {
  //         acc[index] = cur;
  //         return acc;
  //       }, {})
  //       formValues.base64 = newObj;
  //       this.waitingRoomService.uploadUserDocuments(formValues).subscribe((response: ResponseModel) => {

  //         if (response != null && response.statusCode == 200) {

  //           this.getUserDocuments(this.appointmentId);
  //           //this.notifier.notify('success', response.message);
  //           //this.closeDialog("save");
  //         }
  //         else this.notifier.notify('error', response.message);
  //       });
  //       this.fileList = [];
  //     }
  //     else {
  //       this.notifier.notify('error', "Please add atleast one file");
  //     }

  //   }
}
