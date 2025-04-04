import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LabRoutingModule } from "./lab-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LabSchedulingComponent } from "./lab-scheduling/lab-scheduling.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LabAppointmentGraphComponent } from "./lab-appointment-graph/lab-appointment-graph.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ScrollbarModule } from 'ngx-scrollbar';
import { LabDocumentComponent } from "./lab-document/lab-document.component";
import { LabDocumentModalComponent } from "./lab-document/lab-document-modal/lab-document-modal.component";
import { PlatformMaterialModule } from "../../platform.material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormioModule } from '@formio/angular';
import { LabDataTableComponent } from "./lab-appointment-graph/lab-data-table/lab-data-table.component";
import { ClientPortalModule } from "../client-portal/client-portal.module";
import { SchedulerMaterialModule } from "../scheduling/scheduler.material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { LabWaitingRoomComponent } from "./lab-waiting-room/lab-waiting-room.component";
import { LabAppointmentVitalsComponent } from "./lab-waiting-room/lab-appointment-vitals/lab-appointment-vitals.component";
import { VitalModalComponent } from "../agency-portal/clients/vitals/vital-modal/vital-modal.component";
import { MedicationModalComponent } from "../waiting-room/medication/medication-modal/medication-modal.component";
import { ClientsModule } from "../agency-portal/clients/clients.module";
import { LabProfileComponent } from "./lab-profile/lab-profile.component";
import { EditLabProfileComponent } from "./lab-profile/edit-lab-profile/edit-lab-profile.component";
import { LabAddressComponent } from "./lab-profile/edit-lab-profile/lab-address/lab-address.component";
import { LabAvaibilityComponent } from "./lab-profile/edit-lab-profile/lab-avaibility/lab-avaibility.component";
import { LabInformationComponent } from "./lab-profile/edit-lab-profile/lab-information/lab-information.component";
import { LabActionDialogBoxComponent } from "./lab-appointment-graph/lab-action-dialog-box/lab-action-dialog-box.component";
import { ViewLabAppointmentPatientComponent } from "../client-portal/manage-lab-booking/view-lab-appointment-patient/view-lab-appointment-patient.component";
import { LabAppointmentDocumentComponent } from "./lab-waiting-room/lab-appointment-document/lab-appointment-document.component";
import { LabAppointmentPreMedicationComponent } from "./lab-waiting-room/lab-appointment-pre-medication/lab-appointment-pre-medication.component";
import { AddEditLabAddressComponent } from "./lab-profile/edit-lab-profile/lab-address/add-edit-lab-address/add-edit-lab-address.component";
//      <!-- intentionally commented code for running the application -->
 import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { LabClientsComponent } from './lab-clients/lab-clients.component';
import { LabAppointmentsComponent } from './lab-appointments/lab-appointments.component';
import { UsersModule } from "../agency-portal/users/users.module";
import { LabClientsDetailsComponent } from './lab-clients/lab-clients-details/lab-clients-details.component';
import { ClientProfileComponent } from './lab-clients/lab-clients-details/client-profile/client-profile.component';
import { ClientdocumentsComponent } from './lab-clients/lab-clients-details/clientdocuments/clientdocuments.component';
import { ClientinsuanceComponent } from './lab-clients/lab-clients-details/clientinsuance/clientinsuance.component';
import { ClientpastappointmentsComponent } from './lab-clients/lab-clients-details/clientpastappointments/clientpastappointments.component';
import { LabclientheaderComponent } from './lab-clients/lab-clients-details/labclientheader/labclientheader.component';
import { LabQualificationnComponent } from './lab-profile/edit-lab-profile/lab-qualificationn/lab-qualificationn.component';
import { AddEditQualificationComponent } from './lab-profile/edit-lab-profile/lab-qualificationn/add-edit-qualification/add-edit-qualification.component';
import { LabExperienceComponent } from './lab-profile/edit-lab-profile/lab-experience/lab-experience.component';
import { LabAwardComponent } from './lab-profile/edit-lab-profile/lab-award/lab-award.component';
import { AddEditAwardComponent } from './lab-profile/edit-lab-profile/lab-award/add-edit-award/add-edit-award.component';
import { AddEditExperienceComponent } from './lab-profile/edit-lab-profile/lab-experience/add-edit-experience/add-edit-experience.component';
import { LabTestDownloadModalComponent } from "../agency-portal/lab-test-download-modal/lab-test-download-modal.component";
import { AgencyPortalModule } from "../agency-portal/agency-portal.module";

@NgModule({
  imports: [
    CommonModule,
    LabRoutingModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    SharedModule,
    ScrollbarModule,
    PlatformMaterialModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    FormioModule,
    ClientPortalModule,
    SchedulerMaterialModule,
    ClientsModule,
    //      <!-- intentionally commented code for running the application -->
    NgxMatSelectSearchModule,
    AngularEditorModule,
    NgxMaterialTimepickerModule,
    //[NgxMaterialTimepickerModule.forRoot()],
    UsersModule,
  
    AgencyPortalModule

  ],
  // entryComponents: [
  //   LabDocumentModalComponent,
  //   LabActionDialogBoxComponent,
  //   ViewLabAppointmentPatientComponent,
  //   LabAddressComponent,
  //   LabAvaibilityComponent,
  //   LabInformationComponent,
  //   AddEditLabAddressComponent,
  //   LabQualificationnComponent,
  //   AddEditQualificationComponent,  
  //   LabExperienceComponent,
  //   LabAwardComponent,
  //   AddEditAwardComponent,
  //   AddEditExperienceComponent,
  // ],
  declarations: [
    DashboardComponent,
    LabSchedulingComponent,
    LabAppointmentGraphComponent,
    LabDocumentComponent,
    LabDocumentModalComponent,
    LabDataTableComponent,
    LabActionDialogBoxComponent,
    LabWaitingRoomComponent,
    LabAppointmentDocumentComponent,
    LabAppointmentVitalsComponent,
    LabAppointmentPreMedicationComponent,
    LabProfileComponent,
    EditLabProfileComponent,
    LabAddressComponent,
    LabAvaibilityComponent,
    LabInformationComponent,
    AddEditLabAddressComponent,
    LabClientsComponent,
    LabAppointmentsComponent,
    LabClientsDetailsComponent,
    ClientProfileComponent,
    ClientdocumentsComponent,
    ClientinsuanceComponent,
    ClientpastappointmentsComponent,
    LabclientheaderComponent,
    LabQualificationnComponent,
    AddEditQualificationComponent,
    LabExperienceComponent,
    LabAwardComponent,
    AddEditAwardComponent,
    AddEditExperienceComponent,
  
  ],

  exports: [ClientinsuanceComponent,ClientProfileComponent]
})
export class LabModule {}
