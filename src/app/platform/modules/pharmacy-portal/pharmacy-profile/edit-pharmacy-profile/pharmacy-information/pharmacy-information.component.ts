import { Component, ElementRef, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { Observable } from "rxjs";
import { RegisterService } from "src/app/front/register/register.service";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { CommonService } from "src/app/platform/modules/core/services";
import { PharmacyService } from "../../../pharmacy.service";
import { Pharmacy } from "../../Pharmacy.model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-pharmacy-information",
  templateUrl: "./pharmacy-information.component.html",
  styleUrls: ["./pharmacy-information.component.css"],
})
export class PharmacyInformationComponent implements OnInit {
  PharmacyInfo: Array<Pharmacy> = [];
  PharmacyAddress: Array<any> = [];
  loginData: any;
  imagePreview: any;
  dataURL: any;
  masterGender: any = [];
  submitted: boolean = false;
  maxDate = new Date();
  pharmacyProfileForm!: FormGroup;
  isEditing: boolean = false;
  constructor(
    private commonService: CommonService,
    private pharmacyService: PharmacyService,
    private notifier: NotifierService,
    private route: Router,
    private el: ElementRef,
    private registerService: RegisterService,
    private usersService: UsersService,
    private FormBuilder: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
  }
  pharmacyId: any;
  ngOnInit() {
    
    const UserRole = localStorage.getItem("UserRole");
    if (UserRole == "PHARMACY") {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          this.loginData = user.data;
          this.pharmacyService.GetPharmacyById(user.data.id).subscribe((res) => {
            this.PharmacyInfo = res.data.pharmacyInfo;
            // this.PharmacyInfo = this.PharmacyInfo.map((x) => {
            //   x.dob = format(x.dob, 'MM/dd/yyyy');
            //   return x;
            // });
            this.PharmacyInfo = this.PharmacyInfo.map((x) => {
              x.registerDate = format(new Date(x.registerDate), 'MM/dd/yyyy');
              return x;
            });
            this.PharmacyInfo = this.PharmacyInfo.map((x) => {
              x.gender = x.gender == "Female" ? 1 : x.gender == "Male" ? 2 : 3;
              return x;
            });
            this.PharmacyAddress = res.data.pharmacyAddressInfo;

            if (this.PharmacyInfo.length > 0) {
              this.pharmacyProfileForm.patchValue(this.PharmacyInfo[0]);
            }
          });
        }
      });
    }else{
      this.pharmacyId = this.activatedRoute.snapshot.paramMap.get('id');
      this.pharmacyService.GetPharmacyById(this.pharmacyId).subscribe((res) => {
        this.PharmacyInfo = res.data.pharmacyInfo;
        // this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        //   x.dob = format(x.dob, 'MM/dd/yyyy');
        //   return x;
        // });
        this.PharmacyInfo = this.PharmacyInfo.map((x) => {
          x.registerDate = format(new Date(x.registerDate), 'MM/dd/yyyy');
          return x;
        });
        this.PharmacyInfo = this.PharmacyInfo.map((x) => {
          x.gender = x.gender == "Female" ? 1 : x.gender == "Male" ? 2 : 3;
          return x;
        });
        this.PharmacyAddress = res.data.pharmacyAddressInfo;

        if (this.PharmacyInfo.length > 0) {
          this.pharmacyProfileForm.patchValue(this.PharmacyInfo[0]);
        }
      });
    }



    this.pharmacyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.usersService
      .getMasterData("masterGender", true, null)
      .subscribe((response: any) => {
        if (response != null) {
          this.masterGender = response.masterGender;
        }
      });
    this.pharmacyProfileForm = this.FormBuilder.group({
      pharmacyName: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].pharmacyName : "",
      ],
      firstName: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].firstName : "",
      ],
      lastName: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].lastName : "",
      ],
      middleName: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].middleName : "",
      ],
      dob: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].dob : "",
        {
          asyncValidators: [this.validateAge.bind(this)],
        },
      ],
      email: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].email : "",
        {
          validators: [Validators.required],
          asyncValidators: [this.validateUsername.bind(this)],
          updateOn: "blur",
        },
      ],
      gender: [
        this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].gender : "",
      ],
      userImg: [this.PharmacyInfo.length != 0 ? this.PharmacyInfo[0].photoPath : ""]
    });
    this.pharmacyProfileForm.controls['gender'].patchValue(2);



  }

  get formControls() {
    return this.pharmacyProfileForm.controls;
  }

  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
       resolve();;
      } else {
        if (this.PharmacyInfo[0].email == ctrl.value) {
         resolve();;
        } else {
          let userName = ctrl.value;
          this.registerService
            .checkUserNameExistance(userName)
            .subscribe((response: any) => {
              if (response.statusCode != 200) resolve({ uniqueName: true });
              else resolve();;
            });
        }
      }
    });
  }
  validateAge(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
       resolve();
      } else {
        var selectedDate = new Date(ctrl.value);
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
          (today.getTime() -
            new Date(yy + years, mm + months - 1, dd).getTime()) /
          (24 * 60 * 60 * 1000)
        );
        if (years < 18) resolve({ age: true });
        else resolve();;
      }
    });
  }

  handleImageChange(e:any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = this.dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  removeImage() {
    this.dataURL = null;
    this.imagePreview = null;
  }

  onSubmit = (event:any) => {
    this.submitted = true;
    for (const key of Object.keys(this.pharmacyProfileForm.controls)) {
      if (this.pharmacyProfileForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          this.submitted = false;
          break;
        }
      }
    }

    if (!this.pharmacyProfileForm.invalid) {
      const formData = {
        pharmacyName: this.formControls["pharmacyName"].value,
        firstName: this.formControls["firstName"].value,
        middleName: this.formControls["middleName"].value,
        lastName: this.formControls["lastName"].value,
        dob: format(this.formControls["dob"].value, "yyyy-MM-ddTHH:mm:ss"),
        email: this.formControls["email"].value,
        genderId: this.formControls["gender"].value,
        imgBase64: this.dataURL,
        pharmacyId: this.loginData.id,
      };
      this.pharmacyService.UpdatePharmacyProfile(formData).subscribe((res) => {
        console.log(res);
        if (res.statusCode == 200) {
          this.notifier.notify("success", "Profile Update Successful");
          this.isEditing = false;
        } else {
          this.notifier.notify("error", res.message);
        }
      });
    } else {
      this.notifier.notify("error", "Form is invalid");
      this.submitted = false;
    }
  };
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
