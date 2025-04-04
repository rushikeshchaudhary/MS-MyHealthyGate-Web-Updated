import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import {
  FilterModel,
  SuperAdminGetPatientsRequest,
} from "../core/modals/common-model";
import { ManageActionComponent } from "../manage-action/manage-action.component";
import { AddPatientModalComponent } from "./add-patient-modal/add-patient-modal.component";
import { ManagePatientService } from "./manage-patient.service";
import { PatientModel } from "./patient-model.model";

@Component({
  selector: "app-manage-patients",
  templateUrl: "./manage-patients.component.html",
  styleUrls: ["./manage-patients.component.css"],
})
export class ManagePatientsComponent implements OnInit {
  searchText: string = "";
  patientList: Array<PatientModel> = [];
  metaData: any;
  filterModel!: SuperAdminGetPatientsRequest;
  addPatientDialogRef!: MatDialogRef<AddPatientModalComponent>;
  displayColumns: Array<any> = [
    {
      displayName: "FullName",
      key: "fullName",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
      class: "",
      width: "15%",
    },
    { displayName: "DOB", key: "dob", isSort: true, class: "", width: "25%" },
    { displayName: "MRN", key: "mrn", isSort: true, class: "", width: "15%" },
    //{ displayName: "About", key: "aboutMe", isSort: true, class: "", width: "30%" },
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
    { displayName: "View", key: "View", class: "fa fa-eye" },
    { displayName: "Block", key: "action", class: "fa fa-flickr" },
  ];
  profileStatus: any = ["All", "Active", "InActive", "Blocked"];
  isBlock: boolean | null = null;
  isActive: boolean | null = null;
  selected: any;
  constructor(
    private managePatientService: ManagePatientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.filterModel = new SuperAdminGetPatientsRequest();
    this.getAllpatients();
  }

  // statusChangeHandler = (e) => {
  //   this.isBlock = null;
  //   this.isActive = null;
  //   if (e == 'Blocked') {
  //     this.isBlock = true;
  //     this.applyFilter();
  //   } else if (e == 'All') {
  //     this.isBlock = null;
  //     this.isActive = null;
  //     this.applyFilter();
  //   } else if (e == 'InActive') {
  //     this.isActive = false;
  //     this.applyFilter();
  //   } else if (e == 'Active') {
  //     this.isActive = true;
  //     this.applyFilter();
  //   }
  // }

  statusChangeHandler = (e: any) => {
  
    this.isBlock = null;
    this.isActive = null;
  
    if (e == 'Blocked') {
      this.isBlock = true;
    } else if (e == 'Active') {
      this.isActive = true;
    }
    else if (e == 'InActive') {
      this.isActive = false;
    }
  
    this.applyFilter();
  }

  onPageOrSortChange(changeState?: any) {
    console.log(changeState);
    this.setPaginateorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      ""
    );
    this.getAllpatients();
  }

  clearFilters() {
    this.isActive=null;
    this.isBlock=null;
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getAllpatients();
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );

    
    this.getAllpatients();
    // if (searchText.trim() == "" || searchText.trim().length >= 3)
    //   this.getAllpatients();
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
  getAllpatients() {
    debugger
    this.filterModel.isFromSuperAdmin = true;
    this.managePatientService
      .getAll(this.filterModel,this.isActive,this.isBlock)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          response.data.map((ele: { dob: any; isDelete: boolean; status: string; isBlock: boolean; isActive: boolean; }) => {
            ele.dob = format(ele.dob, "MM-dd-yyyy");
            if (ele.isDelete == true) {
              ele.status = "Deleted";
          } else if (ele.isBlock == true) {
              ele.status = "Block";
          } else if (ele.isActive == true) {
              ele.status = "Active";
          } else {
              ele.status = "InActive";
          }
          });
          this.patientList = response.data;
          this.metaData = response.meta;
        } else {
          this.patientList = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  addPatient() {
    this.addPatientDialogRef = this.dialog.open(AddPatientModalComponent, {
      data: {
        mrValue: "patient",
        showFooter: false,
        title: "Add Patient",
        isPatientOrProvider: true,
      },
    });
  }
  openUser(user: any) {
    this.router.navigate(["/webadmin/client/my-profile"], {
      queryParams: {
        id: user.patientId,
        userID: user.userId,
        locationID: user.locationId,
      },
    });
  }

  onTableActionClick(actionObj?: any) {
    console.log(actionObj);
    const id = actionObj.data && actionObj.data.staffID;
    if (actionObj.action == "View") {
      this.openUser(actionObj.data);
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
        this.getAllpatients();
      }
    });
  };
}
