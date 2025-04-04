import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManageAgencyComponent } from "./manage-agency/manage-agency.component";

import { SuperAdminAuthGuard } from "./auth.guard";
import { SuperAdminNoAuthGuard } from "./noAuth.guard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuperAdminMaterialModule } from "./superadmin.material.module";

import { HttpLoaderFactory, SharedModule } from "../shared/shared.module";
import { CommonService } from "./core/services";
import { LayoutService } from "../platform/modules/core/services";
import { ManageAgencyService } from "./manage-agency/manage-agency.service";
import { AddAgencyComponent } from "./manage-agency/add-agency/add-agency.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { HttpTokenInterceptor } from "./core/interceptors";
import { ManageDatabaseComponent } from "./manage-database/manage-database.component";
import { AddDatabaseComponent } from "./manage-database/add-database/add-database.component";
import { ManageDatabaseService } from "./manage-database/manage-database.service";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ManageLocationsComponent } from "./manage-locations/manage-locations.component";
import { ManageLocationService } from "./manage-locations/manage-location.service";
import { AddLocationComponent } from "./manage-locations/add-location/add-location.component";
import { ManageLabsService } from "./manage-labs/manage-labs.service";
import { ManageLabsComponent } from "./manage-labs/manage-labs.component";
import { ManagePharmacyService } from "./manage-pharmacy/manage-pharmacy.service";
import { ManagePharmacyComponent } from "./manage-pharmacy/manage-pharmacy.component";
import { ManageProvidersComponent } from "./manage-providers/manage-providers.component";
import { ManageProvidersService } from "./manage-providers/manage-providers.service";
import { ManagePatientsComponent } from "./manage-patients/manage-patients.component";
import { ManagePatientService } from "./manage-patients/manage-patient.service";
import { ShowProviderProfileComponent } from "./manage-providers/show-provider-profile/show-provider-profile.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ScrollbarModule } from 'ngx-scrollbar';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ManageSubscriptionplansComponent } from "./manage-subscriptionplans/manage-subscriptionplans.component";
import { ManageSubscriptionplansService } from "./manage-subscriptionplans/manage-subscriptionplans.service";
import { AddSubscriptionplansComponent } from "./manage-subscriptionplans/add-subscriptionplans/add-subscriptionplans.component";
import { ManageTopProvidersComponent } from "./manage-top-providers/manage-top-providers.component";
import { ShowProvidersModalComponent } from "./manage-top-providers/show-providers-modal/show-providers-modal.component";
//      <!-- intentionally commented code for running the application -->
//  import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { ManageAdsComponent } from "./manage-ads/manage-ads.component";
import { ManageRadiologyComponent } from "./manage-radiology/manage-radiology.component";
import { AddPatientModalComponent } from "./manage-patients/add-patient-modal/add-patient-modal.component";
import { RegistrationComponent } from "../platform/modules/auth/registration/registration.component";
import { AuthModule } from "../platform/modules/auth/auth.module";
import { ManageDocumentsComponent } from "./manage-documents/manage-documents.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ManageStaticPageComponent } from "./manage-static-page/manage-static-page.component";
import { ManageLoginLogsComponent } from "./manage-login-logs/manage-login-logs.component";
import { ManageLogsService } from "./manage-login-logs/manage-logs.service";
import { ManageStaticPageService } from "./manage-static-page/manage-static-page.service";
import { MyAppointmentsComponent } from "./my-appointments/my-appointments.component";
import { PlatformMaterialModule } from "../platform/platform.material.module";
import { MyAppointmentsService } from "./my-appointments/my-appointments.service";
import { ManageAuditLogsComponent } from "./manage-audit-logs/manage-audit-logs.component";
import { ManageMastersComponent } from "./manage-masters/manage-masters.component";
import { MastersModule } from "../platform/modules/agency-portal/masters/masters.module";
import { ClientsModule } from "../platform/modules/client-portal/clients-details/clients.module";
import { SupDoctorProfileComponent } from "./sup-doctor-profile/sup-doctor-profile.component";
import { SupPharmacyProfileComponent } from "./sup-pharmacy-profile/sup-pharmacy-profile.component";
import { AddTestimonialComponent } from "./manage-testimonial/add-testimonial/add-testimonial.component";
import { ManageTestimonialComponent } from "./manage-testimonial/manage-testimonial.component";
import { ManageTestimonialService } from "./manage-testimonial/manage-testimonial.service";
import { UserManagementComponent } from "./user-management/user-management.component";
import { AgencyPermissionGuard } from "../platform/modules/agency-portal/agency_routing_permission.guard";
import { MyCareLibraryComponent } from "../platform/modules/client-portal/my-care-library/my-care-library.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { UsersModule } from "../platform/modules/agency-portal/users/users.module";
import { ClientPortalModule } from "../platform/modules/client-portal/client-portal.module";
import { LabModule } from "../platform/modules/lab/lab.module";
import { PharmacyPortalModule } from "../platform/modules/pharmacy-portal/pharmacy-portal.module";
import { ManageActionComponent } from "./manage-action/manage-action.component";
import { SuperAdminPaymentHistoryComponent } from "./super-admin-payment-history/super-admin-payment-history.component";
import { PaymentService } from "../platform/modules/agency-portal/Payments/payment.service";
import { TotalRefundHistoryComponent } from "./total-refund-history/total-refund-history.component";
import { ManagePaymentforadminComponent } from "./manage-paymentforadmin/manage-paymentforadmin.component";
import { SuperAdminRoutingModule } from "./super-admin-routing.module";
import { MainContainerComponent } from "./main-container/main-container.component";
import { SuperAdminNotificationComponent } from "./super-admin-notification/super-admin-notification.component";
import { SuperAdminnotificationService } from "./super-admin-notification/super-adminnotification.service";
import { CreateSuperAdminNotificationdataComponent } from "./create-super-admin-notificationdata/create-super-admin-notificationdata.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

