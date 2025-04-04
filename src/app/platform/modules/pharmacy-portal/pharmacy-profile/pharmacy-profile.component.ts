import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { format } from "date-fns";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { CommonService } from "../../core/services/common.service";
import { PharmacyService } from "../pharmacy.service";
import { TranslateService } from "@ngx-translate/core";
import { FilterModel, Metadata } from "src/app/super-admin-portal/core/modals/common-model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-pharmacy-profile",
  templateUrl: "./pharmacy-profile.component.html",
  styleUrls: ["./pharmacy-profile.component.css"],
})
export class PharmacyProfileComponent implements OnInit {
  loginData: any;
  PharmacyInfo: Array<any> = [];
  PharmacyAddress: Array<any> = [];
  pharmacyId:any
  pharmacyIdAdmin:any;
  profileTabsSuperadmin: any =  ["Qualification","Work & Experience","Awards"];
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
  experienceList: any;
  awardList!: any[];
  constructor(
    private pharmacyService: PharmacyService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate:TranslateService,
    private userService: UsersService,
    private clientService: ClientsService,
    private notifier: NotifierService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.pharmacyId = +params["id"];
    });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.loginData = user.data;
        this.pharmacyId = user.data.id;
      }
    });

    this.getPharmacyProfile();
    this.getstaffQualification();
    this.getstaffAward();
    this.getstaffExperience();
  }
  loadComponent(eventType: any): any {
    this.selectedIndex = eventType.index;
  }
  getstaffQualification = () => {
  ///  debugger
    const data = {
      staffId:  this.pharmacyId,
      // pageNumber: this.filterModel.pageNumber,
      // pageSize: this.filterModel.pageSize,
      // sortColumn: this.filterModel.sortColumn,
      // sortOrder: this.filterModel.sortOrder,
      // searchText: this.filterModel.searchText,
    };
  ///  debugger
    this.userService.getUserQualification(data).subscribe((res) => {
      
     // debugger
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


  //need to implemet all this code as they previously were not implemented but they have been used in html
  //do for now just decleared it to solve errors  
  onTableActionClickAward(event:any){

  }

  onTableActionClickExp(event:any){

  }

  onPageOrSortChangeExp(event:any){

  }

  onPageOrSortChangeAward(event:any){

  }


  getstaffAward = () => {
    const data = {
      staffId: this.pharmacyId,
      // pageNumber: this.filterModel.pageNumber,
      // pageSize: this.filterModel.pageSize,
      // sortColumn: this.filterModel.sortColumn,
      // sortOrder: this.filterModel.sortOrder,
      // searchText: this.filterModel.searchText,
    };
    this.userService.getUserAward(data).subscribe((res) => {
      if (res.statusCode == 200) {
        this.awardList = res.data;
        this.awardList.map((ele) => {
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
      staffId: this.pharmacyId,
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
          var fileType:any = "";
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
              fileType = null;
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
        var fileType:any = "";
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
            fileType = null;
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

  onPageOrSortChange = (actionObj:any) => {
    console.log(actionObj);
    this.filterModel.pageNumber = actionObj.pageNumber;
    this.filterModel.pageSize = actionObj.pageSize;
    this.filterModel.sortColumn = actionObj.sort;
    this.filterModel.sortOrder = actionObj.order;
    this.getstaffQualification();
  };
  getPharmacyProfile = () => {
    this.pharmacyService.GetPharmacyById(this.pharmacyId).subscribe((res) => {
      this.PharmacyInfo = res.data.pharmacyInfo;
      this.pharmacyIdAdmin=res.data.pharmacyInfo[0].pharmacyId
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.dob = format(x.dob, 'MM/dd/yyyy');
        return x;
      });
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.registerDate = format(x.registerDate, 'MM/dd/yyyy');
        return x;
      });

      this.PharmacyAddress = res.data.pharmacyAddressInfo;
    });
  };

  goToEditProfile = () => {
    const UserRole = localStorage.getItem("UserRole");
    if (UserRole == "PHARMACY") {
      this.router.navigate(["/web/pharmacy/editprofile/" + this.pharmacyId]);
    } else {
      this.router.navigate(["/webadmin/pharmacy/editprofile/" + this.PharmacyInfo[0].pharmacyId]);
    }
  
  };
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
  
}
