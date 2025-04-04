import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ImmunizationModel } from "./immunization.model";
import { ClientsService } from "../clients.service";
import { ResponseModel } from "../../../core/modals/common-model";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ImmunizationModalComponent } from "./immunization-modal/immunization-modal.component";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { CommonService } from "../../../core/services";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { FilterModel } from "../medication/medication.model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-immunization",
  templateUrl: "./immunization.component.html",
  styleUrls: ["./immunization.component.css"],
})
export class ImmunizationComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @Input() appointmentId: number = 0;
  clientId!: number;
  immunizationModel: ImmunizationModel = new ImmunizationModel;
  immunizationList: Array<ImmunizationModel> = [];
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;
  header: string = "Client Immunization";
  tooltipdMessage = "Maximum 7 immunization are allowed";
  maxAllowedLimit = 7;
  testFormGroup!: FormGroup;
  filterModel:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    private immunizationService: DialogService,
    private immunizationDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private translate:TranslateService,
  ) { 
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  //inital loading
  ngOnInit() {
    this.filterModel=new FilterModel();
    this.filterModel.pageSize=100000;
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
      });
    } else {
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.clientId =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);
    // });

    //on initial page load call listing of immunization
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: ""
    })
    this.setIntialValues();
    this.getImmunizationList();
    this.getUserPermissions();
  }

  get f() {
    return this.testFormGroup.controls;
  }
  setIntialValues() {
    var date = new Date();
    // this.f.rangeStartDate.setValue(
    //   new Date(date.getFullYear(), date.getMonth() - 1, 1)
    // );
    // this.f.rangeEndDate.setValue(
    //   new Date(date.getFullYear(), date.getMonth(), 0)
    // );
    // this.f.rangeStartDate.setValue(
    //   new Date(date.getFullYear(), date.getMonth() - 1, 1)
    // );
    // this.f.rangeEndDate.setValue(
    //   new Date(date.getFullYear(), date.getMonth(), 0)
    // );
    this.f["searchKey"].setValue("");
   this.f["rangeStartDate"].setValue("");
   this.f["rangeEndDate"].setValue("");
  }
  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeStartDate"].setValue(event.value ? new Date(event.value) : null);
    this.getImmunizationList();
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeEndDate"].setValue(event.value ? new Date(event.value) : null);
    this.getImmunizationList();
  }

  //listing of immunization
  getImmunizationList() {
    let fromDate = this.f["rangeStartDate"].value != null && this.f["rangeStartDate"].value != ""
      ? this.datePipe.transform(new Date(this.f["rangeStartDate"].value), 'MM/dd/yyyy')
      : "";
    let toDate = this.f["rangeEndDate"].value != null && this.f["rangeEndDate"].value != ""
      ? this.datePipe.transform(new Date(this.f["rangeEndDate"].value), 'MM/dd/yyyy')
      : "";
    let searchKey = this.f["searchKey"].value == null ? '' : this.f["searchKey"].value;

    this.clientsService
      .getImmunizationList(this.filterModel,this.clientId, this.appointmentId, searchKey, fromDate, toDate)
      .subscribe((response: ResponseModel) => {
        ////debugger
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.immunizationList = response.data;
        } else {
          this.immunizationList;
        }
      });
  }

  //open popup and map model on popup
  openDialog(data?: any) {
    console.log(data);

    if (data != null) {
      // this.clientsService.getImmunizationById(id).subscribe((response: any) => {
      //   if (response != null && response.data != null) {
      //     this.immunizationModel = response.data;
      //     this.createModal(this.immunizationModel);
      //   }
      // });
      this.createModal(data);
    } else {
      this.immunizationModel = new ImmunizationModel();
      this.immunizationModel.id=0;
      this.immunizationModel.patientID = this.clientId;
      this.createModal(this.immunizationModel);
    }
  }

  //create modal popup of immunization for create or update
  createModal(immunizatioModel: ImmunizationModel) {
    //this.immunizationModel.patientID = this.clientId;
   // this.immunizationModel.appointmentId = this.appointmentId;
   // this.immunizationModel.id=immunizatioModel.id;
    let immunizationModal;
    immunizationModal = this.immunizationDialogModal.open(
      ImmunizationModalComponent,
      {
        data: {
          immunization: immunizatioModel,
          refreshGrid: this.getImmunizationList.bind(this),
        },
      }
    );
    immunizationModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        this.getImmunizationList();
      }
    });
  }
  refreshGrid() {
    this.getImmunizationList();
  }

  //delete immunization
  deleteImmunization(id: number) {
    this.immunizationService
      .confirm("Are you sure you want to delete this immunization?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService
            .deleteImmunization(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifier.notify("success", response.message);
                  this.getImmunizationList();
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }

  getUserPermissions() {
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_IMMUNIZATION_LIST"
      );
    const {
      CLIENT_IMMUNIZATION_LIST_ADD,
      CLIENT_IMMUNIZATION_LIST_UPDATE,
      CLIENT_IMMUNIZATION_LIST_DELETE,
    } = actionPermissions;

    this.addPermission = CLIENT_IMMUNIZATION_LIST_ADD || false;
    this.updatePermission = CLIENT_IMMUNIZATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_IMMUNIZATION_LIST_DELETE || false;
  }
  disableButton() {
    return (
      this.immunizationList &&
      this.immunizationList.length > this.maxAllowedLimit
    );
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.getImmunizationList();
  }
}
