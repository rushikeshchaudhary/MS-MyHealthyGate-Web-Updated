import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-cancel-appointment-dialog",
  templateUrl: "./cancel-appointment-dialog.component.html",
  styleUrls: ["./cancel-appointment-dialog.component.css"]
})
export class CancelAppointmentDialogComponent implements OnInit {
  cancelAppointmentForm!: FormGroup;
  appointmentId: number;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  masterCancelType: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentGraphService: AppointmentGraphService,
    public dialogPopup: MatDialogRef<CancelAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.appointmentId = data;
    this.masterCancelType = [];
  }

  ngOnInit() {
    this.initializeFormFields();
    this.fetchMasterData();
  }

  initializeFormFields() {
    const configControls = {
      cancelTypeId: ["", Validators.required],
      cancelReason: [""]
    };
    this.cancelAppointmentForm = this.formBuilder.group(configControls);
  }

  get formControls() {
    return this.cancelAppointmentForm.controls;
  }

  onClose(): void {
    this.dialogPopup.close();
  }

  onSubmit(): void {
    //////debugger
    this.submitted = true;
    if (this.cancelAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }

    let postData = this.cancelAppointmentForm.value;
    postData.ids = [this.appointmentId];

    this.appointmentGraphService
      .cancelAppointment(postData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify("success", response.message);
          this.dialogPopup.close("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERCANCELTYPE" };
    this.appointmentGraphService
      .getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        if (response) {
          this.masterCancelType = response.masterCancelType || [];
          let defautlType = this.masterCancelType.find(
            x => (x.value || "").toUpperCase() == "CARE MANAGER CANCELLATION"
          );
          this.formControls["cancelTypeId"].patchValue(
            defautlType && defautlType.id
          );
        }
      });
  }
}
