import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { FilterModel, Metadata } from "../core/modals/common-model";

@Component({
  selector: "app-manage-documents",
  templateUrl: "./manage-documents.component.html",
  styleUrls: ["./manage-documents.component.css"],
})
export class ManageDocumentsComponent implements OnInit {
  // MatPaginator Inputs
  length = 100;
  pageSize = 20;
  pageNumber = 1;
  pageSizeOptions: number[] = [20, 50, 100];

  // MatPaginator Output
  pageEvent!: PageEvent;

  clientId: number=0;
  header: string = "Document Upload";
  //userId: number = 371;

  locationId: number = 1;
  todayDate = new Date();
  fromDate: Date | string | null = null;
  toDate: Date | string | null = null;
  documentList: any = [];
  locationUsers: any = [];
  uploadPermission: boolean = true;
  downloadPermission: boolean = true;
  deletePermission: boolean = true;
  subscription!: Subscription;
  maxDate: any;
  tab1Active: boolean = false;
  tab2Active: boolean = false;
  fromDateSort: any;
  toDateSort: any;
  searchBox: boolean = true;
  filtermasterDocumentTypes: any = [];
  filterString: any;
  metaData: Metadata;
  filterModel: FilterModel;
  filterDocumentList: any = [];
  selectedRole:any;

