import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import {
  Component,
  OnInit,
  ComponentRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { RegisterService } from "src/app/front/register/register.service";
import { UserModel } from "src/app/platform/modules/agency-portal/users/users.model";
import { PasswordValidator } from "src/app/shared/password-validator";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { InvitationRegisterModel } from "src/app/front/register/register.model";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { NotifierService } from "angular-notifier";
import { SubDomainService } from "src/app/subDomain.service";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { reject } from "lodash";

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
  selector: "app-register-model",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterModelComponent implements OnInit {
  invitationId: string = "";
  userForm!: FormGroup;
  userModel: UserModel;
  registerInvitationModel: InvitationRegisterModel;
  submitted: boolean = false;
  masterGender: any = [];
  masterRoles: any = [];
  masterLocation: any = [];
  isTokenValid: boolean = true;
  isUsernameExisted: boolean = false;
  Message: any;
  isShowPassword: any;
  isShowRePassword: any;
  maxDate = new Date();
  logoUrl: string = "";
  userType: string = "";
  private dobValidation = [Validators.required];
  constructor(
    private dialogModalRef: MatDialogRef<RegisterModelComponent>,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private subDomainService: SubDomainService,
    private dialogModal: MatDialog,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    dialogModalRef.disableClose = true;
    this.userModel = new UserModel();
    this.registerInvitationModel = new InvitationRegisterModel();
  }
  ngOnInit() {
    this.Message = {
      title: "Oops",
      message:
        "Either token isn't legitimate or lapsed or client previously enrolled with this token id, it would be ideal if you contact organization for additional help.",
      imgSrc: "../assets/img/user-register-icon.png",
    };
    this.activatedRoute.queryParams.subscribe((params) => {
      if (
        (params["token"]! =
          undefined && params["token"] != null && params["token"] != "")
      )
        this.invitationId = params["token"];
    });
    let unamePattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$";
    this.userForm = this.formBuilder.group(
      {
        firstName: [this.userModel.firstName],
        lastName: [this.userModel.lastName],
       // middleName: [this.userModel.middleName],
        phone: [this.userModel.phoneNumber],
        dob: [this.userModel.dob, this.dobValidation],
       // email: [this.userModel.email, [Validators.required, Validators.email]],
        gender: [this.userModel.gender, [Validators.required]],
        roleId: [this.userModel.roleID, [Validators.required]],
        // locationId: [this.userModel.locationIds, [Validators.required]],    //agencyremove
        locationId: [101],
        userName: [
          this.userModel.userName,
          {
            validators: [Validators.required],
            asyncValidators: [this.validateUsername.bind(this)],
            updateOn: "blur",
          },
        ],
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

    if (this.invitationId != "") {
      this.registerService
        .checkTokenAccessibility(this.invitationId)
        .subscribe((res) => {
          if (res.statusCode != 200) {
            this.isTokenValid = false;
          } else {
            this.userModel = res.data;
            this.userForm.patchValue(this.userModel);
            this.isTokenValid = true;
          }
        });
    }
    this.registerService
      .getMasterData("MASTERGENDER,MASTERROLESALL,MASTERLOCATION")
      .subscribe((response) => {
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        this.masterRoles =
          response.masterRoles != null ? response.masterRoles : [];
        this.masterLocation =
          response.masterLocation != null ? response.masterLocation : [];
      });
    this.subDomainService.getSubDomainInfo().subscribe((domainInfo) => {
      if (domainInfo)
        this.logoUrl =
          "data:image/png;base64," + domainInfo.organization.logoBase64;
    });
  }
  get formControls() {
    return this.userForm.controls;
  }
  onRoleChange(event: any) {
    var role = this.masterRoles.find((x: { id: any; }) => x.id == event.value);
    const dob = this.userForm.get("dob");
    if(dob){
      if (role.userType == "PROVIDER") {
        dob.setValidators([Validators.required, AgeValidator.bind(this)]);
      } else {
        dob.setValidators([Validators.required]);
      }
      dob.updateValueAndValidity();
    }
    
  }
  // validateAge(
  //   ctrl: AbstractControl
  // ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  //   return new Promise(resolve => {
  //     if (!ctrl.dirty && !ctrl.untouched) {
  //      resolve(null);;
  //     } else {
  //       var selectedDate = new Date(ctrl.value);
  //       var today = new Date();
  //       var year = today.getFullYear();
  //       var month = today.getMonth() + 1;
  //       var day = today.getDate();
  //       var yy = selectedDate.getFullYear();
  //       var mm = selectedDate.getMonth() + 1;
  //       var dd = selectedDate.getDate();
  //       var years, months, days;
  //       // months
  //       months = month - mm;
  //       if (day < dd) {
  //         months = months - 1;
  //       }
  //       // years
  //       years = year - yy;
  //       if (month * 100 + day < mm * 100 + dd) {
  //         years = years - 1;
  //         months = months + 12;
  //       }
  //       // days
  //       days = Math.floor(
  //         (today.getTime() -
  //           new Date(yy + years, mm + months - 1, dd).getTime()) /
  //           (24 * 60 * 60 * 1000)
  //       );
  //       if (years < 18) resolve({ age: true });
  //       else resolve(null);;
  //     }
  //   });
  // }
  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls['password'].value;
    let confirmPass = formGroup.controls['confirmPassword'].value;

    if (!confirmPass.length) return null;
    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls['confirmPassword'].setErrors({ notSame: true });
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        reject(null);
      } else {
        let userName = ctrl.value;
        this.registerService
          .checkUserNameExistance(userName)
          .subscribe((response: any) => {
            if (response.statusCode != 200) resolve({ uniqueName: true });
            else  reject(null);;
          });
      }
    });
  }
  onSubmit() {
    
    if (!this.userForm.invalid) {
      this.submitted = true;
      this.registerService
        .registerNewUserWithoutToken(this.userForm.value)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
              this.isTokenValid = false;
              this.Message = {
                title: "Success!",
                message:
                  "Thank you, Your account has been successfully created with us, please contact administation for further assistance.",
                imgSrc: "../assets/img/user-success-icon.png",
              };
            } else {
              this.notifier.notify("error", response.message);
            }
          } else {
            this.notifier.notify("error","unfortunately something went wrong");
          }
        });
    }
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }

  openDialogLogin() {
    this.closeDialog(null);
    let dbModal;
    dbModal = this.dialogModal.open(LoginModelComponent, { data: {} });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }
}
