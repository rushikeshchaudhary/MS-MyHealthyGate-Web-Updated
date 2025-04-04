import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RadiologyPortalRoutingModule } from "./radiology-portal-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReadiologyProfileComponent } from "./readiology-profile/readiology-profile.component";
import { EditRadiologyProfileComponent } from "./readiology-profile/edit-radiology-profile/edit-radiology-profile.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { FormioModule } from '@formio/angular';
//      <!-- intentionally commented code for running the application -->
 import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

import { ScrollbarModule } from 'ngx-scrollbar';

import { SharedModule } from "src/app/shared/shared.module";
import { PlatformMaterialModule } from "../../platform.material.module";
import { ClientsModule } from "../agency-portal/clients/clients.module";
import { UsersModule } from "../agency-portal/users/users.module";
import { ClientPortalModule } from "../client-portal/client-portal.module";
import { SchedulerMaterialModule } from "../scheduling/scheduler.material.module";
import { RadiologyAppointmentComponent } from "./radiology-appointment/radiology-appointment.component";
import { RadiologyClientComponent } from "./radiology-client/radiology-client.component";
import { RadiologyReferralComponent } from "./radiology-referral/radiology-referral.component";
import { RadiologyAddressComponent } from "./readiology-profile/edit-radiology-profile/radiology-address/radiology-address.component";
import { RadiologyInformationComponent } from "./readiology-profile/edit-radiology-profile/radiology-information/radiology-information.component";
import { AddEditRadiologyAddressComponent } from "./readiology-profile/edit-radiology-profile/radiology-address/add-edit-radiology-address/add-edit-radiology-address.component";
import { AppointmentActionComponent } from "../agency-portal/appointment-action/appointment-action.component";
import { AcceptRejectAppointmentInvitationComponent } from "src/app/shared/accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { AgencyPortalModule } from "../agency-portal/agency-portal.module";
import { RadiologyQualificationnComponent } from './readiology-profile/edit-radiology-profile/radiology-qualificationn/radiology-qualificationn.component';
import { AddEditQualificationComponent } from './readiology-profile/edit-radiology-profile/radiology-qualificationn/add-edit-qualification/add-edit-qualification.component';
import { RadiologyExperienceComponent } from './readiology-profile/edit-radiology-profile/radiology-experience/radiology-experience.component';
import { RadiologyAwardComponent } from './readiology-profile/edit-radiology-profile/radiology-award/radiology-award.component';
import { AddEditAwardComponent } from './readiology-profile/edit-radiology-profile/radiology-award/add-edit-award/add-edit-award.component';
import { AddEditExperienceComponent } from './readiology-profile/edit-radiology-profile/radiology-experience/add-edit-experience/add-edit-experience.component';
import { RadiologyClientDetailsComponent } from './radiology-client-details/radiology-client-details.component';
import { LabModule } from "../lab/lab.module";

@NgModule({
  imports: [
    CommonModule,
    RadiologyPortalRoutingModule,
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
    AgencyPortalModule,
    LabModule,
    
  ], 
  // entryComponents: [
  //   RadiologyAddressComponent,
  //   RadiologyInformationComponent,
  //   AddEditRadiologyAddressComponent,
  //   AppointmentActionComponent,
  //   AcceptRejectAppointmentInvitationComponent,
  //   RadiologyQualificationnComponent,
  //   AddEditQualificationComponent,
  //   RadiologyExperienceComponent,
  //   RadiologyAwardComponent,
  //   AddEditAwardComponent,
  //   AddEditExperienceComponent,
  // ],
  declarations: [
    DashboardComponent,
    ReadiologyProfileComponent,
    EditRadiologyProfileComponent,
    RadiologyAppointmentComponent,
    RadiologyClientComponent,
    RadiologyReferralComponent,
    RadiologyAddressComponent,
    RadiologyInformationComponent,
    AddEditRadiologyAddressComponent,
    RadiologyQualificationnComponent,
    AddEditQualificationComponent,
    RadiologyExperienceComponent,
    RadiologyAwardComponent,
    AddEditAwardComponent,
    AddEditExperienceComponent,
    RadiologyClientDetailsComponent,
  ],
})
export class RadiologyPortalModule {}
