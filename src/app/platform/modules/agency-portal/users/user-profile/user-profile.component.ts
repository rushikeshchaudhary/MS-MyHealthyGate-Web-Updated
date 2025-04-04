import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users.service";
import { ResponseModel } from "../../../../../super-admin-portal/core/modals/common-model";
import { StaffProfileModel } from "../users.model";
import { CommonService } from "../../../core/services";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { FilterModel, Metadata } from "../../../core/modals/common-model";
import { format } from "date-fns";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../clients/clients.service";
import { MatDialog } from "@angular/material/dialog";
import { ReviewModalComponent } from "./review-modal/review-modal.component";
import { HomeService } from "src/app/front/home/home.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  staffId!: number;
  userId!: number;
  roleName!: string;
  selectedIndex: number = 0;
  awardList:any=[]
  staffProfile: StaffProfileModel;
  subscription!: Subscription;
  isProvider: boolean = false;
  profileTabs: any = ["Documents", "Leaves", "Timesheet","Work & Experience","Qualification","Awards"];
  profileTabsSuperadmin: any = ["Work & Experience","Qualification","Awards"];
  
  experienceList: any = [];
  expMetaData: Metadata;
  quaMetaData: Metadata;
  awardMetaData:Metadata;
  expFilterModel: FilterModel;
  quaFiltermodel:FilterModel;
  awardFilterModel:FilterModel
  qualificationList: any = [];
  isSuperAdmin:boolean=false;
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


  constructor(
    private userService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private clientService: ClientsService,
    private dialog:MatDialog,
    private homeService:HomeService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.staffProfile = new StaffProfileModel();
    this.expMetaData = new Metadata();
    this.quaMetaData= new Metadata();
    this.awardMetaData=new Metadata();
    this.expFilterModel = new FilterModel();
    this.quaFiltermodel = new FilterModel();
    this.awardFilterModel=new FilterModel();    
  }

  ngOnInit() {
    debugger
    this.subscription = this.commonService.loginUserSubject.subscribe(
      (user: LoginUser) => {
        console.log('Login User',user);
        debugger
        if (user.data) {
          if (user.data.userRoles.roleName == "Provider" || user.data.userRoles.roleName == "Radiology") {
            this.isProvider = true;
            this.staffId = user.data.id;
            this.userId = user.data.userID;
            this.getStaffProfileData();
            this.getstaffExperience();
            this.getstaffQualification();
            this.getstaffAward();
            this.roleName=user.data.userRoles.roleName; 
          }
          else{

            this.route.queryParams.subscribe((params: Params) => {
              this.staffId = +params["staffId"];
              this.userId = +params["userId"];
              
              this.getStaffProfileData();

            });
          }            
        }    
        else{
          this.isSuperAdmin=true;
          console.log('isSuperAdmin:', this.isSuperAdmin); 
          console.log(this.profileTabsSuperadmin,"tabs");
          this.route.queryParams.subscribe((params: Params) => {
            this.staffId = +params["staffId"];
            this.userId = +params["userId"];
            this.getStaffProfileData();
            this.getstaffExperience();
            this.getstaffQualification();
            this.getstaffAward();
          });
        }     
      }
    );
  }
  openRatingsReviews(){
    let staffId=this.staffId.toString();
    let reviewRatingList;
    this.homeService
        .getRatingReviewsInProfile(staffId, true, 1, 5)
        .subscribe((res) => {
          console.log(res,"res");
          if (res.statusCode == 200) {
            reviewRatingList = res.data;
           this.openReviewsModal(reviewRatingList);
            //this.reviewRatingMeta = res.meta;
          }
        });
       // this.openReviewsModal(reviewRatingList);
  }
  openReviewsModal(reviewRatingList:any){
    this.dialog.open(ReviewModalComponent,{
      hasBackdrop: true,
      data:reviewRatingList,
      width:'100'
    });
  }
  loadComponent(eventType: any): any {
    this.selectedIndex = eventType.index;
  }

  ViewAppointments(){

    debugger
    this.router.navigate(["/webadmin/view-Appointment"], {
      queryParams: { staffId: this.staffId,userid:this.userId}
    });
  }




  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          this.staffProfile = response.data;
        }
        else{
          this.getStaffProfileData();
        }
      });
  }
  editProfile() {
    if (this.isProvider == true || this.roleName=="Radiology") {
      this.router.navigate(["/web/manage-users/user"], {
        queryParams: {
          id: this.commonService.encryptValue(this.staffId, true),
        },
      });
    } else {
      this.router.navigate(["/webadmin/manage-users/user"], {
        queryParams: {
          id: this.commonService.encryptValue(this.staffId, true),
        },
      });
    }
  }
  getstaffAward = () => {
    const data = {
      staffId: this.staffId,
      pageNumber: this.awardFilterModel.pageNumber,
      pageSize: this.awardFilterModel.pageSize,
      sortColumn: this.awardFilterModel.sortColumn,
      sortOrder: this.awardFilterModel.sortOrder,
      searchText: this.awardFilterModel.searchText,
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
        this.awardMetaData = res.meta;
      } else {
        this.awardList = [];
      }
      this.awardMetaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };
  getstaffQualification = () => {
    const data = {
      staffId: this.staffId,
      pageNumber: this.quaFiltermodel.pageNumber,
      pageSize: this.quaFiltermodel.pageSize,
      sortColumn: this.quaFiltermodel.sortColumn,
      sortOrder: this.quaFiltermodel.sortOrder,
      searchText: this.quaFiltermodel.searchText,
    };
    this.userService.getUserQualification(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.qualificationList = res.data;
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
        this.quaMetaData = res.meta;
      } else {
        this.qualificationList = [];
      }
      this.quaMetaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  }
  getstaffExperience = () => {
    debugger
    const data = {
      staffId: this.staffId,
      pageNumber: this.expFilterModel.pageNumber,
      pageSize: this.expFilterModel.pageSize,
      sortColumn: this.expFilterModel.sortColumn,
      sortOrder: this.expFilterModel.sortOrder,
      searchText: this.expFilterModel.searchText,
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
        this.expMetaData = res.meta;
      } else {
        this.experienceList = [];
      }
      this.expMetaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };
  onPageOrSortChangeAward = (actionObj:any) => {
    console.log(actionObj);
    this.awardFilterModel.pageNumber = actionObj.pageNumber;
    this.awardFilterModel.pageSize = actionObj.pageSize;
    this.awardFilterModel.sortColumn = actionObj.sort;
    this.awardFilterModel.sortOrder = actionObj.order;
    this.getstaffAward();
  };

  onTableActionClickAward = (e:any) => {
    console.log(e);
    if (e.action == "delete") {
      this.deleteAward(e.data.id);
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

  deleteAward = (Id:any) => {
    this.userService.DeleteUserAward(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffAward();
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };
  onPageOrSortChangeQua = (actionObj:any) => {
    console.log(actionObj);
    this.quaFiltermodel.pageNumber = actionObj.pageNumber;
    this.quaFiltermodel.pageSize = actionObj.pageSize;
    this.quaFiltermodel.sortColumn = actionObj.sort;
    this.quaFiltermodel.sortOrder = actionObj.order;
    this.getstaffQualification();
  };
  onTableActionClickQua = (e:any) => {
    console.log(e);
    if (e.action == "delete") {
      this.deleteQualification(e.data.id);
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
  deleteQualification = (Id:any) => {
    this.userService.DeleteUserQualification(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffQualification();
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  };


  onTableActionClickExp = (e:any) => {
    console.log(e);
    if (e.action == "delete") {
      this.deleteExperience(e.data.id);
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

  deleteExperience = (Id:any) => {
    this.userService.DeleteUserExperience(Id).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getstaffExperience();
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

  onPageOrSortChangeExp = (actionObj:any) => {
    console.log(actionObj);
    this.expFilterModel.pageNumber = actionObj.pageNumber;
    this.expFilterModel.pageSize = actionObj.pageSize;
    this.expFilterModel.sortColumn = actionObj.sort;
    this.expFilterModel.sortOrder = actionObj.order;
    this.getstaffExperience();
  };
}
