import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import {MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { ClientsService } from "../../clients.service";
import {
  InsuredPersonModel,
  PatientInsuranceModel,
} from "../../insurance.model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-insurance-modal",
  templateUrl: "./insurance-modal.component.html",
  styleUrls: ["./insurance-modal.component.css"],
})
export class InsuranceModalComponent implements OnInit {
  insuranceCompaniesModel: PatientInsuranceModel|any;
  clientInsuranceList: Array<PatientInsuranceModel> = [];
  dataSource = new MatTableDataSource<any>();
  insuredPersonModel: InsuredPersonModel = new InsuredPersonModel;
  loadingMasterData: boolean = false;
  insurancePlanTypeId!: number;
  masterInsuranceCompanies: Array<any> = [];
  patientInsuranceId!: number;
  masterInsurancePlanTypes: Array<any> = [];
  headerText: string = "Add Insurance";
  activeInsurance: string = "primary";
  insuranceEditForm!: FormGroup;
  insuranceAddForm!: FormGroup;
  IsEditForm: boolean;
  patientId!: number;
  imagePreviewFront: any;
  imagePreviewBack: any;
  imageBase64Front: any;
  imageBase64Back: any;
  clientId!: number;
  matcher: any;
  insuranceData: any;
  submitted: boolean = false;
  maxDate = new Date();
  dataURL: any;
  masterRelationship: Array<any> = [];
  masterState: Array<any> = [];
  masterCountry: Array<any> = [];
  masterGender: Array<any> = [];
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  // insuranceModel:

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private insuranceDialogModalRef: MatDialogRef<InsuranceModalComponent>,
    private translate:TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    // this.insuranceCompaniesModel = data;
    this.insuranceCompaniesModel = null;
    console.log('insuranceCompaniesModel', data);
    if (data == null) {
      console.log('AddForm Hit');
      this.IsEditForm = false;
      this.headerText = "Add Insurance";
      this.clientId = data.patientID;
    }else if(data.id == 0){
      console.log('AddForm Hit');
      this.IsEditForm = false;
      this.headerText = "Add Insurance";
      this.clientId = data.patientID;
    }
    else {
      console.log('EditForm Hit');
      this.IsEditForm = true;
      this.headerText = "Edit Insurance";
      this.insuranceCompaniesModel = data;
      console.log(this.insuranceCompaniesModel);
      
    }
    //this.refreshGrid.subscribe(data.refreshGrid);
    //this.clientId = this.insuranceCompaniesModel[0].patientID;
    //this.patientId = this.clientId ;
    //update header text
    //   if (
    //     this.insuranceCompaniesModel.id != null &&
    //     this.insuranceCompaniesModel.id > 0
    //   )
    //     this.headerText = "Edit Insurance";
    //   else 
    //   {
    //   this.headerText = "Add Insurance";
    //   this.refreshGrid.subscribe(data.refreshGrid);
    // }
  }

  ngOnInit() {
    this.getMasterData();
    this.insuranceAddForm = this.formBuilder.group({
      insuranceCompanyID: [],
      insuranceCompanyAddress: [],
      insuranceIDNumber: [],
      insuranceGroupName: [],
      cardIssueDate: [],
      insurancePlanTypeID: [],
      insurancePhotoPathFront: [],
      insurancePhotoPathThumbFront: [],
      insurancePhotoPathBack: [],
      insurancePhotoPathThumbBack: [],
      insurancePersonSameAsPatient: [],
      carrierPayerID: [],
      insuranceCompanyName: [],
      insurancePlanName: [],
      notes: [],
    });

    this.insuranceEditForm = this.formBuilder.group({
      insuranceCompanyID: [],
      insuranceCompanyAddress: [],
      insuranceIDNumber: [],
      insuranceGroupName: [],
      cardIssueDate: [],
      insurancePlanTypeID: [],
      insurancePhotoPathFront: [],
      insurancePhotoPathThumbFront: [],
      insurancePhotoPathBack: [],
      insurancePhotoPathThumbBack: [],
      insurancePersonSameAsPatient: [],
      carrierPayerID: [],
      insuranceCompanyName: [],
      insurancePlanName: [],
      notes: [],
    });
    if (this.insuranceCompaniesModel !== null) {
      this.setEditFrom();
    }

    // this.insuranceEditForm = this.formBuilder.group({
    //   id: [this.insuranceCompaniesModel[0].id],
    //   patientID: [this.insuranceCompaniesModel[0].patientID],
    //   insuranceCompanyID: [
    //     this.insuranceCompaniesModel[0].insuranceCompanyID,
    //     [Validators.required],
    //   ],
    //   insuranceCompanyAddress: [
    //     this.insuranceCompaniesModel[0].insuranceCompanyAddress,
    //   ],
    //   insuranceIDNumber: [
    //     this.insuranceCompaniesModel[0].insuranceIDNumber,
    //     [Validators.required],
    //   ],
    //   insuranceGroupName: [this.insuranceCompaniesModel[0].insuranceGroupName],
    //   insurancePlanTypeID: [this.insuranceCompaniesModel[0].insurancePlanTypeID],
    //   cardIssueDate: [this.insuranceCompaniesModel[0].cardIssueDate],
    //   insurancePhotoPathFront: [
    //     this.insuranceCompaniesModel[0].insurancePhotoPathFront,
    //   ],
    //   insurancePhotoPathThumbFront: [
    //     this.insuranceCompaniesModel[0].insurancePhotoPathThumbFront,
    //   ],
    //   insurancePhotoPathBack: [
    //     this.insuranceCompaniesModel[0].insurancePhotoPathBack,
    //   ],
    //   insurancePhotoPathThumbBack: [
    //     this.insuranceCompaniesModel[0].insurancePhotoPathThumbBack,
    //   ],
    //   insurancePersonSameAsPatient: [
    //     this.insuranceCompaniesModel[0].insurancePersonSameAsPatient= true,
    //   ],
    //   carrierPayerID: [this.insuranceCompaniesModel[0].carrierPayerID],
    //   insuranceCompanyName: [this.insuranceCompaniesModel[0].insuranceCompanyName],
    //   insurancePlanName: [this.insuranceCompaniesModel[0].insurancePlanName],
    //   notes: [this.insuranceCompaniesModel[0].notes],      
    // });



    //this.formControlValueChanged();
  }
  get addFormControls() {
    return this.insuranceAddForm.controls;
  }
  get editFormControls() {
    return this.insuranceEditForm.controls;
  }
  setEditFrom() {
    ////debugger
    this.insuranceEditForm.patchValue({
      insuranceCompanyID: this.insuranceCompaniesModel.insuranceCompanyID,
      insuranceCompanyAddress: this.insuranceCompaniesModel.insuranceCompanyAddress,
      insuranceIDNumber: this.insuranceCompaniesModel.insuranceIDNumber,
      insuranceGroupName: this.insuranceCompaniesModel.insuranceGroupName,
      cardIssueDate: new Date(this.insuranceCompaniesModel.cardIssueDate),
      insurancePlanTypeID: this.insuranceCompaniesModel.insurancePlanTypeID,
      insurancePhotoPathFront: this.insuranceCompaniesModel.insurancePhotoPathFront,
      insurancePhotoPathThumbFront: this.insuranceCompaniesModel.insurancePhotoPathThumbFront,
      insurancePhotoPathBack: this.insuranceCompaniesModel.insurancePhotoPathBack,
      insurancePhotoPathThumbBack: this.insuranceCompaniesModel.insurancePhotoPathThumbBack,
      insurancePersonSameAsPatient: this.insuranceCompaniesModel.insurancePersonSameAsPatient,
      carrierPayerID: this.insuranceCompaniesModel.carrierPayerID,
      insuranceCompanyName: this.insuranceCompaniesModel.insuranceCompanyName,
      insurancePlanName: this.insuranceCompaniesModel.insurancePlanName,
      notes: this.insuranceCompaniesModel.notes,
    })
  }
  // get insuredPersonformControls() {
  //   return this.insuranceForm.get("insuredPerson") as FormGroup;
  // }
  activeHandler(insuranceType: any,event?: any) {
    event && event.preventDefault();
    this.insuranceAddForm.reset();
    this.removeImage("front");
    this.removeImage("back");
    //to reset the error msgs.
    this.matcher = null;
    const insPlanObj = (this.masterInsurancePlanTypes || []).find(
      (obj) => obj.value.toLowerCase() === insuranceType.toLowerCase()
    );
    this.insurancePlanTypeId = insPlanObj && insPlanObj.id;
    this.activeInsurance = insuranceType;
    //if (this.clientId != null) this.getPatientInsurance();
  }
  // formControlValueChanged() {
  //   let insuredPersonControl = this.insuredPersonformControls.controls;
  //   this.insuranceForm
  //     .get("insurancePersonSameAsPatient")
  //     .valueChanges.subscribe((mode: any) => {
  //       if (mode == false || mode == null) {
  //         insuredPersonControl.address1.setValidators([Validators.required]);
  //         insuredPersonControl.firstName.setValidators([Validators.required]);
  //         insuredPersonControl.lastName.setValidators([Validators.required]);
  //         insuredPersonControl.genderID.setValidators([Validators.required]);
  //         insuredPersonControl.relationshipID.setValidators([
  //           Validators.required,
  //         ]);
  //         insuredPersonControl.dob.setValidators([Validators.required]);
  //         insuredPersonControl.phone.setValidators([Validators.required]);
  //         insuredPersonControl.countryID.setValidators([Validators.required]);
  //         insuredPersonControl.city.setValidators([Validators.required]);
  //         insuredPersonControl.stateID.setValidators([Validators.required]);
  //         insuredPersonControl.zip.setValidators([Validators.required]);
  //       } else {
  //         insuredPersonControl.address1.clearValidators();
  //         insuredPersonControl.firstName.clearValidators();
  //         insuredPersonControl.lastName.clearValidators();
  //         insuredPersonControl.genderID.clearValidators();
  //         insuredPersonControl.relationshipID.clearValidators();
  //         insuredPersonControl.dob.clearValidators();
  //         insuredPersonControl.phone.clearValidators();
  //         insuredPersonControl.countryID.clearValidators();
  //         insuredPersonControl.city.clearValidators();
  //         insuredPersonControl.stateID.clearValidators();
  //         insuredPersonControl.zip.clearValidators();
  //       }
  //       insuredPersonControl.address1.updateValueAndValidity();
  //       insuredPersonControl.firstName.updateValueAndValidity();
  //       insuredPersonControl.lastName.updateValueAndValidity();
  //       insuredPersonControl.genderID.updateValueAndValidity();
  //       insuredPersonControl.relationshipID.updateValueAndValidity();
  //       insuredPersonControl.dob.updateValueAndValidity();
  //       insuredPersonControl.phone.updateValueAndValidity();
  //       insuredPersonControl.countryID.updateValueAndValidity();
  //       insuredPersonControl.city.updateValueAndValidity();
  //       insuredPersonControl.stateID.updateValueAndValidity();
  //       insuredPersonControl.zip.updateValueAndValidity();
  //     });
  // }

  handleImageChange(e:any, type: string) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        if (type == "front") {
          this.imagePreviewFront = reader.result;
          this.imageBase64Front = this.imagePreviewFront;
        } else {
          this.imagePreviewBack = reader.result;
          this.imageBase64Back = this.imagePreviewBack;
        }
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }
  removeImage(value: string) {
    if (value == "front") {
      this.imagePreviewFront = null;
      this.imageBase64Front = this.imagePreviewFront;
    } else {
      this.imagePreviewBack = null;
      this.imageBase64Back = this.imagePreviewBack;
    }
  }
  getMasterData() {
    let data =
      "masterInsuranceCompany,insurancePlanType,MASTERGENDER,masterRelationship,MASTERSTATE,MASTERCOUNTRY";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterInsuranceCompanies =
          response.insuranceCompanies != null
            ? response.insuranceCompanies
            : [];
        this.masterCountry =
          response.masterCountry != null ? response.masterCountry : [];
        this.masterState =
          response.masterState != null ? response.masterState : [];
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        this.masterRelationship =
          response.masterRelationship != null
            ? response.masterRelationship
            : [];
        this.masterInsurancePlanTypes =
          response.insurancePlanType != null ? response.insurancePlanType : [];
        this.activeHandler('', "primary");
      }
    });
  }
  onSubmitForAdd(event: any):any {
    this.submitted = true;
    let clickType = event.currentTarget.name;
    if (this.insuranceAddForm.invalid) {
      this.submitted = false;
      this.matcher = new MyErrorStateMatcher();
      return false;
    }
    let postData: any;
    let a = this.insuranceAddForm.value;
    console.log(a);
    //this.insuranceAddForm.get('cardIssueDate').setValue(new Date( (this.insuranceAddForm.get('cardIssueDate').value).toISOString().split('T')[0]));
    const date = new Date(this.insuranceAddForm.get('cardIssueDate')!.value);
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    this.insuranceAddForm.get('cardIssueDate')!.setValue(utcDate);
    if (!this.insuranceAddForm.controls["insurancePersonSameAsPatient"].value) {
      postData = {
        ...this.insuranceAddForm.value,
        cardIssueDate: new Date(this.insuranceAddForm.value.cardIssueDate),
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.clientId,
        insurancePlanTypeID: this.insurancePlanTypeId,
        // insuredPerson: { 
        //   ...this.insuranceAddForm.value.insuredPerson,
        //   dob: this.insuranceAddForm.value.insuredPerson.dob
        //     ? format(this.insuranceAddForm.value.insuredPerson.dob, "MM-dd-yyyy")
        //     : null,
        //   patientID: this.clientId,
        //   patientInsuranceID: this.insuranceAddForm.value.id,
        // },
      };
    } else {
      postData = {
        ...this.insuranceAddForm.value,
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.clientId,
        insurancePlanTypeID: this.insurancePlanTypeId,
        insuredPerson: null,
      };
    }
    this.imageBase64Front = null;
    this.imageBase64Back = null;
    let formData = new Array<PatientInsuranceModel>();
    formData.push(postData);
    this.clientService
      .savePatientInsurance(formData)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          if (clickType == "SaveContinue") {
            this.handleTabChange.next({
              tab: "Custom Fields",
              id: this.clientId,
            });
          } else if (clickType == "Save") {
            this.closeDialog(clickType);
            //this.getPatientInsuranceList();
          }
        } else {
          this.notifier.notify("error", response.message);
        }
      });
      return
  }
  onSubmitForEdit(event: any):any {
    this.submitted = true;
    let clickType = event.currentTarget.name;
    if (this.insuranceEditForm.invalid) {
      this.submitted = false;
      this.matcher = new MyErrorStateMatcher();
      return false;
    }
    let postData: any;
    let a = this.insuranceEditForm.value;
    if (!this.insuranceEditForm.controls["insurancePersonSameAsPatient"].value) {
      postData = {
        ...this.insuranceEditForm.value,
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.insuranceCompaniesModel.patientID,
        id: this.insuranceCompaniesModel.id,
        insurancePlanTypeID: this.insurancePlanTypeId,
        // insuredPerson: {
        //   ...this.insuranceEditForm.value.insuredPerson,
        //   dob: this.insuranceEditForm.value.insuredPerson.dob
        //     ? format(this.insuranceEditForm.value.insuredPerson.dob, "MM-dd-yyyy")
        //     : null,
        //   patientID: this.clientId,
        //   patientInsuranceID: this.insuranceEditForm.value.id,
        // },
      };
    } else {
      postData = {
        ...this.insuranceEditForm.value,
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.clientId,
        insurancePlanTypeID: this.insurancePlanTypeId,
        insuredPerson: null,
        id: this.insuranceCompaniesModel.id,
      };
    }
    this.imageBase64Front = null;
    this.imageBase64Back = null;
    let formData = new Array<PatientInsuranceModel>();
    formData.push(postData);
    this.clientService
      .savePatientInsurance(formData)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          if (clickType == "SaveContinue") {
            this.handleTabChange.next({
              tab: "Custom Fields",
              id: this.clientId,
            });
          } else if (clickType == "Save") {
            this.closeDialog(clickType);
            //this.getPatientInsuranceList();
          }
        } else {
          this.notifier.notify("error", response.message);
        }
      });
      return
  }

  // getPatientInsuranceList() {

  //   this.clientService
  //     .getPatientInsurance(this.clientId)
  //     .subscribe((response: ResponseModel) => {
  //       if (response != null && response.statusCode == 200) {
  //          //this.clientInsuranceListModel = response.data.PatientInsurance;
  //          this.clientInsuranceList = response.data.PatientInsurance;
  //          this.dataSource.data = response.data;
  //       }
  //       else{
  //         this.clientInsuranceList;
  //       }
  //     });
  // }
  // getPatientInsurance() {
  //   this.clientService
  //     .getPatientInsurance(this.clientId)
  //     .subscribe((response: ResponseModel) => {
  //       if (response.statusCode == 200) {
  //         this.insuranceCompaniesModel = response.data.PatientInsurance.find(
  //           (obj) => obj.insurancePlanTypeID == this.insurancePlanTypeId
  //         );
  //         this.insuranceCompaniesModel =
  //           this.insuranceCompaniesModel || new PatientInsuranceModel();
  //         this.imagePreviewFront =
  //           this.insuranceCompaniesModel.insurancePhotoPathThumbFront || "";
  //         this.imagePreviewBack =
  //           this.insuranceCompaniesModel.insurancePhotoPathThumbBack || "";
  //         this.imageBase64Front = null;
  //         this.imageBase64Back = null;
  //         this.patientInsuranceId = this.insuranceCompaniesModel.id;
  //         this.insuranceForm.patchValue(this.insuranceCompaniesModel);
  //         if (
  //           this.insuranceCompaniesModel &&
  //           this.insuranceCompaniesModel.insurancePersonSameAsPatient != true
  //         ) {
  //           this.insuredPersonModel = response.data.InsuredPerson.find(
  //             (obj) => obj.patientInsuranceID == this.insuranceCompaniesModel.id
  //           );
  //           this.insuredPersonModel =
  //             this.insuredPersonModel || new InsuredPersonModel();
  //           this.insuranceForm.patchValue({
  //             insuredPerson: this.insuredPersonModel,
  //           });
  //         }
  //       }
  //     });
  // }
  updateValue(insuranceCompanyId: number) {
    console.log('INSUID');
    if (
      this.masterInsuranceCompanies != null &&
      this.masterInsuranceCompanies.length > 0
    ) {
      const addressObj = this.masterInsuranceCompanies.find(
        (x) => x.id == insuranceCompanyId
      );
      if (this.IsEditForm == true) {
        this.insuranceEditForm.patchValue({
          insuranceCompanyAddress: addressObj.address,
          carrierPayerID: addressObj.carrierPayerID,
        });
      }
      else {
        console.log('IsAdd');
        this.insuranceAddForm.patchValue({
          insuranceCompanyAddress: addressObj.address,
          carrierPayerID: addressObj.carrierPayerID,
        });
      }
    }
  }
  //close popup
  closeDialog(action: string): void {
    this.insuranceDialogModalRef.close(action);
  }
}

// To force error massages to show on untouched submit.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    // const isSubmitted = form && form.submitted;
    // return control && control.invalid;
    const isSubmitted = form ? form.submitted : false;
    return control ? control.invalid && (control.dirty || control.touched || isSubmitted) : false;
  }
}
