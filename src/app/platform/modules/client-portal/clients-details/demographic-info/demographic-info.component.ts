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
import { ClientHeaderLayoutComponent } from "../.././../../../shared/layout/client-header-layout/client-header-layout.component";
import { from } from "rxjs";
import { PhoneNumberComponent } from "src/app/shared/phone-number/phone-number.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-demographic-info",
  templateUrl: "./demographic-info.component.html",
  styleUrls: ["./demographic-info.component.css"],
})
export class DemographicInfoComponent implements OnInit {
  @Output()
  ClientHeaderLayoutComponent: EventEmitter<any> = new EventEmitter<any>();
  demographicInfoForm!: FormGroup;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId!: number;
  clientModel: ClientModel;
  masterGender: any = [];
  masterRace: any = [];
  masterEthnicity!: any[];
  masterStaff!: any[];
  masterDiagnosis!: any[];
  masterLocation!: any[];
  masterRelationship!: any[];
  masterTagsForPatient: any = [];
  masterRenderingProvider: any = [];
  dataURL: any;
  imagePreview: any;
  submitted: boolean = false;
  maxDate = new Date();
  selectedPhoneCode: string = "0";
  isEditing: boolean = false;
  @ViewChild(PhoneNumberComponent)
  phoneNum!: PhoneNumberComponent;
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private route: Router,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.clientModel = new ClientModel();
  }
  ngOnInit() {
    this.maxDate = new Date();
    this.demographicInfoForm = this.formBuilder.group({
      firstName: [this.clientModel.firstName],
      middleName: [this.clientModel.middleName],
      lastName: [this.clientModel.lastName],
      gender: [this.clientModel.gender],
      dob: [this.clientModel.dob,[Validators.required, this.maxDateValidator()]],
      email: [this.clientModel.email, [Validators.required, Validators.email]],
      ssn: [this.clientModel.ssn],
      mrn: [this.clientModel.mrn],
      carrierid:[this.clientModel.carrierid],
      race: [this.clientModel.race],
      secondaryRaceID: [this.clientModel.secondaryRaceID],
      ethnicity: [this.clientModel.ethnicity],
      primaryProvider: [this.clientModel.primaryProvider],
      renderingProviderID: [this.clientModel.renderingProviderID],
      locationID: [this.clientModel.locationID],
      userName: [this.clientModel.userName],
      nationalID:[this.clientModel.nationalID],
      nationality:[this.clientModel.nationality],
      isPortalRequired: [this.clientModel.isPortalRequired],
      emergencyContactRelationship: [
        this.clientModel.emergencyContactRelationship,
      ],
      emergencyContactFirstName: [this.clientModel.emergencyContactFirstName],
      emergencyContactLastName: [this.clientModel.emergencyContactLastName],
      emergencyContactPhone: [
        this.clientModel.emergencyContactPhone,
        [Validators.minLength(10)],
      ],
      photoThumbnailPath: [this.clientModel.photoThumbnailPath],
      photoPath: [this.clientModel.photoPath],
      note: [this.clientModel.note],
      tag: [this.clientModel.tag],
      clientImg: [],
      icdid: [this.clientModel.icdid],
    });
    this.getMasterData();
    this.getCurrentLocations();
    if (this.clientId != null) this.getClientInfo();
  }
  get formControls() {
    return this.demographicInfoForm.controls;
  }

  onSubmit(event: any) {
    //////debugger
    //this.demographicInfoForm.get('firstName').markAsTouched();
    if (!this.demographicInfoForm.invalid) {
      let clickType = event.currentTarget.name;
      this.clientModel = this.demographicInfoForm.value;
      this.clientModel.id = this.clientId;
      this.clientModel.dob = new Date(this.demographicInfoForm.value.dob);
      this.clientModel.dob = new Date(Date.UTC(this.clientModel.dob.getFullYear(), this.clientModel.dob.getMonth(), this.clientModel.dob.getDate()));
      //this.clientModel.dob = new Date(this.clientModel.dob);
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
      //console.log(this.demographicInfoForm.value.email,"email");
      this.clientModel.emergencyContactPhone = `${this.selectedPhoneCode} ${this.clientModel.emergencyContactPhone}`
      this.submitted = true;
      this.clientService
        .create(this.clientModel)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.clientId = response.data.id;
            this.commonService.initializeAuthData();
            // this.route.navigate(["web/client/client-profile"], { queryParams: { id: this.commonService.encryptValue(this.clientId,true) } });
            this.notifierService.notify("success", response.message);
            this.isEditing = false;
            if (clickType == "SaveContinue")
              this.handleTabChange.next({
                tab: "1",
                id: response.data.id,
                clickType: clickType,
              });
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
    }
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

  handleImageChange(e:any):any {
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
    return;
  }

  getMasterData() {
    let data =
      "MASTERGENDER,MasterLocation,MASTERRACE,MASTERETHNICITY,MASTERSTAFF,MASTERICD,MASTERRELATIONSHIP,MASTERRENDERINGPROVIDER,MASTERTAGSFORPATIENT";
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
          this.selectedPhoneCode =
            this.clientModel.emergencyContactPhone &&
            this.clientModel.emergencyContactPhone.length > 0
              ? this.clientModel.emergencyContactPhone.split(" ")[0]
              : "0";
            console.log(this.selectedPhoneCode,"this.selectedPhoneCode")
            const phoneWithoutCountryCode = this.removeCountryCode(this.clientModel.emergencyContactPhone);
            console.log(phoneWithoutCountryCode,"phoneWithoutCountryCode")
            this.clientModel.emergencyContactPhone = phoneWithoutCountryCode;
          //this.phoneNum.bindCountryCode(this.selectedPhoneCode);
          this.clientModel.tag =
            this.clientModel.patientTags != null
              ? this.clientModel.patientTags.map(({ tagID }) => tagID || 0)
              : [];
          this.imagePreview = this.clientModel.photoThumbnailPath || "";
          const primaryDiagnosis =
            this.clientModel.patientDiagnosis &&
            this.clientModel.patientDiagnosis.find((x) => x.isPrimary == true);
          this.clientModel.icdid = primaryDiagnosis && primaryDiagnosis.icdid || 0;
          this.demographicInfoForm.patchValue(this.clientModel);
          this.demographicInfoForm.patchValue({
            email: this.clientModel.email});
        }
      });
  }
  removeCountryCode(phone: string): string {
    return phone.replace(/^\+\d+\s*/, '');
  }
  maxDateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      return selectedDate > today ? { 'matDatepickerMax': true } : null;
    };
  }
  phoneCodeChange($event:any) {
    //this.demographicInfoForm.controls.emergencyContactPhone.setValue($event);
    this.selectedPhoneCode=$event
    console.log($event,"$event")
  }
}