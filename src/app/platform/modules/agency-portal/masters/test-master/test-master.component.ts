import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FilterModel } from '../../clients/medication/medication.model';
import { CreateTestMasterdataComponent } from '../create-test-masterdata/create-test-masterdata.component';
import { TestMasterModule } from '../create-test-masterdata/Test-masterModule';
import { TestmasterserviceService } from '../create-test-masterdata/testmasterservice.service';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-test-master',
  templateUrl: './test-master.component.html',
  styleUrls: ['./test-master.component.css']
})
export class TestMasterComponent implements OnInit {
  searchText: string = "";
  metaData: any;
  serviceData: TestMasterModule[] = [];
  filterModel: FilterModel = new FilterModel;
  formGroup!: FormGroup;
  selectedRole: string = 'radiology';

  displayedColumns: Array<any> = [
    {
      displayName: "Test Name",
      key: "testName",
      isSort: true,
      class: "",
    },
    {
      displayName: "Cost",
      key: "cost",
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

  additionalColumns: Array<any> = [
    {
      displayName: "LIMS Code",
      key: "limsCode",
      isSort: true,
      class: "",
    },
    {
      displayName: "LOINC Code",
      key: "loincCode",
      isSort: true,
      class: "",
    },
    {
      displayName: "Short Name",
      key: "shortName",
      isSort: true,
      class: "",
    },
    {
      displayName: "CPT",
      key: "cpt",
      isSort: true,
      class: "",
    },
    {
      displayName: "Jordan Code",
      key: "jordanianCode",
      isSort: true,
      class: "",
    }
  ];

  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" },
  ];
 
  constructor(
    private TestmasterserviceService: TestmasterserviceService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private masterServiceDialogModal: MatDialog
  ) {}

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""],
    });
    this.getTestmasterdata();
  }

  getTestmasterdata() {
    this.displayedColumns = [
      {
        displayName: "Test Name",
        key: "testName",
        isSort: true,
        class: "",
      },
      {
        displayName: "Cost",
        key: "cost",
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
    this.actionButtons= [
      { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
      { displayName: "Delete", key: "delete", class: "fa fa-times" },
    ];

    if (this.selectedRole === 'lab') {
      this.filterModel.roleId = 325;
      this.displayedColumns = [
        ...this.displayedColumns.slice(0, 3), 
        ...this.additionalColumns, 
        ...this.displayedColumns.slice(3) 
      ];
    } else if (this.selectedRole === 'radiology') {
      this.filterModel.roleId = 329;
    } else {
      this.filterModel.roleId =329 ;
    }

    this.TestmasterserviceService.getAll(this.filterModel).subscribe((response: any) => {
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
  
  onRoleChange($event: any) {
    this.selectedRole = $event.value;
    this.getTestmasterdata();
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
      this.getTestmasterdata();
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

  clearFilters() {
    this.searchText = "";
    this.selectedRole = "radiology";
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      ""
    );
    this.getTestmasterdata();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.testID;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete this Lab ?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.TestmasterserviceService.delete(id).subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message);
                  this.getTestmasterdata();
                } else if (response.statusCode === 401) {
                  this.notifier.notify('warning', response.message);
                } else {
                  this.notifier.notify('error', response.message);
                }
              }, error => {
                this.notifier.notify('error', error);
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
      this.TestmasterserviceService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else {
      this.createModal(new TestMasterModule());
    }
  }

  createModal(serviceModal: TestMasterModule) {
  
    let data={
      serviceModal: serviceModal,
      selectedRole: this.selectedRole,
      roleId: this.filterModel.roleId
    }

    this.masterServiceDialogModal
      .open(CreateTestMasterdataComponent, { hasBackdrop: true, data })
      .afterClosed()
      .subscribe((result) => {
        if (result === "Save") this.getTestmasterdata();
      });
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getTestmasterdata();
  }
}
