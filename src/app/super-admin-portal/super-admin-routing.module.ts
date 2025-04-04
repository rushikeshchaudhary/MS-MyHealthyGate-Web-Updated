import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SuperAdminAuthGuard } from "./auth.guard";
import { SuperAdminNoAuthGuard } from "./noAuth.guard";
import { ManageAgencyComponent } from "./manage-agency/manage-agency.component";

import { AddAgencyComponent } from "./manage-agency/add-agency/add-agency.component";
import { ManageDatabaseComponent } from "./manage-database/manage-database.component";
import { ManageLocationsComponent } from "./manage-locations/manage-locations.component";
import { AddLocationComponent } from "./manage-locations/add-location/add-location.component";
import { ManageLabsComponent } from "./manage-labs/manage-labs.component";
import { ManagePharmacyComponent } from "./manage-pharmacy/manage-pharmacy.component";
import { ManageProvidersComponent } from "./manage-providers/manage-providers.component";
import { ManagePatientsComponent } from "./manage-patients/manage-patients.component";
import { ManageSubscriptionplansComponent } from "./manage-subscriptionplans/manage-subscriptionplans.component";
import { AddSubscriptionplansComponent } from "./manage-subscriptionplans/add-subscriptionplans/add-subscriptionplans.component";
import { ManageTopProvidersComponent } from "./manage-top-providers/manage-top-providers.component";
import { ManageAdsComponent } from "./manage-ads/manage-ads.component";
import { ManageRadiologyComponent } from "./manage-radiology/manage-radiology.component";
import { ManageStaticPageComponent } from "./manage-static-page/manage-static-page.component";
import { ManageDocumentsComponent } from "./manage-documents/manage-documents.component";
import { ManageLoginLogsComponent } from "./manage-login-logs/manage-login-logs.component";
import { MyAppointmentsComponent } from "./my-appointments/my-appointments.component";
import { ManageAuditLogsComponent } from "./manage-audit-logs/manage-audit-logs.component";
import { ManageMastersComponent } from "./manage-masters/manage-masters.component";
import { RolePermissionsComponent } from "../platform/modules/agency-portal/masters/role-permissions/role-permissions.component";
import { ManageTestimonialComponent } from "./manage-testimonial/manage-testimonial.component";
import { AddTestimonialComponent } from "./manage-testimonial/add-testimonial/add-testimonial.component";
import { SupDoctorProfileComponent } from "./sup-doctor-profile/sup-doctor-profile.component";
import { SupPharmacyProfileComponent } from "./sup-pharmacy-profile/sup-pharmacy-profile.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { MyCareLibraryComponent } from "../platform/modules/client-portal/my-care-library/my-care-library.component";
import { SuperAdminPaymentHistoryComponent } from "./super-admin-payment-history/super-admin-payment-history.component";
import { TotalRefundHistoryComponent } from "./total-refund-history/total-refund-history.component";
import { ManagePaymentforadminComponent } from "./manage-paymentforadmin/manage-paymentforadmin.component";
import { MainContainerComponent } from "./main-container/main-container.component";
import { SuperAdminNotificationComponent } from "./super-admin-notification/super-admin-notification.component";
import { SuperadminraiseticketComponent } from "./raiseTicket/superadminraiseticket/superadminraiseticket.component";
import { RaisedTicketDetailsComponent } from "../shared/raised-ticket-details/raised-ticket-details.component";
import { NonBillableSoapSuperadminComponent } from "./non-billable-soap-superadmin/non-billable-soap-superadmin.component";
import { ViewAppointmentComponent } from "./view-appointment/view-appointment.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [SuperAdminAuthGuard],
    component: MainContainerComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "agency",
        component: ManageAgencyComponent,
      },
      {
        path: "agency-setup",
        component: AddAgencyComponent,
      },
      {
        path: "manage-database",
        component: ManageDatabaseComponent,
      },
      {
        path: "manage-locations",
        component: ManageLocationsComponent,
      },
      {
        path: "location-setup",
        component: AddLocationComponent,
      },
      {
        path: "manage-testimonial",
        component: ManageTestimonialComponent,
      },

      {
        path: "testimonial-setup",
        component: AddTestimonialComponent,
      },
      {
        path: "view-Appointment",
        component: ViewAppointmentComponent,
      },
      // {
      //   path: 'manage-labs',
      //   component: ManageLabsComponent
      // },
      // {
      //   path: 'manage-pharmacy',
      //   component: ManagePharmacyComponent
      // },
      // {
      //   path: 'manage-providers',
      //   component: ManageProvidersComponent,
      //   outlet: 'userOutlet'
      // },
      // {
      //   path: 'manage-patients',
      //   component: ManagePatientsComponent
      // },
      // {
      //   path: 'manage-top-providers',
      //   component: ManageTopProvidersComponent
      // },
      // {
      //   path: 'manage-radiology',
      //   component: ManageRadiologyComponent
      // }
      // ,
      {
        path: "manage-subscriptionplans",
        component: ManageSubscriptionplansComponent,
      },
      {
        path: "subscriptionplan-setup",
        component: AddSubscriptionplansComponent,
      },
      {
        path: "manage-ads",
        component: ManageAdsComponent,
      },
      {
        path: "manage-static-page",
        component: ManageStaticPageComponent,
      },
      {
        path: "manage-documents",
        component: ManageDocumentsComponent,
      },
      {
        path: "manage-login-logs",
        component: ManageLoginLogsComponent,
      },
      {
        path: "all-appointments",
        component: MyAppointmentsComponent,
      },
      {
        path: "manage-audit-logs",
        component: ManageAuditLogsComponent,
      },
      {
        path: "provider/:id",
        component: SupDoctorProfileComponent,
      },
      {
        path: "Non-Billable-SoapSuperadminComponent",
        component: NonBillableSoapSuperadminComponent,
      },
      // {
      //   path: "pharmacy/:id",
      //   component: SupPharmacyProfileComponent,
      // },

      {
        path: "Masters",
        component: ManageMastersComponent,
      },
      {
        path: "Masters/template",
        loadChildren:
          () => import('../platform/modules/formio-template/formio-template.module').then(m => m.FormioTemplateModule),
      },
      {
        path: "Masters/role-permissions",
        component: RolePermissionsComponent,
      },
      {
        path: "manage-PaymentforadminComponent",
        component: ManagePaymentforadminComponent,
      },
      {
        path: "raiseticket",
        component: SuperadminraiseticketComponent,
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
        path: "SuperAdminPaymentHistory",
        component: SuperAdminPaymentHistoryComponent,
      },
      {
        path: "Total-Refund",
        component: TotalRefundHistoryComponent,
      },
      {
        path: "manage-Notification",
        component: SuperAdminNotificationComponent,
      },

      {
        path: "manage-user",
        component: UserManagementComponent,
        children: [
          {
            path: "",
            component: UserManagementComponent,
          },
          {
            path: "manage-providers",
            component: ManageProvidersComponent,
            outlet: "userOutlet",
          },
          {
            path: "manage-patients",
            component: ManagePatientsComponent,
            outlet: "userOutlet",
          },
          {
            path: "manage-labs",
            component: ManageLabsComponent,
            outlet: "userOutlet",
          },
          {
            path: "manage-pharmacy",
            component: ManagePharmacyComponent,
            outlet: "userOutlet",
          },
          {
            path: "manage-radiology",
            component: ManageRadiologyComponent,
            outlet: "userOutlet",
          },
          {
            path: "manage-top-providers",
            component: ManageTopProvidersComponent,
            outlet: "userOutlet",
          },
          
        ],
      },
      {
        path: "manage-users",
        loadChildren:
          () => import('../platform/modules/agency-portal/users/users.module').then(m => m.UsersModule),
      },
      {
        path: "client",
        loadChildren:
          () => import('../platform/modules/client-portal/client-portal.module').then(m => m.ClientPortalModule),
      },
      {
        path: "lab",
        loadChildren: () => import('../platform/modules/lab/lab.module').then(m => m.LabModule),
      },
      {
        path: "pharmacy",
        loadChildren:
          () => import('../platform/modules/pharmacy-portal/pharmacy-portal.module').then(m => m.PharmacyPortalModule),
      },
      {  
        path: 'radiology',
        loadChildren:() => import('../platform/modules/radiology-portal/radiology-portal.module').then(m => m.RadiologyPortalModule),
       
      },
    ],
  },
  {
    path: "auth",
    canActivate: [SuperAdminNoAuthGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: "Masters-module",
    loadChildren:
      () => import('../platform/modules/agency-portal/masters/masters.module').then(m => m.MastersModule),
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "/webadmin" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
