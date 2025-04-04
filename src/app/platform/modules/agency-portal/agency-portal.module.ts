import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AgencyRoutingModule } from "./agency-routing.module";
import { SharedModule } from "../../../shared/shared.module";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AuthListComponent } from "./dashboard/auth-list/auth-list.component";
import { AgencyPermissionGuard } from "./agency_routing_permission.guard";
import { ScrollbarModule } from 'ngx-scrollbar';
import { RatingModule } from "ng-starrating";
import { ClientListComponent } from "./client-list/client-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//      <!-- intentionally commented code for running the application -->
// import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { LabTestDownloadModalComponent } from "./lab-test-download-modal/lab-test-download-modal.component";
import { AddLabReferralModalComponent } from "./add-lab-referral-modal/add-lab-referral-modal.component";
import { LabReferralComponent } from "./lab-referral/lab-referral.component";
import { AppointmentActionComponent } from './appointment-action/appointment-action.component';
import { ProviderMsgComponent } from './provider-msg/provider-msg.component';
import { RadiologyReferralComponent } from './radiology-referral/radiology-referral.component';
import { AddRadiologyReferralModalComponent } from './add-radiology-referral-modal/add-radiology-referral-modal.component';
import { ReferralForRadiologyComponent } from './referral-for-radiology/referral-for-radiology.component';
import { RadiologyReferralFileUploadComponent } from './radiology-referral-file-upload/radiology-referral-file-upload.component';
import { PlatformMaterialModule } from "../../platform.material.module";
import { TemplateComponent } from './template/template.component';
import { AddTemplateModalComponent } from './add-template-modal/add-template-modal.component';
import { AngularEditorModule } from "@kolkov/angular-editor";
//import { SignaturePadModule } from "angular-signaturepad";
import { SignaturePadModule } from '@vijhhh2/ngx-signaturepad';
import { RaiseTicketComponent } from "src/app/shared/raise-ticket/raise-ticket.component";
import { ColorPickerModule } from "ngx-color-picker";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ContextMenuModule } from 'ngx-contextmenu';

//import { KeywordModule } from "./Keyword/keyword.module";

@NgModule({
  imports: [
    CommonModule,
    AgencyRoutingModule,
    SharedModule,
    MatMenuModule,
    ScrollbarModule,
    RatingModule,
    FormsModule,
    //MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatCardModule,
    //NgDatepickerModule,
   // <!-- intentionally commented code for running the application -->
   // NgxMatSelectSearchModule,
   NgxMatSelectSearchModule,
   ColorPickerModule,
    //MatButtonToggleModule,
    //[NgxMaskModule.forRoot()],
    //[NgxMaterialTimepickerModule.forRoot()],
    ReactiveFormsModule,
    ContextMenuModule.forRoot(),
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    PlatformMaterialModule,
    MatTooltipModule,
    AngularEditorModule,
    SignaturePadModule,
    MatMenuModule
  ],
  providers: [AgencyPermissionGuard,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    }
  ],
  // entryComponents: [
  //   RadiologyReferralFileUploadComponent,
  //   AddRadiologyReferralModalComponent,
  //   AddLabReferralModalComponent,
  //   LabTestDownloadModalComponent,
  //   AppointmentActionComponent,
  //   ProviderMsgComponent,
  //   AddTemplateModalComponent,
  //   RaiseTicketComponent
  // ],
  declarations: [
    DashboardComponent,
    AuthListComponent,
    ClientListComponent,
    LabReferralComponent,
    AddLabReferralModalComponent,
    LabTestDownloadModalComponent,
    AppointmentActionComponent,
    ProviderMsgComponent,
    RadiologyReferralComponent,
    AddRadiologyReferralModalComponent,
    ReferralForRadiologyComponent,
    RadiologyReferralFileUploadComponent,
    TemplateComponent,
    AddTemplateModalComponent,
   
    
    //DiagnosisModalComponent
  ],
  exports: [LabTestDownloadModalComponent],
  //entryComponents: [DiagnosisModalComponent]
})
export class AgencyPortalModule {}
