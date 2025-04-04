import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DrugPrescriptionServiceService } from './drug-prescription-service.service';
import { drugprscriptionmodel } from './Drugprescription-model';

@Component({
  selector: 'app-create-drug-presciption',
  templateUrl: './create-drug-presciption.component.html',
  styleUrls: ['./create-drug-presciption.component.css']
})
export class CreateDrugPresciptionComponent implements OnInit {
  submitted: boolean = false;
  isEdit: boolean = false;
  headerText: string = 'Add Insurance-CompanyDetails';
  InsuranceServiceModel: drugprscriptionmodel;
  CompanyInsuranceForm!: FormGroup;
  vaccineStatus: any = ["Inactive", "Active", "Never Active", "Pending"];
  selected: string = "Active";
  constructor(private serviceDialogModalRef: MatDialogRef<CreateDrugPresciptionComponent>,
    private DrugPrescriptionService:DrugPrescriptionServiceService,private notifier: NotifierService,private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any) {
      this.InsuranceServiceModel=data;
      if (this.InsuranceServiceModel.id >0){
        this.headerText = 'Edit Prescription-Details';
        this.isEdit = true;
      }
      else
        this.headerText = 'Add PrescriptionDrug-Details';
     }

  ngOnInit() {
    this.CompanyInsuranceForm = this.formBuilder.group({
      Id: [this.InsuranceServiceModel.id],
      drugName: new FormControl(this.InsuranceServiceModel.drugName, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      Dose: new FormControl(this.InsuranceServiceModel.dose, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      Strength: new FormControl(this.InsuranceServiceModel.strength, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      // CvxCode: new FormControl(this.InsuranceServiceModel.CvxCode, {
      //   validators: [Validators.required],
      //  // asyncValidators: [this.validateService.bind(this)],
      //   updateOn: "blur"
      // }),
      // vaccineStatus:new FormControl(this.InsuranceServiceModel.VaccineStatus, {
      //   validators: [Validators.required],
      //  // asyncValidators: [this.validateService.bind(this)],
      //   updateOn: "blur"
      // }),
     // isActive: [this.serviceModel.isActive]
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.CompanyInsuranceForm.invalid) {
      this.submitted = false;
      return;
    }
    this.InsuranceServiceModel = this.CompanyInsuranceForm.value;

    this.DrugPrescriptionService.create(this.InsuranceServiceModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        if (this.isEdit)
          this.notifier.notify("success", "Master service has been updated successfully.");
        else
          this.notifier.notify("success", response.message);
        this.closeDialog("Save");
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }
  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }
  get formControls() {
    return this.CompanyInsuranceForm.controls;''
  }
}
