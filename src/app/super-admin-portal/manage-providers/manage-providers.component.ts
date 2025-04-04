import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { LocationModalComponent } from "src/app/platform/modules/agency-portal/masters/location-master/location-master-modal/location-master-modal.component";
import { Metadata } from "src/app/platform/modules/core/modals/common-model";
import { FilterModel, ResponseModel } from "../core/modals/common-model";
import { ManageLocationService } from "../manage-locations/manage-location.service";
import { ManageProvidersService } from "./manage-providers.service";
import { ProviderModel } from "./provider-model.model";
import { AddPatientModalComponent } from "../manage-patients/add-patient-modal/add-patient-modal.component";
import { Router } from "@angular/router";
import { ManageActionComponent } from "../manage-action/manage-action.component";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { FormControl } from "@angular/forms";
import { debounce, debounceTime, distinctUntilChanged, filter, switchMap } from "rxjs/operators";
import { Observable, of, timer } from "rxjs";
@Component({
  selector: "app-manage-providers",
  templateUrl: "./manage-providers.component.html",
  styleUrls: ["./manage-providers.component.css"],
})
export class ManageProvidersComponent implements OnInit {
  filterModel!: FilterModel;
  //allProviders: ProviderModel[];
  allProviders!: LocationModalComponent[];
  metaData!: Metadata
  searchText: string = "";
  addProviderDialogRef!: MatDialogRef<AddPatientModalComponent>;
  displayColumns: Array<any> = [
    {
      displayName: "Name",
      key: "firstName",
      isSort: true,
      class: "",
      width: "20%",
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
      class: "",
      width: "20%",
    },
    {
      displayName: "Phone",
      key: "phoneNumber",
      isSort: true,
      class: "",
      width: "10%",
    },
    {
      displayName:"Joining Date",
      key:"doj",
      type:"date",
      isSort: true,
      class: "",
      width: "10%",
    },
    {
      displayName: "Status",
      key: "status",
      isSort: true,
      class: "",
      width: "10%",
    },
    //{ displayName: "About", key: "aboutMe", isSort: true, class: "", width: "30%" },
    {
      displayName: "Actions",
      key: "Actions",
      isSort: false,
      class: "",
      width: "20%",
    },
  ];
  actionButtons: Array<any> = [
    // { displayName: "Accept", key: "accept", class: "fa fa-check" },
    // { displayName: "Reject", key: "reject", class: "fa fa-ban" },
    { displayName: "View", key: "View", class: "fa fa-eye" },
    {
      displayName: "Accept/Reject",
      key: "isApprove",
      type: "toggle",
      class: "",
    },
    { displayName: "Block", key: "action", class: "fa fa-flickr" },
  ];
  profileStatus: any = ["All", "Blocked", "Approved", "Pending","InActive"];
  isApprove: boolean | null = null;
  isBlock:boolean | null = null;
  isActive:boolean | null = null;
  selected:any;
  searchControl = new FormControl('');
  constructor(
    private providerService: ManageProvidersService,
    private locationService: ManageLocationService,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
    private dialog: MatDialog,
    private router: Router,
    private commonService:CommonService
  ) {}

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.searchControl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounce(input => input!.length <= 3 ? timer(3000):timer(0)),
      switchMap(searchTerm => this.searchapi(searchTerm))
    )
    .subscribe();
    this.getAllProviders();
  }


  searchapi(value:any): Observable<any> {
    this.applyFilter(value);
    return of(null);
  }

  getAllProviders() {
    this.providerService
      .getAllProviders(this.filterModel,this.isApprove,this.isBlock,this.isActive)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          response.data.map((ele: { isApprove: any; status: string; isBlock: any; isActive: any; })=>{
            if (ele.isApprove) {
              ele.status = 'Approved';
            } else if (ele.isBlock) {
              ele.status = 'Block';
            } else if (!ele.isActive) {
              ele.status = 'InActive';
            } else {
              ele.status = 'Pending';
            }          
          });
          this.allProviders = response.data;
          this.metaData = response.meta;
        } else {
          this.allProviders = [];
          //this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  // statusChangeHandler = (e) => {
  //   this.isApprove=null;
  //   this.isBlock=null;
  //   this.isActive=null;
  //   if (e == 'Approved') {
  //     this.isApprove=true;
  //     this.applyFilter();
  //   } else if (e == 'Blocked') {
  //     this.isBlock=true;
  //     this.applyFilter();
  //   }else if(e=='Pending'){
  //     this.isApprove=false;
  //     this.applyFilter();
  //   }else if(e=='All'){
  //     this.isApprove=null;
  //     this.isBlock=null;
  //     this.applyFilter();
  //   }else if(e=='InActive'){
  //     this.isActive=false;
  //     this.applyFilter();
  //   }
  // }
  statusChangeHandler = (e: any) => {
    debugger;
    this.isApprove = null;
    this.isBlock = null;
    this.isActive = null;
  
    if (e == 'Approved') {
      this.isApprove = true;
      this.isBlock = false;
    } else if (e == 'Blocked') {
      this.isBlock = true;
      this.isApprove = false;
    } else if (e == 'Pending') {
      this.isApprove = false;
      this.isActive = true;
    } else if (e == 'InActive') {
      this.isActive = false;
      this.isApprove = false;
      this.isBlock = false;
    }
  
    this.applyFilter();
  }

  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    this.getAllProviders();
    // if (this.searchText.trim() == "" || searchText.trim().length >= 3) {
    //   this.getAllProviders();
    // }
  }
  clearFilters() {
    this.isApprove=null;
    this.isBlock=null;
    this.isActive=null;
    this.selected='';
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getAllProviders();
  }
  setPaginateorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.staffID;
    if (actionObj.action == "Accept") {
      this.onAcceptAction(id);
    } else if (actionObj.action == "Reject") {
      this.onAcceptAction(id);
    } else if (actionObj.action == "isApprove") {
      this.onToggleAccept(actionObj);
    } else if (actionObj.action == "View") {
      this.openUser(actionObj.data);
    } else if (actionObj.action == "action") {
      this.openModal(actionObj);
    } else {
      this.openUser(actionObj.data);
    }
  }

  openModal = (actionObj: { data: any; }) => {
    const modalPopup = this.dialogModal.open(ManageActionComponent, {
      hasBackdrop: true,
      width: "30%",
      data: actionObj.data,
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllProviders();
      }
    });
  };

  onToggleAccept(actionObj: any) {
    var data = actionObj.data;
    var providerToUpdate = new ProviderModel();
    providerToUpdate.Id = data.staffID;
    providerToUpdate.isApprove = actionObj.state;

    //For checking provider Profile
   
    let status;
    this.commonService.getProfileUpdated(providerToUpdate.Id).subscribe((res) => {
      status = res.data;
      if (status.isProfileSetup > 0
        && status.basicProfile > 0
        && status.staffExperiences > 0
        && status.staffQualifications > 0
        && status.staffTaxonomies > 0
        && status.staffServices > 0
        && status.staffSpecialities > 0) {
        console.log("Profile is complete");
        const data = {
          title: "Profile status",
          message: "The provider status is complete.",
          status: status,
        }
        this.showProviderProfileStatus(data, providerToUpdate);
      } else {
        const data = {
          title: "Profile status",
          message: "The provider status is incomplete.",
          status: status,
        }
        this.showProviderProfileStatus(data, providerToUpdate);
      }
    });

    // this.providerService
    //   .updateProviderIsApproveStatus(providerToUpdate)
    //   .subscribe((response: ResponseModel) => {
    //     if (response.statusCode == 200) {
    //       this.notifier.notify("success", response.message);
    //       this.getAllProviders();
    //     } else {
    //       this.notifier.notify("error", response.message);
    //     }
    //   });
  }


  //For checking provider Profile
  showProviderProfileStatus(data: any, providerToUpdate: ProviderModel) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: data.title,
        message: data.message,
        status: data.status
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.providerService
          .updateProviderIsApproveStatus(providerToUpdate)
          .subscribe((response: ResponseModel) => {
            if (response.statusCode == 200) {
              this.notifier.notify("success", response.message);
              this.getAllProviders();
            } else {
              this.notifier.notify("error", response.message);
            }
          });
      }else{
        this.getAllProviders();
      }
    });
  }
  onAcceptAction(staffId: number) {
    var providerToUpdate = new ProviderModel();
    providerToUpdate.Id = staffId;
    providerToUpdate.isApprove = true;
    this.providerService
      .updateProviderIsApproveStatus(providerToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllProviders();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  onRejectAction(staffId: number) {
    var providerToUpdate = new ProviderModel();
    providerToUpdate.Id = staffId;
    providerToUpdate.isApprove = false;
    this.providerService
      .updateProviderIsApproveStatus(providerToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllProviders();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  onPageOrSortChange(changeState?: any) {
    (this.filterModel.pageNumber = changeState.pageIndex + 1),
      (this.filterModel.pageSize = changeState.pageSize),
      (this.filterModel.sortColumn = changeState.sort),
      (this.filterModel.sortOrder = changeState.order),
      this.getAllProviders();
  }
  addProvider() {
    this.addProviderDialogRef = this.dialog.open(AddPatientModalComponent, {
      data: {
        mrValue: "provider",
        showFooter: false,
        isPatientOrProvider: true,
        title: "Add Provider",
      },
    });
  }

  openUser(user: any) {
    this.router.navigate(["/webadmin/manage-users/user-profile"], {
      queryParams: { staffId: user.staffID, userId: user.userID },
    });
  }
}
