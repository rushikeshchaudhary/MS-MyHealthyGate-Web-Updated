import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgencyLoginComponent } from "./agency-login/agency-login.component";
import { AuthComponent } from "./auth/auth.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthRoutingModule } from "./auth.routing";
import { AuthenticationService } from "./auth.service";
import { ClientLoginComponent } from "./client-login/client-login.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { ResetPasswordComponent } from "src/app/platform/modules/auth/reset-password/reset-password.component";
import { LoginSelectionComponent } from "./login-selection/login-selection.component";
import { RegistrationComponent } from "./registration/registration.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPaymentComponent } from "./NewPayment/NewPayment.component";
import { LabLoginComponent } from "./lab-login/lab-login.component";
import { PharmacyLoginComponent } from "./pharmacy-login/pharmacy-login.component";
import { RegistrationLabPharmacyComponent } from './registration-lab-pharmacy/registration-lab-pharmacy.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RadiologyLoginComponent } from './radiology-login/radiology-login.component';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SecuritywecomeComponent } from './securitywecome/securitywecome.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    SharedModule
  ],
  // entryComponents:[
  //   SecuritywecomeComponent
  // ],
  declarations: [
    AgencyLoginComponent,
    AuthComponent,
    AgencyLoginComponent,
    ClientLoginComponent,
    ForgotPasswordComponent,
    SecurityQuestionComponent,
    ResetPasswordComponent,
    LoginSelectionComponent,
    RegistrationComponent,
    NewPaymentComponent,
    LabLoginComponent,
    PharmacyLoginComponent,
    RegistrationLabPharmacyComponent,
    SignUpComponent,
    RadiologyLoginComponent,
    SecuritywecomeComponent
  ],
  exports: [RegistrationComponent, RegistrationLabPharmacyComponent],
  providers: [AuthenticationService]
})
export class AuthModule { }
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}