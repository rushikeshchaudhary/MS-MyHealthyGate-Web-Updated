import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilterModel, ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { ManageSubscriptionplansService } from './manage-subscriptionplans.service';

@Component({
  selector: 'app-manage-subscriptionplans',
  templateUrl: './manage-subscriptionplans.component.html',
  styleUrls: ['./manage-subscriptionplans.component.css']
})
export class ManageSubscriptionplansComponent implements OnInit {
  filterModel!: FilterModel;
  allSubscriptionPlans!: Array<any>;
  metaData: any;
  searchText: string = "";

  displayColumns: Array<any> = [
    { displayName: "Subscriber", key: "subscriberName", isSort: true, class: "", width: "5%" },
    { displayName: "Plan Type", key: "planType", isSort: true, class: "", width: "10%" },
    { displayName: "Descriptions", key: "descriptions", isSort: true, class: "", width: "20%" },
    { displayName: "Title", key: "title", isSort: true, class: "", width: "10%" },
    { displayName: "Price", key: "amountPerClient", isSort: true, class: "", width: "5%" },
    { displayName: "Expiry Date", key: "expiryDate", isSort: true, class: "", width: "20%" },
    { displayName: "Created Date", key: "startDate", isSort: true, class: "", width: "20%" },
    { displayName: 'Actions', key: 'Actions', isSort: true, class: "", width: "5%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];
  constructor(private subscriptionplanService: ManageSubscriptionplansService, private subscriptionplanDialogModal: MatDialog, private router: Router,private datepipe: DatePipe) {

   }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllSubscriptionPlans();
  }
  getAllSubscriptionPlans() {
    this.subscriptionplanService
      .getAllSubscriptionPlans(this.filterModel)
      .subscribe((response: ResponseModel) => {
        console.log(response);
        if (response.statusCode == 200) {
          this.allSubscriptionPlans = response.data;
          this.allSubscriptionPlans.forEach((d) => {
           d.expiryDate = this.datepipe.transform(
             d.expiryDate,
             "MMM d, y, h:mm:ss a"
           );
           d.startDate = this.datepipe.transform(
            d.startDate,
            "MMM d, y, h:mm:ss a"
          );
          });
          this.metaData = response.meta;
        } else {
          this.allSubscriptionPlans = [];
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
      this.getAllSubscriptionPlans();
  }
  onPageOrSortChange(changeState?: any) {
    this.getAllSubscriptionPlans();
    this.setPaginateorModel(changeState.pageIndex + 1, changeState.pageSize, changeState.sortColumn, changeState.sortOrder, changeState.searchText);
  }
  setPaginateorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getAllSubscriptionPlans();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.subcriptionPlanID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addSubscriptionPlan(id);
        break;
      default:
        break;
    }
  }
  addSubscriptionPlan(organizationId: any=null) {
    this.router.navigate(["/webadmin/subscriptionplan-setup"], { queryParams: { id: organizationId } });
  }
}
