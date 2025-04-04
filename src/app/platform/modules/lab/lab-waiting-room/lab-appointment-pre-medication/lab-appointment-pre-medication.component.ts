import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ClientsService } from '../../../agency-portal/clients/clients.service';
import { MedicationModel } from '../../../agency-portal/clients/medication/medication.model';
import { AddPrescriptionComponent } from '../../../agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';
import { MedicationModalComponent } from '../../../waiting-room/medication/medication-modal/medication-modal.component';
import { LabService } from '../../lab.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-lab-appointment-pre-medication',
  templateUrl: './lab-appointment-pre-medication.component.html',
  styleUrls: ['./lab-appointment-pre-medication.component.css']
})
export class LabAppointmentPreMedicationComponent implements OnInit {
  filterModel: FilterModel = new FilterModel;
  medicationModel: MedicationModel = new MedicationModel;
  medicationList: Array<MedicationModel> = [];
  clientId!: number;
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;
  header: string = "Client Medication";
  tooltipdMessage = "Maximum 7 medications are allowed";
  maxAllowedLimit = 7;
  isHistoryShareable: boolean = false;
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  labAppointmentDetails:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    private dialogService: DialogService,
    private medicationDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private cfr: ComponentFactoryResolver,
    private labService:LabService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.labAppointmentDetails = this.labService.getLabAppointmentDetails();
    console.log(this.labAppointmentDetails)
   }

  ngOnInit() {
    this.medicationModel = new MedicationModel();
    this.medicationList = [];

    this.getAppointmentDetails();
    this.getMedicationList();
    this.getUserPermissions();
  }
  getAppointmentDetails() {
    this.commonService.loadingStateSubject.next(true);
    this.clientsService
      .getClientProfileInfo(this.labAppointmentDetails.data.patientID)
      .subscribe((responce) => {
        this.isHistoryShareable =
          responce.data.patientInfo[0].isHistoryShareable;
        this.commonService.loadingStateSubject.next(false);
      });
  }
  showPrescription() {
    let factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    this.tabContent.clear();
    let comp: ComponentRef<AddPrescriptionComponent> =
      this.tabContent.createComponent(factory);
    comp.instance.showbuttons = false;
  }

  getMedicationList() {
    this.clientsService
      .getMedicationList(this.labAppointmentDetails.data.patientID,this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0 &&
          response.statusCode == 200
        ) {
          this.medicationList = response.data;
          this.medicationList = (response.data || []).map((obj: any) => {
            obj.startDate = format(obj.startDate, 'dd/MM/yyyy');
            obj.endDate = format(obj.endDate, 'dd/MM/yyyy');
            return obj;
          });
        } else {
          this.medicationList;
        }
      });
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getmedicationById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.medicationModel = response.data;
          this.createModal(this.medicationModel);
        }
      });
    } else {
      this.medicationModel = new MedicationModel();
      this.createModal(this.medicationModel);
    }
  }

  createModal(medicationModel: MedicationModel) {
    this.medicationModel.patientId = this.clientId;
    let medicationModal;
    medicationModal = this.medicationDialogModal.open(
      MedicationModalComponent,
      {
        data: {
          medication: this.medicationModel,
          refreshGrid: this.refreshGrid.bind(this),
        },
      }
    );
    medicationModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") this.getMedicationList();
    });
  }
  refreshGrid() {
    this.getMedicationList();
  }
  delete(id: number,patientId:number) {
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService
            .deleteMedication(id,patientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifier.notify("success", response.message);
                  this.getMedicationList();
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
        "CLIENT_MEDICATION_LIST"
      );
    const {
      CLIENT_MEDICATION_LIST_ADD,
      CLIENT_MEDICATION_LIST_UPDATE,
      CLIENT_MEDICATION_LIST_DELETE,
    } = actionPermissions;

    this.addPermission = CLIENT_MEDICATION_LIST_ADD || false;
    this.updatePermission = CLIENT_MEDICATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_MEDICATION_LIST_DELETE || false;
  }

  disableButton() {
    return (
      this.medicationList && this.medicationList.length > this.maxAllowedLimit
    );
  }
}
