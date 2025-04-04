import { CommonService } from "src/app/platform/modules/core/services";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { FilterModel, Metadata } from "../../../core/modals/common-model";
import { MatDialog } from "@angular/material/dialog";
import { ClientsService } from "../../clients/clients.service";
import { AddEditUserAwardComponent } from "./add-edit-user-award/add-edit-user-award.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-user-award",
  templateUrl: "./user-award.component.html",
  styleUrls: ["./user-award.component.css"],
})
export class UserAwardComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  staffId: string = "";
  submitted: boolean = false;
  awardList: any = [];
  metaData: Metadata;
  filterModel: FilterModel;

  staffAwardColumns: Array<any> = [
    {
      displayName: "award",
      key: "awardType",
      isSort: true,
      class: "",
    },
    {
      displayName: "description",
      key: "description",
      isSort: true,
      class: "",
    },
    {
      displayName: "award_date",
      key: "awardDate",
      isSort: true,
      class: "",
      type:"date"
    },
    {
      displayName: "documents",
      type: "img",
      key: "extenstion",
      class: "",
    },
    { displayName: "actions", key: "Actions", class: "" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    //{ displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
  ];

  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private clientService: ClientsService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.activatedRoute.queryParams.subscribe((param) => {
      this.staffId = param["id"];
    });

    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
  }

  ngOnInit() {
    this.getstaffAward();
  }
  checkProfilecomplete = () => {
    this.commonService.isProfileUpdated(parseInt(this.staffId));
    // this.commonService
    //   .getProfileUpdated(parseInt(this.staffId))
    //   .subscribe((res) => {
    //     this.commonService.setIsProfileComplete(res.data);
    //   });
  };

  getstaffAward = () => {
    const data = {
      staffId: this.staffId,
      pageNumber: this.filterModel.pageNumber,
      pageSize: this.filterModel.pageSize,
      sortColumn: this.filterModel.sortColumn,
      sortOrder: this.filterModel.sortOrder,
      searchText: this.filterModel.searchText,
    };
    this.userService.getUserAward(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.awardList = res.data;
        this.awardList.map((ele:any) => {
          ele.awardDate = format(ele.awardDate, "MM-dd-yyyy");
          if (ele.extenstion == ".png") {
            ele.extenstion = "../../../../../../assets/img/jpg.png";
          } else if (ele.extenstion == ".jpg" || ele.extenstion == ".jpeg") {
            ele.extenstion = "../../../../../../assets/img/jpg.png";
          } else if (ele.extenstion == ".txt") {
            ele.extenstion = "../../../../../../assets/img/txt.png";
          } else if (ele.extenstion == ".xls" || ele.extenstion == ".xlsx") {
            ele.extenstion = "../../../../../../assets/img/excel.png";
          } else if (ele.extenstion == ".ppt" || ele.extenstion == ".pptx") {
            ele.extenstion = "../../../../../../assets/img/ppt.png";
          } else if (ele.extenstion == ".doc" || ele.extenstion == ".docx") {
            ele.extenstion = "../../../../../../assets/img/doc.png";
          } else if (ele.extenstion == ".pdf") {
            ele.extenstion = "../../../../../../assets/img/pdf.png";
          }
        });
        this.metaData = res.meta;
      } else {
        this.awardList = [];
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };

  onPageOrSortChange = (actionObj:any) => {
    console.log(actionObj);
    this.filterModel.pageNumber = actionObj.pageNumber;
    this.filterModel.pageSize = actionObj.pageSize;
    this.filterModel.sortColumn = actionObj.sort;
    this.filterModel.sortOrder = actionObj.order;
    this.getstaffAward();
  };

  onTableActionClick = (e:any) => {
    console.log(e);
    if (e.action == "delete") {
      this.deleteSavedCard(e.data.id);
    }
    //  else if (e.action == "edit") {
    //   // this.addCard("edit", e.data);
    // }
    else if (e.action == "download") {
      this.downloadUserDocument(e);
    } else if (e.action == "view") {
      this.viewFile(e);
    } else {
      console.log(e);
    }
  };

  deleteSavedCard = (Id:any) => {
    this.userService.DeleteUserAward(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffAward();
        this.commonService.profileMatTabValChange('callGetProfileUpdateMethod');
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };

  downloadUserDocument(value:any) {
    // this.clientService
    //   .getUserDocument(value.data.documentId)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //     this.clientService.downloadFile(response, response.type, value.url);
    //   });
    
    this.clientService
      .getDocumentForDownlod(value.data.documentId)
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

        this.clientService.downloadFile( newBlob,
            fileType,
            response.data.fileName);
         }
         else {
         
          this.notifier.notify("error", response.message);
        }
      });
  }
  viewFile = (act: { data: { documentId: number; }; }) => {
    // this.clientService
    //   .getUserDocument(act.data.documentId)
    //   .subscribe((response: any) => {
    //     var newBlob = new Blob([response], { type: response.type });
    //     const nav = window.navigator as any;
    //     if (nav && nav.msSaveOrOpenBlob) {
    //       nav.msSaveOrOpenBlob(newBlob);
    //       return;
    //     }
    //     const data = window.URL.createObjectURL(newBlob);
    //     var link = document.createElement("a");
    //     document.body.appendChild(link);
    //     link.href = data;
    //     link.target = "_blank";
    //     link.click();

    //     setTimeout(function () {
    //       document.body.removeChild(link);
    //       window.URL.revokeObjectURL(data);
    //     }, 100);
    //   });

    this.clientService
      .getDocumentForDownlod(act.data.documentId)
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

  createModal = (type: any, qualificationData: any) => {
    let staffData = {
      type: type,
      staffId: this.staffId,
      qualificationData: qualificationData,
    };

    let documentModal;
    documentModal = this.dialogModal.open(AddEditUserAwardComponent, {
      data: staffData,
    });
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == "add") {
        this.getstaffAward();
        this.checkProfilecomplete();
        this.commonService.profileMatTabValChange('callGetProfileUpdateMethod');
      }
    });
  };
}
