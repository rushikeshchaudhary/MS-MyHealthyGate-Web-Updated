import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';import { format } from "date-fns";
import { SelectionModel } from "@angular/cdk/collections";
import {
  PrescriptionModel,
  PrescriptionDownloadModel,
} from "../prescription.model";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { ClientsService } from "../../clients.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { PrescriptionModalComponent } from "../prescription-modal/prescription-modal.component";
import { PrescriptionFaxModalComponent } from "../prescription-fax-modal/prescription-fax-modal.component";
import { PharmacyDialogComponent } from "src/app/platform/modules/client-portal/pharmacy-dialog/pharmacy-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { debounce, debounceTime, distinctUntilChanged, filter, mergeMap, switchMap, tap } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, observable, of, timer } from "rxjs";

@Component({
  selector: "app-add-prescription",
  templateUrl: "./prescription-addprescription.component.html",
  styleUrls: ["./prescription-addprescription.component.css"],
})
export class AddPrescriptionComponent implements OnInit {
  allergyData: PrescriptionModel[] = [];
  prescriptionListingData: PrescriptionModel[] = [];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel = new FilterModel;
  metaData: any;
  stringprescriptionIds!: string;
  actionButtons: Array<any> = [];
  clientId!: number;
  addPermission: boolean = false;
  header: string = "Client Prescription";
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  public prescriptionIds: string[] = [];
  displayedColumns: string[] = [
    "select",
    "prescriptionNo",
    // "drugName",
    // "strength",
    // "directions",
    // "startDate",
    // "endDate",
    "creatorName",
    "createdDate",
    "drugNames",
    "actions",
  ];
  @Input("showbuttons") showbuttons = true;
  @Input() encryptedPatientId:any;
  @Input() appointmentId: number = 0;
  testFormGroup!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private clientsService: ClientsService,
    public activityModal: MatDialog,
    private dialogService: DialogService,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.metaData = {};
  }

  //on inital load
  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe((params) => {
    /// this.clientId =
    // params.id == undefined
    // ? null
    //: this.commonService.encryptValue(params.id, false); //
    // });
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });

    

    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
      });
    } else {
      debugger
      let encryptedValue: string = this.commonService.encryptValue(this.encryptedPatientId, false);


      this.clientId = parseInt(encryptedValue, 10);
    }
    
    this.filterModel = new FilterModel();
    
    
    
    this.testFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000):timer(0)),
      switchMap(searchTerm => this.searchapi())
    ).subscribe();
    
    this.getPrescriptionList(this.filterModel);
    this.getUserPermissions();
  }
  
  searchapi(): Observable<any> {
    this.getPrescriptionList(this.filterModel);
    return of(null);
  }

  get f() {
    return this.testFormGroup.controls;
  }
  
  //listing of allergies
  getPrescriptionList(filterModel:any) {
    debugger
    this.filterModel.fromDate = this.formatDate(
      this.f["rangeStartDate"].value
    );
    this.filterModel.toDate = this.formatDate(
      this.f["rangeEndDate"].value
    );
    this.filterModel.searchText =
      this.f["searchKey"].value == null ? "" : this.f["searchKey"].value;
    this.clientsService
      .getPrescriptionList(this.clientId, this.filterModel, this.appointmentId)
      .subscribe((response: any) => {
        debugger
        console.log(response, "getPrescriptionList");
        if (response.statusCode === 200) {
          this.prescriptionListingData = response.data;
          this.dataSource.data = this.prescriptionListingData;
          this.prescriptionListingData = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, 'dd/MM/yyyy');
              // obj.startDate != null
              //   ? (obj.startDate = format(obj.startDate, 'dd/MM/yyyy'))
              //   : null;
              // obj.endDate != null
              //   ? (obj.endDate = format(obj.endDate, 'dd/MM/yyyy'))
              //   : null;
              // obj.status = obj.isActive ? "ACTIVE" : "INACTIVE";
              // return obj;
            }
          );
          this.metaData = response.meta || {};
        } else {
          this.prescriptionListingData = [];
          this.dataSource.data=[];
          this.metaData = {};
        }
      });
  }
  formatDate(date: Date): string {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  }

  //page load and sorting
  onPageOrSortChange(changeState?: any) {
   // changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      "",
      "",
      this.filterModel.searchText
    );
    this.getPrescriptionList(this.filterModel);
  }

  sharePrescriptionToPharmacy() {
    debugger
    if (this.prescriptionIds.length == 0) {
      this.notifier.notify("error", "Please select atleast one medicine");
    } else {
      const dialog = this.activityModal.open(PharmacyDialogComponent, {
        width: "150px",
        data: {
          prescriptionId: this.prescriptionIds,
          patientId: this.clientId,
        },
      });
    }
  }

  //table action
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.deleteDetails(id, this.clientId);
        break;
      case "DOWNLOAD":
        this.DownloadPrescription();
        break;
      case "FAX":
        this.openfaxDialog(id);
        break;
      default:
        break;
    }
  }

  //open popup
  openDialog(id?: any) {
    debugger
    if (id != null) {
      this.clientsService.getPrescriptionById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.allergyData = response.data;
          if (this.allergyData != null && this.allergyData.length > 0) {
            this.createditModel(this.allergyData);
          }

        }
      });
    } else {
      this.allergyData = new Array<PrescriptionModel>();

      this.createModel(this.allergyData);
    }
  }

  //create modal
  createModel(allergyData: PrescriptionModel[]) {
    let allergydata = new PrescriptionModel();
    allergydata.patientId = this.clientId;
    allergydata.appointmentId = this.appointmentId;
    allergyData.push(allergydata);
    const modalPopup = this.activityModal.open(PrescriptionModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        this.getPrescriptionList(this.filterModel);
      }
    });
  }

  createditModel(allergyData: PrescriptionModel[]) {

    // allergyData[0].patientId = this.clientId;
    // allergyData[0].appointmentId = this.appointmentId;
    const modalPopup = this.activityModal.open(PrescriptionModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        this.getPrescriptionList(this.filterModel);
      }
    });
  }
  refreshGrid() {
    this.getPrescriptionList(this.filterModel);
  }
  deleteDetails(id: any, clientId: number) {


    this.dialogService
      .confirm("Are you sure you want to delete this prescription?")
      .subscribe((result: any) => {
        if (result == true) {
          debugger
          this.clientsService
            .deletePrescription(id, clientId)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                this.notifier.notify("success", response.message);
                this.getPrescriptionList(this.filterModel);
              } else if (response.statusCode === 401) {
                this.notifier.notify("warning", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
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

  getUserPermissions() {
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_ALLERGIES_LIST"
      );
    const {
      CLIENT_ALLERGIES_LIST_ADD,
      CLIENT_ALLERGIES_LIST_UPDATE,
      CLIENT_ALLERGIES_LIST_DELETE,
    } = actionPermissions;
    if (!CLIENT_ALLERGIES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "edit"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }
    if (!CLIENT_ALLERGIES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "delete"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }

    this.addPermission = CLIENT_ALLERGIES_LIST_ADD || false;
    this.addPermission = true;
  }

  DownloadPrescription() {
    if (this.stringprescriptionIds) {
      this.prescriptiondownloadmodel.PrescriptionId =
        this.stringprescriptionIds;
      this.prescriptiondownloadmodel.patientId = this.clientId;
      this.prescriptiondownloadmodel.Issentprescription = false;
      this.prescriptiondownloadmodel.IsMedicationDownload = false;
      this.clientsService
        .DownloadPrescription(this.prescriptiondownloadmodel)
        .subscribe((response: any) => {
          const files = Array.isArray(response) ? response : [response];
          files.forEach(file => {
            const byteArray = new Uint8Array(atob(file.fileContent).split("").map(char => char.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: 'application/pdf' });
             const nav = window.navigator as any;
          this.clientsService.downLoadFile(
            blob,
            "application/pdf",
            `PrescriptionReport`
          );
          })
        });
    } else {
      this.notifier.notify("warning", "Please select Medication");
    }
  }

  //open popup
  openfaxDialog(id?: number) {
    if (this.stringprescriptionIds) {
      if (id != null && id > 0) {
        this.clientsService
          .getPrescriptionById(id)
          .subscribe((response: any) => {
            if (response != null && response.data != null) {
              this.allergyData = response.data;
              this.createFaxModel(this.allergyData);
            }
          });
      } else {
        this.allergyData = new Array<PrescriptionModel>();

        this.createFaxModel(this.allergyData);
      }
    } else {
      this.notifier.notify("warning", "Please select Medication");
    }
  }

  //create modal
  createFaxModel(allergyData: PrescriptionModel[]) {
    let allergydata = new PrescriptionModel();
    allergydata.patientId = this.clientId;
   // allergydata.appointmentId = this.appointmentId;
    debugger
    allergydata.PrescriptionId = this.stringprescriptionIds;
    allergydata.Issentprescription = false;
    allergyData.push(allergydata);
   
    const modalPopup = this.activityModal.open(PrescriptionFaxModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) },
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        //this.getPrescriptionList(this.filterModel);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggle(event: { checked: any; }, row: { prescriptionNo: any; }) {
    let name = row.prescriptionNo;

    if (event.checked) {
      if (this.prescriptionIds.indexOf(name) === -1) {
        this.prescriptionIds.push(name);
        this.selection.select(row);
      }
    } else {
      const index = this.prescriptionIds.indexOf(name);
      if (index > -1) {
        this.prescriptionIds.splice(index, 1);
        this.selection.deselect(row);
      }
    }

    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => {
        this.selection.select(row);
      });

    this.prescriptionIds = [];
    this.dataSource.data.forEach((row) => {
      if (this.selection.isSelected(row)) {
        this.prescriptionIds.push(row.prescriptionNo);
      }
    });
    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }


  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    const endDate = event.value;
    this.f["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getPrescriptionList(this.filterModel);
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    this.f["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getPrescriptionList(this.filterModel);
  }

  clearFilters(): void {
    this.testFormGroup.reset({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });
    this.getPrescriptionList(this.filterModel);
  }
}
