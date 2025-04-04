import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from "../../../shared/shared.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { NgxMaskModule } from "ngx-mask";
import { ContextMenuModule } from "ngx-contextmenu";
import { WaitingRoomRoutingModule } from "./waiting-room.routing.module";
import { WaitingRoomContainerComponent } from "./waiting-room-container.component";
import { SchedulerMaterialModule } from "../scheduling/scheduler.material.module";
import { AssessmentAppointmentComponent } from "./assessment-appointment/assessment-appointment.component";
import { PlatformMaterialModule } from "../../platform.material.module";
import { PatientDocumentsComponent } from "./patient-documents/patient-documents.component";
import { VitalsComponent } from "../client-portal/vitals/vitals.component";
import { VitalsListComponent } from "./vitals-list/vitals-list.component";
//import { MedicationComponent } from './medication/medication.component';
import { VitalModalComponent } from "../agency-portal/clients/vitals/vital-modal/vital-modal.component";
import { AddPrescriptionComponent } from "../agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component";
//import { MedicationModalComponent } from '../agency-portal/clients/medication/medication-modal/medication-modal.component';
import { VitalsModalComponent } from "./vitals-list/vitals-modal/vitals-modal.component";
import { MedicationModalComponent } from "./medication/medication-modal/medication-modal.component";
import { CheckInCallComponent } from "./check-in/check-in-call.component";
import { SoapComponent } from "../agency-portal/encounter/soap/soap.component";
import { EncounterModule } from "../agency-portal/encounter/encounter.module";
import { SchedulingModule } from "../scheduling/scheduling.module";
import { MedicationComponent } from "../agency-portal/clients/medication/medication.component";
import { MedicationListComponent } from "./medication/medication-list/medication-list.component";
import { PatientDocModalComponent } from "./patient-documents/patient-doc-modal/patient-doc-modal.component";
import { PermissionComponent } from "./permission/permission.component";
import { ClientsModule } from "../agency-portal/clients/clients.module";

@NgModule({
  imports: [
    WaitingRoomRoutingModule,
    CommonModule,
    FormsModule,
    EncounterModule,
    SchedulingModule,
    ClientsModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    //[NgxMaterialTimepickerModule.forRoot()],
    SharedModule,
    SchedulerMaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    [NgxMaskModule.forRoot()],
    PlatformMaterialModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [
    WaitingRoomContainerComponent,
    PatientDocModalComponent,
    AssessmentAppointmentComponent,
    PermissionComponent,
    PatientDocumentsComponent,
    VitalsListComponent,
    MedicationListComponent,
    VitalsModalComponent,
    MedicationModalComponent,
    CheckInCallComponent,
  ],
  // entryComponents: [
  //   VitalsModalComponent,
  //   MedicationModalComponent,
  //   PatientDocModalComponent,
  // ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: false,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%",
      },
    },
  ],
})
export class WaitingRoomModule { }
