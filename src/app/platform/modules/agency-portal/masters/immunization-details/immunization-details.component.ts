import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ImmunizationFilterModel, ResponseModel } from '../../../core/modals/common-model';
import { CreateImmunizationDetailsComponent } from '../create-immunization-details/create-immunization-details.component';

import { ImmunizationserviceService } from '../immunizationservice.service';
import { ImmunizationModel } from './ImmunizationModule';


@Component({
  selector: 'app-immunization-details',
  templateUrl: './immunization-details.component.html',
  styleUrls: ['./immunization-details.component.css']
})
export class ImmunizationDetailsComponent implements OnInit {
  filterModel: ImmunizationFilterModel = new ImmunizationFilterModel;
  serviceData: ImmunizationModel[] = [];
  metaData: any;
  searchText: string = "";
  formGroup!: FormGroup;
  displayedColumns: Array<any> = [
    {
      displayName: "vaccineName",
      key: "vaccineName",
      isSort: true,
      class: "",
    },
    {
      displayName: "vaccineStatus",
      key: "vaccineStatus",
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

  constructor(private dialogService: DialogService,private notifier: NotifierService,private masterServiceDialogModal: MatDialog,private formBuilder: FormBuilder,private ImmunizationService: ImmunizationserviceService) { }

  ngOnInit() {
    this.filterModel = new ImmunizationFilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.getImmunizationList();
  }
  getImmunizationList() {
    this.ImmunizationService.getAll(this.filterModel).subscribe((response: any) => {
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
    this.filterModel.SearchText = searchText;
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
      this.getImmunizationList();
  }
  createModal(serviceModal:ImmunizationModel) {
    let ServiceModal;
   ServiceModal = this.masterServiceDialogModal
 .open(CreateImmunizationDetailsComponent, { hasBackdrop: true, data: serviceModal })
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
          .confirm(`Are you sure you want to delete this Immunization?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.ImmunizationService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getImmunizationList();
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
      this.ImmunizationService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new ImmunizationModel());

  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.SearchText
    );
    this.getImmunizationList();
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getImmunizationList();
  }
}
