import { PaymentService } from "./../payment.service";
import { Component, OnInit } from "@angular/core";
import { UserModel } from "../../users/users.model";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CancelationRule, ManageFeesRefundsModel } from "../payment.models";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/platform/modules/core/services";
import { LoggedInUserModel } from "../../../core/modals/loginUser.modal";
import { UsersService } from "../../users/users.service";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-manage-fees-refunds",
  templateUrl: "./manage-fees-refunds.component.html",
  styleUrls: ["./manage-fees-refunds.component.css"],
})
export class ManageFeesRefundsComponent implements OnInit {
  usersData: UserModel[];
  paymentFormGroup!: FormGroup;
  hoursList: number[];
  refundPercentagesList: number[];
  submitted = false;
  manageFeesRefundsData!: ManageFeesRefundsModel;
  daysNumbersList: number[];
  isAdminUser = false;
  isApprove!: boolean;
  loggedInUserModel!: LoggedInUserModel;
  isSubmitted = false;
  showurgentcarefees: boolean = false;
  UserRole: any;
  constructor(
    private paymentService: PaymentService,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private location:Location,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.usersData = new Array<UserModel>();
    this.hoursList = [2, 4, 6, 12, 24, 48];
    this.refundPercentagesList = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.daysNumbersList = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  }

  ngOnInit(): void {
    this.UserRole= localStorage.getItem("UserRole")
    this.createForm([]);
    this.checkLoggedinUser();
    
  }

  createForm(providers: number[] = []) {
    this.paymentFormGroup = this.formBuilder.group({
      providers: [providers ? providers : undefined, Validators.required],
      f2fFee: [undefined, Validators.required],
      newOnlineFee: [undefined, Validators.required],
      homevisitFee: [undefined, Validators.required],
      cancelationRules: this.formBuilder.array([]),
      folowupFees: [undefined, Validators.required],
      folowupDays: [undefined, Validators.required],
      urgentcareFee: [undefined],

      ftfFollowUpPayRate:[undefined, Validators.required],
      ftfFollowUpDays:[undefined, Validators.required],
      homeVisitFollowUpPayRate:[undefined, Validators.required],
      homeVisitFollowUpDays:[undefined, Validators.required]
    });
    //addCancelationRuleControl(null);
  }

