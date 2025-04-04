import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../core/services";
import { ResponseModel } from "../../../core/modals/common-model";
import { ClientsService } from "../clients.service";
import { UserDocumentModel } from "../client.model";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { AddDocumentComponent } from "./add-document/add-document.component";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import {
  Metadata,
  UserDocumentReq,
} from "../../../client-portal/client-profile.model";
import { DatePipe } from "@angular/common";
import { DocumentModalComponent } from "../../../client-portal/documents/document-modal/document-modal.component";
import { ClientHeaderModel } from "../client-header.model";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentsComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @Input() encryptedPatientUserId:any;
  @Input() appointmentId: number = 0;
  clientId!: number;
  header: string = "Document Upload";
  userId!: number;
  locationId: number = 1;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  // documentList: Array<UserDocumentModel> = [];
  documentCategoryList!: any[];
  selectedCategory: any;
  categoryTypeId: number|null=null;
  documentList: any = [];
  locationUsers: any = [];
  uploadPermission!: boolean;
  downloadPermission!: boolean;
  deletePermission!: boolean;
  isHistoryShareable: boolean = true;
  maxDate: any;
  searchBox: boolean = true;
  filtermasterDocumentTypes: any = [];
  filterString: any;
  filterDocumentList: any = [];
  fromD: any;
  toD: any;
  metaData: Metadata;
  userDocRequest: UserDocumentReq;
  showLoader = false;

  displayColumns: Array<any> = [
    {
      displayName: "document_name",
      key: "documentTitle",
      isSort: true,
      class: "",
    },
    {
      displayName: "category",
      key: "documentTypeName",
      isSort: true,
      class: "",
    },
    {
      displayName: "uploaded_date",
      key: "createdDate",
      isSort: true,
      class: "",
      type: 'date'
    },

    {
      displayName: "uploaded_by",
      key: "creatorName",
      class: "",
    },
    {
      displayName: "extension",
      type: "img",
      key: "extenstion",
      class: "",
    },
    {
      displayName: "actions",
      key: "Actions",
      class: "",
    },
  ];

  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];
  clientHeaderModel!: ClientHeaderModel;

  constructor(
    private dialogModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private schedular: SchedulerService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userDocRequest = new UserDocumentReq();
    this.metaData = new Metadata();
  }
  ngOnInit() {
    if (this.appointmentId != 0) {
      this.commonService._isHistoryShareable.subscribe((isHistoryShareable) => {
        console.log("get", isHistoryShareable)
        this.isHistoryShareable = isHistoryShareable;
      });
    }

    console.log(this.isHistoryShareable, "this.isHistoryShareable");
    this.commonService.loadingStateSubject.next(true);
    console.log("document appointment id", this.appointmentId);
    if (this.encryptedPatientUserId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
        this.userId =
          params["uid"] == undefined
            ? null
            : this.commonService.encryptValue(params["uid"], false);
      });
    } else {
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
      this.userId = this.commonService.encryptValue(
        this.encryptedPatientUserId,
        false
      );

      // this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      //   this.clientId = user.id;
      // });
    }

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.clientId =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);
    //   this.userId =
    //     params.uid == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.uid, false);
    // });
    // this.getUserPermissions();
    // this.getAppointmentDetails();
    this.commonService.loadingStateSubject.next(false);

    var today = new Date().toLocaleDateString();
    var dateArray = today.split("/");
    this.maxDate = new Date(
      parseInt(dateArray[2]),
      parseInt(dateArray[0]) - 1,
      parseInt(dateArray[1])
    );
    this.getMasterData();
    this.getClientUserDetails();

  }
  getClientUserDetails() {
    this.clientService
      .getClientProfileInfo(Number(this.clientId))
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.userId = response.data.patientInfo[0].userID;
          debugger
          if (this.appointmentId == 0) {
            this.isHistoryShareable =
              response.data.patientInfo[0].isHistoryShareable;
          }


          if (this.isHistoryShareable) {
            this.setIntialValues();
          }

        }
      });
  }

  onCategorySelectionChange(event: any) {
    this.categoryTypeId = event.value;
    this.selectedCategory = event.value;
    console.log(this.categoryTypeId);
    this.userDocRequest.pageNumber = 1;
    this.setIntialValues();
  }
  getMasterData() {
    this.clientService
      .getMasterData("MASTERDOCUMENTTYPESSTAFF")
      .subscribe((response: any) => {
        if (response != null)
          this.documentCategoryList = response.masterDocumentTypesStaff =
            response.masterDocumentTypesStaff != null
              ? response.masterDocumentTypesStaff
              : [];
      });
  }
  setIntialValues() {
    var date = new Date();
    this.userDocRequest.userId = this.userId;
    this.userDocRequest.CreatedBy = "Patient";
    this.userDocRequest.documentType = this.categoryTypeId != null ? this.categoryTypeId : undefined;
    // let startDate = new Date(date.getFullYear(), date.getMonth() - 10, 1);
    // //let endDate = new Date().toLocaleDateString();
    // let endDate = new Date(date.setDate(date.getDate() + 1));
    // this.userDocRequest.fromDate = this.datePipe.transform(
    //   new Date(startDate),
    //   'MM/dd/yyyy'
    // );
    // this.userDocRequest.toDate = this.datePipe.transform(
    //   new Date(endDate),
    //   'MM/dd/yyyy'
    // );

    this.getUserDocuments();
  }

  // getAppointmentDetails() {
  //   this.clientService
  //     .getClientProfileInfo(this.clientId)
  //     .subscribe((responce) => {
  //       console.log(responce);
  //       this.userId = responce.data.patientInfo[0].userID;
  //       this.isHistoryShareable =
  //         responce.data.patientInfo[0].isHistoryShareable;
  //       this.getUserDocuments();
  //     });
  // }

  searchDocument = (e: any) => {

    this.userDocRequest.searchCriteria = e;
    this.getUserDocuments();

  };
  onSelFunc(data: { documentTitle: any; filterDocumentList: string; }) {
    this.filterString = data.documentTitle;
    this.filterDocumentList = this.filterDocumentList.filter(
      (doc: { filterDocumentList: string; }) =>
        doc.filterDocumentList.toLowerCase() == data.filterDocumentList.toLowerCase()
    );
  }
  searcOnDatehHandler = () => {
    this.getUserDocuments();
  };
  // sortHandler = (type: string) => {
  //   if (type === "atoz") {
  //     (this.filterDocumentList.length == 0
  //       ? this.documentList
  //       : this.filterDocumentList
  //     ).sort((a, b) => a.documentTitle.localeCompare(b.documentTitle));
  //   } else if (type === "ztoa") {
  //     (this.filterDocumentList.length == 0
  //       ? this.documentList
  //       : this.filterDocumentList
  //     ).sort((a, b) => b.documentTitle.localeCompare(a.documentTitle));
  //   } else if (type === "latest") {
  //     (this.filterDocumentList.length == 0
  //       ? this.documentList
  //       : this.filterDocumentList
  //     ).sort((a, b) => b.createdDate.localeCompare(a.createdDate));
  //   } else if (type === "oldest") {
  //     (this.filterDocumentList.length == 0
  //       ? this.documentList
  //       : this.filterDocumentList
  //     ).sort((a, b) => a.createdDate.localeCompare(b.createdDate));
  //   } else {
  //     this.filterDocumentList = [...this.documentList];
  //   }
  // };
  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
    if (type == "to") {
      this.userDocRequest.toDate = this.datePipe.transform(
        (event.value ? new Date (event.value) : null),'MM/dd/yyyy'
      ) || '';
      console.log();
    } else {
      this.userDocRequest.fromDate = this.datePipe.transform(
        (event.value ? new Date (event.value) : null),'MM/dd/yyyy'
      ) || '';
    }
  };
  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
  };

  // getUserDocuments() {
  //   if (this.userId != null) {
  //     this.fromDate =
  //       this.fromDate == null
  //         ? "1990-01-01"
  //         : format(this.fromDate, "yyyy-MM-dd");
  //     this.toDate =
  //       this.toDate == null
  //         ? format(this.todayDate, "yyyy-MM-dd")
  //         : format(this.toDate, "yyyy-MM-dd");
  //     this.clientService
  //       .getUserDocuments(this.userId, this.fromDate, this.toDate)
  //       .subscribe((response: ResponseModel) => {
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
  //       });
  //   }
  // }

  getUserDocuments() {
    this.showLoader = true;
    if (this.userId != null) {
      if (this.categoryTypeId != null) {

        this.userDocRequest.FirstCall = false;
      }
      else {
        this.userDocRequest.FirstCall = true;
        this.userDocRequest.documentType = 0;
      }
      this.clientService
        .getFilterUserDocuments(this.userDocRequest)
        .subscribe((response: ResponseModel) => {
          if (response != null) {
            console.log(response);
            this.metaData = response.meta;
            this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            this.filterDocumentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];

            this.documentList.forEach((element: { createdDate: any; }, i: number) => {
              this.documentList[i].filteredDate = element.createdDate;
            });

            // this.documentList.map((ele) => {
            //   ele.createdDate = format(ele.createdDate, "dd-MM-yyyy");
            // });

            this.documentList.map(
              (element: { documentTypeName: null; documentTypeNameStaff: null; otherDocumentType: any; }) =>
              (element.documentTypeName =
                element.documentTypeNameStaff != null
                  ? element.documentTypeNameStaff
                  : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );

            this.filterDocumentList.map(
              (element: { documentTypeName: null; documentTypeNameStaff: null; otherDocumentType: any; }) =>
              (element.documentTypeName =
                element.documentTypeNameStaff != null
                  ? element.documentTypeNameStaff
                  : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );
            this.documentList.map((element: { extenstion: string; }) => {
              if (element.extenstion == ".png") {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (
                element.extenstion == ".jpg" ||
                element.extenstion == ".jpeg"
              ) {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (element.extenstion == ".txt") {
                element.extenstion = "../../../../../../assets/img/txt.png";
              } else if (
                element.extenstion == ".xls" ||
                element.extenstion == ".xlsx"
              ) {
                element.extenstion = "../../../../../../assets/img/excel.png";
              } else if (
                element.extenstion == ".ppt" ||
                element.extenstion == ".pptx"
              ) {
                element.extenstion = "../../../../../../assets/img/ppt.png";
              } else if (
                element.extenstion == ".doc" ||
                element.extenstion == ".docx"
              ) {
                element.extenstion = "../../../../../../assets/img/doc.png";
              } else if (element.extenstion == ".pdf") {
                element.extenstion = "../../../../../../assets/img/pdf.png";
              }
            });
            this.filterDocumentList.map((element: { extenstion: string; }) => {
              if (element.extenstion == ".png") {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (
                element.extenstion == ".jpg" ||
                element.extenstion == ".jpeg"
              ) {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (element.extenstion == ".txt") {
                element.extenstion = "../../../../../../assets/img/txt.png";
              } else if (
                element.extenstion == ".xls" ||
                element.extenstion == ".xlsx"
              ) {
                element.extenstion = "../../../../../../assets/img/excel.png";
              } else if (
                element.extenstion == ".ppt" ||
                element.extenstion == ".pptx"
              ) {
                element.extenstion = "../../../../../../assets/img/ppt.png";
              } else if (
                element.extenstion == ".doc" ||
                element.extenstion == ".docx"
              ) {
                element.extenstion = "../../../../../../assets/img/doc.png";
              } else if (element.extenstion == ".pdf") {
                element.extenstion = "../../../../../../assets/img/pdf.png";
              }
            });
            this.showLoader = false;
          } else {
            this.documentList = [];
            this.filterDocumentList = [];
            this.metaData = new Metadata();
            this.showLoader = false;
          }


          console.log(response.data);
        });
    }
  }

  downloadUserDocument(value: UserDocumentModel) {
    let key;
    if (value.key.toLowerCase() === 'refferal') {
      key = "refferal";
    }
    else {
      key = "userdoc";
    }

    // this.clientService.getUserDocument(value.id, key).subscribe((response: any) => {
    //   this.clientService.downloadFile(response, response.type, value.url);
    // });
    this.clientService
      .getDocumentForDownlod(value.id, key)
      .subscribe((response: any) => {
        console.log(response);
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

          this.clientService.downloadFile(newBlob,
            fileType,
            response.data.fileName);
        }
        else {

          this.notifier.notify("error", response.message);
        }
      });

  }

  deleteUserDocument(data: any) {
    let key:any;
    if (data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    else {
      key = "userdoc";
    }
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(data.id, key)
            .subscribe((response: ResponseModel) => {
              if (response.statusCode == 200) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments();
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  // getUserPermissions() {
  //   const actionPermissions = this.clientService.getUserScreenActionPermissions(
  //     "CLIENT",
  //     "CLIENT_DOCUMENT_LIST"
  //   );
  //   const {
  //     CLIENT_DOCUMENT_LIST_UPLOAD,
  //     CLIENT_DOCUMENT_LIST_DOWNLOAD,
  //     CLIENT_DOCUMENT_LIST_DELETE,
  //   } = actionPermissions;

  //   this.uploadPermission = CLIENT_DOCUMENT_LIST_UPLOAD || false;
  //   this.downloadPermission = CLIENT_DOCUMENT_LIST_DOWNLOAD || false;
  //   this.deletePermission = CLIENT_DOCUMENT_LIST_DELETE || false;
  // }

  // createModal() {
  //   if (this.userId != null) {
  //     let documentModal;
  //     documentModal = this.dialogModal.open(AddDocumentComponent, {
  //       data: this.userId,
  //     });
  //     documentModal.afterClosed().subscribe((result: string) => {
  //       if (result == "save") this.getUserDocuments();
  //     });
  //   } else this.notifier.notify("error", "Please select user");
  // }

  createModal(type: string, documentData: { key: string; } | null) {
    if (documentData && documentData.key && documentData.key.toLowerCase() === "refferal") {
      this.notifier.notify("warning", "Can't update this document");
    }
    else
      if (this.userId != null) {
        let allData = {
          id: this.userId,
          type: type,
          documentData: documentData,
        };
        let documentModal;

        documentModal = this.dialogModal.open(DocumentModalComponent, {
          data: allData,
        });
        documentModal.afterClosed().subscribe((result: string) => {
          if (result == "save") this.getUserDocuments();
        });
      } else this.notifier.notify("error", "Please select user");
  }

  onPageOrSortChange = (actObj: { pageIndex: number; pageSize: number; order: string; sort: string; }) => {
    console.log(actObj);
    this.userDocRequest.pageNumber = actObj.pageIndex + 1;
    this.userDocRequest.pageSize = actObj.pageSize;
    this.userDocRequest.sortOrder = actObj.order;
    this.userDocRequest.sortColumn = actObj.sort;
    this.getUserDocuments();
  };

  onTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.getUserDocument(actionObj);
        break;
      case "VIEW":
        this.viewFile(actionObj);
        break;
      case "DELETE":
        this.deleteUserDocument(actionObj.data);
        break;
      case "EDIT":
        this.createModal("edit", actionObj.data);
        console.log(actionObj);
        break;
      default:
        break;
    }
  }

  viewFile = (act: { data: { key: string; id: number; }; }) => {
    // window.open(act.data.url, '_blank')
    console.log("view", act);
    let key;
    if (act.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    else {
      key = "userdoc";
    }
    this.clientService
      .getDocumentForDownlod(act.data.id, key)
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

          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  };

  getUserDocument(value: { data: { key: string; id: number; }; }) {
    let key;
    if (value.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    else {
      key = "userdoc";
    }
    this.clientService
      .getDocumentForDownlod(value.data.id, key)
      .subscribe((response: any) => {
        console.log(response);
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

          this.clientService.downloadFile(newBlob,
            fileType,
            response.data.fileName);
        }
        else {

          this.notifier.notify("error", response.message);
        }
      });
  }

  clearFilters(): void {

    this.filterString = null;
    this.categoryTypeId = null;
    this.userDocRequest.pageNumber = 1;
    this.userDocRequest.pageSize = 5;
    this.selectedCategory = null;
    this.userDocRequest.toDate = "";
    this.userDocRequest.fromDate = "";
    this.userDocRequest.documentType = 0;
    this.userDocRequest.FirstCall = true;
    this.userDocRequest.searchCriteria = "";
    this.userDocRequest.userId = this.userId;
    this.userDocRequest.CreatedBy = "Patient";
    this.userDocRequest.documentType = this.categoryTypeId != null ? this.categoryTypeId : 0;
    this.getUserDocuments();

  }
}
