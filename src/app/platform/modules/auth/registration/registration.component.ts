import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { DesclaimerComponent } from "src/app/front/desclaimer/desclaimer.component";
import { RegisterService } from "src/app/front/register/register.service";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";
import { PasswordValidator } from "src/app/shared/password-validator";
import { SubDomainService } from "src/app/subDomain.service";
import { UserModel } from "../../agency-portal/users/users.model";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { AuthenticationService } from "../auth.service";

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
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit {
  //export class RegistrationComponent  {
  registrationForm!: FormGroup;
  showLoader = false;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subDomainInfo: any;
  errorMessage: string |null = null;
  ipAddress!: string;
  isPatient = false;
  isProvider = false;
  userModel: UserModel;
  maxDate = new Date();
  minDate = new Date(1900, 1, 1);
  isShowPassword: any;
  isShowRePassword: any;
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
  emailExist: boolean = false;
  @Input()
  formType!: string;
  @Input() showFooter: boolean = true;
  phoneCountryCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private subDomainService: SubDomainService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private dialogModal: MatDialog
  ) {
    //this.formType="patient";
    if (this.formType != undefined) {
      if (this.formType.toLowerCase() == "patient") {
        this.isPatient = true;
        this.isProvider = false;
        this.maxDate.setFullYear(this.maxDate.getFullYear());
      } else if (this.formType.toLowerCase() == "provider") {
        this.isProvider = true;
        this.isPatient = false;
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
      }
    }
    // this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.userModel = new UserModel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("value changed", this.formType);
    if (this.formType.toLowerCase() == "patient") {
      this.isPatient = true;
      this.isProvider = false;
      if (this.registrationForm && this.registrationForm.contains('clinicName')) {
        this.registrationForm.removeControl('clinicName');
      }
      //this.registrationForm.removeControl("clinicName");
      this.maxDate.setFullYear(this.maxDate.getFullYear());
    } else if (this.formType.toLowerCase() == "provider") {
      this.isProvider = true;
      this.isPatient = false;
      // this.registrationForm.addControl(
      //   'clinicName',
      //   this.formBuilder.control("", Validators.required)
      // );
      if (this.registrationForm && !this.registrationForm.contains('clinicName')) {
        this.registrationForm.addControl(
          'clinicName',
          this.formBuilder.control("", Validators.required)
        );
      }
      this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }
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

    // webUrl = `${webUrl}/web/login`;

    this.commonService.sytemInfo.subscribe((obj) => {
      this.ipAddress = obj.ipAddress;
    });

    if (this.formType.toLowerCase() == "patient") {
      this.authenticationService.updateSideScreenImgSrc(
        "../../../../../assets/signup-patient.jpg"
      );
      webUrl = `${webUrl}/web/client-login`;
    } else if (this.formType.toLowerCase() == "provider") {
      this.authenticationService.updateSideScreenImgSrc(
        "../../../../../assets/signup-doc.jpg"
      );
      webUrl = `${webUrl}/web/login`;
    }

    this.registrationForm = this.formBuilder.group(
      {
        firstName: [this.userModel.firstName],
        middleName:[this.userModel.middleName],
        lastName: [this.userModel.lastName],
        phone: [
          this.userModel.phoneNumber,
          [Validators.required, Validators.pattern],
        ],
        dob: [this.userModel.dob, this.dobValidation],
        email: [
          this.userModel.email,
          [
            Validators.required,
            Validators.email,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          ],
        ],
        gender: [this.userModel.gender, [Validators.required]],
        roleId: [this.userModel.roleID, [Validators.required]],
        clinicName:[this.userModel.roleID, [Validators.required]],
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

    // if(this.isPatient){
    //   this.registrationForm.removeControl("resume");
    //   this.registrationForm.updateValueAndValidity();
    // }

    // reset login status
    this.commonService.logout();

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = "web/client/dashboard";
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

        if (this.formType.toLowerCase() == "patient") {
          // const patientRoleId = response.masterRoles.find(x => x.userType == "CLIENT").id;
          // this.userModel.roleID = patientRoleId;
          // this.f.roleId.setValue(patientRoleId);
        } else if (this.formType.toLowerCase() == "provider") {
          // const provinderRoleId = response.masterRoles.find(x => x.userType == "PROVIDER").id;
          // this.userModel.roleID = provinderRoleId;
          // this.f.roleId.setValue(provinderRoleId);

          // const provinderRoleId = response.masterRoles.find(x => x.userType == "PROVIDER").id;
          // this.userModel.roleID = provinderRoleId;
          // this.f.roleId.setValue(provinderRoleId);
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

  get f() {
    return this.registrationForm.controls;
  }

  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls["password"].value;
    let confirmPass = formGroup.controls["confirmPassword"].value;

    if (!confirmPass.length) return null;
    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls["confirmPassword"].setErrors({ notSame: true });
  }
  validateEmail() {
    let email = this.registrationForm.controls["email"].value;
    this.registerService.validateEmail(email).subscribe((response: ResponseModel) => {
      if (response.statusCode == 302) {
        this.emailExist = true;
        // this.notifier.notify("error", response.message);
      } else {
        this.emailExist = false;
      }
    });
    console.log(this.registrationForm.controls["email"].value);
  }
  toSignInpage() {
    if (!this.showFooter) {
      window.location.reload();
    } else {
      this.redirect("/web/login");
    }

    /*if (this.isPatient) {
      this.redirect('/web/client-login');
    } else if (this.isProvider) {
      this.redirect('/web/login');
    }*/
  }
  validateConfirmPassword() {
    let pass = this.registrationForm.controls["password"].value;
    let confirmPass = this.registrationForm.controls["confirmPassword"].value;
    if (!confirmPass.length) return null;

    if (pass && confirmPass && pass === confirmPass) {
      this.submitted = false;
      return null;
    } else {
      this.submitted = true;
      return this.registrationForm.controls["confirmPassword"].setErrors({ notSame: true });
    }

  }
  phoneCodeChange($event: any) {
    console.log("phoneCodeChange :", $event);
    this.phoneCountryCode = $event;
    // this.registrationForm.controls.phone.setValue($event);
    // this.registrationForm.controls.phone.setValue($event);
  }

  onSubmit() {
    debugger
    console.log("Click On Signup");
    this.loading=true;
    this.showLoader = true;
    if (this.formType.toLowerCase() == "patient") {
      this.checkAge(this.f["dob"].value);
      if (sessionStorage.getItem("iagree")) {
        this.dialogModal.closeAll();
        sessionStorage.removeItem("iagree");
        this.submitted = true;
        const patientRoleId = this.masterRoles.find(
          (x: { userType: string; }) => x.userType == "CLIENT"
        ).id;
        this.userModel.roleID = patientRoleId;
        this.f["roleId"].setValue(patientRoleId);
        this.f["username"].setValue(this.f["email"].value);
        this.f["username"].setValue(this.f["email"].value);
        this.f["clinicName"].clearValidators();
        this.f["clinicName"].updateValueAndValidity();
        
        /// To check if phone number is all zero then it's invalid.
        /// Currently this is not working
        /// If you know any solution you are welcome to correct it.
        ///New Solution:
        // if(this.f.phone.value.length === 14){
        //   let Hphone = this.f.phone.value;
        //   if(Hphone === "(000) 000-0000" || Hphone == "(111) 111-1111" || Hphone == "(222) 222-2222" || Hphone == "(333) 333-3333" || Hphone == "(444) 444-4444" || Hphone == "(555) 555-5555" || Hphone == "(666) 666-6666" || Hphone == "(777) 777-7777" || Hphone == "(888) 888-8888" || Hphone == "(999) 999-9999"){
        //     this.f.controls["phone"].setErrors({inValid: 'Invalid Username'});
        //   }
        // }
        //End of New solution
        // if(this.registrationForm.value){
        //   let isValidPhone = new RegExp("^(?!0+$)\(\d{3}\)\s?\d{3}-\d{4}$");
        //   let result = isValidPhone.test(this.registrationForm.value.phone);
        //   console.log(result+" "+ typeof(this.registrationForm.value.phone));
        //   if(!result){
        //     this.f.controls["phone"].setErrors(PatternValidator, {'incorrect': true});
        //   }
        // }
        this.registrationForm.value.phone =
          this.phoneCountryCode + "" + this.registrationForm.value.phone;

        // stop here if form is invalid
        if (this.registrationForm.invalid) {
          this.loading=false;
          this.showLoader = false;
          return;
        }
        this.showLoader = true;
        this.registerService
          .registerNewUserWithoutToken(this.registrationForm.value)
          .subscribe((response: ResponseModel) => {
            this.showLoader = false;
            this.submitted = false;
            if (response != null) {
              if (response.statusCode == 200) {
                this.isTokenValid = false;
                this.notifier.notify(
                  "success",
                  "Thank you, your account has been successfully created with us. To access all features,please login and complete your profile."
                );
                this.loading = true;
                setTimeout(() => {
                  this.toSignInpage();
                }, 3000);
              }else if(response.statusCode == 422){
              //else if(response.message == 'Patient already exist.Patient Email,MRN and User Name should be unique.'){
                this.loading=false;
                this.notifier.notify("error", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            } 
          });
        this.errorMessage = null;
      }
    } else {
      console.log('this.registrationForm.invalid', this.registrationForm.invalid);
      console.log('this.registrationForm', this.registrationForm);
      this.submitted = true;
      const providerRoleId = this.masterRoles.find(
        (x: { userType: string; }) => x.userType == this.formType.toUpperCase()
      ).id;
      this.userModel.roleID = providerRoleId;
      this.f["roleId"].setValue(providerRoleId);
      this.f["username"].setValue(this.f["email"].value);

      // concat country code with phone number with space
      this.registrationForm.value.phone =
        this.phoneCountryCode + "" + this.registrationForm.value.phone;

      // stop here if form is invalid
      if (this.registrationForm.invalid) {
        this.loading=false;
        this.showLoader = false;
        return;
      }
      this.showLoader = true;
      this.registerService
        .registerNewUserWithoutToken(this.registrationForm.value)
        .subscribe((response: ResponseModel) => {
          console.log('sign up API Response', response);

          this.showLoader = false;
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
              this.isTokenValid = false;
              this.notifier.notify(
                "success",
                "Thank you, Your account has been successfully created with us, To access all features, please login and complete your profile."
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
  checkAge(date: string): number {
    if(date){
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    let newage = age * 12 + month; // in months 216 months for 18 years

    if (newage >= 216) {
      sessionStorage.setItem("iagree", "yes");
    } else {
      let dbModal;
      dbModal = this.dialogModal.open(DesclaimerComponent, {
        hasBackdrop: true,
        width: "70%",
      });
      dbModal.afterClosed().subscribe((result: string) => {
        if (result == "close" || result == undefined) {
          this.submitted = false;
          this.loading = false;
        }
        // if(result = 'agree'){

        // }
      });
    }
    return age;
  }
  sessionStorage.setItem("iagree", "yes");
  return 0;
  }
}
