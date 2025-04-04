import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { CreateCategoryMasterDataComponent } from '../create-category-master-data/create-category-master-data.component';
import { CategoryMasterServiceService } from './category-master-service.service';
import { MasterCategoryModel } from './category-model';

@Component({
  selector: 'app-catogery-master',
  templateUrl: './catogery-master.component.html',
  styleUrls: ['./catogery-master.component.css']
})
export class CatogeryMasterComponent implements OnInit {
  filterModel: FilterModel = new FilterModel;
  serviceData: MasterCategoryModel[] = [];
  searchText: string = "";
  metaData: any;
  formGroup!: FormGroup;
  displayedColumns: Array<any> = [
    {
      displayName: "CategoryName",
      key: "careCategoryName",
      isSort: true,
      class: "",
    },
    {
      displayName: "CreatedDate",
      key: "createDate",
      type:"date",
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
  constructor(private CategoryMasterService: CategoryMasterServiceService,private formBuilder: FormBuilder,private masterServiceDialogModal: MatDialog,private dialogService: DialogService,private notifier: NotifierService,) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
this.getCatogeryModuleMasterdata();
  }
  getCatogeryModuleMasterdata() {
    this.CategoryMasterService.getAll(this.filterModel).subscribe((response: any) => {
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
  openDialog(id: string = "") {
    if (id != null && id != "") {
      this.CategoryMasterService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new MasterCategoryModel());

  }
  createModal(serviceModal:MasterCategoryModel) {
    let ServiceModal;
   ServiceModal = this.masterServiceDialogModal
 .open(CreateCategoryMasterDataComponent, { hasBackdrop: true, data: serviceModal })
      .afterClosed()
      .subscribe((result) => {
        //if (result === "Save")
        //this.getServiceList();
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
    this.getCatogeryModuleMasterdata();
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
      this.getCatogeryModuleMasterdata();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete this Care Category?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.CategoryMasterService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getCatogeryModuleMasterdata();
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
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getCatogeryModuleMasterdata();
  }
}
