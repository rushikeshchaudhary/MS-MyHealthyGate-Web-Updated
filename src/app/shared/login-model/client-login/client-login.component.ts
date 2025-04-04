import { NotifierService } from "angular-notifier";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";
import { SecurityQuestionModelComponent } from "../../security-question-model/security-question-model.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-client-login",
  templateUrl: "./client-login.component.html",
  styleUrls: ["./client-login.component.css"]
})
export class ClientLoginModelComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string='';
  subDomainInfo: any;
  errorMessage: string|null = null;
  ipAddress: string='';
  isShowPassword: boolean = false;

  constructor(
    private dialogModalRef: MatDialogRef<ClientLoginModelComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    dialogModalRef.disableClose = true;
  }

  ngOnInit() {
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // reset login status
    //this.commonService.logout();

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = "web/client/dashboard";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const postData = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authenticationService
      .clientLogin(postData)
      .pipe(first())
      .subscribe(
        response => {
        
          if (
            response.statusCode >= 400 &&
            response.statusCode < 500 &&
            response.message
          ) {
            this.errorMessage = response.message;
            this.loading = false;
          } else if (response.statusCode === 205) {
            this.errorMessage = response.message;
            this.loading = false;
          } else if (response.firstTimeLogin == true)
          {
            this.openDialogSecurityQuestion();
            this.router.navigate([this.returnUrl]);
          }else {
            this.commonService.setIsPatient(true);
            
            this.notifier.notify(
              "success",
              "Login successfully, You have other menu choices soon after clicking picture"
            );
            this.closeDialog({
              response: response,
              isPatient: true
            });
            //this.router.navigate(["/doctor-list"]);
          }
        },
        error => {
          console.log(error);
          // this.alertService.error(error);
          this.errorMessage = error;
          this.loading = false;
        }
      );
  }
  openDialogSecurityQuestion(){
    this.closeDialog(null);
    let dbModal;
    dbModal = this.dialogModal.open(SecurityQuestionModelComponent, {
      hasBackdrop: true,
      data:{}
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }
  openDialogRegister() {
    this.closeDialog(null);
    let dbModal;
    dbModal = this.dialogModal.open(RegisterModelComponent, {hasBackdrop: true, data: {} });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }
  forgetPassword() {
    this.closeDialog("");
    this.router.navigateByUrl("/web/forgot-password");
  }
}


