import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/platform/modules/core/services";
import { LocationModalComponent } from "src/app/platform/modules/agency-portal/masters/location-master/location-master-modal/location-master-modal.component";
import { NotifierService } from "angular-notifier";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AddPatientModalComponent } from "../manage-patients/add-patient-modal/add-patient-modal.component";

import {
  ResponseModel,
  FilterModel,
  Metadata,
} from "src/app/platform/modules/core/modals/common-model";
import { ManagePharmacyService } from "./manage-pharmacy.service";
import { ManagePharmacy } from "./manage-pharmacy.model";
import { format } from "date-fns";
import { ManageActionComponent } from "../manage-action/manage-action.component";

@Component({
  selector: "app-manage-pharmacy",
  templateUrl: "./manage-pharmacy.component.html",
  styleUrls: ["./manage-pharmacy.component.css"],
})
export class ManagePharmacyComponent implements OnInit {
  filterModel!: FilterModel;
  //allPharmacy:  Array<any>;
  allPharmacy!: LocationModalComponent[];
  metaData: any;
  searchText: string = "";
  addPharmacyDialogRef!: MatDialogRef<AddPatientModalComponent>;

  displayColumns: Array<any> = [
    // {
    //   displayName: "PharmacyName",
    //   key: "pharmacyName",
    //   isSort: true,
    //   class: "",
    // },
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
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
      class: "",
    },
    //{ displayName: "DOB", key: "dob", isSort: true, class: "",},
    // {
    //   displayName: "Gender",
    //   key: "gender",
    //   isSort: true,
    //   class: "",
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
      isSort: true,
      class: "",
    },
  ];
  actionButtons: Array<any> = [
    // { displayName: "Accept", key: "accept", class: "fa fa-check" },
    // { displayName: "Reject", key: "reject", class: "fa fa-ban" },
    {
      displayName: "Accept/Reject",
      key: "isApprove",
      type: "toggle",
      class: "",
    },
    { displayName: "Block", key: "action", class: "fa fa-flickr" },
  ];

  constructor(
    private dialog: MatDialog,
    private pharmacyService: ManagePharmacyService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllPharmacy();
  }
  getAllPharmacy() {
    this.pharmacyService
      .getAllPharmacy(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          response.data.map((ele: { srNo: any; registerDate: string | number | Date; isDelete: boolean; status: string; isBlock: boolean; isApprove: boolean; },index: number) => {
            // ele.dob = format(ele.dob, "MM-dd-yyyy");
            // ele.registerDate = format(ele.registerDate, "MM-dd-yyyy");
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
          this.allPharmacy = response.data;
          this.metaData = response.meta;
        } else {
          this.allPharmacy = [];
          this.metaData = null;
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
    this.getAllPharmacy();
  }
  onPageOrSortChange(changeState?: any) {
    // console.log(changeState)
    (this.filterModel.pageNumber = changeState.pageIndex + 1),
      (this.filterModel.pageSize = changeState.pageSize),
      (this.filterModel.sortColumn = changeState.sort),
      (this.filterModel.sortOrder = changeState.order),
      this.getAllPharmacy();
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
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    this.getAllPharmacy();
    // if (searchText.trim() == "" || searchText.trim().length >= 3)
    //   this.getAllPharmacy();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.staffId;

    if (actionObj.action == "Accept") {
      this.onAcceptAction(id);
    } else if (actionObj.action == "Reject") {
      this.onRejectAction(id);
    } else if (actionObj.action == "isApprove") {
      this.onToggleAccept(actionObj);
    } else if (actionObj.action == "action") {
      this.openModal(actionObj);
    } else {
      this.openUser(actionObj);
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
        this.getAllPharmacy();
      }
    });
  };

  openUser(data: any) {
    this.router.navigate(["/webadmin/pharmacy/my-profile"], {
      queryParams: {
        id: data.data.staffId,
      },
    });
  }
  onToggleAccept(actionObj: any) {
    console.log(data);
    var data = actionObj.data;
    var pharmacyToUpdate = new ManagePharmacy();
    pharmacyToUpdate.pharmacyID = data.pharmacyId;
    pharmacyToUpdate.isApprove = actionObj.state;
    this.pharmacyService
      .updatePharmacyIsApproveStatus(pharmacyToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllPharmacy();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  onAcceptAction(pharmacyId: number) {
    var pharmacyToUpdate = new ManagePharmacy();
    pharmacyToUpdate.pharmacyID = pharmacyId;
    pharmacyToUpdate.isApprove = true;
    this.pharmacyService
      .updatePharmacyIsApproveStatus(pharmacyToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllPharmacy();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  onRejectAction(pharmacyId: number) {
    var pharmacyToUpdate = new ManagePharmacy();
    pharmacyToUpdate.pharmacyID = pharmacyId;
    pharmacyToUpdate.isApprove = false;
    this.pharmacyService
      .updatePharmacyIsApproveStatus(pharmacyToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllPharmacy();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  addPharmacy() {
    this.addPharmacyDialogRef = this.dialog.open(AddPatientModalComponent, {
      data: {
        mrValue: "Pharmacy",
        showFooter: false,
        isLabOrPharmacy: true,
        title: "Add Pharmacy",
      },
    });
  }
}
