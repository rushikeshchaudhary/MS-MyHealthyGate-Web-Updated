import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TermsConditionModalComponent } from 'src/app/front/terms-conditions/terms-conditions.component';
import { SubDomainService } from 'src/app/subDomain.service';
import { CommonService } from '../../core/services';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [SubDomainService]
})
export class ClientLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string="";
  subDomainInfo: any;
  errorMessage: string | null = null;
  ipAddress: string="";
  isShowPassword = false;
  organizationModel: string="";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private dialogModal: MatDialog) {
    this.subDomainService.subjectlogo.subscribe(res => {

      if (res) {
        setTimeout(() => {
          this.organizationModel = sessionStorage.getItem("logo")!;
        }, 500);


      }
    });
    if (sessionStorage.getItem("logo"))
      this.organizationModel = sessionStorage.getItem("logo")!;


  }
  ngAfterViewChecked() {
    if (sessionStorage.getItem("logo")) {
      this.organizationModel = sessionStorage.getItem("logo")!;
    }
  }
  ngOnInit() {


    this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-patient.png");
    this.commonService.sytemInfo.subscribe((obj) => {
      this.ipAddress = obj.ipAddress;
    });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.commonService.logout();

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = 'web/client/dashboard';

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

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
      macaddress: 'ec:aa:a0:2d:dc:67',
    };
    this.authenticationService.clientLogin(postData)

      .pipe(first())
      .subscribe(
        response => {
          // localStorage.setItem("isPatient", "1");
          if ((response.statusCode >= 400 && response.statusCode < 500) && response.message) {
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
        });
  }
  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width: '70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {

      }
    });
  }

}
