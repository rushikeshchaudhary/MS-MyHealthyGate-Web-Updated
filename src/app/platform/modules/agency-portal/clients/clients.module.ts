import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientComponent } from "./client/client.component";
import { ClientsRoutingModule } from "./clients.module.routing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { DemographicInfoComponent } from "./demographic-info/demographic-info.component";
import { GuardianComponent } from "./guardian/guardian.component";
import { AddressComponent } from "./address/address.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { ClientsService } from "./clients.service";
import { GuardianModalComponent } from "./guardian/guardian-modal/guardian-modal.component";
import { ClientHeaderComponent } from "./client-header/client-header.component";
import { ProfileComponent } from "./profile/profile.component";
import { SocialHistoryComponent } from "./social-history/social-history.component";
import { FamilyHistoryComponent } from "./family-history/family-history.component";
import { ImmunizationComponent } from "./immunization/immunization.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
import { VitalsComponent } from "./vitals/vitals.component";
import { AllergiesComponent } from "./allergies/allergies.component";
import { AuthorizationComponent } from "./authorization/authorization.component";
import { MedicationComponent } from "./medication/medication.component";
import { EncounterComponent } from "./encounter/encounter.component";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { DocumentsComponent } from "./documents/documents.component";
import { LabOrdersComponent } from "./lab-orders/lab-orders.component";
import { DiagnosisModalComponent } from "./diagnosis/diagnosis-modal/diagnosis-modal.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { FamilyHistoryModelComponent } from "./family-history/family-history-model/family-history-model.component";
import { EligibilityEnquiryComponent } from "./eligibility-enquiry/eligibility-enquiry.component";
import { ImmunizationModalComponent } from "./immunization/immunization-modal/immunization-modal.component";
import { VitalModalComponent } from "./vitals/vital-modal/vital-modal.component";
import { AllergiesModalComponent } from "./allergies/allergies-modal/allergies-modal.component";
import { AuthorizationModalComponent } from "./authorization/authorization-modal/authorization-modal.component";
import { MedicationModalComponent } from "./medication/medication-modal/medication-modal.component";
import { SoapEncounterComponent } from "./soap-encounter/soap-encounter.component";
import { ClientLedgerDetailComponent } from "./client-ledger/client-ledger-detail/client-ledger-detail.component";
import { AddPaymentDetailComponent } from "./client-ledger/add-payment-detail/add-payment-detail.component";
import { AddDocumentComponent } from "./documents/add-document/add-document.component";
import { ChartsModule } from "ng2-charts";
//      <!-- intentionally commented code for running the application -->
 import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { PrescriptionFaxModalComponent } from "./prescription/prescription-fax-modal/prescription-fax-modal.component";
import { PrescriptionModalComponent } from "./prescription/prescription-modal/prescription-modal.component";
import { AddPrescriptionComponent } from "./prescription/prescription-addprescription/prescription-addprescription.component";
import { SentPrescriptionComponent } from "./prescription/prescription-sentprescription/prescription-sentprescription.component";
import { HistoryComponent } from "./history/history.component";
import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { IcdComponent } from "./icd/icd.component";
import { ClientInsuranceComponent } from "./client-insurance/client-insurance.component";
import { InsuranceModalComponent } from "./insurance/insurance-modal/insurance-modal.component";
import { DocumentModalComponent } from "../../client-portal/documents/document-modal/document-modal.component";
import { DoctorPatientNotesComponent } from './doctor-patient-notes/doctor-patient-notes.component';
import { SoapNoteViewModalComponent } from './soap-note-view-modal/soap-note-view-modal.component';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { HealthPlanCoverageComponent } from './health-plan-coverage/health-plan-coverage.component';
import { MediCertificateComponent } from './medi-certificate/medi-certificate.component';
import { MediCertificateModalComponent } from './medi-certificate/medi-certificate-modal/medi-certificate-modal.component';
import { HistoryModule } from "../../client-portal/history/history.module";
import { LabRefferralClientsComponent } from "./lab-refferral-clients/lab-refferral-clients.component";
import { RadiologyRefferralClientsComponent } from "./radiology-refferral-clients/radiology-refferral-clients.component";
import { FormioModule } from '@formio/angular';
import { ScrollbarModule } from 'ngx-scrollbar';
import { VideoCallInvitationSharedComponent } from "src/app/shared/video-call-invitation-shared/video-call-invitation-shared.component";

