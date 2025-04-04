import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { FilterModel } from '../../clients/medication/medication.model';
import { CreateDrugPresciptionComponent } from '../create-drug-presciption/create-drug-presciption.component';
import { DrugPrescriptionServiceService } from '../create-drug-presciption/drug-prescription-service.service';
import { drugprscriptionmodel } from '../create-drug-presciption/Drugprescription-model';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-prescription-drug-details',
  templateUrl: './prescription-drug-details.component.html',
  styleUrls: ['./prescription-drug-details.component.css']
})
export class PrescriptionDrugDetailsComponent implements OnInit {
  filterModel: FilterModel = new FilterModel;
  serviceData: drugprscriptionmodel[] = [];
  metaData: any;
  searchText: string = "";
  formGroup!: FormGroup;
  displayedColumns: Array<any> = [
    {
      displayName: "DrugName",
      key: "drugName",
      isSort: true,
      class: "",
    },
    {
      displayName: "Strength",
      key: "strength",
      isSort: true,
      class: "",
     // type: ["Active", "Inactive"],
    },
    {
      displayName: "Dose",
      key: "dose",
      isSort: true,
      class: "",
    },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];
  isActive: boolean = false;


  constructor(private dialogService: DialogService,private notifier: NotifierService,private masterServiceDialogModal: MatDialog,private formBuilder: FormBuilder,private DrugPrescriptionService: DrugPrescriptionServiceService) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.statusChangeHandler(1);
   // this.getPrescriptionDrugList();
  }

  statusChangeHandler = (e:any) => {
    this.isActive = e == 1 ? true : e;
    if (e == true) {
      this.isActive = true;
      this.applyFilter();
    } else if (e == false) {
      this.isActive = false;
      this.applyFilter();
    }
  }
  getPrescriptionDrugList() {
    this.DrugPrescriptionService.getAll(this.filterModel, this.isActive).subscribe((response: any) => {
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
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3 || this.isActive!==null)
      this.getPrescriptionDrugList();
  }
  createModal(serviceModal:drugprscriptionmodel) {
    let ServiceModal;
   ServiceModal = this.masterServiceDialogModal
 .open(CreateDrugPresciptionComponent, { hasBackdrop: true, data: serviceModal })
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
          .confirm(`Are you sure you want to delete this Prescription Drugs?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.DrugPrescriptionService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getPrescriptionDrugList();
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
      this.DrugPrescriptionService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new drugprscriptionmodel());

  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getPrescriptionDrugList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getPrescriptionDrugList();
  }
}
