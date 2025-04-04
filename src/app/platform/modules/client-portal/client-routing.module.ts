import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { RefundHistoryComponent } from "./Payments/refund-history/refund-history.component";
import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
import { CardHistoryComponent } from "./Payments/card-history/card-history.component";

//import { SocialHistoryComponent } from "./social-history/social-history.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientDashboardComponent } from "./dashboard/dashboard.component";
import { MyCareLibraryComponent } from "./my-care-library/my-care-library.component";
import { MailboxComponent } from "../mailing/mailbox/mailbox.component";
import { ClientPermissionGuard } from "./client_routing_permission.guard";
import { AssignQuestionnaireComponent } from "../agency-portal/questionnaire/assign-questionnaire/assign-questionnaire.component";
//import { FamilyHistoryComponent } from "src/app/platform/modules/client-portal/family-history/family-history.component";
import { VitalsComponent } from "src/app/platform/modules/client-portal/vitals/vitals.component";
import { DocumentsComponent } from "src/app/platform/modules/client-portal/documents/documents.component";
import { ReviewRatingComponent } from "./review-rating/review-rating.component";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";
import { SymptomCheckerComponent } from "./../../../shared/symptom-checker/symptom-checker.component";
import { FamilyHistoryComponent } from "./history/family-history/family-history.component";
import { SocialHistoryComponent } from "./history/social-history/social-history.component";
import { PaymentContainerComponent } from "./Payments/payment-container/payment-container.component";
import { HistoryContainerComponent } from "./history/history-container/history-container.component";
import { ClientencounterComponent } from "../client-portal/clientencounter/clientencounter.component";
import { NonBillableSoapComponent } from "../client-portal/non-billable-soap/non-billable-soap.component";
import { ManageLabBookingComponent } from "./manage-lab-booking/manage-lab-booking.component";
import { FavouritePharmacyComponent } from "./favourite-pharmacy/favourite-pharmacy.component";
import { FavouriteProviderComponent } from "./favourite-provider/favourite-provider.component";
import { ProfileDoctorComponent } from "./favourite-provider/profile-doctor/profile-doctor.component";
import { ProfilePharmacyComponent } from "./favourite-pharmacy/profile-pharmacy/profile-pharmacy.component";
import { SubscriptionplanComponent } from "./subscriptionplan/subscriptionplan.component";
import { FavoriteComponent } from "./favorite/favorite.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { LabReferralComponent } from "./lab-referral/lab-referral.component";
import { LabReferralPatientComponent } from "./lab-referral-patient/lab-referral-patient.component";
import { RadiologyReferralPatientsComponent } from "./radiology-referral-patients/radiology-referral-patients.component";
import { RaiseTicketComponent } from "src/app/shared/raise-ticket/raise-ticket.component";
import { ProfileRadiologyComponent } from "./favourite-radiology/profile-radiology/profile-radiology/profile-radiology.component";
import { ProfileLabComponent } from "./favourite-lab/profile-lab/profile-lab/profile-lab.component";

const routes: Routes = [
  {
    path: "dashboard",
    canActivate: [ClientPermissionGuard],
    component: ClientDashboardComponent,
  },
  {
    path: "raiseticket",
    canActivate: [ClientPermissionGuard],
    component: RaiseTicketComponent,
  },
  {
    path: "my-scheduling",
    canActivate: [ClientPermissionGuard],
    loadChildren: () => import('../scheduling/scheduling.module').then(m => m.SchedulingModule),
  },
  {
    path: "my-care-library",
    canActivate: [ClientPermissionGuard],
    component: MyCareLibraryComponent,
  },
  {
    path: "my-profile",
    canActivate: [ClientPermissionGuard],
    component: MyProfileComponent,
  },

  {
    path: "favourite",
    // canActivate: [ClientPermissionGuard],
    component: FavoriteComponent,
  },
  {
    path: "non-billable-soap",
    component: NonBillableSoapComponent,
  },
  {
    path: "managelab",
    component: ManageLabBookingComponent,
  },
  {
    path: "subscriptionplan",
    component: SubscriptionplanComponent,
  },
  {
    path: "waiting-room",
    canActivate: [ClientPermissionGuard],
    component: WaitingRoomComponent,
  },
  {
    path: "labreferral",
    component: LabReferralComponent
  },
  {
    path: "labreferral-patients",
    component: LabReferralPatientComponent
  },
  {
    path: "radiologyreferral-patients",
    component: RadiologyReferralPatientsComponent
  },
  // {
  //   path: "my-family-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: FamilyHistoryComponent
  // },
  // {
  //   path: "my-social-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: SocialHistoryComponent
  //   //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  // },
  {
    path: "history",
    canActivate: [ClientPermissionGuard],
    component: HistoryContainerComponent,
    loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
  },
  {
    path: "payment",
    canActivate: [ClientPermissionGuard],
    component: PaymentContainerComponent,
    loadChildren: () => import('./Payments/client-payment.module').then(m => m.ClientPaymentModule),
  },
  // {
  //   path: "payment-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: PaymentHistoryComponent
  // },
  // {
  //   path: "refund-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: RefundHistoryComponent
  //   //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  // },
  {
    path: "my-vitals",
    canActivate: [ClientPermissionGuard],
    component: VitalsComponent,
    //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  },
  {
    path: "my-documents",
    canActivate: [ClientPermissionGuard],
    component: DocumentsComponent,
    //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  },
  {
    path: "mailbox",
    canActivate: [ClientPermissionGuard],
    component: MailboxComponent,
  },
  {
    path: "encounter",
    // canActivate: [ClientPermissionGuard],
    loadChildren: () => import('../agency-portal/encounter/encounter.module').then(m => m.EncounterModule),
  },

  {
    path: "assigned-documents",
    canActivate: [ClientPermissionGuard],
    component: AssignQuestionnaireComponent,
  },
  {
    path: "soap-note",
    canActivate: [ClientPermissionGuard],
    component: SoapNoteComponent,
  },
  // {
  //   path:"client-profile",
  //    canActivate:[ClientPermissionGuard],
  //   component:clientProfileComponent

  // },
  {
    path: "client-profile",
    loadChildren: () => import('./clients-details/clients.module').then(m => m.ClientsModule),
  },

  {
    path: "doctor/:id",
    component: ProfileDoctorComponent,
  },
  {
    path: "pharmacy/:id",
    component: ProfilePharmacyComponent,
  },
  {
    path: "radiology/:id",
    component: ProfileRadiologyComponent,
  },
  {
    path: "lab/:id",
    component: ProfileLabComponent,
  },
  {
    path: "review-rating",
    canActivate: [ClientPermissionGuard],
    component: ReviewRatingComponent,
  },
  {
    path: "symptom-checker",
    canActivate: [ClientPermissionGuard],
    component: SymptomCheckerComponent,
  },
  {
    path: "clientencounter",
    component: ClientencounterComponent,
  },
 
  { path: "**", redirectTo: "/web" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
