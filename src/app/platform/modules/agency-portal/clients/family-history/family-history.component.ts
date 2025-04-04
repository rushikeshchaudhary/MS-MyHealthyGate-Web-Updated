import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { ClientsService } from "../clients.service";
import { MatDialog } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../../core/modals/common-model";
import { PatientMedicalFamilyHistoryModel } from "./family-history.model";
import { FamilyHistoryModelComponent } from "./family-history-model/family-history-model.component";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../core/services";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-family-history",
  templateUrl: "./family-history.component.html",
  styleUrls: ["./family-history.component.css"],
})
export class FamilyHistoryComponent implements OnInit {
  @Input() clientId!: number;
  @Input() appointmentId: number = 0;

  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();

  header: string = "Family History";
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  patientMedicalFamilyHistoryList: Array<PatientMedicalFamilyHistoryModel> = [];
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;
  tooltipdMessage = "Maximum 7 members are allowed";
  maxAllowedLimit = 7;
  isHistoryShareable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private patientMedicalFamilyHistoryDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.patientMedicalFamilyHistoryModel =
      new PatientMedicalFamilyHistoryModel();
  }

  ngOnInit() {
    console.log(this.clientId);
    this.commonService.loadingStateSubject.next(true);
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.clientId =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);
    // });
    this.getAppointmentDetails();
    this.getPatientMedicalFamilyHistoryList();
    this.getUserPermissions();
    this.commonService.loadingStateSubject.next(false);
  }
  getAppointmentDetails() {
    this.commonService.loadingStateSubject.next(true);
    this.clientsService
      .getClientProfileInfo(this.clientId)
      .subscribe((responce) => {
        this.isHistoryShareable =
          responce.data.patientInfo[0].isHistoryShareable;
        this.commonService.loadingStateSubject.next(false);
      });
  }

  getPatientMedicalFamilyHistoryList() {
    this.clientsService
      .getPatientMedicalFamilyHistoryList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.patientMedicalFamilyHistoryList = response.data;
        }
      });
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService
        .getPatientMedicalFamilyHistoryById(id)
        .subscribe((response: any) => {
          if (response != null && response.data != null) {
            this.patientMedicalFamilyHistoryModel = response.data;
            this.createModal(this.patientMedicalFamilyHistoryModel);
          }
        });
    } else {
      this.patientMedicalFamilyHistoryModel =
        new PatientMedicalFamilyHistoryModel();
      this.createModal(this.patientMedicalFamilyHistoryModel);
    }
  }

  createModal(
    patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel
  ) {
    this.patientMedicalFamilyHistoryModel.patientID = this.clientId;
    let historyModal;
    historyModal = this.patientMedicalFamilyHistoryDialogModal.open(
      FamilyHistoryModelComponent,
      { data: patientMedicalFamilyHistoryModel }
    );
    historyModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") this.getPatientMedicalFamilyHistoryList();
    });
  }

  delete(id: number) {
    
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService
            .deletePatientMedicalFamilyHistory(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 204) {
                  this.notifier.notify("success", response.message);
                  this.getPatientMedicalFamilyHistoryList();
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }

  getUserPermissions() {
    // this is commented as family history is include in history page
    // const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_FAMILYHISTORY_LIST');
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_HISTORY_LIST"
      );
    const {
      CLIENT_FAMILYHISTORY_LIST_ADD,
      CLIENT_FAMILYHISTORY_LIST_UPDATE,
      CLIENT_FAMILYHISTORY_LIST_DELETE,
    } = actionPermissions;

    this.addPermission = CLIENT_FAMILYHISTORY_LIST_ADD || false;
    this.updatePermission = CLIENT_FAMILYHISTORY_LIST_UPDATE || false;
    this.deletePermission = CLIENT_FAMILYHISTORY_LIST_DELETE || false;
  }

  disableButton() {
    return (
      this.patientMedicalFamilyHistoryList &&
      this.patientMedicalFamilyHistoryList.length > this.maxAllowedLimit
    );
  }

  continue() {
    let clickType = "Continue";
    this.handleTabChange.next({
      tab: "Social History",
      id: this.clientId,
      clickType: clickType,
    });
  }
}
