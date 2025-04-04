import { FrontRoutingModule } from "./front/front-routing.module";
import { FrontModule } from "src/app/front/front.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubDomainGuard } from "./subDomain.guard";
import { ReferralQrCodePageComponent } from "./shared/QrCodeScanPage/referral-qr-code-page/referral-qr-code-page.component";
import { QRCodeResultScanLandingPageComponent } from "./shared/qrcode-result-scan-landing-page/qrcode-result-scan-landing-page.component";
import { TestPaymentFlowComponent } from "./shared/test-payment-flow/test-payment-flow.component";
import { PaymentSuccessTestComponent } from "./shared/payment-success-test/payment-success-test.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [SubDomainGuard],
    //pathMatch: 'full',
   // loadChildren: "./front/front.module#FrontModule"
    loadChildren: () => import('./front/front.module').then(m => m.FrontModule)
    //redirectTo: '/web'
  },
  {
    path: "web",
    canActivate: [SubDomainGuard],
   // loadChildren: "./platform/platform.module#PlatformModule"
   loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule)
  },
  {
    path: "webadmin",
    // loadChildren:
    //   "./super-admin-portal/super-admin-portal.module#SuperAdminPortalModule"
    loadChildren: () => import('./super-admin-portal/super-admin-portal.module').then(m => m.SuperAdminPortalModule)
  },
  {
    path: "referal/:id",
    component:ReferralQrCodePageComponent
  },
  {
    path: "referalResult/:id",
    component:QRCodeResultScanLandingPageComponent
  },


  {
    path: "testPayment",
    component:TestPaymentFlowComponent
  },
  {
    path: "testPaymentSuccess",
    component:PaymentSuccessTestComponent
  },



  // {
  //   path: 'front',
  //   loadChildren: './front/front.module#FrontModule'
  // },
  // otherwise redirect to home
  { path: "**", redirectTo: "/" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    anchorScrolling: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
