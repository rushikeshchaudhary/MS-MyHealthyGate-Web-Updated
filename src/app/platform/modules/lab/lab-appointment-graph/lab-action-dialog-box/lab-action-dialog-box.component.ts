import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";
import { LabService } from "../../lab.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-action-dialog-box",
  templateUrl: "./lab-action-dialog-box.component.html",
  styleUrls: ["./lab-action-dialog-box.component.css"],
})
export class LabActionDialogBoxComponent implements OnInit {


  appointmentData:any;
  acceptDialog = false;
  cancelDialog = false;
  approveAppointmentForm!: FormGroup;
  cancelAppointmentForm!: FormGroup;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  masterCancelType!: Array<any>;


  constructor(
    public dialogPopup: MatDialogRef<LabActionDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private appointmentGraphService: AppointmentGraphService,
    private labService:LabService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.appointmentData = data;
    if(data.action=='accept'){
      this.acceptDialog=true
    }else{
      this.cancelDialog=true;
    }
  }

  ngOnInit() {
    this.initializeAcceptFormFields();
    this.initializeCancelFormFields();
    this.fetchMasterData();
  }





  initializeAcceptFormFields() {
    const configControls = {
      NotesToMember: [""]
    };
    this.approveAppointmentForm = this.formBuilder.group(configControls);
  }

  get formAcceptControls() {
    return this.approveAppointmentForm.controls;
  }





  initializeCancelFormFields() {
    const configControls = {
      cancelId: ["", Validators.required],
      cancelReason: [""]
    };
    this.cancelAppointmentForm = this.formBuilder.group(configControls);
  }

  get formCancelControls() {
    return this.cancelAppointmentForm.controls;
  }

  onClose(): void {
    this.dialogPopup.close();
  }
  onAcceptSubmit=()=>{
    this.submitted = true;
    if (this.approveAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }
    console.log(this.appointmentData.data.patientAppointmentId)
    this.labService.ApproveLabAppointment(this.appointmentData.data.patientAppointmentId).subscribe((res:any)=>{
      if (res.statusCode === 200) {
        this.notifier.notify("success", res.message);
        this.dialogPopup.close("SAVE");
      } else {
        this.notifier.notify("error", res.message);
      }
    })
  }


  onCancelSubmit=()=>{
    this.submitted = true;
    if (this.cancelAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }

    let postData = this.cancelAppointmentForm.value;
    postData.appointmentId =this.appointmentData.data.patientAppointmentId ;
    this.labService
      .cancelLabAppointment(postData)
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
          this.formCancelControls["cancelTypeId"].patchValue(
            defautlType && defautlType.id
          );
        }
      });
  }

}
