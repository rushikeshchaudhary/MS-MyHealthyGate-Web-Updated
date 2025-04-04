import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AgencyPermissionGuard } from "./agency_routing_permission.guard";
import { ClientListComponent } from "./client-list/client-list.component";
import { AvailabilityComponent } from "./users/availability/availability.component";
import { LabReferralComponent } from "./lab-referral/lab-referral.component";
import { RadiologyReferralComponent } from "./radiology-referral/radiology-referral.component";
import { ReferralForRadiologyComponent } from "./referral-for-radiology/referral-for-radiology.component";
import { TemplateComponent } from "./template/template.component";

import { RaiseTicketComponent } from "src/app/shared/raise-ticket/raise-ticket.component";
import { RaisedTicketDetailsComponent } from "src/app/shared/raised-ticket-details/raised-ticket-details.component";

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/web/dashboard"
  // },
  {
    path: "template",
    canActivate: [AgencyPermissionGuard],
    component: TemplateComponent,
  },
  {
    path: "labrefferal",
    canActivate: [AgencyPermissionGuard],
    component: LabReferralComponent,
  },
  {
    path: "radiologyreferral",
    canActivate: [AgencyPermissionGuard],
    component: RadiologyReferralComponent,
  },
  {
    path: "radiology-referral",
    canActivate: [AgencyPermissionGuard],
    component: ReferralForRadiologyComponent,
  },
  {
    path: "dashboard",
    canActivate: [AgencyPermissionGuard],
    component: DashboardComponent,
  },
  {
    path: "raiseTicket",
    canActivate: [AgencyPermissionGuard],
    component: RaiseTicketComponent,
  },
  {
    path: "ticket",
    component: RaisedTicketDetailsComponent,
  },
  {
    path: "ticket/:ticketid",
    component: RaisedTicketDetailsComponent,
  },
  {
    path: "Masters",
    loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule)

  },
  {
    path: "manage-users",
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)

  },
  {
    path: "scheduling",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('../scheduling/scheduling.module').then(m => m.SchedulingModule)

  },
  {
    path: "encounter",
    // canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('./encounter/encounter.module').then(m => m.EncounterModule)

  },
  {
    path: "clearing-house",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('./clearing-house/clearing-house.module').then(m => m.ClearingHouseModule)

  },
  {
    path: "client",
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)

  },
  {
    path: "clientlist",
    component: ClientListComponent,
  },
  {
    path: "Logs",
    loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule)

  },
  {
    path: "Billing",
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule)

  },
  {
    path: "payers",
    loadChildren: () => import('./payers/payers.module').then(m => m.PayersModule)

  },
  {
    path: "payroll",
    loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule)

  },
  {
    path: "mailbox",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('../mailing/mailing.module').then(m => m.MailingModule)

  },
  {
    path: "app-config",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('./app-config/app-config.module').then(m => m.AppConfigModule)

  },
  {
    // path: "questionnaire",
    path: "questionnairess",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('./questionnaire/questionnaire.module').then(m => m.QuestionnaireModule)

  },
  {
    path: "assign-questionnaire",
    // canActivate: [AgencyPermissionGuard],
      loadChildren: () => import('./providerquestionnaire/providerquestionnaire.module').then(m => m.ProviderquestionnaireModule)

  },
  // {
  //   path: "add-keyword",
  //   canActivate: [AgencyPermissionGuard],
  //   loadChildren: "./keyword/keyword.module#KeywordModule"
  // },
  {
    path: "payment",
    canActivate: [AgencyPermissionGuard],
    loadChildren: () => import('./Payments/payment.module').then(m => m.PaymentModule)

  },
  {
    path: "educational-content",
    canActivate: [AgencyPermissionGuard],
      loadChildren: () => import('./provider-documents/provider-documents.module').then(m => m.ProviderDocumentModule)

  },
  {
    path: "waiting-room/:id",
    loadChildren: () => import('../waiting-room/waiting-room.module').then(m => m.WaitingRoomModule)

  },
  {
    path: "waiting-room",
    loadChildren: () => import('../waiting-room/waiting-room.module').then(m => m.WaitingRoomModule)

  },
  {
    path: "my-appointments",
      loadChildren: () => import('./my-appointments/my-appointments.module').then(m => m.MyAppointmentsModule)

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgencyRoutingModule {}
