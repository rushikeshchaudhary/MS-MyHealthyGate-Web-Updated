import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ImmunizationModel } from '../immunization-details/ImmunizationModule';
import { ImmunizationserviceService } from '../immunizationservice.service';

@Component({
  selector: 'app-create-immunization-details',
  templateUrl: './create-immunization-details.component.html',
  styleUrls: ['./create-immunization-details.component.css']
})
export class CreateImmunizationDetailsComponent implements OnInit {
  submitted: boolean = false;
  isEdit: boolean = false;
  headerText: string = 'Add Insurance-CompanyDetails';
  InsuranceServiceModel: ImmunizationModel;
  CompanyInsuranceForm!: FormGroup;
  vaccineStatus: any = ["Inactive", "Active", "Never Active", "Pending"];
  selected: string = "Active";

  constructor(private serviceDialogModalRef: MatDialogRef<CreateImmunizationDetailsComponent>,
    private ImmunizationSevice:ImmunizationserviceService,private notifier: NotifierService,private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any) {
      this.InsuranceServiceModel=data;
      if (this.InsuranceServiceModel.id >0){
        this.headerText = 'Edit Immunization-Details';
        this.isEdit = true;
      }
      else
        this.headerText = 'Add Immunization-Details';
     }

  ngOnInit() {
    this.CompanyInsuranceForm = this.formBuilder.group({
      Id: [this.InsuranceServiceModel.id],
      VaccineName: new FormControl(this.InsuranceServiceModel.vaccineName, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      VaccineStatus: new FormControl(this.InsuranceServiceModel.vaccineStatus, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      ShortDesc: new FormControl(this.InsuranceServiceModel.shortDesc, {
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

    this.ImmunizationSevice.create(this.InsuranceServiceModel).subscribe((response: any) => {
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
  statusChangeHandler(event: any){
    this.InsuranceServiceModel.vaccineStatus=event
    //this.onSubmit();

  }
}
