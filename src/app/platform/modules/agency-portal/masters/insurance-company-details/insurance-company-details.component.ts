import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { FilterModel, InsurancecompanyModel, ResponseModel } from '../../../core/modals/common-model';
import { CompanyInsuranceModelComponent } from '../company-insurance-model/company-insurance-model.component';
import { CompanyInsuranceService } from '../company-insurance-model/company-insurance.service';

@Component({
  selector: 'app-insurance-company-details',
  templateUrl: './insurance-company-details.component.html',
  styleUrls: ['./insurance-company-details.component.css']
})
export class InsuranceCompanyDetailsComponent implements OnInit {
  filterModel: FilterModel = new FilterModel;
  serviceData: InsurancecompanyModel[] = [];
  metaData: any;
  searchText: string = "";
  formGroup!: FormGroup;
  displayedColumns: Array<any> = [
    {
      displayName: "CompanyName",
      key: "companyName",
      isSort: true,
      class: "",
    },
    {
      displayName: "CompanyAddress",
      key: "companyAddress",
      isSort: true,
      class: "",
     // type: ["Active", "Inactive"],
    },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];
  constructor( private dialogService: DialogService,private notifier: NotifierService,   private masterServiceDialogModal: MatDialog, private CompanyInsuranceService: CompanyInsuranceService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.getServiceList();
  }
  //data:any
  createModal(serviceModal:InsurancecompanyModel) {
    let ServiceModal;
   ServiceModal = this.masterServiceDialogModal
 .open(CompanyInsuranceModelComponent, { hasBackdrop: true, data: serviceModal })
      .afterClosed()
      .subscribe((result) => {
        //if (result === "Save")
        //this.getServiceList();
      });
  }
  getServiceList() {
    this.CompanyInsuranceService.getAll(this.filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.serviceData = response.data || [];
        this.metaData = response.meta;
      } else {
        this.serviceData = [];
        this.metaData = {};
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  }
  clearFilters() {
    this.searchText = "";
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      ""
    );
    this.getServiceList();
  }
  setPaginatorModel(
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
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.searchText
    );
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getServiceList();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.incuranceCompanyId;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete this Company?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.CompanyInsuranceService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getServiceList();
                  } else if (response.statusCode === 401) {
                    this.notifier.notify("warning", response.message);
                  } else {
                    this.notifier.notify("error", response.message);
                  }
                });
            }
          });
        break;
      default:
        break;
    }
  }
  openDialog(id: string = "") {
    if (id != null && id != "") {
      this.CompanyInsuranceService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new InsurancecompanyModel());

  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getServiceList();
  }
}
