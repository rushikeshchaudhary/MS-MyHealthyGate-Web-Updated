import { UniquePipe } from "./../shared/pipes/unique.pipe";
import { PaymentFailureComponent } from "./payment-failure/payment-failure.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { BookAppointmentComponent } from "./book-appointment/book-appointment.component";
import { HomeFooterComponent } from "./home-footer/home-footer.component";
import { HomeHeaderComponent } from "./home-header/home-header.component";
import { HomeContainerComponent } from "./home-container/home-container.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register/register.component";
import { AppMaterialModule } from "src/app/app.material.module";
import { FrontRoutingModule } from "src/app/front/front-routing.module";
import { FrontMaterialModule } from "src/app/front/front.material.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonService } from "src/app/platform/modules/core/services";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RejectInvitationComponent } from "src/app/front/reject-invitation/reject-invitation.component";
import { CarouselModule } from "ngx-owl-carousel-o";

import { DatepickerModule  } from "ng2-datepicker";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";

import { LabPharmacyListComponent } from "./lab-pharmacy-list/lab-pharmacy-list.component";
import { ScrollbarModule } from 'ngx-scrollbar';
import { DoctorProfileComponent } from "./doctor-profile/doctor-profile.component";

import "hammerjs";

import { DatePipe } from "@angular/common";
import { AgencyLoginModelComponent } from "src/app/shared/login-model/agency-login/agency-login.component";
import { ClientLoginModelComponent } from "src/app/shared/login-model/client-login/client-login.component";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";
import { HttpTokenInterceptor } from "src/app/platform/modules/core/interceptors";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import { SecurityQuestionModelComponent } from "src/app/shared/security-question-model/security-question-model.component";
import { AgmCoreModule } from "@agm/core";
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { OverlayModule } from "@angular/cdk/overlay";
//import { StripeModule } from "stripe-angular";
//import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
//import { NgxMaterialTimepickerEventService } from "ngx-material-timepicker/src/app/material-timepicker/services/ngx-material-timepicker-event.service";
//import { ChangePasswordComponent } from "src/app/platform/modules/agency-portal/change-password/change-password.component";
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
//import { NgxUploaderModule } from 'ngx-uploader';
import { RatingModule } from 'ng-starrating';
import { BookFreeAppointmentComponent } from "./book-freeappointment/book-freeappointment.component";
import { WhatWeDoComponent } from "./what-we-do/what-we-do.component";
import { OurDoctorsComponent } from "./our-doctors/our-doctors.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { TermsConditionModalComponent } from "./terms-conditions/terms-conditions.component";
import { FaqComponent } from "./faq/faq.component";
import { ProviderProfileModalComponent } from "./provider-profile/provider-profile.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { AddUserDocumentComponent } from "../platform/modules/agency-portal/users/user-documents/add-user-document/add-user-document.component";
import { SaveDocumentComponent } from "./save-document/save-document.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ProviderFeeSettingsComponent } from "./provider-fee-settings/provider-fee-settings.component";
import { UrgentCareProviderListComponent } from "./urgentcareprovider-list/urgentcareprovider-list.component";
import { UrgentCareAppointmentComponent } from "./urgentcare-appointment/urgentcare-appointment.component";
import { DesclaimerComponent } from './desclaimer/desclaimer.component';
import { VideoPopupComponent } from "./video-popup/video-popup.component";
import { ConsultationFeesComponent } from "./consultation-fees/consultation-fees.component";
import { LabBookingListComponent } from "./lab-booking-list/lab-booking-list.component";
import { LabBookAppointmentModalComponent } from "./lab-booking-list/lab-book-appointment-modal/lab-book-appointment-modal.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { BlogComponent } from "./blog/blog.component";
import { DynamicContnetComponent } from './dynamic-contnet/dynamic-contnet.component';
import { HealthServiceComponent } from "./health-service/health-service.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { OurSpecialityComponent } from "./our-speciality/our-speciality.component";
import { ProvidersComponent } from "./providers/providers.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { RefundAndCancellationComponent } from './refund-policy/refund-and-cancellation/refund-and-cancellation.component';
import { NgSelectModule } from "@ng-select/ng-select";
@NgModule({
  imports: [
    CommonModule,
    FrontMaterialModule,
    FrontRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CarouselModule,
    NgSelectModule,
    DatepickerModule,
    ScrollbarModule,
    MatStepperModule,
    NgxGalleryModule,
    NgxSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    //NgxUploaderModule,
    RatingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD9WPa4_81AAXVhPJdQm1tZU5cp-NvrrR4"
      //"AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw"
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
      //libraries: ["places"]
    }),
    //StripeModule.forRoot("pk_test_eDyXvdOe0IkSPxG2dQBNGlk600XXmL8M1q"),
    OverlayModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  // exports:[
  //   NgxMaterialTimepickerModule
  // ],
  declarations: [
    RegisterComponent,
    RejectInvitationComponent,
    HomeComponent,
    DoctorListComponent,
    DoctorProfileComponent,
    LabPharmacyListComponent,
    HomeContainerComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    BookAppointmentComponent,
    VideoPopupComponent,
    BookFreeAppointmentComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    WhatWeDoComponent,
    OurDoctorsComponent,
    ContactUsComponent,
    TermsConditionModalComponent,
    FaqComponent,
    ProviderProfileModalComponent,
    //AddUserDocumentComponent
    SaveDocumentComponent,
    ProviderFeeSettingsComponent,
    UrgentCareProviderListComponent,
    UrgentCareAppointmentComponent,
    DesclaimerComponent,
    ConsultationFeesComponent,
    LabBookingListComponent,
    LabBookAppointmentModalComponent,
    HealthServiceComponent,
    AboutUsComponent,
    BlogComponent,
    DynamicContnetComponent,
    OurSpecialityComponent,
    ProvidersComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    RefundAndCancellationComponent
    //ChangePasswordComponent
  ],
  // entryComponents: [
  //   AgencyLoginModelComponent,
  //   ClientLoginModelComponent,
  //   RegisterModelComponent,
  //   LoginModelComponent,
  //   SecurityQuestionModelComponent,
  //   BookAppointmentComponent,
  //   VideoPopupComponent,
  //   BookFreeAppointmentComponent,
  //   TermsConditionModalComponent,
  //   ProviderProfileModalComponent,
  //   SaveDocumentComponent,
  //   ProviderFeeSettingsComponent,
  //   UrgentCareProviderListComponent,
  //   UrgentCareAppointmentComponent,
  //   DesclaimerComponent,
  //   ConsultationFeesComponent,
  //   LabBookAppointmentModalComponent,
  //   TermsAndConditionsComponent,
  //   PrivacyPolicyComponent

  //   //AddUserDocumentComponent
  //   //ChangePasswordComponent
  // ],
  providers: [
    CommonService,
    DatePipe,
    UniquePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA,  
      useValue: {
      hasBackdrop: true,
      disableClose: true,
      minWidth: "55%",
      maxWidth: "90%"
    } 
  },
    //{ provide: MdDialogRef, useValue: {} }
  ]
})
export class FrontModule {
  constructor(commonService: CommonService) {
    commonService.initializeAuthData();
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
