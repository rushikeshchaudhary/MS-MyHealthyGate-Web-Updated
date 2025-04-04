import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { timeStamp } from "console";
import { format } from "date-fns";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { CommonService } from "../../core/services";
import { LabService } from "../lab.service";
import { TranslateService } from "@ngx-translate/core";
import { FilterModel, Metadata } from "src/app/super-admin-portal/core/modals/common-model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { NotifierService } from "angular-notifier";




@Component({
  selector: "app-lab-profile",
  templateUrl: "./lab-profile.component.html",
  styleUrls: ["./lab-profile.component.css"],
})
export class LabProfileComponent implements OnInit {
  labInfo: any = [];
  labAddress: any = [];
  loginData: any;
  labId:any;
  profileTabsSuperadmin: any = ["Qualification","Work & Experience","Awards"];
  selectedIndex: number = 0;
  qualificationList: any = [];
  metaData: Metadata = new Metadata;
  filterModel: FilterModel = new FilterModel;
  staffAwardColumns: Array<any> = [
    {
      displayName: "awards",
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
    },
    {
      displayName: "documents",
      type: "img",
      key: "extenstion",
      class: "",
    },
    { displayName: "actions", key: "Actions", class: "" },
  ];
  awardActionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    //{ displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "delete", key: "delete", class: "fa fa-trash" },
  ];

  staffExpColumns: Array<any> = [
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
  expActionButtons: Array<any> = [
    { displayName: "download", key: "download", class: "fa fa-download" },
    { displayName: "view", key: "view", class: "fa fa-eye" },
    //{ displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "delete", key: "delete", class: "fa fa-trash" },
  ];

  staffQualificationColumns: Array<any> = [
    {
      displayName: "course",
      key: "course",
      isSort: true,
      class: "",
    },
    {
      displayName: "university",
      key: "university",
      isSort: true,
      class: "",
    },
    {
      displayName: "from_date",
      key: "startDate",
      class: "",
    },

    {
      displayName: "to_date",
      key: "endDate",
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
  quaActionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    //{ displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "delete", key: "delete", class: "fa fa-trash" },
  ];
  awardList: any;
  experienceList: any;
 
  


  constructor(
    private commonService: CommonService,
    private labService: LabService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private userService: UsersService,
    private clientService: ClientsService,
    private notifier: NotifierService,


  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    //
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.labId = +params["id"];
      console.log(this.labId,"lab")
    });
    
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        console.log(user);
        this.loginData = user.data;
        this.labId = user.data.id;
      }
    });

    this.getLabProfile();
    this.getstaffQualification();
    this.getstaffAward();
    this.getstaffExperience();
    
  }

  getLabProfile = () => {
    this.labService.GetLabById(this.labId).subscribe((res) => {
      this.labService.setLabDetails(res.data);
      this.labInfo = res.data.labInfo;
      this.labInfo = this.labInfo.map((x:any) => {
        x.dob = format(x.dob, 'MM/dd/yyyy');
        return x;
      });
      this.labInfo = this.labInfo.map((x:any) => {
        x.doj = format(x.doj, 'MM/dd/yyyy');
        return x;
      });

      this.labAddress = res.data.labAddressesModel;
    });
  };
  loadComponent(eventType: any): any {
    this.selectedIndex = eventType.index;
  }
  
  //need to implemet all this code as they previously were not implemented but they have been used in html
  //do for now just decleared it to solve errors  
  onTableActionClickExp(event:any){

  }

  onPageOrSortChangeAward(event:any){

  }

  onTableActionClickAward(event:any){

  }



  getstaffQualification = () => {
    ///debugger
    const data = {
      staffId:  this.labId,
      // pageNumber: this.filterModel.pageNumber,
      // pageSize: this.filterModel.pageSize,
      // sortColumn: this.filterModel.sortColumn,
      // sortOrder: this.filterModel.sortOrder,
      // searchText: this.filterModel.searchText,
    };
    ///
    this.userService.getUserQualification(data).subscribe((res) => {
      
//debugger
      if (res.statusCode == 200) {
        
        this.qualificationList = res.data;
        console.log(this.qualificationList);
        this.qualificationList.map((ele:any) => {
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
        this.qualificationList = [];
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };

  getstaffAward = () => {
    const data = {
      staffId: this.labId,
      // pageNumber: this.filterModel.pageNumber,
      // pageSize: this.filterModel.pageSize,
      // sortColumn: this.filterModel.sortColumn,
      // sortOrder: this.filterModel.sortOrder,
      // searchText: this.filterModel.searchText,
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

  getstaffExperience = () => {
    const data = {
      staffId: this.labId,
      // pageNumber: this.filterModel.pageNumber,
      // pageSize: this.filterModel.pageSize,
      // sortColumn: this.filterModel.sortColumn,
      // sortOrder: this.filterModel.sortOrder,
      // searchText: this.filterModel.searchText,
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
    this.getstaffQualification();
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
     // debugger
      this.viewFile(e);
    } else {
      console.log(e);
    }
  };

  deleteSavedCard = (Id:any) => {
    this.userService.DeleteUserQualification(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffQualification();
        this.commonService.profileMatTabValChange('callGetProfileUpdateMethod');
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };
  
  viewFile = (act:any) => {

        this.clientService
        .getDocumentForDownlod(act.data.documentId)
        .subscribe((response: any) => {
          console.log(response);
        ///  debugger;
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
            this.notifier.notify("error", response.message);
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

  goToEditProfile = () => {
    const UserRole = localStorage.getItem("UserRole");
    if (UserRole == "LAB") {
      this.router.navigate(["/web/lab/editprofile/" + this.labId]);
    } else {
      this.router.navigate(["/webadmin/lab/editprofile/" + this.labId]);
    }
  };
}
