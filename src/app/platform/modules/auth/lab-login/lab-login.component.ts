import { NotifierService } from "angular-notifier";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";
import { SubDomainService } from "src/app/subDomain.service";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";

@Component({
  selector: 'app-lab-login',
  templateUrl: './lab-login.component.html',
  styleUrls: ['./lab-login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[SubDomainService]
})
export class LabLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subDomainInfo: any;
  errorMessage: string |null= null;
  ipAddress!: string;
  isShowPassword= false;
  organizationModel!: string;

  constructor(
    // private dialogModalRef: MatDialogRef<LabLoginComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private subDomainService : SubDomainService,
    private notifier: NotifierService
  ) { 
    // dialogModalRef.disableClose = true;
    this.subDomainService.subjectlogo.subscribe(res => {
      if (res) {
        setTimeout(() => {
          this.organizationModel = sessionStorage.getItem("logo")!;
        }, 500);
      }
    });
    if(sessionStorage.getItem("logo"))
      this.organizationModel=sessionStorage.getItem("logo")!;
  }

  ngOnInit() {
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.returnUrl = "web/client/dashboard";
  }

  opentermconditionmodal(){
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width:'70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
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
      username: this.f["username"].value,
      password: this.f["password"].value,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authenticationService
      .labLogin(postData)
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
          } else if (response.access_token) {        
            this.router.navigate([this.returnUrl]);            
          } else {

            this.router.navigate(['/web/security-question']);
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
  openDialogRegister() {
    this.closeDialog(null);
    let dbModal; 
    dbModal = this.dialogModal.open(RegisterModelComponent, { data: {} }); // need to change
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }
  closeDialog(action: any): void {
    // this.dialogModalRef.close(action);
  }
  forgetPassword() {
    this.closeDialog("");
    this.router.navigateByUrl("/web/forgot-password"); // need to change
  }


}
