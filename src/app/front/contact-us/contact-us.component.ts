
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { CommonService } from 'src/app/platform/modules/core/services';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionModalComponent } from '../terms-conditions/terms-conditions.component';
import { TranslateService } from "@ngx-translate/core";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string="";
  subDomainInfo: any;
  errorMessage: string | null = null;
  ipAddress: string="";
  sendContactUsDataUrl = "api/Organization/SendContactUsData";
  organizationEmailAddress: string = "corvus_admin@corvushealthrec.com";
  getOrganizationEmailAddressUrl = "api/Organization/GetOrganizationEmailAddress";
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
    private translate: TranslateService) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.contactUsForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      department: ["", Validators.required],
      reason: [""],
    });
    this.getOrganizationEmailAddress();
  }

  get f() {
    return this.contactUsForm.controls;
  }

  getOrganizationEmailAddress() {
    this.commonService.get(this.getOrganizationEmailAddressUrl).subscribe(res => {
      this.organizationEmailAddress = res.data;
    });
  }

  get mailToAddress(): string {
    if (this.organizationEmailAddress) {
      return "mailto:" + this.organizationEmailAddress + "?Subject=Hello%20again";
    } else {
      return "mailto:info@smartdatainc.net?Subject=Hello%20again";
    }

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

  onSubmit() {
    //////debugger
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactUsForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const postData = {
      Name: this.f["name"].value,
      EmailAddress: this.f["email"].value,
      Department: this.f["department"].value,
      Reason: this.f["reason"].value,
      IPaddress: this.ipAddress ? this.ipAddress : ''
    };

    this.commonService.post(this.sendContactUsDataUrl, postData, true).subscribe(res => {
      if (res.data) {
        this.notifier.notify('success', 'Submitted Successfully');
        this.router.navigate(['/']);
      }
    });

  }
}
