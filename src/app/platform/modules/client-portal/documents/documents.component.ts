import { Subscription } from "rxjs";
import { DocumentModalComponent } from "./document-modal/document-modal.component";
import { Component, OnInit } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { TranslateService } from "@ngx-translate/core";
import { Metadata, UserDocumentReq } from "../client-profile.model";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  showLoader = false;
  clientId!: number;
  userId!: number;
  tab3Active: boolean = false;
  tab1Active: boolean = true;
  tab2Active: boolean = false;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  metaData: Metadata;
  documentList: any = [];
  locationUsers: any = [];
  uploadPermission: boolean = true;
  downloadPermission: boolean = true;
  deletePermission: boolean = true;
  subscription!: Subscription;
  maxDate: any;
  fromDateSort: any;
  toDateSort: any;
  searchBox: boolean = true;
  filtermasterDocumentTypes: any = [];
  filterString: any;
  filterDocumentList: any = [];
  userDocRequest: UserDocumentReq;

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

  constructor(
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userDocRequest = new UserDocumentReq();
    this.metaData = new Metadata();
  }
  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.userId = this.clientId = user.userID;
          var today = new Date().toLocaleDateString();

          var dateArray = today.split("/");
          // this.maxDate = new Date(
          //   parseInt(dateArray[2]),
          //   parseInt(dateArray[0]) - 1,
          //   parseInt(dateArray[1])
          // );
          (this.maxDate = new Date(Date.now())), // Maximal selectable date
            this.setIntialValues();
        }
      }
    );
  }

  setIntialValues() {
    var date = new Date();
    this.userDocRequest.userId = this.userId;
    this.userDocRequest.CreatedBy = "Patient";

    let startDate = new Date(date.getFullYear(), date.getMonth() - 10, 1);
    //let endDate = new Date().toLocaleDateString();
    let endDate = new Date(date.setDate(date.getDate() + 1));
    this.userDocRequest.fromDate = this.datePipe.transform(
      new Date(startDate),
      'MM/dd/yyyy'
    )|| '';
    this.userDocRequest.toDate = this.datePipe.transform(
      new Date(endDate),
      'MM/dd/yyyy'
    )|| '';

    this.getUserDocuments();
  }


  onUserChange=(user:any)=>{
    this.creatorHandler(user);

  }

  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
    const dateValue = event.value;

  // Check if dateValue is not null
  if (dateValue) {
    const formattedDate = this.datePipe.transform(dateValue, 'MM/dd/yyyy') || '';

    if (type === "to") {
      this.userDocRequest.toDate = formattedDate;
    } else {
      this.userDocRequest.fromDate = formattedDate;
    }
  } else {
    if (type === "to") {
      this.userDocRequest.toDate = ''; 
    } else {
      this.userDocRequest.fromDate = '';
    }
  }
};
  //   if (type == "to") {
  //     this.userDocRequest.toDate = this.datePipe.transform(
  //       new Date(event.value),
  //       'MM/dd/yyyy'
  //     )|| '';
  //   } else {
  //     this.userDocRequest.fromDate = this.datePipe.transform(
  //       new Date(event.value),
  //       'MM/dd/yyyy'
  //     )|| '';
  //   }
  // };
  searchBydate = () => {
    this.getUserDocuments();
  };
  searchHandlar = (e: string) => {
    this.userDocRequest.searchCriteria = e;
    this.getUserDocuments();
  };

  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
    this.setIntialValues();
  };

  createModal(type: string, documentData: any) {
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

  getUserDocuments() {
    this.showLoader = true;
    if (this.userId != null) {
      this.clientService
        .getFilterUserDocuments(this.userDocRequest)
        .subscribe((response: ResponseModel) => {
          if (response != null) {
            console.log(response);
            this.metaData = response.meta;
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            this.filterDocumentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];

            this.documentList.map((ele:any) => {
              ele.createdDate = format(ele.createdDate, "dd-MM-yyyy");
            });
            this.documentList.map(
              (element:any) =>
                (element.documentTypeName =
                  element.documentTypeNameStaff != null
                    ? element.documentTypeNameStaff
                    : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );

            this.filterDocumentList.map(
              (element:any) =>
                (element.documentTypeName =
                  element.documentTypeNameStaff != null
                    ? element.documentTypeNameStaff
                    : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );
            this.documentList.map((element:any) => {
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
            this.filterDocumentList.map((element:any) => {
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
          this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];

          console.log(response.data);
        });
    }
  }
  getUserDocument(value:any) {
    // this.clientService
    //   .getUserDocument(value.data.id)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //     this.clientService.downloadFile(response, response.type, value.url);
    //   });
    let key = "userdoc";
    if (value.data.key.toLowerCase() === "refferal") {
      key = "refferal";
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
            fileType = '';
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
   
  }
  deleteUserDocument(act: any) {
    let key = "userdoc";
    if (act.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(act.data.id,key)
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
  creatorHandler = (creator:any) => {
    this.userDocRequest.CreatedBy = creator;
    this.getUserDocuments();
  };
  onPageOrSortChange = (actObj:any) => {
    console.log(actObj);
    this.userDocRequest.pageNumber = actObj.pageNumber;
    this.userDocRequest.pageSize = actObj.pageSize;
    this.userDocRequest.sortOrder = actObj.order;
    this.userDocRequest.sortColumn = actObj.sort;
    this.getUserDocuments();
  };

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
  onTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.getUserDocument(actionObj);
        break;
      case "VIEW":
        this.viewFile(actionObj);
        break;
      case "DELETE":
        this.deleteUserDocument(actionObj);
        break;
      case "EDIT":
        this.createModal("edit", actionObj.data);
        break
      default:
        break;
    }
  }
  viewFile = (act:any) => {
    // window.open(act.data.url, '_blank')

   // this.clientService
      // .getUserDocument(act.data.id)
      // .subscribe((response: any) => {
      //   console.log(act);
      //   console.log(response);

      //   var newBlob = new Blob([response], { type: response.type });
      //   const nav = window.navigator as any;
      //   if (nav && nav.msSaveOrOpenBlob) {
      //     nav.msSaveOrOpenBlob(newBlob);
      //     return;
      //   }
      //   const data = window.URL.createObjectURL(newBlob);
      //   var link = document.createElement("a");
      //   document.body.appendChild(link);
      //   link.href = data;
      //   link.target = "_blank";
      //   link.click();

      //   setTimeout(function () {
      //     document.body.removeChild(link);
      //     window.URL.revokeObjectURL(data);
      //   }, 100);
      // });
      let key = "userdoc";
      if (act.data.key.toLowerCase() === "refferal") {
        key = "refferal";
      }
      this.clientService
      .getDocumentForDownlod(act.data.id, key)
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
  tabActiveTwo(eve:any) {
    this.tab1Active = false;
    this.tab2Active = false;
    this.tab3Active = false;
    if (eve == 1) {
      this.tab1Active = true;
    } else if (eve == 2) {
      this.tab2Active = true;
    } else if (eve == 3) {
      this.tab3Active = true;
    }
  }
}
