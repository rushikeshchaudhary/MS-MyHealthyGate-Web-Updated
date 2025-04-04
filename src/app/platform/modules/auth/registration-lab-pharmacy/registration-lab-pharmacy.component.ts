import { Component, Input, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { RegisterService } from "src/app/front/register/register.service";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";
import { PasswordValidator } from "src/app/shared/password-validator";
import { SubDomainService } from "src/app/subDomain.service";
import { UserModel } from "../../agency-portal/users/users.model";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { AuthenticationService } from "../auth.service";
import { UsersService } from "../../agency-portal/users/users.service";

export function AgeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  var selectedDate = new Date(control.value);
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var yy = selectedDate.getFullYear();
  var mm = selectedDate.getMonth() + 1;
  var dd = selectedDate.getDate();
  var years, months, days;
  // months
  months = month - mm;
  if (day < dd) {
    months = months - 1;
  }
  // years
  years = year - yy;
  if (month * 100 + day < mm * 100 + dd) {
    years = years - 1;
    months = months + 12;
  }
  // days
  days = Math.floor(
    (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
    (24 * 60 * 60 * 1000)
  );
  if (years < 18) return { age: true };
  else return null;
  //
  //return { years: years, months: months, days: days };
}

@Component({
  selector: "app-registration-lab-pharmacy",
  templateUrl: "./registration-lab-pharmacy.component.html",
  styleUrls: ["./registration-lab-pharmacy.component.css"],
})
export class RegistrationLabPharmacyComponent implements OnInit {
  registrationForm!: FormGroup;
  showLoader = false;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subDomainInfo: any;
  errorMessage: string |null = null;
  ipAddress!: string;
  isLab = false;
  isPharmacy = false;
  userModel: UserModel;
  maxDate = new Date();
  minDate = new Date(1900, 1, 1);
  isShowPassword!: boolean;
  isShowRePassword!: boolean;
  masterGender: any = [];
  masterRoles: any = [];
  masterLocation: any = [];
  isTokenValid: boolean = true;
  isUsernameExisted: boolean = false;
  Message: any;
  logoUrl!: string;
  userType: string = "";
  private dobValidation = [Validators.required];
  organizationModel!: string;
  @Input()
  formType!: string;
  @Input() showFooter: boolean = true;
  phoneCountryCode: any;
  masterCountry: any = [];
  masterState: any = [];
  previousCountryId!: number;
  pObJ: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private subDomainService: SubDomainService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private usersService: UsersService,
  ) {
    /* if (this.formType == "lab") {
       this.isLab = true;
       this.isPharmacy = false;
       this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
     } else if (this.formType == "pharmacy-signup") {
       this.isPharmacy = true;
       this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
     }*/
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.userModel = new UserModel();
  }

  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    let webUrl = window.location.origin;
    this.commonService.sytemInfo.subscribe((obj) => {
      this.ipAddress = obj.ipAddress;
    });
    this.usersService
      .getMasterData("masterCountry,masterState", true, [])
      .subscribe((response: any) => {
        if (response != null) {
          this.masterCountry = response.masterCountry;
          this.masterState = response.masterState;
        }
      });

    /* if (this.isLab) {
       this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-patient.jpg");
       webUrl = `${webUrl}/web/client-login`;
     }
     else if (this.isPharmacy) {
       this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-doc.jpg")
       webUrl = `${webUrl}/web/login`;
     }*/
    this.authenticationService.updateSideScreenImgSrc(
      "../../../../../assets/signup-doc.jpg"
    );
    webUrl = `${webUrl}/web/login`;
    this.registrationForm = this.formBuilder.group(
      {
        labPharmacyName: [this.userModel.labPharmacyName],
        firstName: [this.userModel.firstName],
        middleName: [this.userModel.middleName],
        lastName: [this.userModel.lastName],
        phone: [
          this.userModel.phoneNumber,
          [Validators.required, Validators.pattern, Validators.minLength(10)],
        ],
        //dob: [this.userModel.dob, this.dobValidation],
        email: [
          this.userModel.email,
          [
            Validators.required,
            Validators.email,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          ],
        ],
        gender: [2],
        address: [this.userModel.address],
        stateID: [],
        countryID: [],
        roleId: [this.userModel.roleID, [Validators.required]],
        locationId: [101],
        webUrl: webUrl,
        username: [this.userModel.userName],
        password: [
          this.userModel.password,
          [Validators.required, PasswordValidator.strong],
        ],
        confirmPassword: [this.userModel.confirmPassword],
      },
      {
        validator: this.validateForm.bind(this),
      }
    );
    this.getMasterData();
    this.commonService.logout();
    this.returnUrl = "web/client/dashboard";
  }
  handleAddressChange(addressObj: any) {
    let countryIdMaped =
      this.masterCountry.find(
        (x: { value: string; }) => x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
      ) == null
        ? null
        : this.masterCountry.find(
          (x: { value: string; }) =>
            x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
        ).id;

    if (this.previousCountryId != countryIdMaped) {
      // this.masterState=[];
    }
    console.log(addressObj);

    this.updateValue(countryIdMaped, addressObj);
  }

  updateValue(country: any, addressObj: any) {
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      if (res.statusCode == 200) {
        this.masterState = res.data;
        let stateIdMapped =
          this.masterState.find(
            (y: { value: any; }) =>
              (y.value || "").toUpperCase() ==
              (addressObj.state || "").toUpperCase()
          ) == null
            ? null
            : this.masterState.find(
              (y: { value: any; }) =>
                (y.value || "").toUpperCase() ==
                (addressObj.state || "").toUpperCase()
            ).id;

        this.pObJ = {
          address: addressObj.address1,
          countryID: country,
          city: addressObj.city,
          stateID: stateIdMapped,
          zip: addressObj.zip,
          latitude: addressObj.latitude,
          longitude: addressObj.longitude,
          apartmentNumber: "",
        };
        this.registrationForm.patchValue(this.pObJ);
      } else {
        this.masterState = [];
        this.notifier.notify("error", res.message);
      }
    });
    /*this.masterState =this.usersService.getStateByCountryId(country).toPromise();
    return this.masterState;*/
  }
  get f() {
    return this.registrationForm.controls;
  }

  getMasterData() {
    this.registerService
      .getMasterData("MASTERGENDER,MASTERROLESALL,MASTERLOCATION,MASTERPREFIX")
      .subscribe((response) => {
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        this.masterRoles =
          response.masterRoles != null ? response.masterRoles : [];
        this.masterLocation =
          response.masterLocation != null ? response.masterLocation : [];
        if (this.formType.toLowerCase() == "lab") {
          const labRoleId = response.masterRoles.find(
            (x: { userType: string; }) => x.userType == "LAB"
          ).id;
          this.userModel.roleID = labRoleId;
          this.f["roleId"].setValue(labRoleId);
        } else if (this.formType.toLowerCase() == "pharmacy") {
          const pharmacyRoleId = response.masterRoles.find(
            (x: { userType: string; }) => x.userType == "PHARMACY"
          ).id;
          this.userModel.roleID = pharmacyRoleId;
          this.f["roleId"].setValue(pharmacyRoleId);

          this.f["dob"].setValidators([
            Validators.required,
            AgeValidator.bind(this),
          ]);
          this.f["dob"].updateValueAndValidity();
        } else if (this.formType.toLowerCase() == "radiology") {
          const radiologyRoleId = response.masterRoles.find(
            (x: { userType: string; }) => x.userType == "RADIOLOGY"
          ).id;
          this.userModel.roleID = radiologyRoleId;
          this.f["roleId"].setValue(radiologyRoleId);
          this.f["dob"].setValidators([
            Validators.required,
            AgeValidator.bind(this),
          ]);
          this.f["dob"].updateValueAndValidity();
        }
      });

    this.subDomainService.getSubDomainInfo().subscribe((domainInfo) => {
      if (domainInfo)
        this.logoUrl =
          "data:image/png;base64," + domainInfo.organization.logoBase64;
    });
  }

  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls["password"].value;
    let confirmPass = formGroup.controls["confirmPassword"].value;

    if (!confirmPass.length) return null;
    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls["confirmPassword"].setErrors({ notSame: true });
  }

  toSignInpage() {
    if (this.formType.toLowerCase() == "lab" && this.showFooter) {
      this.redirect("/web/login");
    } else if (this.formType.toLowerCase() == "pharmacy" && this.showFooter) {
      this.redirect("/web/login");
    } else if (this.formType.toLowerCase() == "radiology" && this.showFooter) {
      this.redirect("/web/login");
    } else if (!this.showFooter) {
      window.location.reload();
    } else {
      this.redirect("/web/sign-up");
    }
  }

  onSubmit() {
    this.submitted = true;
    this.f["username"].setValue(this.f["email"].value);
    if (this.registrationForm.invalid) {
      return;
    }
    this.registrationForm.value.phone =
      this.phoneCountryCode + "" + this.registrationForm.value.phone;

    this.registrationForm.value.address = this.pObJ.address
    this.registrationForm.value.countryID = this.pObJ.countryID
    this.registrationForm.value.stateID = this.pObJ.stateID

    this.showLoader = true;
    this.registerService
      .registerNewUserWithoutToken(this.registrationForm.value)
      .subscribe((response: ResponseModel) => {
        this.showLoader = false;
        this.submitted = false;
        if (response != null) {
          //////debugger
          if (response.statusCode == 200) {
            this.isTokenValid = false;
            this.notifier.notify(
              "success",
              "Thank you, Your account has been successfully created with us, please contact administation for further assistance."
            );
            this.loading = true;
            setTimeout(() => {
              this.toSignInpage();
            }, 3000);
          } else {
            this.notifier.notify("error", response.message);
          }
        } 
      });
    this.errorMessage = null;
  }

  redirect(path:any) {
    this.router.navigate([path]);
  }

  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width: "70%",
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
      }
    });
  }

  phoneCodeChange($event: any) {
    this.phoneCountryCode = $event;

    // this.registrationForm.controls.phone.setValue($event);
  }
}