import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { FilterModel } from '../../clients/medication/medication.model';
import { CreateMasterAllergiesComponent } from '../create-master-allergies/create-master-allergies.component';
import { MasterAllergiesServiceService } from './master-allergies-service.service';
import { MasterAllergiesModel } from './MasterAllergies-Model';

@Component({
  selector: 'app-master-allergies-details',
  templateUrl: './master-allergies-details.component.html',
  styleUrls: ['./master-allergies-details.component.css']
})
export class MasterAllergiesDetailsComponent implements OnInit {
  filterModel: FilterModel = new FilterModel;
  serviceData: MasterAllergiesModel[] = [];
  metaData: any;
  searchText: string = "";
  formGroup!: FormGroup;
  displayedColumns: Array<any> = [
    {
      displayName: "allergyName",
      key: "allergyType",
      isSort: true,
      class: "",
    },
    // {
    //   displayName: "vaccineStatus",
    //   key: "vaccineStatus",
    //   isSort: true,
    //   class: "",
    //  // type: ["Active", "Inactive"],
    // },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];

  constructor(private dialogService: DialogService,private notifier: NotifierService,private masterServiceDialogModal: MatDialog,private formBuilder: FormBuilder,private AllergiesService: MasterAllergiesServiceService) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.getAllergiesList();
  }
  getAllergiesList() {
    this.AllergiesService.getAll(this.filterModel).subscribe((response: any) => {
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
      this.getAllergiesList();
  }
  createModal(serviceModal:MasterAllergiesModel) {
    let ServiceModal;
   ServiceModal = this.masterServiceDialogModal
 .open(CreateMasterAllergiesComponent, { hasBackdrop: true, data: serviceModal })
      .afterClosed()
      .subscribe((result) => {
        //if (result === "Save")
        //this.getServiceList();
      });
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete this Alleriges?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.AllergiesService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getAllergiesList();
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
  openDialog(id?:number) {
    if (id !== undefined && id > 0) {
      this.AllergiesService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new MasterAllergiesModel());

  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getAllergiesList();
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getAllergiesList();
  }

}
