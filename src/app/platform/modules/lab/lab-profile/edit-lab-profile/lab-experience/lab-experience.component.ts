import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from "src/app/platform/modules/core/services";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { FilterModel, Metadata } from "src/app/super-admin-portal/core/modals/common-model";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AddEditExperienceComponent } from './add-edit-experience/add-edit-experience.component';


@Component({
  selector: 'app-lab-experience',
  templateUrl: './lab-experience.component.html',
  styleUrls: ['./lab-experience.component.css']
})
export class LabExperienceComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  staffId: string = "";
  submitted: boolean = false;
  experienceList: any = [];
  metaData: Metadata;
  filterModel: FilterModel;

  staffExperienceColumns: Array<any> = [
    {
      displayName: "organization_name",
      key: "organizationName",
      isSort: true,
      class: "",
    },
    {
      displayName: "role_in_organization",
      key: "roleExperience",
      isSort: true,
      class: "",
    },
    {
      displayName: "start_date",
      key: "startDate",
      class: "",
      type:"date"
    },

    {
      displayName: "end_date",
      key: "endDate",
      type:"date",
      class: "",
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
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private clientService: ClientsService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    // this.activatedRoute.queryParams.subscribe((param) => {
    //   this.staffId = param["id"];
    // });
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
  }

  ngOnInit() {
    debugger
    this.activatedRoute.params.subscribe((params) => {
      this.staffId = params["id"];
    });
    console.log(this.staffId);
    this.getstaffExperience();
  }

  checkProfilecomplete = () => {
    this.commonService.isProfileUpdated(parseInt(this.staffId));
    // this.commonService
    //   .getProfileUpdated(parseInt(this.staffId))
    //   .subscribe((res) => {
    //     this.commonService.setIsProfileComplete(res.data);
    //   });
  };

  getstaffExperience = () => {
    const data = {
      staffId: this.staffId,
      pageNumber: this.filterModel.pageNumber,
      pageSize: this.filterModel.pageSize,
      sortColumn: this.filterModel.sortColumn,
      sortOrder: this.filterModel.sortOrder,
      searchText: this.filterModel.searchText,
    };
    this.userService.getUserExperience(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.experienceList = res.data;
        this.experienceList.map((ele:any) => {
          ele.startDate = format(ele.startDate, "MM-dd-yyyy");
          ele.endDate = format(ele.endDate, "MM-dd-yyyy");
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
        this.experienceList = [];
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
    this.getstaffExperience();
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
    this.userService.DeleteUserExperience(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffExperience();
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
  viewFile = (act:any) => {
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
        debugger
        this.notifier.notify("error", response.message);
      }
    });
  };

  createModal = (type:any, qualificationData:any) => {
    let staffData = {
      type: type,
      staffId: this.staffId,
      qualificationData: qualificationData,
    };

    let documentModal;
    documentModal = this.dialogModal.open(AddEditExperienceComponent, {
      data: staffData,
    });
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == "add") {
        this.getstaffExperience();
        this.checkProfilecomplete();
        this.commonService.profileMatTabValChange('callGetProfileUpdateMethod');
      }
    });
  };
}