import { SuperadminraiseticketComponent } from "./raiseTicket/superadminraiseticket/superadminraiseticket.component";
import { SuperadminImageviewerComponent } from "./raiseTicket/superadminraiseticket/superadmin-imageviewer/superadmin-imageviewer.component";
import { SuperadminupdateraiseticketComponent } from "./raiseTicket/superadminraiseticket/superadminupdateraiseticket/superadminupdateraiseticket.component";
import { DoughnutChartComponent } from "../shared/doughnut-chart/doughnut-chart.component";
import { NonBillableSoapSuperadminComponent } from "./non-billable-soap-superadmin/non-billable-soap-superadmin.component";

import { ViewAppointmentComponent } from "./view-appointment/view-appointment.component";
import { FormioModule } from '@formio/angular';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";


@NgModule({
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SuperAdminMaterialModule,
    SharedModule,
    HttpClientModule,
    
    MatStepperModule,
    NgxGalleryModule,
    NgxSliderModule,
    NgSelectModule,
    //      <!-- intentionally commented code for running the application -->
     NgxMatSelectSearchModule,
    AngularEditorModule,
    AuthModule,
    MatPaginatorModule,
    PlatformMaterialModule,
    MastersModule,
    UsersModule,
    ClientPortalModule,
    MatSidenavModule,
    LabModule,
    PharmacyPortalModule,
    ScrollbarModule,
    FormioModule,
    
  ],
  declarations: [
    DashboardComponent,
    ManageAgencyComponent,
    MainContainerComponent,
    AddAgencyComponent,
    ManageDatabaseComponent,
    AddDatabaseComponent,
    ManageLocationsComponent,
    AddLocationComponent,
    ManageLabsComponent,
    ManagePharmacyComponent,
    ManageProvidersComponent,
    ManagePatientsComponent,
    ShowProviderProfileComponent,
    ManageTopProvidersComponent,
    ShowProvidersModalComponent,
    ManageSubscriptionplansComponent,
    AddSubscriptionplansComponent,
    ManageAdsComponent,
    ManageRadiologyComponent,
    AddPatientModalComponent,
    ManageStaticPageComponent,
    ManageDocumentsComponent,
    ManageLoginLogsComponent,
    MyAppointmentsComponent,
    ManageAuditLogsComponent,
    ManageMastersComponent,
    AddTestimonialComponent,
    ManageTestimonialComponent,

    UserManagementComponent,
    SupDoctorProfileComponent,
    SupPharmacyProfileComponent,
    ManageActionComponent,
    SuperAdminPaymentHistoryComponent,
    TotalRefundHistoryComponent,
    ManagePaymentforadminComponent,
    SuperAdminNotificationComponent,
    CreateSuperAdminNotificationdataComponent,
    ConfirmDialogComponent,
    SuperadminraiseticketComponent,
    SuperadminImageviewerComponent,
    SuperadminupdateraiseticketComponent,
    SuperadminraiseticketComponent,
    NonBillableSoapSuperadminComponent,
    ViewAppointmentComponent
    
  ],
  // entryComponents: [
  //   AddDatabaseComponent,
  //   ShowProviderProfileComponent,
  //   ShowProvidersModalComponent,
  //   AddPatientModalComponent,
  //   ManageActionComponent,
  //   SuperAdminPaymentHistoryComponent,
  //   TotalRefundHistoryComponent,
  //   ManagePaymentforadminComponent,
  //   SuperAdminNotificationComponent,
  //   CreateSuperAdminNotificationdataComponent,
  //   ConfirmDialogComponent,
  //   SuperadminImageviewerComponent,
  //   SuperadminupdateraiseticketComponent,
  //   DoughnutChartComponent,
    
  // ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    SuperAdminAuthGuard,
    SuperAdminNoAuthGuard,
    AgencyPermissionGuard,
    CommonService,
    LayoutService,
    ManageAgencyService,
    ManageDatabaseService,
    ManageLocationService,
    ManageLabsService,
    ManagePharmacyService,
    ManageProvidersService,
    ManageSubscriptionplansService,
    ManagePatientService,
    ManageStaticPageService,
    ManageLogsService,
    MyAppointmentsService,
    PaymentService,
    ManageTestimonialService,
    SuperAdminnotificationService,
    SuperAdminPaymentHistoryComponent,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true, disableClose: true, width: "700px" },
    },
  ],
})
export class SuperAdminPortalModule {
  constructor(commonService: CommonService) {}
}
