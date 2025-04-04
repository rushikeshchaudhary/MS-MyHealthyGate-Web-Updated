import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { DiagnosisModel } from "./diagnosis.model";
import { ClientsService } from "../clients.service";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../../core/modals/common-model";
import { MatDialog } from "@angular/material/dialog";
import { DiagnosisModalComponent } from "./diagnosis-modal/diagnosis-modal.component";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../core/services";

@Component({
  selector: "app-diagnosis",
  templateUrl: "./diagnosis.component.html",
  styleUrls: ["./diagnosis.component.css"]
})
export class DiagnosisComponent implements OnInit {
  @Input("clientID") clientID!: ElementRef;
  clientId!: number;
  header: string = "Client Diagnosis";
  diagnosisModel: DiagnosisModel = new DiagnosisModel;
  diagnosisList: Array<DiagnosisModel> = [];
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;

  tooltipdMessage="Maximum 7 diagnosis are allowed";
  maxAllowedLimit=7;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private diagnosisDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId =
        params["id"] == undefined
          ? null
          : this.commonService.encryptValue(params["id"], false);
    });
    this.getDiagnosisList();
    this.getUserPermissions();
  }

  getDiagnosisList() {
    this.clientsService
      .getDiagnosisList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.diagnosisList = response.data;
        }
      });
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getDiagnosisById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.diagnosisModel = response.data;
          this.createModal(this.diagnosisModel);
        }
      });
    } else {
      this.diagnosisModel = new DiagnosisModel();
      this.createModal(this.diagnosisModel);
    }
  }

  createModal(diagnosisModel: DiagnosisModel) {
    this.diagnosisModel.patientID = this.clientId;
    let diagnosisModal;
    diagnosisModal = this.diagnosisDialogModal.open(DiagnosisModalComponent, {
      data: {
        diagnosis: diagnosisModel,
        refreshGrid: this.refreshGrid.bind(this)
      }
    });
    diagnosisModal.afterClosed().subscribe((result: string) => {
      if (result == "save") this.getDiagnosisList();
    });
  }
  refreshGrid() {
    this.getDiagnosisList();
  }

  delete(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this diagnosis?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService.deleteDiagnosis(id).subscribe((response: any) => {
            if (response != null && response.data != null) {
              if (response.statusCode == 200) {
                this.notifier.notify("success", response.message);
                this.getDiagnosisList();
              } else {
                this.notifier.notify("error", response.message);
              }
            }
          });
        }
      });
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions(
      "CLIENT",
      "CLIENT_DIAGNOSIS_LIST"
    );
    const {
      CLIENT_DIAGNOSIS_LIST_ADD,
      CLIENT_DIAGNOSIS_LIST_UPDATE,
      CLIENT_DIAGNOSIS_LIST_DELETE
    } = actionPermissions;

    this.addPermission = CLIENT_DIAGNOSIS_LIST_ADD || false;
    this.updatePermission = CLIENT_DIAGNOSIS_LIST_UPDATE || false;
    this.deletePermission = CLIENT_DIAGNOSIS_LIST_DELETE || false;
  }
  disableButton() {
    return this.diagnosisList && this.diagnosisList.length > this.maxAllowedLimit;
  }
}