  displayColumns: Array<any> = [
    {
      displayName: "Document Title",
      key: "documentTitle",
      isSort: true,
      class: "",
    },
    {
      displayName: "Uploaded Date",
      key: "createdDate",
      isSort: true,
      class: "",
    },
    // {
    //   displayName: "Expration Date",
    //   key: "expiration",
    //   isSort: true,
    //   class: "",
    // },
    {
      displayName: "Uploaded By",
      key: "creatorName",
      isSort: true,
      class: "",
    },
    {
      displayName: "Uploader Role",
      key: "creatorRole",
      isSort: true,
      class: "",
    },
    {
      displayName: "Extension",
      type: "img",
      key: "extenstion",
      isSort: true,
      class: "",
    },
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
      width: "15%",
    },
  ];
  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
  ];
  userRoles: any = [
    // { RoleId: 152, RoleName: "Patient" },
    { RoleId: 156, RoleName: "Provider" },
    { RoleId: 325, RoleName: "Lab" },
    { RoleId: 326, RoleName: "Pharmacy" },
    { RoleId: 329, RoleName: "Radiology" },
  ];

  constructor(
    private dialogModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.metaData = new Metadata();
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.getUserDocuments();
    var today = new Date().toLocaleDateString();
    var dateArray = today.split("/");
    this.maxDate = new Date(
      parseInt(dateArray[2]),
      parseInt(dateArray[0]) - 1,
      parseInt(dateArray[1])
    );
  }

  searchDocument = (e: any) => {
    this.filterModel.searchText = e;
    this.getUserDocuments();
  };

  onTableActionClick(actionObj?: any) {
    console.log(actionObj);
    const id = actionObj.data && actionObj.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.getDoc(actionObj);
        break;
      case "VIEW":
        this.viewFile(actionObj);
        break;
      case "DELETE":
        this.deleteUserDocument(actionObj.data.id);
        break;
      default:
        break;
    }
  }

  viewFile = (act: { data: { key: string; id: number; }; }) => {

    /*
 this.clientService
      .getUserDocument(act.data.id)
      .subscribe((response: any) => {
        var newBlob = new Blob([response], { type: response.type });
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
      });
    */
      let key = "userdoc";
      if (act.data.key.toLowerCase() === "refferal") {
        key = "refferal";
      }
    this.clientService
      .getDocumentForDownlod(act.data.id,key)
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

  searcOnDatehHandler = () => {
    if (this.fromDateSort.jsonValue < this.toDateSort.jsonValue) {
      var date = new Date(this.toDateSort.stringValue).setDate(
        this.toDateSort.stringValue.getDate() + 1
      );
      this.toDateSort.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc: { createdDate: number; }) =>
          doc.createdDate >= this.fromDateSort.jsonValue &&
          doc.createdDate <= this.toDateSort.jsonValue
      );
    } else {
      var date = new Date(this.fromDateSort.stringValue).setDate(
        this.fromDateSort.stringValue.getDate() + 1
      );
      this.fromDateSort.jsonValue = new Date(date).toJSON();
      this.filterDocumentList = this.documentList.filter(
        (doc: { createdDate: number; }) =>
          doc.createdDate >= this.toDateSort.jsonValue &&
          doc.createdDate <= this.fromDateSort.jsonValue
      );
    }
  };

  creatorHandler = (item: { RoleId: any; }) => {
    this.selectedRole = item.RoleId;
    this.getUserDocuments();
  };

  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
    const dateValue = event.value;
    if (dateValue) {
      const data = {
        jsonValue: new Date(dateValue).toJSON(),
        stringValue: dateValue,
      };
      if (type !== "to") {
        this.fromDateSort = data;
      } else {
        this.toDateSort = data;
      }
    }
  };
  

  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
  };

  onPageOrSortChange(changeState?: any) {
    (this.filterModel.pageNumber = changeState.pageIndex + 1),
      (this.filterModel.pageSize = changeState.pageSize),
      (this.filterModel.sortColumn = changeState.sort),
      (this.filterModel.sortOrder = changeState.order),
      this.getUserDocuments();
  }

  getUserDocuments() {
    this.fromDate = this.fromDate ? format(new Date(this.fromDate), 'yyyy-MM-dd') : '1990-01-01';
    this.toDate = this.toDate ? format(new Date(this.toDate), 'yyyy-MM-dd') : format(this.todayDate, 'yyyy-MM-dd');

    let data = {
      roleId: this.selectedRole,
      fromDate: this.fromDate,
      toDate: this.toDate,
      pageNumber: this.filterModel.pageNumber,
      pageSize: this.filterModel.pageSize,
      sortColumn: this.filterModel.sortColumn,
      sortOrder: this.filterModel.sortOrder,
      searchText: this.filterModel.searchText,
    };
    this.clientService
      .getAllDocumentSuperAdmin(data)
      .subscribe((response: ResponseModel) => {
        console.log(response);
        if (response != null) {
          this.documentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.filterDocumentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];

          this.metaData = response.meta;

          this.metaData.pageSizeOptions = [5, 10, 20, 30, 50];

          this.documentList.map((element:any) => {
            element.documentTypeName =
              element.documentTypeNameStaff != null
                ? element.documentTypeNameStaff
                : element.documentTypeName != null
                ? element.documentTypeName
                : element.otherDocumentType;
            element.createdDate = format(element.createdDate, "yyyy-MM-dd");
            element.expiration
              ? (element.expiration = format(element.expiration, "yyyy-MM-dd"))
              : "";
          });
          this.filterDocumentList.map((element:any) => {
            element.documentTypeName =
              element.documentTypeNameStaff != null
                ? element.documentTypeNameStaff
                : element.documentTypeName != null
                ? element.documentTypeName
                : element.otherDocumentType;

            element.createdDate = format(element.createdDate, "dd-MM-yyyy");
            element.expiration
              ? (element.expiration = format(element.expiration, "dd-MM-yyyy"))
              : "";
          });
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
        }
      });
  }

  getDoc(event: { data: { key: string; id: number; }; }) {
    // console.log(event);
    // this.clientService.getUserDocument(event.id).subscribe((response: any) => {
    //   this.clientService.downloadFile(response, response.type, event.url);
    // });
    let key = "userdoc";
    if (event.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.clientService
      .getDocumentForDownlod(event.data.id,key)
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
              fileType = "null";
          }
          var binaryString = atob(response.data.base64);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          var newBlob = new Blob([bytes], {
            type: fileType,
          });

        this.clientService.downloadFile( newBlob,
            fileType,
            response.data.fileName);
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
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments();
              } else {
                this.notifier.notify('error',"unfortunately something went wrong")
              }
            });
        }
      });
  }
  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions(
      "CLIENT",
      "CLIENT_DOCUMENT_LIST"
    );
    const {
      CLIENT_DOCUMENT_LIST_UPLOAD,
      CLIENT_DOCUMENT_LIST_DOWNLOAD,
      CLIENT_DOCUMENT_LIST_DELETE,
    } = actionPermissions;

    this.uploadPermission = CLIENT_DOCUMENT_LIST_UPLOAD || false;
    this.downloadPermission = CLIENT_DOCUMENT_LIST_DOWNLOAD || false;
    this.deletePermission = CLIENT_DOCUMENT_LIST_DELETE || false;
  }
}
