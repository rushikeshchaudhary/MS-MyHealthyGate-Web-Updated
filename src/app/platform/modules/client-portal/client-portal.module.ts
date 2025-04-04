import { DocumentsComponent } from "./documents/documents.component";
import { VitalsComponent } from "./vitals/vitals.component";
//import { SocialHistoryComponent } from "./social-history/social-history.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//import { FamilyHistoryModelComponent } from "src/app/platform/modules/client-portal/family-history/family-history-model/family-history-model.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientDashboardComponent } from "./dashboard/dashboard.component";
import { ClientRoutingModule } from "./client-routing.module";
import { MyCareLibraryComponent } from "./my-care-library/my-care-library.component";
import { ClientsService } from "./clients.service";
import { SharedModule } from "../../../shared/shared.module";
import { PlatformMaterialModule } from "../../platform.material.module";
import { MailingModule } from "../mailing/mailing.module";
import { ClientPermissionGuard } from "./client_routing_permission.guard";
import { QuestionnaireModule } from "../agency-portal/questionnaire/questionnaire.module";
//import { FamilyHistoryComponent } from "src/app/platform/modules/client-portal/family-history/family-history.component";
import { VitalModelComponent } from "./vitals/vital-model/vital-model.component";
import { DocumentModalComponent } from "./documents/document-modal/document-modal.component";
import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
import { RefundHistoryComponent } from "./Payments/refund-history/refund-history.component";
import { CardHistoryComponent } from "./Payments/card-history/card-history.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { ClientDashboardService } from "./dashboard/dashboard.service";
import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormioModule } from '@formio/angular';
import { RatingModule } from "ng-starrating";
import { ReviewRatingComponent } from "./review-rating/review-rating.component";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";
import { UpcomingappointmentdialogComponent } from "./upcomingappointmentdialog/upcomingappointmentdialog.component";
import { FamilyHistoryModelComponent } from "./history/family-history/family-history-model/family-history-model.component";
import { SocialHistoryComponent } from "./history/social-history/social-history.component";
import { FamilyHistoryComponent } from "./history/family-history/family-history.component";
import { PaymentContainerComponent } from "./Payments/payment-container/payment-container.component";
import { HistoryContainerComponent } from "./history/history-container/history-container.component";
import { ClientencounterComponent } from "./clientencounter/clientencounter.component";
import { NonBillableSoapComponent } from "./non-billable-soap/non-billable-soap.component";
import { ManageLabBookingComponent } from "./manage-lab-booking/manage-lab-booking.component";
import { CancelLabAppointmentPatientComponent } from "./manage-lab-booking/cancel-lab-appointment-patient/cancel-lab-appointment-patient.component";
import { ViewLabAppointmentPatientComponent } from "./manage-lab-booking/view-lab-appointment-patient/view-lab-appointment-patient.component";
import { FavouritePharmacyComponent } from "./favourite-pharmacy/favourite-pharmacy.component";
import { FavouriteProviderComponent } from "./favourite-provider/favourite-provider.component";
import { ProfileDoctorComponent } from "./favourite-provider/profile-doctor/profile-doctor.component";
import { ProfilePharmacyComponent } from './favourite-pharmacy/profile-pharmacy/profile-pharmacy.component';
//import { ClientsService as AgencyClientsService } from "../agency-portal/clients/clients.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SubscriptionplanComponent } from './subscriptionplan/subscriptionplan.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { ImmunizationModalComponent } from "../agency-portal/clients/immunization/immunization-modal/immunization-modal.component";
import { ClientsModule } from "../agency-portal/clients/clients.module";
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FavouriteRadiologyComponent } from './favourite-radiology/favourite-radiology.component';
import { FavouriteLabComponent } from './favourite-lab/favourite-lab.component';
import { HistoryModule } from "./history/history.module";
import { LabReferralComponent } from './lab-referral/lab-referral.component';
import { LabReferrralFileUploadComponent } from './lab-referrral-file-upload/lab-referrral-file-upload.component';
import { LabReferralPatientComponent } from './lab-referral-patient/lab-referral-patient.component';
import { LabTestDownloadModalComponent } from "../agency-portal/lab-test-download-modal/lab-test-download-modal.component";
import { LabTestDownloadPatientComponent } from './lab-test-download-patient/lab-test-download-patient.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RadiologyReferralPatientsComponent } from './radiology-referral-patients/radiology-referral-patients.component';
import { AgencyPortalModule } from "../agency-portal/agency-portal.module";
import { ProfileRadiologyComponent } from './favourite-radiology/profile-radiology/profile-radiology/profile-radiology.component';
import { ProfileLabComponent } from './favourite-lab/profile-lab/profile-lab/profile-lab.component';
import { MatSortModule } from "@angular/material/sort";




@NgModule({
  imports: [
    CommonModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    ClientRoutingModule,
    SharedModule,
    PlatformMaterialModule,
    MailingModule,
    HistoryModule,
    FormsModule,
    QuestionnaireModule,
    ReactiveFormsModule,
    MatFormFieldModule ,
    ScrollbarModule,
    FormioModule,
    RatingModule,
    MatSortModule,
    ClientsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  // entryComponents: [
  //   FamilyHistoryModelComponent,
  //   VitalModelComponent,
  //   // DocumentModalComponent,
  //   ReviewRatingComponent,
  //   UpcomingappointmentdialogComponent,
  //   PaymentContainerComponent,
  //   HistoryContainerComponent,
  //   CancelLabAppointmentPatientComponent,
  //   ViewLabAppointmentPatientComponent,
  //   FavouritePharmacyComponent,
  //   FavouriteProviderComponent,
  //   FavouriteLabComponent,
  //   FavouriteRadiologyComponent,
  //   LabReferrralFileUploadComponent,
  //   LabTestDownloadPatientComponent,
    
  // ],
  declarations: [
    ClientDashboardComponent,
    MyCareLibraryComponent,
    //FamilyHistoryComponent,
    FamilyHistoryModelComponent,
    //SocialHistoryComponent,
    VitalsComponent,
    VitalModelComponent,
    // DocumentModalComponent,
    DocumentsComponent,
    //PaymentHistoryComponent,
    //RefundHistoryComponent,
    SoapNoteComponent,
    ReviewRatingComponent,
    WaitingRoomComponent,
    UpcomingappointmentdialogComponent,
    PaymentContainerComponent,
    HistoryContainerComponent,
    ClientencounterComponent,
    NonBillableSoapComponent,
    ManageLabBookingComponent,

    CancelLabAppointmentPatientComponent,

    ViewLabAppointmentPatientComponent,

    FavouritePharmacyComponent,

    FavouriteProviderComponent,
    ProfileDoctorComponent,
    ProfilePharmacyComponent,
    SubscriptionplanComponent,
    FavoriteComponent,
    FavouriteRadiologyComponent,
    FavouriteLabComponent,
    MyProfileComponent,
    LabReferralComponent,
    LabReferrralFileUploadComponent,
    LabReferralPatientComponent,
    LabTestDownloadPatientComponent,
    RadiologyReferralPatientsComponent,
    ProfileRadiologyComponent,
    ProfileLabComponent,
    
    
    
    // LabReferralComponent,
  ],
  providers: [
    ClientPermissionGuard,
    ClientsService,
    ClientDashboardService,
    //  AgencyClientsService
  ],
  exports: [ProfileDoctorComponent, ProfilePharmacyComponent, ]
})
export class ClientPortalModule { }
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
