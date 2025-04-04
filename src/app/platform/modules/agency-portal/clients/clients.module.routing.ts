import { Routes, RouterModule } from "@angular/router";
import { NgModule, Component } from "@angular/core";
import { ClientComponent } from "./client/client.component";
import { ProfileComponent } from "./profile/profile.component";
import { SocialHistoryComponent } from "./social-history/social-history.component";
import { FamilyHistoryComponent } from "./family-history/family-history.component";
import { ImmunizationComponent } from "./immunization/immunization.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
import { VitalsComponent } from "./vitals/vitals.component";
import { AllergiesComponent } from "./allergies/allergies.component";
import { MedicationComponent } from "./medication/medication.component";
import { EncounterComponent } from "./encounter/encounter.component";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { DocumentsComponent } from "./documents/documents.component";
import { AuthorizationComponent } from "./authorization/authorization.component";
import { LabOrdersComponent } from "./lab-orders/lab-orders.component";
import { SoapEncounterComponent } from "./soap-encounter/soap-encounter.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { ClientPermissionGuard } from "../../client-portal/client_routing_permission.guard";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { HistoryComponent } from "./history/history.component";
import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { ClientInsuranceComponent } from "./client-insurance/client-insurance.component";
import { IcdComponent } from "./icd/icd.component";
import { HealthPlanCoverageComponent } from "./health-plan-coverage/health-plan-coverage.component";
import { MediCertificateComponent } from "./medi-certificate/medi-certificate.component";
import { UserInvitationComponent } from "../users/user-invitation/user-invitation.component";

import { LabRefferralClientsComponent } from "./lab-refferral-clients/lab-refferral-clients.component";
import { RadiologyRefferralClientsComponent } from "./radiology-refferral-clients/radiology-refferral-clients.component";
import { VideoCallInvitationComponent } from "../encounter/video-call-invitation/video-call-invitation.component";
import { VideoCallInvitationSharedComponent } from "src/app/shared/video-call-invitation-shared/video-call-invitation-shared.component";
const routes: Routes = [
  {
    path: "",
    canActivate: [AgencyPermissionGuard],
    component: ClientComponent
  }, 
  {
    path: "profile",
    canActivate: [AgencyPermissionGuard],
    component: ProfileComponent
  },
  {
    path: "family-history",
    canActivate: [AgencyPermissionGuard],
    component: FamilyHistoryComponent
  },
  {
    path: "history",
    canActivate: [AgencyPermissionGuard],
    component: HistoryComponent
  },
  {
    path: "social-history",
    canActivate: [AgencyPermissionGuard],
    component: SocialHistoryComponent
  },
  {
    path: "immunization",
    canActivate: [AgencyPermissionGuard],
    component: ImmunizationComponent
  },
  {
    path: "diagnosis",
    canActivate: [AgencyPermissionGuard],
    component: DiagnosisComponent
  },
  {
    path: "laborderlist",
    canActivate: [AgencyPermissionGuard],
    component: LabOrdersComponent
  },
  {
    path: "vitals",
    canActivate: [AgencyPermissionGuard],
    component: VitalsComponent
  },
  {
    path: "allergies",
    canActivate: [AgencyPermissionGuard],
    component: AllergiesComponent
  },
  {
    path: "authorization",
    canActivate: [AgencyPermissionGuard],
    component: AuthorizationComponent
  },
  {
    path: "medication",
    canActivate: [AgencyPermissionGuard],
    component: MedicationComponent
  },
  {
    path: "encounter",
    //canActivate: [AgencyPermissionGuard],
    component: EncounterComponent
  },
  {
    path: "soap-encounter",
    canActivate: [AgencyPermissionGuard],
    component: SoapEncounterComponent
  },
  {
    path: "ledger",
    canActivate: [AgencyPermissionGuard],
    component: ClientLedgerComponent
  },
  {
    path: "documents",
    canActivate: [AgencyPermissionGuard],
    component: DocumentsComponent
  },
  {
    path: "scheduling",
    canActivate: [AgencyPermissionGuard],
    //loadChildren: "../../scheduling/scheduling.module#SchedulingModule"
    loadChildren: () => import('../../scheduling/scheduling.module').then(m => m.SchedulingModule)

  },
  {
    path:'prescription',
  canActivate: [AgencyPermissionGuard],
  component:PrescriptionComponent
  },
  {
    path:'soap-note',
  canActivate: [AgencyPermissionGuard],
  component:SoapNoteComponent
  },
  {
    path:'icd',
  canActivate: [AgencyPermissionGuard],
  component:IcdComponent
  },
  {
    path:'insurance',
    canActivate: [AgencyPermissionGuard],
    component:ClientInsuranceComponent
  },
  {
    path:'healthplancoverage',
    // canActivate:[AgencyPermissionGuard],
    component :HealthPlanCoverageComponent
  },
  {
    path:'medicertificate',
    component:MediCertificateComponent
  },
  {
    path:'user-invitations',
    component:VideoCallInvitationSharedComponent
  },
  {
    path:'lab-refferral',
    component:LabRefferralClientsComponent
  },
  {
    path:'radiology-refferral',
    component:RadiologyRefferralClientsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
