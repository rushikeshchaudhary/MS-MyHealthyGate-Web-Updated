import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { FilterModel, ResponseModel } from "../core/modals/common-model";
import { ManageActionComponent } from "../manage-action/manage-action.component";
import { AddPatientModalComponent } from "../manage-patients/add-patient-modal/add-patient-modal.component";
import { ManagePharmacyService } from "../manage-pharmacy/manage-pharmacy.service";
import { ManageProvidersService } from "../manage-providers/manage-providers.service";
import { ProviderModel } from "../manage-providers/provider-model.model";

@Component({
  selector: "app-manage-radiology",
  templateUrl: "./manage-radiology.component.html",
  styleUrls: ["./manage-radiology.component.css"],
})
export class ManageRadiologyComponent implements OnInit {
  filterModel!: FilterModel;
  metaData: any;
  searchText: string = "";
  allRadiologists: Array<any> = [];
  addRadiologyDialogRef!: MatDialogRef<AddPatientModalComponent>;

  displayColumns: Array<any> = [
    {
      displayName: "Sr.no",
      key: "srNo",
      isSort: true,
      class: "",
    },
    {
      displayName: "FullName",
      key: "fullName",
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
    // { displayName: "DOB", key: "dob", isSort: true, class: "", width: "15%" },
    // {
    //   displayName: "Gender",
    //   key: "gender",
    //   isSort: true,
    //   class: "",
    //   width: "15%",
    // },
    {
      displayName: "Register Date",
      key: "registerDate",
      isSort: true,
      class: "",
    },
    {
      displayName: "Status",
      key: "status",
      isSort: true,
      class: "",
      width: "15%",
    },
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
    // { displayName: "View", key: "View", class: "fa fa-eye" },
    {
      displayName: "Accept/Reject",
      key: "isApprove",
      type: "toggle",
      class: "",
    },
    { displayName: "Block", key: "action", class: "fa fa-flickr" },
  ];

  constructor(
    private pharmacyService: ManagePharmacyService,
    private dialog: MatDialog,
    private router: Router,
    private providerService: ManageProvidersService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllRadiogy();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginateorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.order,
      changeState.sort,
      ""
    );
    this.getAllRadiogy();
  }
  setPaginateorModel(
    pageNumber: number,
    pageSize: number,
    sortOrder: string,
    sortColumn: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  getAllRadiogy() {
    this.pharmacyService
      .getAllRadiologists(this.filterModel)
      .subscribe((response) => {
        if (response != null && response.statusCode == 200) {
          response.data.map((ele: { srNo: any; registerDate: string | number | Date; isDelete: boolean; status: string; isBlock: boolean; isApprove: boolean; }, index: number) => {
            ele.srNo = index + 1; // Adding Sr.no
            ele.registerDate = format(new Date(ele.registerDate), "MM-dd-yyyy"); // Formatting Register Date
            if (ele.isDelete == true) {
              ele.status = "Deleted";
          } else if (ele.isBlock == true) {
              ele.status = "Block";
          } else if (ele.isApprove == true) {
              ele.status = "Active";
          } else {
              ele.status = "Inactive";
          }
          });

          this.allRadiologists = response.data;
          this.metaData = response.meta;
        } else {
          this.allRadiologists = response.data;
          this.metaData = response.meta;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getAllRadiogy();
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    this.getAllRadiogy();

    // if (searchText.trim() == "" || searchText.trim().length >= 3)
    //   this.getAllRadiogy();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.staffID;
    if (actionObj.action == "Accept") {
      this.onAcceptAction(id);
    } else if (actionObj.action == "Reject") {
      this.onAcceptAction(id);
    } else if (actionObj.action == "isApprove") {
      this.onToggleAccept(actionObj);
    } else if (actionObj.action == "action") {
      this.openModal(actionObj);
    } else {
      this.openUser(actionObj.data);
    }
  }

  openModal = (actionObj: { data: any; }) => {
    const modalPopup = this.dialog.open(ManageActionComponent, {
      hasBackdrop: true,
      width: "30%",
      data: actionObj.data,
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllRadiogy();
      }
    });
  };

  onAcceptAction(staffId: number) {
    var providerToUpdate = new ProviderModel();
    providerToUpdate.Id = staffId;
    providerToUpdate.isApprove = true;
    this.providerService
      .updateProviderIsApproveStatus(providerToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllRadiogy();
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
          this.getAllRadiogy();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  onToggleAccept(actionObj: any) {
    var data = actionObj.data;
    console.log(data,"Rad dat");
    var providerToUpdate = new ProviderModel();
    providerToUpdate.Id = data.radiologyID;
    providerToUpdate.isApprove = actionObj.state;
    this.providerService
      .updateProviderIsApproveStatus(providerToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllRadiogy();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  addRadiology() {
    this.addRadiologyDialogRef = this.dialog.open(AddPatientModalComponent, {
      data: {
        mrValue: "Radiology",
        showFooter: false,
        isLabOrPharmacy: true,
        title: "Add Radiology",
      },
    });
  }

  openUser(user: any) {
    debugger
    this.router.navigate(["/webadmin/radiology/profile"], {
      queryParams: { staffId: user.radiologyID, userId: user.userID },
    });
  }
}
