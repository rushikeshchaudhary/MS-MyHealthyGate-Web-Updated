import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import Swal from "sweetalert2";
import { LabCancelationRuleModel, LabFeeAndCancellation } from "../../lab.model";
import { LabService } from "../../lab.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-manage-fee",
  templateUrl: "./lab-manage-fee.component.html",
  styleUrls: ["./lab-manage-fee.component.css"],
})
export class LabManageFeeComponent implements OnInit {
  paymentFormGroup!: FormGroup;
  showurgentcarefees: boolean = false;
  hoursList: number[];
  refundPercentagesList: number[];
  daysNumbersList: number[];
  submitted = false;
  labFeeData!: LabFeeAndCancellation;

  constructor(
    private formBuilder: FormBuilder,
    private labService: LabService,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.hoursList = [2, 4, 6, 12, 24, 48];
    this.refundPercentagesList = [0, 10, 20, 30, 40, 50];
    this.daysNumbersList = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  }

  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      f2fFee: [undefined, Validators.required],
      newOnlineFee: [undefined, Validators.required],
      homevisitFee: [undefined, Validators.required],
      labCancelationRuleModel: this.formBuilder.array([]),
      folowupFees: [undefined, Validators.required],
      folowupDays: [undefined, Validators.required],
      urgentcareFee: [undefined],
    });
    this.getLabFeeAndCancellation();
  }
  get f() {
    return this.paymentFormGroup.controls;
  }

  get cancelationRulesFormGroups(): FormArray {
    return this.paymentFormGroup.get('labCancelationRuleModel') as FormArray;
  }

  // onF2fFeeChange(value:any) {
  //   //////debugger
  //   if (value && value != 0 && value != "0") {
  //     if (value.length == 1) {
  //       value = 0 + value;
  //     }

  //     value = Number(value);
  //     this.f["newOnlineFee"].setValue(value * 0.7);
  //     this.f["folowupFees"].setValue(value * 0.7);
  //   }
  // }

  onF2fFeeChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    
    if (value && value != '0') {
      let numericValue = Number(value);
      
      if (numericValue && numericValue.toString().length === 1) {
        numericValue = Number('0' + value);
      }
      
      this.f["newOnlineFee"].setValue(numericValue * 0.7);
      this.f["folowupFees"].setValue(numericValue * 0.7);
    }
  }

  getLabFeeAndCancellation = () => {
    this.labService.getLabFeeAndCancellationRules().subscribe((res) => {
      this.labFeeData = res.data;
      
      console.log(this.labFeeData);
      this.bindForm(res.data)
    });
  };
  bindForm(model: LabFeeAndCancellation) {
    if (model && model.labCancelationRuleModel && model.labCancelationRuleModel.length > 0) {
      model.labCancelationRuleModel.forEach((rule) => {
        const toAdd: LabCancelationRuleModel = {
          refundPercentage: rule.refundPercentage,
          uptoHours: rule.uptoHours,
        };
        if (!this.hoursList.includes(rule.refundPercentage)) {
          this.refundPercentagesList.push(rule.refundPercentage);
          this.refundPercentagesList.sort((a, b) => b - a);
        }
        if (!this.hoursList.includes(rule.uptoHours)) {
          this.hoursList.push(rule.uptoHours);
          this.hoursList.sort((a, b) => b - a);
        }
        this.addCancelationRuleControl(toAdd);
      });
    }
    

    if (!this.daysNumbersList.includes(model.folowupDays)) {
      this.daysNumbersList.push(model.folowupDays);
      this.daysNumbersList.sort((a, b) => b - a);
    }

    this.paymentFormGroup.patchValue(model);
  }

  checkboxchecked(event:any) {
    if (event.source.checked) {
      this.showurgentcarefees = true;
    } else {
      this.showurgentcarefees = false;
    }
  }
  addMoreHourOption() {
    Swal({
      title: "Enter New Hour Option",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      input: "number",
      cancelButtonClass: "cancel-btn-alet",
      confirmButtonClass: "cnfm-btn-alrt",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Enter value");
        } else if (value % 2 != 0) {
          Swal.showValidationMessage("Only 2-Miltiple is allowed");
        }
      },
    }).then((result) => {
      if (result.value && result.value % 2 == 0) {
        if (!this.hoursList.includes(result.value)) {
          this.hoursList.push(result.value);
          this.hoursList.sort((a, b) => b - a);
        }
      }
    });
  }
  addMoreRefundPercentageOption() {
    Swal({
      title: "Enter New Refund % Option",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      input: "number",
      cancelButtonClass: "cancel-btn-alet",
      confirmButtonClass: "cnfm-btn-alrt",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Enter value");
        } else if (value % 2 != 0) {
          Swal.showValidationMessage("Only 2-Miltiple is allowed");
        }
      },
    }).then((result) => {
      if (result.value) {
        if (!this.refundPercentagesList.includes(result.value)) {
          this.refundPercentagesList.push(result.value);
          this.refundPercentagesList.sort((a, b) => b - a);
        }
      }
    });
  }
  addCancelationRuleControl(rule:any) {
    this.cancelationRulesFormGroup.push(this.getCancelationRulesForm(rule));
  }
  removeCancelationRuleControl(i:any) {
    this.cancelationRulesFormGroup.removeAt(i);
  }
  get cancelationRulesFormGroup() {
    return <FormArray>this.paymentFormGroup.controls["labCancelationRuleModel"];
  }
  private getCancelationRulesForm(rule:any) {
    return this.formBuilder.group({
      uptoHours: [
        rule ? rule.refundPercentage : undefined,
        [Validators.required],
      ],
      refundPercentage: [
        rule ? rule.refundPercentage : undefined,
        [Validators.required],
      ],
    });
  }
  addMoreFollowUpDaysOption() {
    Swal({
      title: "Enter New Followup days Option",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      input: "number",
      cancelButtonClass: "cancel-btn-alet",
      confirmButtonClass: "cnfm-btn-alrt",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Enter value");
        }
      },
    }).then((result) => {
      if (result.value) {
        if (!this.daysNumbersList.includes(result.value)) {
          this.daysNumbersList.push(result.value);
          this.daysNumbersList.sort((a, b) => b - a);
        }
      }
    });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control:any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onSubmit() {
   // this.isSubmitted = true;
    
    this.markFormGroupTouched(this.paymentFormGroup);
    if (this.paymentFormGroup.invalid) return;

    const model = this.paymentFormGroup.value;

    if (!this.checkIfDuplicateHours(model)) {
      this.updateProvidersFeesAndRefundsSettings(model);
    } else {
      this.notifier.notify("error", "Duplicate hours in cancellation rules");
    }
  }
  checkIfDuplicateHours(model: LabFeeAndCancellation): boolean {
    let isDuplicate = false;
    if (model && model.labCancelationRuleModel && model.labCancelationRuleModel.length > 1) {
      const values: number[] = [];
      model.labCancelationRuleModel.forEach((r) => {
        if (values.includes(r.uptoHours)) {
          isDuplicate = true;
          return isDuplicate;
        } else {
          values.push(r.uptoHours);
          return false ;
        }
      });
    } else {
      return isDuplicate;
    }
    return isDuplicate;
  }

  sortFunc(a:any, b:any) {
    return 1;
  }
  private updateProvidersFeesAndRefundsSettings(model: LabFeeAndCancellation) {
    this.submitted = true;
    console.log(model)
    this.labService
      .updateLabFeeAndCancellationRules(model)
      .subscribe((response) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify("success", "Updated Successfully");
        }
        this.submitted = false;
      });
  }

}
