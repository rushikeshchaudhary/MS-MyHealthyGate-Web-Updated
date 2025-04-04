import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { LocationModalComponent } from "src/app/platform/modules/agency-portal/masters/location-master/location-master-modal/location-master-modal.component";
import { LocationModel } from "src/app/platform/modules/agency-portal/masters/location-master/location-master.model";
import { LocationService } from "src/app/platform/modules/agency-portal/masters/location-master/location-master.service";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { ResponseModel } from "../core/modals/common-model";
import { ManageLocationService } from "./manage-location.service";

@Component({
  selector: "app-manage-locations",
  templateUrl: "./manage-locations.component.html",
  styleUrls: ["./manage-locations.component.css"],
})
export class ManageLocationsComponent implements OnInit {
  filterModel!: FilterModel;
  allLocations!: LocationModalComponent[];
  metaData: any;
  searchText: string = "";

  displayColumns: Array<any> = [
    { displayName: "Location", key: "locationName", isSort: true, class: "", width: "15%" },
    { displayName: "Description", key: "locationDescription", isSort: true, class: "", width: "30%" },
    { displayName: "Address", key: "address", isSort: true, class: "", width: "35%" },
    { displayName: "ZipCode", key: "zip", isSort: true, class: "", width: "10%" },
    { displayName: 'Actions', key: 'Actions', isSort: true, class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];
  constructor(private locationService: ManageLocationService, private locationDialogModal: MatDialog, private router: Router) {

  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllLocations();
  }
  getAllLocations() {
    this.locationService
      .getAllLocations(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.allLocations = response.data;
          this.metaData = response.meta;
          this.metaData.pageSize = response.meta.defaultPageSize
        } else {
          this.allLocations = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText ="";
    this.setPaginateorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.filterModel.searchText);
      this.getAllLocations();
  }
  onPageOrSortChange(changeState?: any) {
    console.log(changeState);
    this.setPaginateorModel(changeState.pageIndex + 1, changeState.pageSize, changeState.sort, changeState.Order, changeState.searchText);
    this.getAllLocations();
  }
  setPaginateorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";;
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";;
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getAllLocations();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.locationID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addLocation(id);
        break;
      default:
        break;
    }
  }
  /*openDialog(id?: number) {
    if (id != null && id > 0) {
      this.locationService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModel(response.data);
        }
      });
    } else {
      this.createModel(new LocationModel());
    }
  }
  createModel(locationModel: LocationModel) {
    let locationModal;
    locationModal = this.locationDialogModal.open(LocationModalComponent, { hasBackdrop: true, data: LocationModel });
    locationModal.afterClosed().subscribe((result: string) => {
      if (result == "save")
        this.getAllLocations();
    });
  }
  */
  addLocation(organizationId: any = null) {
    this.router.navigate(["/webadmin/location-setup"], { queryParams: { id: organizationId } });
  }
}
