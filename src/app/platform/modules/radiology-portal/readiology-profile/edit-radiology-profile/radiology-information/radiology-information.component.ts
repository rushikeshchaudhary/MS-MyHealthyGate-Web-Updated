import { Component, ElementRef, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { Observable } from "rxjs";
import { RegisterService } from "src/app/front/register/register.service";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { RadiologyDetailModel } from "src/app/platform/modules/lab/lab.model";
import { LabService } from "src/app/platform/modules/lab/lab.service";

@Component({
  selector: "app-radiology-information",
  templateUrl: "./radiology-information.component.html",
  styleUrls: ["./radiology-information.component.css"],
})
export class RadiologyInformationComponent implements OnInit {
  labInfo: RadiologyDetailModel;
  labAddress: Array<any> = [];
  loginData: any;
  imagePreview: any;
  dataURL: any;
  masterGender: any = [];
  labForm: FormGroup;
  submitted: boolean = false;
  maxDate = new Date();
  radiologyId: any;
  isEditing: boolean = false;
  constructor(
    private commonService: CommonService,
    private labService: LabService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: Router,
    private el: ElementRef,
    private registerService: RegisterService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.labForm = this.formBuilder.group({
      firstName: [],
      lastName: [],
      radiologyName: [],
      email: [
        "",
        {
          validators: [Validators.required],
          asyncValidators: [this.validateUsername.bind(this)],
          updateOn: "blur",
        },
      ],
    });
      this.labInfo = new RadiologyDetailModel();
  }

  ngOnInit() {
    debugger
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.radiologyId = params.get('id');
    });

    this.labService.GetRadiologyById(this.radiologyId).subscribe((res) => {
      this.labInfo = res.data;
      console.log(res.data);

      this.labInfo.dob = format(new Date(this.labInfo.dob), 'MM/dd/yyyy');
      this.labInfo.doj = format(new Date(this.labInfo.doj), 'MM/dd/yyyy');
      this.labForm.patchValue({
        firstName: this.labInfo.firstName,
        lastName: this.labInfo.lastName,
        radiologyName: this.labInfo.radiologyName
          ? this.labInfo.radiologyName
          : this.labInfo.firstName + " " + this.labInfo.lastName,
        email: this.labInfo.email,
      });
    });



    this.usersService
      .getMasterData("masterGender", true, null)
      .subscribe((response: any) => {
        if (response != null) {
          this.masterGender = response.masterGender;
        }
      });
  }

  get formControls() {
    return this.labForm.controls;
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
       resolve();;
      } else {
        if (this.labInfo.email == ctrl.value) {
         resolve();
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
    for (const key of Object.keys(this.labForm.controls)) {
      if (this.labForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          break;
        }
      }
    }

    if (!this.labForm.invalid) {
      const formData = {
        firstName: this.formControls["firstName"].value,
        lastName: this.formControls["lastName"].value,
        email: this.formControls["email"].value,
        radiologyName: this.formControls["radiologyName"].value,
        imgBase64: this.dataURL,
        radiologyId: this.loginData.id,
      };
      this.labService.UpdateRadiologyProfile(formData).subscribe((res) => {
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
    }
  };
}
