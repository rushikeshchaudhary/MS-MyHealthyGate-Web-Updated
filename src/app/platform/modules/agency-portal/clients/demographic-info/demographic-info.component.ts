import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ClientModel, PatientDiagnosis, PatientTag } from "../client.model";
import { ClientsService } from "../clients.service";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { CommonService } from "../../../core/services";
import { ResponseModel } from "../../../core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { Router } from "@angular/router";
import { ClientHeaderComponent } from "../client-header/client-header.component";
import { max } from "date-fns";
import { Observable } from "rxjs";
import { RegisterService } from "src/app/front/register/register.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-demographic-info",
  templateUrl: "./demographic-info.component.html",
  styleUrls: ["./demographic-info.component.css"],
})
export class DemographicInfoComponent implements OnInit {
  demographicInfoForm!: FormGroup;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId!: number;
  clientModel: ClientModel;
  masterGender: any = [];
  masterRace: any = [];
  masterEthnicity!: any[];
  masterStaff!: any[];
  masterDiagnosis!: any[];
  masterPhoneType!: any[];
  masterLocation!: any[];
  masterRelationship!: any[];
  masterTagsForPatient: any = [];
  masterRenderingProvider: any = [];
  dataURL: any;
  imagePreview: any;
  submitted: boolean = false;
  maxDate = new Date();
  minDate = new Date();
  MRN!: string;
  selectedPhoneCode: string | null = null;
  isProvider: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private registerService: RegisterService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private route: Router,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.clientModel = new ClientModel();
    this.minDate = new Date(1900, 1, 1);
  }
  ngOnInit() {
    var loginUser = this.commonService.getLoginUserInfo();
    this.isProvider =
      loginUser.data.userRoles.roleName.toLowerCase() == "provider";
    console.log("Login user from agency demographic", loginUser);
    let webUrl = window.location.origin;
    this.selectedPhoneCode = this.clientModel.emergencyContactPhone
      ? this.clientModel.emergencyContactPhone.split(" ")[0]
      : null;

    webUrl = `${webUrl}/web/client-login`;
    this.demographicInfoForm = this.formBuilder.group({
      firstName: [this.clientModel.firstName],
      middleName: [this.clientModel.middleName],
      lastName: [this.clientModel.lastName],
      gender: [this.clientModel.gender],
      dob: [this.clientModel.dob],
      // email: [this.clientModel.email, [Validators.required, Validators.email]],
      email: [
        this.clientModel.email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.validateUsername.bind(this)],
          updateOn: "blur",
        },
      ],

      phone: [this.clientModel.phone],
      nationalID: [this.clientModel.nationalID],
      nationality: [this.clientModel.nationality],
      //ssn: [this.clientModel.ssn],
      mrn: [this.MRN],
      race: [this.clientModel.race],
      secondaryRaceID: [this.clientModel.secondaryRaceID],
      ethnicity: [this.clientModel.ethnicity],
      primaryProvider: [this.clientModel.primaryProvider],
      // renderingProviderID: [this.clientModel.renderingProviderID],
      // locationID: [this.clientModel.locationID],                  //agencyremove
      locationID: [101],
      AddUserURL: webUrl,
      // userName: [this.clientModel.userName],
      // isPortalRequired: [this.clientModel.isPortalRequired],
      emergencyContactRelationship: [
        this.clientModel.emergencyContactRelationship,
      ],
      emergencyContactFirstName: [this.clientModel.emergencyContactFirstName],
      emergencyContactLastName: [this.clientModel.emergencyContactLastName],
      emergencyContactPhone: [this.clientModel.emergencyContactPhone],
      photoThumbnailPath: [this.clientModel.photoThumbnailPath],
      photoPath: [this.clientModel.photoPath],
      note: [this.clientModel.note],
      tag: [this.clientModel.tag],
      clientImg: [],
      carrierid: [this.clientModel.carrierId],
      //  icdid: [this.clientModel.icdid]
    });
    this.getMasterData();
    this.getCurrentLocations();
    if (this.clientId != null) this.getClientInfo();
    this.getLastOfPatient();
  }
  get formControls() {
    return this.demographicInfoForm.controls;
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve();;
      } else {
        if (this.clientModel.userName == ctrl.value) {
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

  getLastOfPatient = () => {
    this.clientService.getlastIdOfPatient().subscribe((res) => {
      this.createMRN(res.data.id);
    });
  };

  createMRN = (Id: any) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "MRN" + Id;
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.demographicInfoForm.controls["mrn"].setValue(result);
  };
  onSubmit(event: any) {
    if (!this.demographicInfoForm.invalid) {
      let clickType = event.currentTarget.name;
      this.clientModel = this.demographicInfoForm.value;
      this.clientModel.userName = this.clientModel.email;
      this.clientModel.id = this.clientId;
      this.clientModel.isPortalRequired = true;
      this.clientModel.isPortalActivate = true;
      // this.clientModel.phone=this.selectedPhoneCode== '0' ? this.clientModel.phone : this.selectedPhoneCode.trim() + " " + this.clientModel.phone;
      this.clientModel.phone = (this.selectedPhoneCode && this.selectedPhoneCode.trim() !== '0')
        ? (this.selectedPhoneCode.trim() + " " + this.clientModel.phone)
        : this.clientModel.phone;
      console.log(this.clientModel.phone);
      this.clientModel.PhotoBase64 = this.dataURL || null;
      if (this.clientModel.icdid != null) {
        this.clientModel.patientDiagnosis = new Array<PatientDiagnosis>();
        let patientDiag = new PatientDiagnosis();
        patientDiag.patientID = this.clientId;
        patientDiag.icdid = this.clientModel.icdid;
        patientDiag.isPrimary = true;
        this.clientModel.patientDiagnosis.push(patientDiag);
      }
      if (this.clientModel.tag != null) {
        this.clientModel.patientTags = new Array<PatientTag>();
        let patientTag = new PatientTag();
        this.clientModel.tag.forEach((x) => {
          patientTag = { patientID: this.clientId, isDeleted: false, tagID: x };
          this.clientModel.patientTags.push(patientTag);
        });
      }
      this.submitted = true;
      this.clientService
        .create(this.clientModel)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.clientId = response.data.id;
            // this.route.navigate(["web/client"], {
            //   queryParams: {
            //     id: this.commonService.encryptValue(this.clientId, true),
            //   },
            // });
            this.notifierService.notify("success", response.message);
            this.handleTabChange.next({
              tab: "Guardian/Guarantor",
              id: response.data.id,
              clickType: clickType,
            });
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
    }
  }

  onSubmitFirsthalf(event: any) {
    if (!this.demographicInfoForm.invalid) {
      let clickType = event.currentTarget.name;
      this.clientModel = this.demographicInfoForm.value;
      this.clientModel.userName = this.clientModel.email;
      this.clientModel.id = this.clientId;
      this.clientModel.isPortalRequired = true;
      this.clientModel.isPortalActivate = true;
      // this.clientModel.phone=this.selectedPhoneCode== '0' ? this.clientModel.phone : this.selectedPhoneCode.trim() + " " + this.clientModel.phone;
      this.clientModel.phone = (this.selectedPhoneCode && this.selectedPhoneCode.trim() !== '0')
        ? (this.selectedPhoneCode.trim() + " " + this.clientModel.phone)
        : this.clientModel.phone;
      console.log(this.clientModel.phone);
      this.clientModel.PhotoBase64 = this.dataURL || null;
      if (this.clientModel.icdid != null) {
        this.clientModel.patientDiagnosis = new Array<PatientDiagnosis>();
        let patientDiag = new PatientDiagnosis();
        patientDiag.patientID = this.clientId;
        patientDiag.icdid = this.clientModel.icdid;
        patientDiag.isPrimary = true;
        this.clientModel.patientDiagnosis.push(patientDiag);
      }
      if (this.clientModel.tag != null) {
        this.clientModel.patientTags = new Array<PatientTag>();
        let patientTag = new PatientTag();
        this.clientModel.tag.forEach((x) => {
          patientTag = { patientID: this.clientId, isDeleted: false, tagID: x };
          this.clientModel.patientTags.push(patientTag);
        });
      }
      this.submitted = true;
      this.clientService
        .create(this.clientModel)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.clientId = response.data.id;
            this.route.navigate(["web/client"], {
              queryParams: {
                id: this.commonService.encryptValue(this.clientId, true),
              },
            });
            //   this.notifierService.notify("success", response.message);
            //   this.handleTabChange.next({
            //     tab: "Guardian/Guarantor",
            //     id: response.data.id,
            //     clickType: clickType,
            //   });
            // } else {
            //   this.notifierService.notify("error", response.message);
          }
          else {
            this.notifierService.notify("error", response.message);
          }
        });
    }
  }

  onNext() {
    //let clickType = event.currentTarget.name;
    // this.route.navigate(["web/client"], {
    //   queryParams: {
    //     id: this.commonService.encryptValue(this.clientId, true),
    //   },
    // });
    this.handleTabChange.next({
      tab: "Guardian/Guarantor",
      id: this.clientId,
      // clickType: clickType,
    });
  }
  getCurrentLocations() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.masterLocation = (user.userLocations || []).map((obj: any) => {
          return {
            id: obj.id,
            value: obj.locationName,
          };
        });
      }
    });
  }

  handleImageChange(e: any):any {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      //The file size in MB adn max limit is 2.5 MB.
      //in bytes 2097152 = 2MB, 2621440 = 2.5 MB.
      let maxSize = 2621440;
      // console.log(e.target.files[0].size);
      if (e.target.files[0].size > maxSize) {
        this.notifierService.notify(
          "error",
          "Please Select the image size less than 2.5 MB."
        );
        return false;
      }
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");

    return
  }

  // To remove changed image.
  removeImage() {
    this.dataURL = null;
    this.imagePreview = null;
  }

  getMasterData() {
    let data =
      "MASTERGENDER,MasterLocation,PHONETYPE,MASTERRACE,MASTERETHNICITY,MASTERSTAFF,MASTERICD,MASTERRELATIONSHIP,MASTERRENDERINGPROVIDER,MASTERTAGSFORPATIENT";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        this.masterRace =
          response.masterRace != null ? response.masterRace : [];
        this.masterEthnicity =
          response.masterEthnicity != null ? response.masterEthnicity : [];
        this.masterRelationship =
          response.masterRelationship != null
            ? response.masterRelationship
            : [];
        this.masterRenderingProvider =
          response.masterRenderingProvider != null
            ? response.masterRenderingProvider
            : [];
        // this.masterPhoneType = this.removeDuplicates(
        //   response.masterPhoneType != null ? response.masterPhoneType : [],
        //   "value"  
        // );
        this.masterTagsForPatient =
          response.masterTagsforPatient != null
            ? response.masterTagsforPatient
            : [];
        this.masterDiagnosis =
          response.masterICD != null ? response.masterICD : [];
      }
    });
  }

  getClientInfo() {
    this.clientService
      .getClientById(this.clientId)
      .subscribe((response: any) => {
        if (response != null) {
          this.clientModel = response.data;
          this.clientModel.patientTags != null
            ? this.clientModel.patientTags
              .map(({ tagID }) => tagID)
              .filter((tagID): tagID is number => tagID !== undefined)
            : [];
          this.imagePreview = this.clientModel.photoThumbnailPath || "";
          const primaryDiagnosis =
            this.clientModel.patientDiagnosis &&
            this.clientModel.patientDiagnosis.find((x) => x.isPrimary == true);
          //this.clientModel.icdid = primaryDiagnosis && primaryDiagnosis.icdid;
          this.clientModel.icdid = primaryDiagnosis?.icdid ?? 0;
          this.demographicInfoForm.patchValue(this.clientModel);
        }
      });
  }
  removeDuplicates = (array: any[], key: string | number) => {
    //////debugger;
    return array.reduce((arr, item) => {
      const removed = arr.filter((i: { [x: string]: any; }) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };
  phoneCodeChange($event: any) {
    this.selectedPhoneCode = $event;
  }
  // Only Integer Numbers
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    //////debugger
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 65 || (charCode > 90 && charCode < 97) || charCode > 122) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
