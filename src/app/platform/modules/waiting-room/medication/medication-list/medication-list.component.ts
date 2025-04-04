//import { ClientsService } from '../../agency-portal/clients/clients.service';
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
//import { ResponseModel } from '../../core/modals/common-model';
//import { CommonService } from '../../core/services';
//import { AddPrescriptionComponent } from '../../agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component';
//import { MedicationModalComponent } from './medication-modal/medication-modal.component';
//import { MedicationModel } from '../../agency-portal/clients/medication/medication.model';
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { ClientsService } from "../../../agency-portal/clients/clients.service";
import { FilterModel, ResponseModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { AddPrescriptionComponent } from "../../../agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component";
import { MedicationModalComponent } from "../medication-modal/medication-modal.component";
import { MedicationModel } from "../../../agency-portal/clients/medication/medication.model";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";

@Component({
  selector: "app-medication-list",
  templateUrl: "./medication-list.component.html",
  styleUrls: ["./medication-list.component.css"],
})
export class MedicationListComponent implements OnInit {
  medicationModel: MedicationModel = new MedicationModel;
  medicationList: Array<MedicationModel> = [];
  clientId!: number;
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;
  header: string = "Client Medication";
  tooltipdMessage = "Maximum 7 medications are allowed";
  maxAllowedLimit = 7;
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  isPatient: boolean = false;
  patientId: number = 0;
  isHistoryShareable: boolean = true;
  appointmentId!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private schedular: SchedulerService,
    private clientsService: ClientsService,
    private dialogService: DialogService,
    private medicationDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private cfr: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const apptId = Number(this.activatedRoute.snapshot.paramMap.get("id"));
    this.appointmentId = Number(apptId);


    this.getAppointmentDetails();


    if (apptId != null) {
      this.patientId = Number(this.getClient(Number(apptId)));
    }
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.clientId = user.userID;
        //initialization of model
        this.medicationModel = new MedicationModel();
        this.medicationList = [];
        //this.getUserPermissions();
        // this.showPrescription();
      }
    });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.isPatient = true;
        }
      }
    });

  }

  getAppointmentDetails() {
    this.schedular
      .getAppointmentDetails(this.appointmentId)
      .subscribe((responce) => {
        this.isHistoryShareable = responce.data.isHistoryShareable;
      });
  }


  getClient(id: number) {
    if (id != null && id > 0) {
      this.clientsService
        .getPatientWithAppointmentId(id)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.patientId = response.data.patientId;
            this.getMedicationList();
          }
        });
    }
  }
  showPrescription() {
    let factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    //if (factory != undefined) {
    this.tabContent.clear();
    let comp: ComponentRef<AddPrescriptionComponent> =
      this.tabContent.createComponent(factory);
    comp.instance.showbuttons = false;
    //}
  }

  getMedicationList() {
    this.clientsService
      .getMedicationList(this.patientId,new FilterModel())
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
    this.medicationModel.patientId = this.patientId;
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
      .confirm("Are you sure you want to delete this medication?")
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