@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    ChartsModule,
    //<!-- intentionally commented code for running the application -->
    NgxMatSelectSearchModule,
    AngularEditorModule,
    HistoryModule,
    FormioModule,
    ScrollbarModule
    
    
  ],
  providers: [
    ClientsService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%",
      },
    },
  ],
  // entryComponents: [
  //   DemographicInfoComponent,
  //   GuardianComponent,
  //   AddressComponent,
  //   InsuranceComponent,
  //   CustomFieldsComponent,
  //   GuardianModalComponent,
  //   DiagnosisModalComponent,
  //   FamilyHistoryModelComponent,
  //   EligibilityEnquiryComponent,
  //   ImmunizationModalComponent,
  //   VitalModalComponent,
  //   AllergiesModalComponent,
  //   AuthorizationModalComponent,
  //   MedicationModalComponent,
  //   ClientLedgerDetailComponent,
  //   AddPaymentDetailComponent,
  //   AddDocumentComponent,
  //   PrescriptionModalComponent,
  //   PrescriptionFaxModalComponent,
  //   // AddPrescriptionComponent,
  //   SentPrescriptionComponent,
  //   SoapNoteComponent,
  //   ClientInsuranceComponent,
  //   InsuranceModalComponent,
  //   DocumentModalComponent,
  //   DoctorPatientNotesComponent,
  //   SoapNoteViewModalComponent,
  //   HealthPlanCoverageComponent,
  //   MediCertificateModalComponent,
    
  // ],
  declarations: [
    ClientComponent,
    DemographicInfoComponent,
    GuardianComponent,
    AddressComponent,
    InsuranceComponent,
    CustomFieldsComponent,
    GuardianModalComponent,
    ClientHeaderComponent,
    ProfileComponent,
    SocialHistoryComponent,
    FamilyHistoryComponent,
    ImmunizationComponent,
    DiagnosisComponent,
    VitalsComponent,
    AllergiesComponent,
    AuthorizationComponent,
    MedicationComponent,
    EncounterComponent,
    ClientLedgerComponent,
    DocumentsComponent,
    LabOrdersComponent,
    DiagnosisModalComponent,
    FamilyHistoryModelComponent,
    EligibilityEnquiryComponent,
    ImmunizationModalComponent,
    VitalModalComponent,
    AllergiesModalComponent,
    AuthorizationModalComponent,
    MedicationModalComponent,
    SoapEncounterComponent,
    ClientLedgerDetailComponent,
    AddPaymentDetailComponent,
    AddDocumentComponent,
    PrescriptionComponent,
    PrescriptionFaxModalComponent,
    PrescriptionModalComponent,
    // AddPrescriptionComponent,
    SentPrescriptionComponent,
    HistoryComponent,
    IcdComponent,
    SoapNoteComponent,
    ClientInsuranceComponent,
    InsuranceModalComponent,
    DocumentModalComponent,
    DoctorPatientNotesComponent,
    SoapNoteViewModalComponent,
    HealthPlanCoverageComponent,
    MediCertificateComponent,
    MediCertificateModalComponent,
    LabRefferralClientsComponent,
    RadiologyRefferralClientsComponent,
   
  ],
  exports: [
    ImmunizationModalComponent,
    MedicationModalComponent,
    AllergiesModalComponent,
    AuthorizationModalComponent,
    FamilyHistoryModelComponent,
    InsuranceModalComponent,
    PrescriptionComponent,
    MedicationComponent,
    SoapNoteComponent,
    FamilyHistoryComponent,
    HistoryComponent,
    SocialHistoryComponent,
    ImmunizationComponent,
    AllergiesComponent,
    DocumentsComponent,
    IcdComponent,
    ClientInsuranceComponent,
    VitalsComponent,
    DocumentModalComponent,
    HealthPlanCoverageComponent,
    LabRefferralClientsComponent,
    RadiologyRefferralClientsComponent,
    VideoCallInvitationSharedComponent
  ],
})
export class ClientsModule { }
