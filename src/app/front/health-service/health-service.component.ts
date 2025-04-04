import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";

import {
  FilterModel,
  LabSerachFilterModel,
  ResponseModel,
} from "src/app/platform/modules/core/modals/common-model";

import { HomeHeaderComponent } from "../home-header/home-header.component";
import { HomeService } from "../home/home.service";
import { CommonService } from "src/app/platform/modules/core/services";

import { ProviderProfileModalComponent } from "../provider-profile/provider-profile.component";

import { BookFreeAppointmentComponent } from "../book-freeappointment/book-freeappointment.component";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";


import { LabBookAppointmentModalComponent } from "../lab-booking-list/lab-book-appointment-modal/lab-book-appointment-modal.component";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-health-service",
  templateUrl: "./health-service.component.html",
  styleUrls: ["./health-service.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class HealthServiceComponent implements OnInit, AfterViewInit {
  showLoader: boolean = false;
  selectedLocation: any;
  clearing = false;
  currentLoginUserId:any;
  doctorWidgetClass: string = "col-sm-6 grid-profile";
  userId!: number;
  userRoleName!: string;
  isPatientLogin: boolean = false;
  userRole: any;
  sortby: any[] = [
    { value: 1, label: "Price Low" },
    { value: 2, label: "Price High" },
    { value: 3, label: "Rating" },
  ];
  location: any[] = [];
  staffId!: string;
  labList: any = [];
  radiologyList: any = [];
  physiotherapyList: any = [];
  filterLabModel: LabSerachFilterModel;
  healthService: any = [];
  searchModel:any;
  radiologyFilterModel: FilterModel;
  selectedRole:any = null;

  healthServiceCheck = [
    // { id: 1, service: "Laboratory", isChecked: true },
    // { id: 2, service: "Radiology", isChecked: true },
    // { id: 3, service: "Home Care", isChecked: true }
    // { id: 3, service: "PHYSIOTHERAPHY", isChecked: true },
    { id: 1, service: "Laboratory", isChecked: true, RoleId: 325 },
    { id: 2, service: "Radiology", isChecked: true, RoleId: 329 },
    // { id: 3, service: "Home Care", isChecked: true },
  ];
  checkedService: any = [];

  constructor(
    private commonService: CommonService,
    private homeService: HomeService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private translate:TranslateService,
    private userService: UsersService,
    private clientService: ClientsService,
  ) {
    this.filterLabModel = new LabSerachFilterModel();
    this.radiologyFilterModel = new FilterModel();
  
  }

  ngAfterViewInit(): void {
    this.checkPatientLogIn();
  }

  ngOnInit() {
    this.showLoader = true;
    window.scroll(0, 0);
    this.filterLabModel.pageSize = 10;
    //this.getLabList();
    //this.getRadiologyList();
    this.checkAndFetchData();
  }
  searchFiltter = (e:any) => {
    console.log(e);
    this.filterLabModel.searchText = e;
    this.getLabList();
    this.checkAndFetchData();
  };

  onSortChange = (event?:any) => {};
  locationChange = () => {};
  onReviewRatingChange = (event?:any) => {};
  clearFilter = () => {};
  addToFavouritePharmacy = () => {};

  checkPatientLogIn() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLoginUserId = user.id;
        this.userId = user.userID;
        this.userRole = user && user.users3 && user.users3.userRoles.userType;
        this.isPatientLogin = this.userRole === "CLIENT";
      }
    });
  }
  serviceCheckbox = (item: { id: number; }, event: { checked: boolean; }) => {
    // console.log(item);
    // console.log(this.healthServiceCheck.findIndex((obj=>obj.id==item.id)));
    const objIndex = this.healthServiceCheck.findIndex(
      (obj) => obj.id == item.id
    );
    this.healthServiceCheck[objIndex].isChecked = event.checked;

    // if (event.checked) {
    //   this.checkedService.push(item.service);
    // } else {
    //   let index = this.checkedService.indexOf(item.service);
    //   this.checkedService.splice(index, 1);
    //   if (item.service == "LAB") {
    //     this.labList = [];
    //     this.healthService = this.healthService.filter(
    //       (ele) => ele.hasOwnProperty("labId") == false
    //     );
    //     //this.healthService = data;
    //   }
    //   if (item.service == "RADIOLOGY") {
    //     this.radiologyList = [];
    //     this.healthService = this.healthService.filter(
    //       (ele) => ele.roleID != 329
    //     );
    //   }
    //   if (item.service == "PHYSIOTHERAPHY") {
    //     this.physiotherapyList = [];
    //   }
    // }
    this.checkAndFetchData();
  };

  // getHealthServiceData = () => {
  //   if (this.healthServiceCheck.every((obj) => obj.isChecked === true)) {
  //     this.filterLabModel.RoleId = null;
  //     this.getLabList();
  //   } else if (
  //     this.healthServiceCheck.every((obj) => obj.isChecked === false)
  //   ) {
  //     this.filterLabModel.RoleId = null;
  //     this.getLabList();
  //   } else {
  //     let checkedHomeSr = this.healthServiceCheck.filter(
  //       (ob) => ob.isChecked == true
  //     );
  //     this.filterLabModel.RoleId = checkedHomeSr[0].RoleId.toString();
  //     this.getLabList();
  //   }
  // };
  // getRadiologyList = () => {
  //   this.homeService
  //     .getRadiologyList(this.filterLabModel)
  //     .subscribe((res) => {
  //       console.log(res);
  //       if (res != null && res.statusCode == 200) {
  //         this.radiologyList = res.data;
  //         this.healthService = [
  //           ...this.labList,
  //           ...this.radiologyList,
  //           ...this.physiotherapyList,
  //         ];
  //       }
  //     });

  // };
  getPhysiotheraphyList = () => {
    this.physiotherapyList = ["physiotherapy"];
    this.healthService = [
      ...this.labList,
      ...this.radiologyList,
      ...this.physiotherapyList,
    ];
  };

  getLabList() {
    this.homeService
      .getLabList(this.filterLabModel)
      .subscribe((response: any) => {
        this.filterLabModel.LabId = "";
        if (response != null && response.statusCode == 200) {
          console.log(response);
          this.labList = response.data;
          this.healthService = [
            ...this.labList,
            ...this.healthService
          ];
        } else {
        }
      });
  }
  getRadiologyList() {
    let organizationId = 128;
    let roleId = 329;
    this.clientService.getAllLabList(organizationId,roleId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.radiologyList = response.data;
          this.healthService = [
            ...this.radiologyList,
            ...this.healthService
          ];
        }
      });
      console.log(this.radiologyList,"this.radiologyList")

  }

  checkAndFetchData() {
    console.log('Health Service Check:', this.healthServiceCheck);
    const labServiceChecked = this.healthServiceCheck.find(s => s.service === "Laboratory" && s.isChecked);
    const radiologyServiceChecked = this.healthServiceCheck.find(s => s.service === "Radiology" && s.isChecked);
    this.healthService = [];
    if (labServiceChecked && radiologyServiceChecked) {
      this.getLabList();
      this.getRadiologyList();
    } else if (labServiceChecked) {
      this.getLabList();
    } else if (radiologyServiceChecked) {
      this.getRadiologyList();
    }
    else{
      console.log("No data found.")}
  }

  bookAppointment(provider: any) {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        panelClass: "loginModalPanel",
        data: { selectedIndex: 1 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          this.headerComp.loading = false;
        } else if (response.access_token) {
          this.openDialogBookAppointment(provider);
        } else {
          this.headerComp.openDialogSecurityQuestion();
        }
      });
    } else {
      this.openDialogBookAppointment(provider);
    }
  }

  openDialogBookAppointment(provider: { staffId: any; labId: any; }) {
    let dbModal:any;
    if (provider.staffId) {
      dbModal = this.dialogModal.open(LabBookAppointmentModalComponent, {
        hasBackdrop: true,
        data: provider,
        width: "80%",
      });
    } else if (provider.labId) {
      dbModal = this.dialogModal.open(LabBookAppointmentModalComponent, {
        hasBackdrop: true,
        data: provider,
        width: "80%",
      });
    }

    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
      }
    });
  }

  redirectToProfilePage(provider: { labId: any; }) {
    let dbModal:any;
    if (provider.labId) {
      dbModal = this.dialogModal.open(ProviderProfileModalComponent, {
        hasBackdrop: true,
        data: { id: provider.labId },
        width: "80%",
        panelClass: "providerProfilePanel",
      });
    }

    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
      }
    });
  }

  bookFreeAppointment(staffId: number, providerId: string) {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 },
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          this.headerComp.loading = false;
        } else if (response.access_token) {
          location.reload();
        } else {
          this.headerComp.openDialogSecurityQuestion();
        }
      });
    } else {
      this.openDialogBookFreeAppointment(staffId, providerId);
    }
    //let staffId = this.commonService.encryptValue(id);
  }
  openDialogBookFreeAppointment(staffId: number, providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(BookFreeAppointmentComponent, {
      hasBackdrop: true,
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.selectedLocation || 0,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }

  // openCancellationRulesPopup(rules) {
  //   rules = rules ? rules : [];
  //   const dbModal = this.dialogModal.open(ProviderFeeSettingsComponent, {
  //     hasBackdrop: true,
  //     data: rules as CancelationRule[],
  //     width: "400px",
  //     maxWidth: "400px",
  //     minWidth: "40%",
  //   });
  // }

  // openSeeFees(provider) {
  //   let dbModal;
  //   if(provider.providerId){
  //     dbModal = this.dialogModal.open(ConsultationFeesComponent, {
  //       width: "60%",
  //       data: { id: provider.providerId },
  //     });
  //   }

  //   dbModal.afterClosed().subscribe((result: string) => {});
  // }
}