  checkLoggedinUser() {
    this.paymentService.getUserRole().subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {     
        this.loggedInUserModel = response.data;
          this.getStaffProfileData();
          this.createForm([this.loggedInUserModel.staffId]);
          this.getProvidersFeesAndRefundsSettings([
            this.loggedInUserModel.staffId,
          ]);
      } else if (this.UserRole!="PROVIDER") {
        this.createForm([]);
        this.getProviders();
      } 
    });
  }
  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.loggedInUserModel.staffId)
      .subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.isApprove = response.data.isApprove;
          if(!response.data.isApprove){
            this.notifier.notify('error','You are not authorized to add payment!');
            this.location.back();
         }
        }
      });
  }
  addCancelationRuleControl(rule: CancelationRule | null) {
    if(rule!=null){

      this.cancelationRulesFormGroup.push(this.getCancelationRulesForm(rule));
    }
  }
  removeCancelationRuleControl(i:any) {
    this.cancelationRulesFormGroup.removeAt(i);
  }

  get cancelationRulesFormGroup() {
    return <FormArray>this.paymentFormGroup.controls["cancelationRules"];
  }

  private getCancelationRulesForm(rule: CancelationRule) {
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

  bindForm(model: ManageFeesRefundsModel) {
    if (model && model.cancelationRules && model.cancelationRules.length > 0) {
      model.cancelationRules.forEach((rule) => {
        const toAdd: CancelationRule = {
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
    // else {
    //     this.addCancelationRuleControl(null);
    // }

    if (!this.daysNumbersList.includes(model.folowupDays)) {
      this.daysNumbersList.push(model.folowupDays);
      this.daysNumbersList.sort((a, b) => b - a);
    }

    if(!this.daysNumbersList.includes(model.ftfFollowUpDays)){
      this.daysNumbersList.push(model.ftfFollowUpDays);
      this.daysNumbersList.sort((a, b) => b - a);
    }

    if(!this.daysNumbersList.includes(model.homeVisitFollowUpDays)){
      this.daysNumbersList.push(model.homeVisitFollowUpDays);
      this.daysNumbersList.sort((a, b) => b - a);
    }

    this.paymentFormGroup.patchValue(model);
  }

  get f() {
    return this.paymentFormGroup.controls;
  }

  getProviders() {
    this.paymentService.getProviders().subscribe((response) => {
      if (response != null && response.statusCode == 200) {
        this.usersData = response.data;
      }
    });
  }

  onProviderDropDownClose(value: any) {
    if (!value) {
      // on dropdown close
      const provindersIds = this.f["providers"].value;
      if (provindersIds && provindersIds.length > 0) {
        this.getProvidersFeesAndRefundsSettings(provindersIds);
      }
    }
  }

  private getProvidersFeesAndRefundsSettings(provindersIds: number[]) {
    this.paymentService
      .getProvidersFeesAndRefundsSettings(provindersIds)
      .subscribe((response) => {
        if (response != null && response.statusCode == 200) {
          this.createForm(
            this.UserRole!="PROVIDER" ? undefined  : [this.loggedInUserModel.staffId]
          );
          if (this.UserRole=="PROVIDER" && response.data.length > 1) {
            this.notifier.notify(
              "warning",
              "Displaying only first practitioner's data"
            );
          }
          if (response.data && response.data.length > 0) {
            this.bindForm(response.data[0]);
          }
        }
      });
  }

  private updateProvidersFeesAndRefundsSettings(model: ManageFeesRefundsModel) {
    this.submitted = true;
    this.paymentService
      .updateProvidersFeesAndRefundsSettings(model)
      .subscribe((response) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify("success", "Updated Successfully");
        }
        this.submitted = false;
        this.isSubmitted = false;
      });
  }

  onF2fFeeChange(value:any) {
    const input = value.target as HTMLInputElement;
     value = input.value;
    if (value && value != 0 && value != "0") {
      if (value.length == 1) {
        value = 0 + value;
      }
      value = Number(value);
      this.f["newOnlineFee"].setValue(value * 0.7);
      this.f["ftfFollowUpPayRate"].setValue(value * 0.7);
    }
  }
  onnewOnlineFeeChangeForfollowup(value:any){
    const input = value.target as HTMLInputElement;
     value = input.value;
    if (value && value != 0 && value != "0") {
      if (value.length == 1) {
        value = 0 + value;
      }
      value = Number(value);
      this.f["folowupFees"].setValue(value * 0.7);     
    }
  }
  onHomeVisitFeeChangeForfollowup(value: any) {
    const input = value.target as HTMLInputElement;
   value = input.value;
    if (value && value != 0 && value != "0") {
      if (value.length == 1) {
        value = 0 + value;
      }
      value = Number(value);
      this.f["homeVisitFollowUpPayRate"].setValue(value * 0.6);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
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

  onSubmit() {
  
    this.isSubmitted = true;
    if (this.UserRole=="PROVIDER") {
      this.f["providers"].setValue([this.loggedInUserModel.staffId]);
    }
    this.markFormGroupTouched(this.paymentFormGroup);
    if (this.paymentFormGroup.invalid) return;
    const model = this.paymentFormGroup.value;

    if (!this.checkIfDuplicateHours(model)) {
      this.updateProvidersFeesAndRefundsSettings(model);
    } else {
      this.notifier.notify("error", "Duplicate hours in cancellation rules");
    }
  }

  checkIfDuplicateHours(model: ManageFeesRefundsModel): boolean {
    let isDuplicate = false;
    if (model && model.cancelationRules && model.cancelationRules.length > 1) {
      const values: number[] = [];
      model.cancelationRules.forEach((r) => {
        if (values.includes(r.uptoHours)) {
          isDuplicate = true;
          return isDuplicate;
        } else {
          values.push(r.uptoHours);
          return false;
        }
      });
    } else {
      return isDuplicate;
    }
    return isDuplicate;
  }

  sortFunc() {
    return 1;
  }

  get isShowNoRefundTxt(): boolean {
    // if(this.cancelationRulesFormGroup.)
    return true;
  }
  checkboxchecked(event: { source: { checked: any; }; }) {
    if (event.source.checked) {
      this.showurgentcarefees = true;
    } else {
      this.showurgentcarefees = false;
    }
  }
}
