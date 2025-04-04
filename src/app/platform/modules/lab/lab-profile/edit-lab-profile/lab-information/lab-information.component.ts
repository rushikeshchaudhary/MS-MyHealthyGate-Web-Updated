import { Component, ElementRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { timeStamp } from 'console';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { RegisterService } from 'src/app/front/register/register.service';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';
import { LoginUser } from 'src/app/super-admin-portal/core/modals/loginUser.modal';
import { LabDetailModel } from '../../../lab.model';
import { LabService } from '../../../lab.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-information',
  templateUrl: './lab-information.component.html',
  styleUrls: ['./lab-information.component.css'],
})
export class LabInformationComponent implements OnInit {
  labInfo: LabDetailModel;
  labAddress: Array<any> = [];
  loginData: any;
  imagePreview: any;
  dataURL: any;
  masterGender: any = [];
  labForm!: FormGroup;
  submitted: boolean = false;
  maxDate = new Date();
  labId: any;
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
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
    this.labInfo = new LabDetailModel();
  }

  ngOnInit() {
    const UserRole = localStorage.getItem('UserRole');
    if (UserRole == 'LAB') {
      this.commonService.loginUser.subscribe((user) => {
        if (user.data) {
          this.loginData = user.data;
          this.labService.GetLabById(user.data.id).subscribe((res) => {
            let tempData = res.data.labInfo;
            // tempData = tempData.map((x) => {
            //   x.dob = format(x.dob, 'MM/dd/yyyy');
            //   return x;
            // });
            tempData = tempData.map((x: any) => {
              x.doj = format(x.doj, 'MM/dd/yyyy');
              return x;
            });
            this.labInfo = tempData[0];
            console.log(this.labInfo);

            if (this.labInfo != null) {
              this.labForm.patchValue(this.labInfo);
            }
          });
        }
      });
    } else {
      this.labId = this.activatedRoute.snapshot.paramMap.get('id');
      this.labService.GetLabById(this.labId).subscribe((res) => {
        let tempData = res.data.labInfo;
        // tempData = tempData.map((x) => {
        //   x.dob = format(x.dob, 'MM/dd/yyyy');
        //   return x;
        // });
        tempData = tempData.map((x: any) => {
          x.doj = format(x.doj, 'MM/dd/yyyy');
          return x;
        });
        this.labInfo = tempData[0];
        console.log(this.labInfo);

        if (this.labInfo != null) {
          this.labForm.patchValue(this.labInfo);
        }
      });
    }

    this.usersService
      .getMasterData('masterGender', true, [])
      .subscribe((response: any) => {
        if (response != null) {
          this.masterGender = response.masterGender;
        }
      });

    this.labForm = this.formBuilder.group({
      firstName: [this.labInfo.firstName],
      lastName: [this.labInfo.lastName],
      middleName: [this.labInfo.middleName],
      dob: [
        this.labInfo.dob,
        {
          asyncValidators: [this.validateAge.bind(this)],
        },
      ],
      email: [
        this.labInfo.email,
        {
          validators: [Validators.required],
          asyncValidators: [this.validateUsername.bind(this)],
          updateOn: 'blur',
        },
      ],
      gender: [this.labInfo.gender],
      labName: [this.labInfo.labName],
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
        resolve();
      } else {
        if (this.labInfo.email == ctrl.value) {
          resolve();
        } else {
          let userName = ctrl.value;
          this.registerService
            .checkUserNameExistance(userName)
            .subscribe((response: any) => {
              if (response.statusCode != 200) resolve({ uniqueName: true });
              else resolve();
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
        else resolve();
      }
    });
  }

  handleImageChange(e: any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, 'image')) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = this.dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify('error', 'Please select valid file type');
  }

  removeImage() {
    this.dataURL = null;
    this.imagePreview = null;
  }

  onSubmit = () => {
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
        firstName: this.formControls['firstName'].value,
        middleName: this.formControls['middleName'].value,
        lastName: this.formControls['lastName'].value,
        dob: format(this.formControls['dob'].value, 'yyyy-MM-ddTHH:mm:ss'),
        email: this.formControls['email'].value,
        genderId: this.formControls['gender'].value,
        imgBase64: this.dataURL,
        labId: this.loginData.id,
      };
      this.labService.UpdateLabProfile(formData).subscribe((res) => {
        console.log(res);
        if (res.statusCode == 200) {
          this.notifier.notify('success', 'Profile Update Successful');
          this.isEditing = false;
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    } else {
      this.notifier.notify('error', 'Form is invalid');
    }
  };
}
