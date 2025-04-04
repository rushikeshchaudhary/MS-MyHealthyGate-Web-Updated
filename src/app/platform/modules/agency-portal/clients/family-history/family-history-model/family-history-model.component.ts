import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";
import {
  PatientMedicalFamilyHistoryModel,
  PatientMedicalFamilyHistoryDiseaseModel,
} from "../family-history.model";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../clients.service";
import { NotifierService } from "angular-notifier";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-family-history-model",
  templateUrl: "./family-history-model.component.html",
  styleUrls: ["./family-history-model.component.css"],
})
export class FamilyHistoryModelComponent implements OnInit {
  familyHistoryModel: PatientMedicalFamilyHistoryModel;
  familyHistoryForm!: FormGroup;
  masterRelationship: Array<any> = [];
  masterICD: Array<any> = [];
  masterGender: Array<any> = [];
  masterStatus: Array<any> = [
    { id: true, value: "Active" },
    { id: false, value: "In Active" },
  ];
  maxDate = new Date();
  submitted: boolean = false;
  clientId: number;
  showError: boolean = false;
  // Issue 53  Fix Start
  diagnosisAge: any = 0;
  // Issue 53  Fix end
  constructor(
    private formBuilder: FormBuilder,
    private familyHistoryDialogModalRef: MatDialogRef<FamilyHistoryModelComponent>,
    private familyHistoryService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private translate:TranslateService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.familyHistoryModel = data;
    this.clientId = this.familyHistoryModel.patientID;
  }

  ngOnInit() {
    this.initializeFormFields(this.familyHistoryModel);
    this.getMasterData();
    this.formControlValueChanged();
  }
  initializeFormFields(familyHistoryObj?: PatientMedicalFamilyHistoryModel) {
    familyHistoryObj =
      familyHistoryObj || new PatientMedicalFamilyHistoryModel();
    const configControls = {
      id: [familyHistoryObj.id],
      firstName: [familyHistoryObj.firstName, Validators.required],
      lastName: [familyHistoryObj.lastName, Validators.required],
      genderID: [familyHistoryObj.genderID, Validators.required],
      dob: [familyHistoryObj.dob, Validators.required],
      relationshipID: [familyHistoryObj.relationshipID, Validators.required],
      dateOfDeath: [familyHistoryObj.dateOfDeath],
      causeOfDeath: [familyHistoryObj.causeOfDeath],
      observation: [familyHistoryObj.observation],
      patientMedicalFamilyHistoryDiseases: this.formBuilder.array([]),
      patientID: [familyHistoryObj.patientID],
    };
    this.familyHistoryForm = this.formBuilder.group(configControls);
    // initialize modifier modal
    if (
      familyHistoryObj.patientMedicalFamilyHistoryDiseases &&
      familyHistoryObj.patientMedicalFamilyHistoryDiseases.length
    ) {
      familyHistoryObj.patientMedicalFamilyHistoryDiseases.forEach((obj) => {
        this.addDiseaseFields(obj);
      });
    } else {
      this.addDiseaseFields();
    }
  }
  get patientMedicalFamilyHistoryDiseases() {
    return this.familyHistoryForm.get(
      "patientMedicalFamilyHistoryDiseases"
    ) as FormArray;
  }
  addDiseaseFields(diseaseObj?: PatientMedicalFamilyHistoryDiseaseModel) {
    const diseaseControls =
      diseaseObj || new PatientMedicalFamilyHistoryDiseaseModel();
    this.patientMedicalFamilyHistoryDiseases.push(
      this.formBuilder.group(diseaseControls)
    );
  }
  removeDiseaseFields(ix: number) {
    this.patientMedicalFamilyHistoryDiseases.removeAt(ix);
  }
  get formControls() {
    return this.familyHistoryForm.controls;
  }
  onSubmit() {
    // Issue 53  Fix Start
    this.showError = false;
    var dob = this.familyHistoryForm.get("dob")!.value;
    var result: any;
    if (dob != null && dob != undefined) {
      var diff = Math.abs(<any>new Date() - <any>new Date(dob));
      result = Math.floor(diff / (1000 * 3600 * 24 * 365));
    }
    if (result != null && dob != null && this.diagnosisAge > result) {
      this.showError = true;
      return;
    }
    // Issue 53  Fix end
    if (this.familyHistoryForm.invalid) {
      return;
    }
    this.submitted = true;
    let postData: any;
    postData = {
      ...this.familyHistoryForm.value,
      patientMedicalFamilyHistoryDiseases: (
        this.familyHistoryForm.value.patientMedicalFamilyHistoryDiseases || []
      ).map((obj: any) => {
        return {
          ...obj,
          patientID: this.clientId,
          medicalFamilyHistoryId: this.familyHistoryForm.value.id,
        };
      }),
    };
    this.familyHistoryService
      .savePatientFamilyHistoryData(postData)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.closeDialog("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  formControlValueChanged() {
    const causeOfDeathControl = this.familyHistoryForm.get("causeOfDeath");
    this.familyHistoryForm
      .get("dateOfDeath")!
      .valueChanges.subscribe((mode: any) => {
        if (mode != null) {
          causeOfDeathControl!.setValidators([Validators.required]);
        } else {
          causeOfDeathControl!.clearValidators();
        }
        causeOfDeathControl!.updateValueAndValidity();
      });
  }
  // Issue 53  Fix Start
  ageValueChange(event: any) {
    this.diagnosisAge = event.target.value;
  }
  // Issue 53  Fix end
  closeDialog(action: string): void {
    this.familyHistoryDialogModalRef.close(action);
  }
  getMasterData() {
    let data = "MASTERGENDER,MASTERICD,MASTERRELATIONSHIP";
    this.familyHistoryService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        // let defaultCountryObj = (response.masterCountry || []).find((obj) => (obj.countryName || '').toUpperCase() === 'US');
        // this.defaultCountryId = defaultCountryObj && defaultCountryObj.id;
        this.masterICD = response.masterICD != null ? response.masterICD : [];
        this.masterRelationship =
          response.masterRelationship != null
            ? response.masterRelationship
            : [];
      }
    });
  }
}
