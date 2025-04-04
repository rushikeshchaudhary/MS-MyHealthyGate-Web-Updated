import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { FilterModel } from '../../clients/medication/medication.model';
import { CreateMastersecurityquestionComponent } from '../create-mastersecurityquestion/create-mastersecurityquestion.component';
import { SecurityQuestionModel } from './securityquestion-model';
import { SecurityquestionmasterService } from './securityquestionmaster.service';

@Component({
  selector: 'app-master-securityquestions',
  templateUrl: './master-securityquestions.component.html',
  styleUrls: ['./master-securityquestions.component.css']
})
export class MasterSecurityquestionsComponent implements OnInit {
  filterModel!: FilterModel;
  formGroup!: FormGroup;
  metaData: any;
  searchText: string = "";
  serviceData!: SecurityQuestionModel[];
  addPermission!: boolean;
  displayedColumns: Array<any> = [
    {
      displayName: "Question",
      key: "question",
      isSort: true,
      class: "",
    },
    {
      displayName: "Status",
      key: "isActive",
      isSort: true,
      class: "",
      type: ["Active", "Inactive"],
    },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];
  constructor( private masterServiceDialogModal: MatDialog,
    private masterService: SecurityquestionmasterService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.getSecurityQuestion();
  }
  get formControls() {
    return this.formGroup.controls;
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
    this.getSecurityQuestion();
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

  getSecurityQuestion() {
    this.masterService.getAll(this.filterModel).subscribe((response: any) => {
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
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete this master service?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.masterService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getSecurityQuestion();
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
      this.masterService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new SecurityQuestionModel());
  }
  createModal(serviceModel: SecurityQuestionModel) {
    let ServiceModal;
    ServiceModal = this.masterServiceDialogModal
      .open(CreateMastersecurityquestionComponent, { hasBackdrop: true, data: serviceModel })
      .afterClosed()
      .subscribe((result) => {
        if (result === "Save") this.getSecurityQuestion();
      });
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
      this.getSecurityQuestion();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getSecurityQuestion();
  }

}
