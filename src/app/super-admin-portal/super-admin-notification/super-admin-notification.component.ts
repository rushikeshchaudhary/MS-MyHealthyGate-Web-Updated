import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import {
  AdminDataFilterModel,
  Metadata,
  SuperAdminDataModel,
} from "src/app/platform/modules/core/modals/common-model";
import { CreateSuperAdminNotificationdataComponent } from "../create-super-admin-notificationdata/create-super-admin-notificationdata.component";
import { SuperAdminnotificationService } from "./super-adminnotification.service";

@Component({
  selector: "app-super-admin-notification",
  templateUrl: "./super-admin-notification.component.html",
  //styleUrls: ['./super-admin-notification.component.css']
})
export class SuperAdminNotificationComponent implements OnInit {
  filterModel: AdminDataFilterModel;
  displayedColumns: Array<any> = [];
  actionButtons: Array<any> = [];
  selected: string = "Patients";
  appointmentMode: any = [
    { name: "Patients", checked: true },
    { name: "Provider", checked: false },
    { name: "Lab", checked: false },
    { name: "Pharmacy", checked: false },
    { name: "Radiology", checked: false },
  ];
  notificationGroup!: FormGroup;
  serviceData!: SuperAdminDataModel[];
  metaData: any;
  searchText: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private AdminDataservice: SuperAdminnotificationService,
    private masterServiceDialogModal: MatDialog
  ) {
    this.filterModel = new AdminDataFilterModel();
  }

  ngOnInit() {
    this.notificationGroup = this.formBuilder.group({
      appStatus: "",
      searchText: "",
      Email: "",
    });
    this.getServiceList();
  }
  getServiceList() {
    if (this.filterModel.Listof == "" || this.filterModel.Listof == null) {
      this.filterModel.Listof = this.selected;
    }
    if (this.filterModel.Email == undefined) {
      this.filterModel.Email = "";
    }
    if (this.filterModel.searchText == undefined) {
      this.filterModel.searchText = "";
    }
    this.AdminDataservice.getAll(this.filterModel).subscribe(
      (response: any) => {
        if (response.statusCode === 302) {
          this.serviceData = response.data || [];
          this.metaData = response.meta;
          if (this.serviceData[0].patientID > 0) {
            this.displayedColumns = [
              {
                displayName: "PatientName",
                key: "fullName",
                isSort: true,
                class: "",
              },
              {
                displayName: "PatientEmail",
                key: "email",
                isSort: true,
                class: "",
                // type: ["Active", "Inactive"],
              },
              {
                displayName: "Status",
                key: "isActive",
                isSort: true,
                class: "",
                type: ["Active", "Inactive"],
              },
              {
                displayName: "Actions",
                key: "Actions",
                class: "",
                width: "10%",
              },
            ];
            this.actionButtons = [
              { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
            ];
          }
          if (this.serviceData[0].staffID > 0) {
            this.displayedColumns = [
              {
                displayName: "ProviderName",
                key: "providerFullName",
                isSort: true,
                class: "",
              },
              {
                displayName: "ProviderEmail",
                key: "email",
                isSort: true,
                class: "",
                // type: ["Active", "Inactive"],
              },
              {
                displayName: "Status",
                key: "isActive",
                isSort: true,
                class: "",
                type: ["Active", "Inactive"],
              },
              {
                displayName: "Actions",
                key: "Actions",
                class: "",
                width: "10%",
              },
            ];
            this.actionButtons = [
              { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
            ];
          }
          if (this.serviceData[0].labID > 0) {
            this.displayedColumns = [
              {
                displayName: "LabName",
                key: "labFullName",
                isSort: true,
                class: "",
              },
              {
                displayName: "LabEmail",
                key: "labEmail",
                isSort: true,
                class: "",
                // type: ["Active", "Inactive"],
              },
              {
                displayName: "Status",
                key: "isActive",
                isSort: true,
                class: "",
                type: ["Active", "Inactive"],
              },
              {
                displayName: "Actions",
                key: "Actions",
                class: "",
                width: "10%",
              },
            ];
            this.actionButtons = [
              { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
            ];
          }
          if (this.serviceData[0].pharmacyID > 0) {
            this.displayedColumns = [
              {
                displayName: "PharmacyName",
                key: "pharmaFullName",
                isSort: true,
                class: "",
              },
              {
                displayName: "PharmacyEmail",
                key: "pharmaEmail",
                isSort: true,
                class: "",
                // type: ["Active", "Inactive"],
              },
              {
                displayName: "Status",
                key: "isActive",
                isSort: true,
                class: "",
                type: ["Active", "Inactive"],
              },
              {
                displayName: "Actions",
                key: "Actions",
                class: "",
                width: "10%",
              },
            ];
            this.actionButtons = [
              { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
            ];
          }
          if (this.serviceData[0].radiologyID > 0) {
            this.displayedColumns = [
              {
                displayName: "RadiologysName",
                key: "radioFullName",
                isSort: true,
                class: "",
              },
              {
                displayName: "RadiologyEmail",
                key: "radioEmail",
                isSort: true,
                class: "",
                // type: ["Active", "Inactive"],
              },
              {
                displayName: "Status",
                key: "isActive",
                isSort: true,
                class: "",
                type: ["Active", "Inactive"],
              },
              {
                displayName: "Actions",
                key: "Actions",
                class: "",
                width: "10%",
              },
            ];
            this.actionButtons = [
              { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
            ];
          }
        } else {
          this.serviceData = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      }
    );
  }
  applyFilter() {
    //console.log("whatsmy name",this.f.appStatus.value)
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f['appStatus'].value,
      this.f['searchText'].value,
      this.f['Email'].value
    );

    this.getServiceList();
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    appStatus: any,
    searchtext: string,
    Email: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.SearchText = searchtext;
    this.filterModel.Email = Email;
    this.filterModel.Listof = this.f['appStatus'].value;
  }
  onModeChange(mode: any) {
    //this.confirmation.mode = mode;
    this.f['appStatus'].setValue(mode);
    this.applyFilter();
  }

  get f() {
    return this.notificationGroup.controls;
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f['appStatus'].value,
      this.f['searchtext'].value,
      this.f['Email'].value
    );
    this.getServiceList();
  }
  clearFilters() {
    this.notificationGroup.reset();
    this.appointmentMode = [
      { name: "Patients", checked: true },
      { name: "Provider", checked: false },
      { name: "Lab", checked: false },
      { name: "Pharmacy", checked: false },
      { name: "Radiology", checked: false },
    ];
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      "",
      "",
      ""
    );
    this.getServiceList();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.testID;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(actionObj.data);
        break;
        // case "DELETE":
        //   this.dialogService
        //     .confirm(`Are you sure you want to delete this Care Category?`)
        //     .subscribe((result: any) => {
        //       if (result == true) {
        //         this.CategoryMasterService
        //           .delete(id)
        //           .subscribe((response: ResponseModel) => {
        //             if (response.statusCode === 200) {
        //               this.notifier.notify("success", response.message);
        //               this.getCatogeryModuleMasterdata();
        //             } else if (response.statusCode === 401) {
        //               this.notifier.notify("warning", response.message);
        //             } else {
        //               this.notifier.notify("error", response.message);
        //             }
        //           });
        //       }
        // });
        break;
      default:
        break;
    }
  }
  openDialog(serviceData: SuperAdminDataModel) {
    if (serviceData != null) {
      // this.AdminDataservice.getById(serviceData).subscribe((response: any) => {
      //   if (response != null && response.data != null) {
      this.createModal(serviceData);
      // }
      // });
    } else this.createModal(new SuperAdminDataModel());
  }
  createModal(serviceModal: SuperAdminDataModel) {
    let ServiceModal;
    ServiceModal = this.masterServiceDialogModal
      .open(CreateSuperAdminNotificationdataComponent, {
        hasBackdrop: true,
        data: serviceModal,
      })
      .afterClosed()
      .subscribe((result) => {
        //if (result === "Save")
        //this.getServiceList();
      });
  }
}
