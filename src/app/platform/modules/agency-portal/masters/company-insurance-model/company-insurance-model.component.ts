import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { InsurancecompanyModel } from '../../../core/modals/common-model';
import { CompanyInsuranceService } from './company-insurance.service';
//import { InsurancecompanyModel } from './insurancecompany-model';

@Component({
  selector: 'app-company-insurance-model',
  templateUrl: './company-insurance-model.component.html',
  styleUrls: ['./company-insurance-model.component.css']
})
export class CompanyInsuranceModelComponent implements OnInit {
  submitted: boolean = false;
  isEdit: boolean = false;
  headerText: string = 'Add Insurance-CompanyDetails';
  InsuranceServiceModel: InsurancecompanyModel;
  CompanyInsuranceForm!: FormGroup;
  constructor(private serviceDialogModalRef: MatDialogRef<CompanyInsuranceModelComponent>,
    private CompanyInsurance:CompanyInsuranceService,private notifier: NotifierService,private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,) {
      this.InsuranceServiceModel=data;
      if (this.InsuranceServiceModel.incuranceCompanyId >0){
        this.headerText = 'Edit Insurance-CompanyDetails';
        this.isEdit = true;
      }
      else
        this.headerText = 'Add Insurance-CompanyDetails';
    }


  ngOnInit() {
    this.CompanyInsuranceForm = this.formBuilder.group({
      IncuranceCompanyId: [this.InsuranceServiceModel.incuranceCompanyId],
      companyName: new FormControl(this.InsuranceServiceModel.companyName, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      companyAddress: new FormControl(this.InsuranceServiceModel.companyAddress, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      comapnyEmail: new FormControl(this.InsuranceServiceModel.comapnyEmail, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      phone: new FormControl(this.InsuranceServiceModel.phone, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
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

    this.CompanyInsurance.create(this.InsuranceServiceModel).subscribe((response: any) => {
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
  get formControls() {
    return this.CompanyInsuranceForm.controls;''
  }
  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }
  // validateService(
  //   ctrl: AbstractControl
  // ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  //   return new Promise(resolve => {
  //     if (!ctrl.dirty) {
  //      resolve(null);;
  //     } else
  //       this.masterService.validate(ctrl.value).subscribe((response: any) => {
  //         if (response.statusCode != 404) resolve({ uniqueName: true });
  //         else resolve(null);;
  //       });
  //   });
  // }
}
