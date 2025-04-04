import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from "@angular/material/datepicker"
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { ClientsService } from "../../../agency-portal/clients/clients.service";
import { ResponseModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { WaitingRoomService } from "../../../waiting-room/waiting-room.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-appointment-document",
  templateUrl: "./lab-appointment-document.component.html",
  styleUrls: ["./lab-appointment-document.component.css"],
})
export class LabAppointmentDocumentComponent implements OnInit {

  searchBox: boolean = true;
  maxDate: any;
  fromDateSort: any;
  toDateSort: any;
  filterString: any;
  userId!: number;
  documentList: any = [];
  appointmentId: any;
  filterDocumentList: any = [];

  constructor(
    private commonService: CommonService,
    private dialogService: DialogService,
    private clientService: ClientsService,
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private waitingRoomService: WaitingRoomService,
    private translate: TranslateService,

  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    const apptId = this.route.snapshot.paramMap.get("id");
    this.appointmentId = Number(apptId);

    var today = new Date().toLocaleDateString();
    var dateArray = today.split("/");
    this.maxDate = new Date(
      parseInt(dateArray[2]),
      parseInt(dateArray[0]) - 1,
      parseInt(dateArray[1])
    );
    this.getUserDocuments(this.appointmentId)
  }


  searchDocument = (e: any) => {
    if (e !== "") {
      this.filterDocumentList = this.documentList.filter(
        (doc:any) =>
          doc.documentTitle.toLowerCase().indexOf(e) != -1 ||
          (doc.documentTypeNameStaff != null
            ? doc.documentTypeNameStaff
            : doc.otherDocumentType != null
              ? doc.otherDocumentType
              : doc.documentTypeName
          )
            .toLocaleLowerCase()
            .indexOf(e) != -1
      );
    } else {
      this.filterDocumentList = [...this.documentList];
    }
  };


  sortHandler = (type: string) => {
    if (type === "atoz") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a:any, b:any) => a.documentTitle.localeCompare(b.documentTitle));
    } else if (type === "ztoa") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a:any, b:any) => b.documentTitle.localeCompare(a.documentTitle));
    } else if (type === "latest") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a:any, b:any) => b.createdDate.localeCompare(a.createdDate));
    } else if (type === "oldest") {
      (this.filterDocumentList.length == 0
        ? this.documentList
        : this.filterDocumentList
      ).sort((a:any, b:any) => a.createdDate.localeCompare(b.createdDate));
    } else {
      this.filterDocumentList = [...this.documentList];
    }
  };
  searcOnDatehHandler = () => {
    if (this.fromDateSort.jsonValue < this.toDateSort.jsonValue) {
      var date = new Date(this.toDateSort.stringValue).setDate(
        this.toDateSort.stringValue.getDate() + 1
      );
      this.toDateSort.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc:any) =>
          doc.createdDate >= this.fromDateSort.jsonValue &&
          doc.createdDate <= this.toDateSort.jsonValue
      );
    } else {
      var date = new Date(this.fromDateSort.stringValue).setDate(
        this.fromDateSort.stringValue.getDate() + 1
      );
      this.fromDateSort.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc:any) =>
          doc.createdDate >= this.toDateSort.jsonValue &&
          doc.createdDate <= this.fromDateSort.jsonValue
      );
    }
  };
  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
  };
  // createModal = () => {
  //   if (this.userId != null) {
  //     let documentModal = this.dialogModal.open(LabDocumentModalComponent, {
  //       data: this.userId,
  //     });
  //     documentModal.afterClosed().subscribe((result: string) => {
  //       if (result == "save") {
  //         this.getLabDocuments();
  //       }
  //     });
  //   } else this.notifier.notify("error", "Please select user");
  // };

  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
    var data = {
      jsonValue: event.value ? new Date(event.value).toJSON() : null,
      stringValue: event.value,
    };
    if (type !== "to") {
      this.fromDateSort = data;
    } else {
      this.toDateSort = data;
    }
  };

  // getLabDocuments = () => {
  //   if (this.userId != null) {
  //     this.clientService
  //       .getLabDocuments(this.userId)
  //       .subscribe((response: any) => {
  //         if (response != null) {
  //           this.documentList =
  //             response.data != null && response.data.length > 0
  //               ? response.data
  //               : [];
  //           this.filterDocumentList =
  //             response.data != null && response.data.length > 0
  //               ? response.data
  //               : [];
  //         }
  //         console.log(response.data);
  //       });
  //   }
  // };
  getUserDocuments(appyId:any) {
    this.commonService.loadingStateSubject.next(true);
    this.waitingRoomService
      .getPateintApptDocuments(appyId)
      .subscribe((response: ResponseModel) => {
        this.commonService.loadingStateSubject.next(false);

        if (response.statusCode == 200) {
          this.documentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.filterDocumentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
        } else {
          this.documentList = response.data
          this.filterDocumentList = response.data
        }

      });
  }


  downoladUserDocument = (value: any) => {
    // this.clientService.getUserDocument(value.id).subscribe((response: any) => {
    //   console.log(response);
    //   this.clientService.downloadFile(response, response.type, value.url);
    // });
    let key = "userdoc";
    if (value.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.clientService
      .getDocumentForDownlod(value.id, key)
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

          this.clientService.downloadFile(
            newBlob,
            fileType,
            response.data.fileName
          );
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  };

  deleteUserDocument = (id: number) => {
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: any) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments(this.appointmentId);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  };
}
