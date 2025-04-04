import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubDomainService } from 'src/app/subDomain.service';
import { CommonService } from '../../core/services';
import { AuthenticationService } from '../auth.service';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionModalComponent } from 'src/app/front/terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-radiology-login',
  templateUrl: './radiology-login.component.html',
  styleUrls: ['./radiology-login.component.css']
})
export class RadiologyLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subDomainInfo: any;
  errorMessage: string |null = null;
  ipAddress!: string;
  isShowPassword = false;
  organizationModel!: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private dialogModal: MatDialog
  ) {
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
    if (sessionStorage.getItem("logo"))
      this.organizationModel = sessionStorage.getItem("logo")!;
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
    this.returnUrl = 'web/pharmacy/shared-prescription';

  }

  opentermconditionmodal() {
    let dbModel;
    dbModel = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width: '70%'
    });
    dbModel.afterClosed().subscribe((result) => {
      if (result != null && result != "close") {

      }
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) { return; }

    this.loading = true;
    this.errorMessage = null;

    const postData = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      ipaddress: this.ipAddress,
      macaddress: 'ec:aa:a0:2d:dc:67',
    };

    this.authenticationService.radiologyLogin(postData)
      .pipe(first())
      .subscribe(response => {
        localStorage.setItem("isRadiology", "1");
        if ((response.statusCode >= 400 && response.statusCode < 500) && response.message) {
          this.errorMessage = response.message;
          this.loading = false;
        } else if (response.statusCode === 205) {
          this.errorMessage = response.errorMessage;
          this.loading = false;
        } else if (response.access_token) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.router.navigate(['/web/security-question']);
        }
      }, error => {
        console.log(error);
        this.errorMessage = error;
        this.loading = false;
      });
  }
}
