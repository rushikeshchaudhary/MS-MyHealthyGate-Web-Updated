import { StaffRole, StaffServices } from "./../users.model";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import {
  UserModel,
  StaffLocation,
  StaffTags,
  StaffTeam,
  StaffSpeciality,
  StaffTaxonomy,
} from "../users.model";
import { UsersService } from "../users.service";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { Router } from "@angular/router";
import { PasswordValidator } from "../../../../../shared/password-validator";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { format } from "date-fns";
import { RegisterService } from "src/app/front/register/register.service";
import { takeUntil } from "rxjs/operators";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { PhoneNumberComponent } from "src/app/shared/phone-number/phone-number.component";
import { TranslateService } from "@ngx-translate/core";
import { UserRoleService } from "../../masters/user-roles/user-role.service";


// export function AgeValidator(
//   control: AbstractControl
// ): { [key: string]: boolean } | null {
//   var selectedDate = new Date(control.value);
//   var today = new Date();
//   var year = today.getFullYear();
//   var month = today.getMonth() + 1;
//   var day = today.getDate();
//   var yy = selectedDate.getFullYear();
//   var mm = selectedDate.getMonth() + 1;
//   var dd = selectedDate.getDate();
//   var years, months, days;
//   // months
//   months = month - mm;
//   if (day < dd) {
//     months = months - 1;
//   }
//   // years
//   years = year - yy;
//   if (month * 100 + day < mm * 100 + dd) {
//     years = years - 1;
//     months = months + 12;
//   }
//   // days
//   days = Math.floor(
//     (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
//       (24 * 60 * 60 * 1000)
//   );
//   if (years >= 18) return { age: false };
//   else return { age: true };
//   //
//   //return { years: years, months: months, days: days };
// }
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  customPatterns = { "0": { pattern: new RegExp("[a-zA-Z]") } };
  masterStaff: any = [];
  masterLocation: any = [];
  masterRoles: any = [];
  masterCountry: any = [];
  masterGender: any = [];
  masterState: any = [];
  masterDegree: any = [];
  masterTagsForStaff: any = [];
  masterStaffSpecialities: any = [];
  //public masterStaffSpecialities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public testingspeciality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public duplicatemasterStaffSpecialities: any = [];
  public testingServices: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  duplicateMasterServices: any = [];
  masterProviderCareCategory: any = [];
  masterStaffTaxonomies: any = [];
  masterServices: any = [];
  payrollGroup: any = [];
  defaultLocationList: any = [];
  previousTeam: any = [];
  previousTags: any = [];
  countryId!: number;
  previousCountryId!: number;
  previousSpeciality: Array<StaffSpeciality> = [];
  prvSpeciality: any[] = [];
  // previoushealthcareCategory: Array<StaffCareCategoryModel> = [];
  previousTaxonomy: Array<StaffTaxonomy> = [];
  previousServices: Array<StaffServices> = [];
  staffId!: number;
  maxDate = new Date();
  userForm!: FormGroup;
  userModel: UserModel;
  staffLocation!: StaffLocation;
  public searching: boolean = false;
  staffTeam!: StaffTeam;
  staffTag!: StaffTags;
  staffSpeciality!: StaffSpeciality;
  //StaffhealthcareCategory: StaffCareCategoryModel;
  staffTaxonomy!: StaffTaxonomy;
  staffService!: StaffServices;
  submitted: boolean = false;
  isSaving: boolean = false;
  previousText!: string;
  dataURL: any;
  logoDataURL: any;
  stampDataURL: any;
  imagePreview: any;
  cliniclogo: any;
  clinicStamp: any;
  userRoleName!: string;
  addEditRolePermission!: boolean;
  isShowPassword: any;
  imagetype: any
  isShowRePassword: any;
  displayErrMsg: boolean = false;
  filterCtrl: FormControl = new FormControl();
  filterCtrl1: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  selectedPhoneCode: string = "0";
  isEditing: boolean = false;
  // show: boolean = false;
  roleaddmsg!: boolean;
  @ViewChild(PhoneNumberComponent)
  phoneNum!: PhoneNumberComponent;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",

    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };
  languages: Array<any> = [
    { key: "English", value: "English", checked: false },
    { key: "Arabic", value: "Arabic", checked: false },
  ];
  //languages: Array<any> = [{ key: "English", value: 1 }, { key: "Arabic", value: 2 }];
  // languages: Array<any> = ["English,Arabic"];
  selectedLanguages: Array<any> = [];
  selected: number = -1;
  phoneCountryCode: any;
  signatureDataURL: any;
  clinicSignature: any;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private route: Router,
    private el: ElementRef,
    private registerService: RegisterService,
    private translate: TranslateService,
    private userRoleService: UserRoleService

  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userModel = new UserModel();
  }
  ngOnInit() {
    let webUrl = window.location.origin;
    debugger

    webUrl = `${webUrl}/web/login`;
    // this.GetProviderCreatedRoles();
    this.getMasterData(null);
    this.getStaffById();

    let taxonomy: Number[] = [359252, 359253];
    this.userForm = this.formBuilder.group(
      {
        firstName: [this.userModel.firstName],
        lastName: [this.userModel.lastName],
        middleName: [this.userModel.middleName],
        address: [this.userModel.address],
        apartmentNumber: [this.userModel.apartmentNumber],
        countryID: [this.userModel.countryID],
        city: [this.userModel.city],
        stateID: [this.userModel.stateID],
        zip: [this.userModel.zip],
        latitude: [this.userModel.latitude],
        longitude: [this.userModel.longitude],
        phoneNumber: [
          !this.userModel.phoneNumber
            ? "0"
            : this.userModel.phoneNumber,
          [Validators.required],
        ],
        //npiNumber: [this.userModel.npiNumber],
        // taxId: [this.userModel.taxId],
        webUrl: webUrl,
        dob: [
          this.userModel.dob,
          {
            asyncValidators: [this.validateAge.bind(this)],
          },
        ],
        doj: [this.userModel.doj],
        npiNumber: [this.userModel.npiNumber, Validators.required],
        roleID: [this.userModel.roleID],
        email: [
          this.userModel.email,
          {
            validators: [Validators.required],
            asyncValidators: [this.validateUsername.bind(this)],
            updateOn: "blur",
          },
        ],
        gender: [this.userModel.gender],
        caqhid: [this.userModel.caqhid],
        language: [this.userModel.language],
        // degreeID: [this.userModel.degreeID],
        employeeID: [this.userModel.employeeID],
        // payRate: [
        //   this.userModel.payRate,
        //   {
        //     asyncValidators: [this.validatePayRate.bind(this)]
        //   }
        // ],
        // ftFpayRate: [
        //   this.userModel.ftFpayRate,
        //   {
        //     asyncValidators: [this.validatePayRate.bind(this)]
        //   }
        // ],
        // payrollGroupID: [this.userModel.payrollGroupID],
        // userName: [
        //   this.userModel.userName,
        //   {
        //     validators: [Validators.required],
        //     asyncValidators: [this.validateUsername.bind(this)],
        //     updateOn: "blur"
        //   }
        // ],
        password: [
          this.userModel.password,
          [Validators.required, PasswordValidator.strong],
        ],
        confirmPassword: [this.userModel.confirmPassword],
        isRenderingProvider: [this.userModel.isRenderingProvider],
        isUrgentCare: [true],//[this.userModel.isUrgentCare],

        // locationIds: [this.userModel.locationIds],
        locationIds: [101],
        // staffTeamKeys: [this.userModel.staffTeamKeys],
        staffTagsKeys: [this.userModel.staffTagsKeys],
        staffSpecialityKeys: [this.userModel.staffSpecialityKeys],
        staffCarecategoryKeys: [this.userModel.staffCarecategoryKeys],
        // staffUserRole: [this.userModel.StaffUserRoleModelkeys],
        staffTaxonomyKeys: this.formBuilder.array(taxonomy),
        //taxonomy: [this.userModel.taxonomy],
        languageKeys: [this.userModel.languageKeys],
        servicesKeys: [this.userModel.servicesKeys],
        // defaultLocation: [this.userModel.defaultLocation],
        defaultLocation: [101],
        aboutMe: [this.userModel.aboutMe],
        userImg: [],
        clinicLogo: [null, Validators.required],
        clinicStamp: [null, Validators.required],
        clinicSignature: [null, Validators.required]
      },
      { validator: this.validateForm.bind(this) }
    );
    // this.checkAboutMeLength();
    debugger
    // this.commonService.getshowProfileCompleteMessage().subscribe((res) => this.show = res);
    // console.log("add user", this.show);
    //this.updateStaffUserRoleValidators();
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterspeciality();
      });
    this.filterCtrl1.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterServices();
      })

    this.getUserPermissions();

    console.log('this.userModel.staffCarecategoryKeys >>>', this.userModel.staffCarecategoryKeys);
    if (this.cliniclogo) {
      this.userForm.get('clinicLogo')!.clearValidators();
    }
    else {
      this.userForm.get('clinicLogo')!.setValidators(Validators.required);
    }


    if (this.clinicStamp) {
      this.userForm.get('clinicStamp')!.clearValidators();
    }
    else {
      this.userForm.get('clinicStamp')!.setValidators(Validators.required);
    }


    if (this.clinicSignature) {
      this.userForm.get('clinicSignature')!.clearValidators();
    }
    else {
      this.userForm.get('clinicSignature')!.setValidators(Validators.required);
    }

    this.userForm.get('clinicLogo')!.updateValueAndValidity();
    this.userForm.get('clinicStamp')!.updateValueAndValidity();
    this.userForm.get('clinicSignature')!.updateValueAndValidity();
  }
  get formControls() {
    return this.userForm.controls;
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
       resolve();;
      } else {
        if (
          this.userModel.userName == ctrl.value ||
          this.userModel.email == ctrl.value
        ) {
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


  // updateStaffUserRoleValidators() {
  //   if (!this.show) {
  //     this.userForm.get('staffUserRole').setValidators(Validators.required);
  //   } else {
  //     this.userForm.get('staffUserRole').clearValidators();
  //   }
  //   this.userForm.get('staffUserRole').updateValueAndValidity();
  // }



  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls["password"].value;
    let confirmPass = formGroup.controls["confirmPassword"].value;

    if (!confirmPass.length) return null;

    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls["confirmPassword"].setErrors({ notSame: true });
  }
  validateAge(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
       resolve();;
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
  // validatePayRate(
  //   ctrl: AbstractControl
  // ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
  //   return new Promise(resolve => {
  //     if (!ctrl.dirty && !ctrl.untouched) {
  //      resolve(null);;
  //     } else {
  //       var payRate = ctrl.value;

  //       if (payRate <= 0) resolve({ rate: true });
  //       else resolve(null);;
  //     }
  //   });
  // }
  getMasterData(value: any, type: any = 0) {
    this.prvSpeciality = [];

    if (value && value.length > 0) {
      if (type == 0) {
        for (var i = 0; i < value.length; i++)
          this.prvSpeciality.push(value[i].specialityId);
      } else {
        for (var i = 0; i < value[0].length; i++)
          this.prvSpeciality.push(value[0][i]);
      }
    }




    this.usersService
      .getMasterData(
        "masterStaff,masterLocation,MASTERROLES,masterCountry,masterGender,masterState,masterDegree,MASTERTAGSFORSTAFF,PAYROLLGROUP,MASTERSPECIALITY,MASTERPROVIDERCARECATEGORY,MASTERTAXONOMY,MASTERSTAFFSERVICE",
        true,
        this.prvSpeciality
      )
      .subscribe((response: any) => {
        if (response != null) {
          this.masterStaff = response.staffs != null ? response.staffs : [];
          this.masterLocation =
            response.masterLocation != null ? response.masterLocation : [];
          this.userModel.locationIds.forEach((element: any) => {
            this.defaultLocationList.push(
              this.masterLocation.find((x: { id: any; }) => x.id == element)
            );
          });
          this.masterRoles =
            response.masterRoles != null ? response.masterRoles : [];
          this.masterCountry =
            response.masterCountry != null ? response.masterCountry : [];
          this.masterGender =
            response.masterGender != null ? response.masterGender : [];
          this.masterState =
            response.masterState != null ? response.masterState : [];
          this.masterDegree =
            response.masterDegree != null ? response.masterDegree : [];
          this.masterTagsForStaff =
            response.masterTagsforStaff != null
              ? response.masterTagsforStaff
              : [];
          this.masterStaffSpecialities =
            response.masterSpeciality != null ? response.masterSpeciality : [];
          this.duplicatemasterStaffSpecialities = this.masterStaffSpecialities;
          //this.testingspeciality=this.masterStaffSpecialities

          // this.masterProviderCareCategory =
          //   response.masterprovidercarecategory != null
          //     ? response.masterRolesDropDown
          //     : [];
          this.masterStaffTaxonomies =
            response.masterTaxonomy != null ? response.masterTaxonomy : [];
          this.payrollGroup =
            response.payrollGroup != null ? response.payrollGroup : [];
          this.masterServices =
            response.masterStaffServices != null
              ? response.masterStaffServices
              : [];
          this.duplicateMasterServices = this.masterServices;
        }
      });
  }

  // GetProviderCreatedRoles() {
  //   let filterModel = new FilterModel();
  //   filterModel.pageSize = 1000;
  //   filterModel.pageNumber = 1;

  //   this.userRoleService.getAll(filterModel).subscribe(
  //     (response) => {
  //       debugger
  //       if (response.data != null && response.statusCode==200) {
  //         this.roleaddmsg=false;
  //         this.masterProviderCareCategory = response.data.map(r => ({
  //           id: r.id,
  //           value: r.roleName,
  //           key: r.id.toString()
  //         }));

  //         debugger
  //         if (this.userModel.StaffUserRoleModelkeys) {
  //           this.userForm.patchValue({ staffUserRole: this.userModel.StaffUserRoleModelkeys });
  //         }
  //       } else {
  //         this.masterProviderCareCategory = [];
  //         this.roleaddmsg=true;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching roles:', error);
  //       this.masterProviderCareCategory = [];
  //       this.roleaddmsg=true;
  //     }
  //   );
  // }


  updateLocationList() {
    this.defaultLocationList = [];
    if (this.masterLocation != null && this.masterLocation.length > 0) {
      this.userForm.controls["locationIds"].value.forEach((element: any) => {
        this.defaultLocationList.push(
          this.masterLocation.find((x: { id: any; }) => x.id == element)
        );
      });
    }
    if (
      !this.userForm.controls["locationIds"].value.includes(
        this.userForm.controls["defaultLocation"].value
      )
    ) {
      this.userForm.patchValue({ defaultLocation: null });
    }
  }

  getStaffById() {
    this.usersService
      .getStaffById(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.userModel = response.data;
          console.log('rere', response.data);
          this.selectedPhoneCode = !this.userModel.phoneNumber ? "0" : this.userModel.phoneNumber.split(" ").length == 1 ? "0" : this.userModel.phoneNumber.split(" ")[0];
          this.selectedPhoneCode = this.selectedPhoneCode.replace("(", "").replace(")", "");
          this.getPhoneNumber(this.userModel.phoneNumber);
          let langu: any = [];
          /*if (response.data.language != null) {
            var resultLanguages: Array<any> = response.data.language.split(',');
            resultLanguages.forEach((d) => {
              var lang = this.languages.find(x => x.key === d);
              console.log('lang',lang);
              if (lang){
                 lang.checked = true;
                 langu.push(lang.value);
              }
            });

          }*/
          if (response.data.language) {
            let regex = /,/g;
            let resultLanguages =
              response.data.language != undefined && response.data.language
                ? response.data.language.split(",")
                : [];
            if (resultLanguages.length == 2) {
              this.userModel.languageKeys = ["English", "Arabic"];
            } else {
              this.userModel.languageKeys =
                resultLanguages[0] == "English" ? ["English"] : ["Arabic"];
            }
            //let result = abc.replace(regex, "','");
            /*let langs=`${response.data.language}`;
                    langu.push(langs.replace(regex,"','"));
                      this.userModel.languageKeys=langu;*/
            console.log(
              "this.userModel.languageKeys",
              this.userModel.languageKeys
            );
            this.userModel.language = response.data.language;
          }
          this.previousTeam = response.data.staffTeamList;
          this.previousTags = response.data.staffTagsModel;
          this.previousSpeciality = response.data.staffSpecialityModel;
          // this.previoushealthcareCategory =
          //   response.data.staffCareCategoryModel;
          this.previousTaxonomy = response.data.staffTaxonomyModel;
          this.previousServices = response.data.staffServicesModels;
          //this.getMasterData(response.data.staffSpecialityModel);
          this.userModel.locationIds =
            response.data.staffLocationList != null &&
              response.data.staffLocationList.length > 0
              ? response.data.staffLocationList.map((item: any) => (item.id as any))
              //? response.data.staffLocationList.map(({ id }) => id)
              : [];
          this.userModel.defaultLocation =
            response.data.staffLocationList != null &&
              response.data.staffLocationList.length > 0
              ? response.data.staffLocationList.find((z: { isDefault: boolean; }) => z.isDefault == true)
                .id
              : null;
          this.userModel.staffTeamKeys =
            response.data.staffTeamList != null &&
              response.data.staffTeamList.length > 0
              ? response.data.staffTeamList.map((item: any) => (item.staffteamid as any))
              : [];
          this.userModel.staffTagsKeys =
            response.data.staffTagsModel != null &&
              response.data.staffTagsModel.length > 0
              ? response.data.staffTagsModel.map((item: any) => (item.tagID as any))
              : [];
          this.userModel.staffSpecialityKeys =
            response.data.staffSpecialityModel != null &&
              response.data.staffSpecialityModel.length > 0
              ? response.data.staffSpecialityModel.map((item: any) => (item.specialityId as any))
              : [];
          // this.userModel.StaffUserRoleModelkeys =
          //   response.data.userRolesModels != null
          //     ? response.data.userRolesModels.id
          //     : null;

          // if (this.userModel.StaffUserRoleModelkeys) {
          //   this.userForm.patchValue({ staffUserRole: this.userModel.StaffUserRoleModelkeys });
          // }
          // console.log(
          //   "this.userModel.UserRolesModels",
          //   response.data.userRolesModels.id
          // );
          this.userModel.staffTaxonomyKeys =
            response.data.staffTaxonomyModel != null &&
              response.data.staffTaxonomyModel.length > 0
              ? response.data.staffTaxonomyModel.map((item: any) => (item.taxonomyId as any))
              : [];

          this.userModel.servicesKeys =
            response.data.staffServicesModels != null &&
              response.data.staffServicesModels.length > 0
              ? response.data.staffServicesModels.map((item: any) => (item.serviceId as any))
              : [];
          this.userModel.confirmPassword = response.data.password;
          this.imagePreview = this.userModel.photoThumbnailPath;
          this.cliniclogo = this.userModel.cliniclogoPath;
          if (this.cliniclogo) {
            this.userForm.get('clinicLogo')!.clearValidators();
          }
          else {
            this.userForm.get('clinicLogo')!.setValidators(Validators.required);
          }
          this.clinicStamp = this.userModel.clinicstampPath;
          if (this.clinicStamp) {
            this.userForm.get('clinicStamp')!.clearValidators();
          }
          else {
            this.userForm.get('clinicStamp')!.setValidators(Validators.required);
          }

          this.clinicSignature = this.userModel.signaturePath;
          if (this.clinicSignature) {
            this.userForm.get('clinicSignature')!.clearValidators();
          } else {
            this.userForm.get('clinicSignature')!.setValidators(Validators.required);
          }

          this.userForm.get('clinicLogo')!.updateValueAndValidity();
          this.userForm.get('clinicStamp')!.updateValueAndValidity();
          this.userForm.get('clinicSignature')!.updateValueAndValidity();
          this.userRoleName = this.userModel.roleName;
          this.userForm.patchValue(this.userModel);
          this.checkAboutMeLength();

          // this.selectedPhoneCode = !this.userModel.phoneNumber
          //   ? "0"
          //   : this.userModel.phoneNumber.split(" ")[0];
          // this.selectedPhoneCode = this.selectedPhoneCode
          //   .replace("(", "")
          //   .replace(")", "");
          // this.phoneNum.bindCountryCode(this.selectedPhoneCode);
          // let phoneCode =
          //   this.userModel.phoneNumber.split(" ").length == 1
          //     ? this.userModel.phoneNumber.split(" ")[0]
          //     : this.userModel.phoneNumber.split(" ")[1];
          // this.userModel.phoneNumber = !this.userModel.phoneNumber
          //   ? "0"
          //   : phoneCode.trim();

          this.getMasterData(response.data.staffSpecialityModel);
        } else {
          this.getMasterData(null);
        }
      });
  }
  getPhoneNumber = (phoneNumber: string):any => {
    if (phoneNumber) {
      const phoneData = phoneNumber.split(" ");
      if (phoneData.length == 1) {
        this.phoneNum.bindCountryCode(" ");
        this.userModel.phoneNumber = phoneData[0];
      } else {
        this.phoneNum.bindCountryCode(phoneData[0]);
        this.userModel.phoneNumber = phoneData[1];
      }
    } else {
      return phoneNumber;
    }

    return
  };

  selectChange(evt: any) {
    this.prvSpeciality = [];
    this.prvSpeciality.push(evt);
    this.getMasterData(this.prvSpeciality, 1);
  }

  handleImageChange(e: any, type: any) {
    if (type == "user") {
      ////debugger
      if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
        var inputUser = e.target;
        var readerUser = new FileReader();
        readerUser.onload = () => {
          this.dataURL = readerUser.result;
          this.imagePreview = this.dataURL;
        };
        readerUser.readAsDataURL(inputUser.files[0]);
      } else this.notifier.notify("error", "Please select valid file type");
    } else if (type == "logo") {
      if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
        var inputlogo = e.target;
        var readerlogo = new FileReader();
        readerlogo.onload = () => {
          this.logoDataURL = readerlogo.result;
          this.cliniclogo = this.logoDataURL;
        };
        readerlogo.readAsDataURL(inputlogo.files[0]);
      } else this.notifier.notify("error", "Please select valid file type");
    } else if (type == "stamp") {
      if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
        var inputstamp = e.target;
        var readerstamp = new FileReader();
        readerstamp.onload = () => {
          this.stampDataURL = readerstamp.result;
          this.clinicStamp = this.stampDataURL;
        };
        readerstamp.readAsDataURL(inputstamp.files[0]);
      } else this.notifier.notify("error", "Please select valid file type");
    } else if (type == "signature") {
      debugger
      if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
        var inputstamp = e.target;
        var readerstamp = new FileReader();
        readerstamp.onload = () => {
          this.signatureDataURL = readerstamp.result;
          this.clinicSignature = this.signatureDataURL;
        };
        readerstamp.readAsDataURL(inputstamp.files[0]);
      } else this.notifier.notify("error", "Please select valid file type");
    }
    //  if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
    //   var input = e.target;
    //   var reader = new FileReader();
    //   reader.onload = () => {
    //     this.dataURL = reader.result;
    //     this.imagePreview = this.dataURL;
    //   };
    //   reader.readAsDataURL(input.files[0]);
    // } else this.notifier.notify("error", "Please select valid file type");
  }

  removeImage(type: any) {
    debugger
    if (type == "user") {
      this.dataURL = null;
      this.imagePreview = null;

    } else if (type == "logo") {
      this.logoDataURL = null;
      this.cliniclogo = null;

    } else if (type == "stamp") {
      this.stampDataURL = null;
      this.clinicStamp = null;

    } else if (type == "signature") {
      this.signatureDataURL = null;
      this.clinicSignature = null;

    }
    // this.dataURL = null;
    // this.imagePreview = null;
    this.imagetype = type
    this.DeleteUploadedImages()

  }

  DeleteUploadedImages() {
    debugger;
    this.usersService.DeleteUploadedImages(this.staffId, this.imagetype).subscribe((res) => {
      if (res.statusCode == 200) {
        console.log(this.staffId, this.imagetype)

      }
    });

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
    this.updateValue(countryIdMaped, addressObj);


  }
  checkAboutMeLength() {
    var aboutMeValue = this.userForm.controls["aboutMe"].value;
    if (aboutMeValue && aboutMeValue.length > 500) {
      console.log("sub");
      //this.displayErrMsg = true;
      //this.submitted = true;
      //this.displayErrMsg = true;
      //this.submitted = true;
      this.userForm.controls["aboutMe"].setValue(this.previousText);
      this.displayErrMsg = false;
      this.submitted = false;
      // console.log('about me length', this.userForm.controls.aboutMe.value.length);
    } else {
      this.previousText = this.userForm.controls["aboutMe"].value;
      console.log("sub2");
      this.displayErrMsg = false;
      this.submitted = false;
    }
  }
  onSubmit(event: any) {
    debugger
    for (const key of Object.keys(this.userForm.controls)) {
      if (this.userForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          break;
        }
      }
    }

    if (!this.userForm.invalid) {
      /*if (this.selectedLanguages.length > 0) {
        this.userForm.value.language = this.selectedLanguages.join(',');
      } else {
        this.userForm.value.language = null;
      }*/
      this.isSaving = true;
      let clickType = event.currentTarget.name;
      this.submitted = true;
      let formValues = this.userForm.value;
      if (formValues.languageKeys.length > 0) {
        this.userModel.language = '';
        formValues.language = null;
        this.userModel.language = formValues.languageKeys.join(",");
        formValues.language = formValues.languageKeys.join(",");
      } else {
        this.userModel.language = '';
      }
      this.userModel = formValues;
      this.userModel.userName = this.userModel.email;
      this.userModel.id = this.staffId;
      debugger;
      this.userModel.photoBase64 = this.dataURL;
      this.userModel.clinicLogoBase64 = this.logoDataURL;
      debugger;
      this.userModel.stamplogoBase64 = this.stampDataURL;
      this.userModel.signatureBase64 = this.signatureDataURL;
      this.userModel.staffTeamList = new Array<StaffTeam>();
      this.userModel.staffLocationList = new Array<StaffLocation>();
      this.userModel.staffTagsModel = new Array<StaffTags>();
      this.userModel.staffSpecialityModel = new Array<StaffSpeciality>();
      this.userModel.userRolesModels = new StaffRole(0, '', '', 0, '');
      this.userModel.staffTaxonomyModel = new Array<StaffTaxonomy>();
      this.userModel.staffServicesModels = new Array<StaffServices>();
      this.userModel.dob = format(new Date(this.userModel.dob), "yyyy-MM-dd'T'HH:mm:ss"); //new Date(this.userModel.dob);
      this.userModel.doj = format(new Date(this.userModel.doj), "yyyy-MM-dd'T'HH:mm:ss"); //new Date(this.userModel.dob);
      this.userModel.phoneNumber = this.selectedPhoneCode == '0' ? this.userModel.phoneNumber : this.selectedPhoneCode.trim() + " " + this.userModel.phoneNumber;

      // let phoneCode1 =
      //   this.userModel.phoneNumber.split(" ").length == 1
      //     ? this.userModel.phoneNumber.split(" ")[0]
      //     : this.userModel.phoneNumber.split(" ")[1].trim();
      // this.userModel.phoneNumber = !this.userModel.phoneNumber
      //   ? "0"
      //   : phoneCode1; //new Date(this.userModel.dob);

      // formValues.locationIds != undefined &&
      //   formValues.locationIds.forEach(element => {
      //     this.staffLocation = new StaffLocation();
      //     this.staffLocation.id = element;
      //     this.staffLocation.isDefault =
      //       formValues.defaultLocation == element ? true : false;
      //     this.userModel.staffLocationList.push(this.staffLocation);
      //   });

      if (
        formValues.locationIds != undefined &&
        formValues.locationIds != null
      ) {
        if (this.staffId == null || this.staffId == 0) {
          this.staffLocation = new StaffLocation();
          this.staffLocation.id = formValues.locationIds;
          this.staffLocation.isDefault =
            formValues.defaultLocation == formValues.locationIds ? true : false;
          this.userModel.staffLocationList.push(this.staffLocation);
        } else {
          formValues.locationIds.forEach((element: number) => {
            this.staffLocation = new StaffLocation();
            this.staffLocation.id = element;
            this.staffLocation.isDefault =
              formValues.defaultLocation == element ? true : false;
            this.userModel.staffLocationList.push(this.staffLocation);
          });
        }
      }

      // formValues.staffTeamKeys != null &&
      //   formValues.staffTeamKeys.forEach((element) => {
      //     this.staffTeam = new StaffTeam();
      //     this.staffTeam.staffteamid = element;
      //     this.userModel.staffTeamList.push(this.staffTeam);
      //   });
      formValues.staffTagsKeys != null &&
        formValues.staffTagsKeys.forEach((element: number) => {
          let pStaffTag =
            this.previousTags != null &&
            this.previousTags.find((x: { tagID: number; }) => x.tagID == element);
          this.staffTag = new StaffTags();
          this.staffTag.tagID = element;
          this.staffTag.id =
            pStaffTag != null && pStaffTag.id > 0 ? pStaffTag.id : null;
          this.staffTag.staffID =
            pStaffTag != null && pStaffTag.staffID > 0
              ? pStaffTag.staffID
              : this.staffId;
          this.userModel.staffTagsModel.push(this.staffTag);
        });
      this.previousTags != null &&
        this.previousTags.forEach((x: any) => {
          if (
            this.userModel.staffTagsModel.findIndex(
              (y) => y.tagID == x.tagID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffTagsModel.push(x);
          }
        });
      // this.previousTeam != null &&
      //   this.previousTeam.forEach((x) => {
      //     if (
      //       this.userModel.staffLocationList.findIndex((y) => y.id == x.id) ==
      //       -1
      //     ) {
      //       x.isDeleted = true;
      //       this.userModel.staffTeamList.push(x);
      //     }
      //   });

      formValues.staffSpecialityKeys != null &&
        formValues.staffSpecialityKeys.forEach((element: number) => {
          this.staffSpeciality = new StaffSpeciality();
          this.staffSpeciality.specialityID = element;
          this.userModel.staffSpecialityModel.push(this.staffSpeciality);
        });



      this.previousSpeciality != null &&
        this.previousSpeciality.forEach((x) => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.staffSpecialityModel.findIndex(
              (y) => +y.specialityID == +x.specialityID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffSpecialityModel.push(x);
          }
        });

      // formValues.staffCarecategoryKeys != null &&
      //   formValues.staffCarecategoryKeys.forEach((element) => {
      //     this.StaffhealthcareCategory = new StaffCareCategoryModel();
      //     this.StaffhealthcareCategory.healthcarecategoryID = element;
      //     this.userModel.StaffCareCategoryModel.push(
      //       this.StaffhealthcareCategory
      //     );
      //   });
      debugger




      // var result = this.masterProviderCareCategory.filter(r => r.id == formValues.staffUserRole);


      // this.userModel.userRolesModels = result.length > 0 ? result[0] : null;


      // if (this.userModel.userRolesModels) {
      //   this.userModel.roleID = this.userModel.userRolesModels.id;
      // }

      // this.userModel.UserRolesModels=this.masterProviderCareCategory.filter(r=>r.id==formValues.staffUserRole);

      // this.previoushealthcareCategory != null &&
      //   this.previoushealthcareCategory.forEach((x) => {
      //     //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
      //     if (
      //       this.userModel.StaffCareCategoryModel.findIndex(
      //         (y) => +y.healthcarecategoryID == +x.healthcarecategoryID
      //       ) == -1
      //     ) {
      //       x.isActive=false;
      //       x.isDeleted = true;
      //       this.userModel.StaffCareCategoryModel.push(x);
      //     }
      //     else
      //     {

      //       var index=this.userModel.StaffCareCategoryModel.findIndex(
      //         (y) => +y.healthcarecategoryID == +x.healthcarecategoryID
      //       )
      //       this.userModel.StaffCareCategoryModel.splice(index,1);
      //     }

      //   });
      //Texonomy below code need to comment 

      formValues.staffTaxonomyKeys != null &&
        formValues.staffTaxonomyKeys.forEach((element: number) => {
          this.staffTaxonomy = new StaffTaxonomy();
          this.staffTaxonomy.taxonomyID = element;
          this.userModel.staffTaxonomyModel.push(this.staffTaxonomy);
        });
      //Texonomy Above code need to comment
      /////////////////////////
      this.previousTaxonomy != null &&
        this.previousTaxonomy.forEach((x) => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.staffTaxonomyModel.findIndex(
              (y) => +y.taxonomyID == +x.taxonomyID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffTaxonomyModel.push(x);
          }
        });
      formValues.servicesKeys != null &&
        formValues.servicesKeys.forEach((element: number) => {
          this.staffService = new StaffServices();
          this.staffService.serviceId = element;
          this.userModel.staffServicesModels.push(this.staffService);
        });
      this.previousServices != null &&
        this.previousServices.forEach((x) => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.servicesKeys.findIndex(
              (y) => +y.serviceId == +x.serviceId
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffServicesModels.push(x);
          }
        });
      this.submitted = true;
      debugger
      this.usersService.create(this.userModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.staffId = response.data.id;
          this.commonService.initializeAuthData();
          this.route.navigate(["web/manage-users/user"], {
            queryParams: {
              id: this.commonService.encryptValue(this.staffId, true),
            },
          });
          this.notifier.notify("success", response.message);
          this.isEditing = false;
          this.getStaffById();
          this.commonService.isProfileUpdated(this.staffId);
          if (clickType == "SaveContinue")
            this.handleTabChange.next({
              // tab: "Custom Fields",
              tab: "Work & Experience",
              id: response.data.id,
            });

          this.isSaving = false;
        } else {
          this.notifier.notify("error", response.message);
        }
      });
    }
  }
  // selectedLanguages: Array<any> = [];
  onLangChange(event: any, lang: any) {
    // console.log(event);
    if (event.checked) {
      this.selectedLanguages.push(lang.key);
    }
  }
  onBackHandler = () => {
    this.route.navigate(["web/manage-users/user-profile"]);
  };
  getUserPermissions() {
    const actionPermissions = this.usersService.getUserScreenActionPermissions(
      "USER",
      "USER_ADD"
    );
    const { USER_ADD_EDIT_USER_ROLE } = actionPermissions;

    this.addEditRolePermission = USER_ADD_EDIT_USER_ROLE || false;
  }

  normalizeMobile(value: any, previousValue: any[]): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + " ";
      }
      if (onlyNums.length === 6) {
        return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3);
    }
    return (
      "(" +
      onlyNums.slice(0, 3) +
      ") " +
      onlyNums.slice(3, 6) +
      "-" +
      onlyNums.slice(6, 10)
    );
  }

  normalizeSSN(value: any, previousValue: any[]): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + "-";
      }
      if (onlyNums.length === 6) {
        return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
    }
    return (
      onlyNums.slice(0, 3) +
      "-" +
      onlyNums.slice(3, 5) +
      "-" +
      onlyNums.slice(5, 9)
    );
  }

  normalizeFax(value: any, previousValue: any[]): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + " ";
      }
      if (onlyNums.length === 6) {
        return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3);
    }
    return (
      "(" +
      onlyNums.slice(0, 3) +
      ") " +
      onlyNums.slice(3, 6) +
      "-" +
      onlyNums.slice(6, 13)
    );
  }

  normalizeZipCode(value: any, previousValue: any[]): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward 12345-1234
      if (onlyNums.length < 5) {
        return onlyNums;
      }
      if (onlyNums.length === 5) {
        return onlyNums.slice(0, 5);
      }
      if (onlyNums.length > 5) {
        return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5);
      }
    }
    if (onlyNums.length < 5) {
      return onlyNums;
    }
    if (onlyNums.length > 5) {
      return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5);
    }
    if (onlyNums.length === 5) {
      return onlyNums.slice(0, 5);
    }
  }

  normalizeRate(value: any, previousValue: any[]): any {
    if (!value) {
      return value;
    }
    if (parseFloat(value) === 0) {
      return "";
    }
    const onlyNums = value.replace(/[^\d]/g, "");

    if (!previousValue || value.length > previousValue.length) {
      // typing forward 12345-1234
      if (onlyNums.length > 0) {
        if (onlyNums.length === 2) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            return "00." + onlyNums.slice(1) + "0";
          }
          return onlyNums + ".00";
        } else if (onlyNums.length === 1) {
          return "00.0" + onlyNums;
        } else if (onlyNums.length === 3) {
          if (previousValue.length > value.length) {
            return onlyNums.slice(0, 2) + "." + onlyNums.slice(2);
          } else if (onlyNums[onlyNums.length - 1] === "0") {
            return "00." + onlyNums.slice(0, 2);
          }
          return (
            "0" +
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length === 4) {
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length === 5) {
          if (onlyNums[0] === "0") {
            return (
              onlyNums.slice(1, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
          } else
            return (
              onlyNums.slice(0, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
        } else if (onlyNums.length > 5) {
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        }
      } else {
        return null;
      }
    } else {
      // tabbing backspace

      if (onlyNums.length > 0) {
        if (onlyNums.length === 2) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            return "00." + onlyNums.slice(1) + "0";
          }
          if (value.indexOf(".") === onlyNums.length) {
            return "00." + onlyNums;
          }
          return onlyNums + ".00";
        } else if (onlyNums.length === 1) {
          return "0" + onlyNums + ".00";
        } else if (onlyNums.length === 3) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            if (previousValue.length > value.length) {
              return onlyNums.slice(0, 2) + "." + onlyNums.slice(2);
            } else if (onlyNums[onlyNums.length - 1] === "0") {
              return "00." + onlyNums.slice(0, 2);
            } else {
              return onlyNums.slice(0, 2) + "." + onlyNums.slice(2) + "0";
            }
          } else
            return (
              "0" +
              onlyNums.slice(0, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
        } else if (onlyNums.length === 4) {
          if (value.indexOf(".") === -1) {
            return onlyNums + ".00";
          }
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length > 4) {
          if (value.indexOf(".") !== -1) {
            if (value.indexOf(".") === onlyNums.length - 1) {
              if (previousValue.length > value.length) {
                return (
                  onlyNums.slice(0, value.indexOf(".") - 1) +
                  "." +
                  onlyNums.slice(value.indexOf(".") - 1)
                );
              } else
                return (
                  onlyNums.slice(0, value.indexOf(".")) +
                  "." +
                  onlyNums.slice(value.indexOf(".")) +
                  "0"
                );
            } else
              return (
                onlyNums.slice(0, value.indexOf(".")) +
                "." +
                onlyNums.slice(value.indexOf("."))
              );
          } else {
            return onlyNums + ".00";
          }
        }
      } else {
        return null;
      }
    }

    // return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5);
  }
  protected filterServices() {
    //get the search keyword
    let search = this.filterCtrl1.value;
    if (search.length > 2) {
      search = search.toLowerCase();

      // filter the banks
      this.testingServices.next(
        this.duplicateMasterServices.filter(
          (d: { value: string; }) => d.value.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }
  protected filterspeciality() {
    // if (!this.banks) {
    //   return;
    // }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (search.length > 2) {
      search = search.toLowerCase();

      // if (!search) {
      //   this.filteredBanksMulti.next(this.banks.slice());
      //   return;
      // } else {
      //   search = search.toLowerCase();
      // }
      // filter the banks
      this.testingspeciality.next(
        this.duplicatemasterStaffSpecialities.filter(
          (bank: { value: string; }) => bank.value.toLowerCase().indexOf(search) > -1
        )
      );
    }
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

        const pObJ = {
          address: addressObj.address1,
          countryID: country,
          city: addressObj.city,
          stateID: stateIdMapped,
          zip: addressObj.zip,
          latitude: addressObj.latitude,
          longitude: addressObj.longitude,
          apartmentNumber: "",

        };
        this.userForm.patchValue(pObJ);
      } else {
        this.masterState = [];
        this.notifier.notify("error", res.message);
      }
    });
    /*this.masterState =this.usersService.getStateByCountryId(country).toPromise();
    return this.masterState;*/
  }
  phoneCodeChange($event: string) {
    this.phoneCountryCode = $event;
    this.selectedPhoneCode = $event;
  }
}
