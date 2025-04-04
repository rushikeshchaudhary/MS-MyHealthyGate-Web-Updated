import { PaymentFailureComponent } from "./payment-failure/payment-failure.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "src/app/front/register/register.component";
import { RejectInvitationComponent } from "src/app/front/reject-invitation/reject-invitation.component";
import { HomeComponent } from "./home/home.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { LabPharmacyListComponent } from "./lab-pharmacy-list/lab-pharmacy-list.component";
import { DoctorProfileComponent } from "./doctor-profile/doctor-profile.component";
import { PageNotAllowedComponent } from "src/app/platform/modules/page-not-allowed/page-not-allowed.component";
import { HomeContainerComponent } from "src/app/front/home-container/home-container.component";
import { WhatWeDoComponent } from "./what-we-do/what-we-do.component";
import { OurDoctorsComponent } from "./our-doctors/our-doctors.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { FaqComponent } from "./faq/faq.component";
import { UrgentCareProviderListComponent } from "./urgentcareprovider-list/urgentcareprovider-list.component";

import { SymptomCheckerComponent } from "./../shared/symptom-checker/symptom-checker.component";
import { LabBookingListComponent } from "./lab-booking-list/lab-booking-list.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { BlogComponent } from "./blog/blog.component";
import { DynamicContnetComponent } from "./dynamic-contnet/dynamic-contnet.component";
import { HealthServiceComponent } from "./health-service/health-service.component";
import { OurSpecialityComponent } from "./our-speciality/our-speciality.component";
import { ProvidersComponent } from "./providers/providers.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { RefundAndCancellationComponent } from "./refund-policy/refund-and-cancellation/refund-and-cancellation.component";

const routes: Routes = [
  {
    path: "",
    component: HomeContainerComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "doctor-list",
        component: DoctorListComponent,
      },
      {
        path: "doctor-profile",
        component: DoctorProfileComponent,
      },
      {
        path: "lab-pharmacy-list",
        component: LabPharmacyListComponent,
      },
      {
        path: "lab-booking",
        component: LabBookingListComponent,
      },
      {
        path: "payment-success",
        component: PaymentSuccessComponent,
      },
      {
        path: "payment-failure",
        component: PaymentFailureComponent,
      },
      {
        path: "what-we-do",
        component: WhatWeDoComponent,
      },
      {
        path: "our-doctors",
        component: OurDoctorsComponent,
      },
      {
        path: "providers",
        component: ProvidersComponent
      },
      {
        path: "contact-us",
        component: ContactUsComponent,
      },
      {
        path: "faq",
        component: FaqComponent,
      },
      {
        path: "health-services",
        component: HealthServiceComponent,
      },
      {
        path: "our-speciality",
        component: OurSpecialityComponent,
      },
      {
        path: "providers",
        component: ProvidersComponent,
      },
      {
        path: "urgentcare-providers",
        component: UrgentCareProviderListComponent,
      },
      {
        path: "symptom-checker",
        component: SymptomCheckerComponent,
      },
      {
        path: "about-us",
        component: AboutUsComponent,
      },
      {
        path: "blog",
        component: BlogComponent,
      },
      {
        path: "dynamic/:id",
        component: DynamicContnetComponent,
      },
    ],
  },
  // {
  //   path: "contact-us",
  //   component: ContactUsComponent,
  // },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "reject-invitation",
    component: RejectInvitationComponent,
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent,
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
  },
  {
    path: "refund-and-cancellation-policy",
    component: RefundAndCancellationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontRoutingModule { }
