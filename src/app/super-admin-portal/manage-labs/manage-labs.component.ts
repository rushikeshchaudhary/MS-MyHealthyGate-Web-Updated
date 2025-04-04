import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LocationModalComponent } from "src/app/platform/modules/agency-portal/masters/location-master/location-master-modal/location-master-modal.component";
import { NotifierService } from "angular-notifier";
import { Router } from "@angular/router";
import {
  ResponseModel,
  FilterModel,
} from "src/app/platform/modules/core/modals/common-model";
import { ManageLabsService } from "./manage-labs.service";
import { ManageLabs } from "./manage-labs.model";
import { AddPatientModalComponent } from "../manage-patients/add-patient-modal/add-patient-modal.component";
import { format } from "date-fns";
import { ManageActionComponent } from "../manage-action/manage-action.component";

@Component({
  selector: "app-manage-labs",
  templateUrl: "./manage-labs.component.html",
  styleUrls: ["./manage-labs.component.css"],
})
export class ManageLabsComponent implements OnInit {
  filterModel!: FilterModel;
  allLabs!: Array<any>;
  // allLabs: LocationModalComponent[];
  metaData: any;
  searchText: string = "";
  addLabDialogRef!: MatDialogRef<AddPatientModalComponent>;

  displayColumns: Array<any> = [
    // {
    //   displayName: "LabName",
    //   key: "labName",
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
      displayName: "Full Name",
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
    // {
    //   displayName: "Role",
    //   key: "role",
    //   isSort: true,
    //   class: "",
    // },
    // { displayName: "DOB", key: "dob", isSort: true, class: "" },
    // {
    //   displayName: "Phone Number",
    //   key: "phone",
    //   isSort: true,
    //   class: "",
    // },
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
    private labService: ManageLabsService,
    private notifier: NotifierService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllLabs();
  }
  
  getAllLabs() {
    this.labService.getAllLabs(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          response.data.map((ele: { srNo: any; registerDate: string | number | Date; isDelete: boolean; status: string; isBlock: boolean; isApprove: boolean; }, index: number) => {
            ele.srNo = index + 1; // Adding Sr.no
            ele.registerDate = format(new Date(ele.registerDate), "MM-dd-yyyy"); // Formatting Register Date
          // ele.role = ele.role;
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
  
          this.allLabs = response.data;
          this.metaData = response.meta;
        } else {
          this.allLabs = [];
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
    this.getAllLabs();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginateorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sortColumn,
      changeState.sortOrder,
      changeState.searchText
    );
    this.getAllLabs();
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
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    this.getAllLabs();
    // if (searchText.trim() == "" || searchText.trim().length >= 3)
    //   this.getAllLabs();
  }
  onTableActionClick(actionObj?: any) {
    if (actionObj.action == "accept") {
      this.onAcceptAction(actionObj.data.labId);
    } else if (actionObj.action == "reject") {
      this.onRejectAction(actionObj.data.labId);
    } else if (actionObj.action == "isApprove") {
      this.onToggleAccept(actionObj);
    } else if (actionObj.action == "action") {
      this.openModal(actionObj);
    } else {
      this.openUser(actionObj.data.labId);
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
        this.getAllLabs();
      }
    });
  };

  openUser(id: any) {
    this.router.navigate(["/webadmin/lab/profile"], {
      queryParams: {
        id: id,
      },
    });
  }
  onToggleAccept(actionObj: any = null) {
    debugger
    // console.log(`On toggle Change: ${actionObj.data}`);
    var data = actionObj.data;
    var labToUpdate = new ManageLabs();
    labToUpdate.labID = data.labId;
    labToUpdate.isApprove = actionObj.state;
    this.labService
      .updateLabIsApproveStatus(labToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllLabs();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  onAcceptAction(labId: number) {
    var labToUpdate = new ManageLabs();
    labToUpdate.labID = labId;
    labToUpdate.isApprove = true;
    this.labService
      .updateLabIsApproveStatus(labToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllLabs();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  onRejectAction(labId: number) {
    var labToUpdate = new ManageLabs();
    labToUpdate.labID = labId;
    labToUpdate.isApprove = false;
    this.labService
      .updateLabIsApproveStatus(labToUpdate)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.getAllLabs();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  addLab() {
    this.addLabDialogRef = this.dialog.open(AddPatientModalComponent, {
      data: {
        mrValue: "Lab",
        showFooter: false,
        isLabOrPharmacy: true,
        title: "Add Lab",
      },
    });
  }
}
